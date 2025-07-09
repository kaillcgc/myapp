import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus' // 引入Element Plus
import 'element-plus/dist/index.css' // 引入样式


// 全局样式
import './assets/css/top.css'
import './assets/css/left.css'
import './assets/css/zxxx.css'
import './assets/css/hdyg.css'
import './assets/css/bodynr.css'
import './assets/css/bottomcon.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(ElementPlus)

app.mount('#app')

