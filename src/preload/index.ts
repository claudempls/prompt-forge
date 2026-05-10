import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  store: {
    get:  (key: string)                  => ipcRenderer.invoke('store:get', key),
    set:  (key: string, value: unknown)  => ipcRenderer.invoke('store:set', key, value),
    all:  ()                             => ipcRenderer.invoke('store:all')
  },
  quick: {
    resize: (height: number)             => ipcRenderer.invoke('quick:resize', height),
    done:   (enhancedPrompt: string)     => ipcRenderer.invoke('quick:done', enhancedPrompt),
    close:  ()                           => ipcRenderer.invoke('quick:close'),
    // Listen for reset event sent from main when window is hidden
    onReset: (cb: () => void) => {
      ipcRenderer.on('quick:reset', cb)
      return () => ipcRenderer.off('quick:reset', cb)
    },
    // Receive auto-detected prompt text from active input field
    onDetectedPrompt: (cb: (text: string) => void) => {
      const handler = (_: Electron.IpcRendererEvent, text: string) => cb(text)
      ipcRenderer.on('quick:detected-prompt', handler)
      return () => ipcRenderer.off('quick:detected-prompt', handler)
    }
  }
})
