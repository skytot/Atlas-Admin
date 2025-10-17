import DefaultTheme from 'vitepress/theme'
import ThemeLogo from './components/ThemeLogo.vue'
import HeroLogo from './components/HeroLogo.vue'
import './custom.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    // 注册主题 logo 组件
    app.component('ThemeLogo', ThemeLogo)
    // 注册 hero logo 组件
    app.component('HeroLogo', HeroLogo)
  }
}
