/// <reference types="vite/client" />

interface Window {
  electron: {
    auth: {
      google: () => Promise<{ access_token: string; refresh_token: string }>
    }
    store: {
      get:  (key: string)                  => Promise<unknown>
      set:  (key: string, value: unknown)  => Promise<void>
      all:  ()                             => Promise<Record<string, unknown>>
    }
    quick: {
      resize:  (height: number)            => Promise<void>
      done:    (enhancedPrompt: string)    => Promise<void>
      close:   ()                          => Promise<void>
      onReset:          (cb: () => void)            => () => void
      onDetectedPrompt: (cb: (text: string) => void) => () => void
    }
  }
}
