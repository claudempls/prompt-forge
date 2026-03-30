import { app, shell, BrowserWindow, ipcMain, globalShortcut, screen, clipboard } from 'electron'
import { join } from 'path'
import { exec } from 'child_process'
import { is } from '@electron-toolkit/utils'
import fs from 'fs'

const userDataPath = app.getPath('userData')
const storePath = join(userDataPath, 'store.json')

function readStore(): Record<string, unknown> {
  try {
    if (fs.existsSync(storePath)) return JSON.parse(fs.readFileSync(storePath, 'utf-8'))
  } catch { /* ignore */ }
  return {}
}

function writeStore(data: Record<string, unknown>): void {
  fs.writeFileSync(storePath, JSON.stringify(data, null, 2), 'utf-8')
}

let mainWindow: BrowserWindow | null = null
let quickWindow: BrowserWindow | null = null
let previousAppName: string | null = null

// ---- Main window ----
function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 960,
    height: 680,
    minWidth: 720,
    minHeight: 560,
    show: false,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#070710',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => mainWindow?.show())
  mainWindow.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' } })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// ---- Quick overlay window ----
function createQuickWindow(): void {
  const { width: sw } = screen.getPrimaryDisplay().workAreaSize
  quickWindow = new BrowserWindow({
    width: 540,
    height: 72,
    x: Math.round(sw / 2 - 270),
    y: screen.getPrimaryDisplay().workAreaSize.height - 160,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    show: false,
    transparent: true,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    quickWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '?quick=1')
  } else {
    quickWindow.loadFile(join(__dirname, '../renderer/index.html'), { query: { quick: '1' } })
  }

  // Hide instead of close when user dismisses
  quickWindow.on('close', (e) => {
    e.preventDefault()
    quickWindow?.hide()
    quickWindow?.webContents.send('quick:reset')
  })
}

// Get the frontmost macOS app name (for auto-paste)
function getPreviousApp(): Promise<string | null> {
  return new Promise((resolve) => {
    exec(
      `osascript -e 'tell application "System Events" to name of first application process whose frontmost is true'`,
      (err, stdout) => resolve(err ? null : stdout.trim())
    )
  })
}

// Try to read text from the currently focused input/textarea via macOS Accessibility API
// Works for most native apps and Electron-based apps (Claude, ChatGPT desktop, etc.)
// For browser-based AI (claude.ai in Chrome etc.) it reads the browser's focused element
function captureActiveText(): Promise<string> {
  const script = `
    tell application "System Events"
      tell (first application process whose frontmost is true)
        try
          set el to focused UI element
          set val to value of el
          if val is missing value then return ""
          -- Trim to avoid grabbing huge multi-page documents
          if (count of characters of val) > 4000 then
            return text 1 thru 4000 of val
          end if
          return val
        on error
          return ""
        end try
      end tell
    end tell
  `
  return new Promise((resolve) => {
    exec(`osascript -e '${script.replace(/\n/g, '\n').replace(/'/g, "'\\''")}'`,
      (err, stdout) => resolve(err ? '' : stdout.trim())
    )
  })
}

// Activate previous app and paste from clipboard
function pasteToApp(appName: string): void {
  exec(
    `osascript -e 'tell application "${appName}" to activate' -e 'delay 0.25' -e 'tell application "System Events" to keystroke "v" using command down'`,
    () => { /* fire and forget */ }
  )
}

// ---- Register global shortcut (Option+Space) ----
function registerShortcut(): void {
  globalShortcut.register('Alt+Space', async () => {
    if (!quickWindow) return

    if (quickWindow.isVisible()) {
      // Activate previous app FIRST — before hide — so macOS doesn't surface mainWindow
      if (previousAppName && previousAppName !== 'PromptForge') {
        exec(`osascript -e 'tell application "${previousAppName}" to activate'`)
      }
      quickWindow.hide()
      quickWindow.webContents.send('quick:reset')
      return
    }

    // Record which app was in front + try to capture active text field
    // Both run before we show the window (previous app still focused)
    const [appName, detectedText] = await Promise.all([
      getPreviousApp(),
      captureActiveText()
    ])
    previousAppName = appName

    // Reposition in case screen size changed
    const { width: sw, height: sh } = screen.getPrimaryDisplay().workAreaSize
    quickWindow.setPosition(Math.round(sw / 2 - 270), sh - 160)
    quickWindow.setSize(540, 72)
    quickWindow.show()
    quickWindow.focus()

    // Send detected text to quick window after it's visible
    // Small delay so renderer is ready to receive
    setTimeout(() => {
      quickWindow?.webContents.send('quick:detected-prompt', detectedText ?? '')
    }, 80)
  })
}

app.whenReady().then(() => {
  createWindow()
  createQuickWindow()
  registerShortcut()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().filter(w => w !== quickWindow).length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

// ---- IPC: persistent store ----
ipcMain.handle('store:get', (_e, key: string) => {
  return readStore()[key] ?? null
})
ipcMain.handle('store:set', (_e, key: string, value: unknown) => {
  const s = readStore(); s[key] = value; writeStore(s)
})
ipcMain.handle('store:all', () => readStore())

// ---- IPC: quick mode ----
// Resize the quick window (called as overlay expands)
ipcMain.handle('quick:resize', (_e, height: number) => {
  if (!quickWindow) return
  const { width: sw, height: sh } = screen.getPrimaryDisplay().workAreaSize
  const clampedH = Math.min(Math.max(height, 72), 520)
  const y = sh - clampedH - 80
  quickWindow.setSize(540, clampedH)
  quickWindow.setPosition(Math.round(sw / 2 - 270), y)
})

// Enhanced prompt is ready — copy to clipboard and paste to previous app
ipcMain.handle('quick:done', (_e, enhancedPrompt: string) => {
  clipboard.writeText(enhancedPrompt)
  setTimeout(() => {
    if (previousAppName && previousAppName !== 'PromptForge') {
      pasteToApp(previousAppName) // activates previous app + pastes — also prevents mainWindow surfacing
    }
    quickWindow?.hide()
    quickWindow?.webContents.send('quick:reset')
  }, 500)
})

// Close quick window from renderer
ipcMain.handle('quick:close', () => {
  if (previousAppName && previousAppName !== 'PromptForge') {
    exec(`osascript -e 'tell application "${previousAppName}" to activate'`)
  }
  quickWindow?.hide()
  quickWindow?.webContents.send('quick:reset')
})
