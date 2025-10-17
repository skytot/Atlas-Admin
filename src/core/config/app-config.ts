/**
 * 应用级静态配置。
 */
export const appConfig = {
  appName: 'Atlas Admin',
  enableLogging: import.meta.env.VITE_ENABLE_LOGGING === 'true',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api'
} as const
