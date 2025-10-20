import { createRouter, createWebHistory } from 'vue-router'
import { staticRoutes } from './routes/static.routes'
export { useAuthGuard } from './guard'
/**
 * 应用级路由实例，默认使用 HTML5 history 模式。
 */
export const router = createRouter({ history: createWebHistory(), routes: staticRoutes })
