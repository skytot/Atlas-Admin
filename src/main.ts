import { createApp } from 'vue'
import App from './App.vue'
import { setupPlugins } from '@/core/plugins'
import '@/styles/index.scss'

const app = createApp(App)
setupPlugins(app)

app.mount('#app')