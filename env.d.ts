/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_APP_ENV: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_ROUTER_MODE: string
  readonly VITE_ROUTER_BASE: string
  readonly VITE_DEFAULT_THEME: string
  readonly VITE_ENABLE_THEME_SWITCH: string
  readonly VITE_DEFAULT_LOCALE: string
  readonly VITE_FALLBACK_LOCALE: string
  readonly VITE_ENABLE_DEVTOOLS: string
  readonly VITE_ENABLE_MOCK: string
  readonly VITE_ENABLE_DEBUG: string
  readonly VITE_HMR_PORT: string
  readonly VITE_PROXY_TARGET: string
  readonly VITE_BUILD_SOURCEMAP: string
  readonly VITE_BUILD_DROP_CONSOLE: string
  readonly VITE_BUILD_DROP_DEBUGGER: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}
