import './style.css'
import 'hippie-nav/dist/style.css'
import App from './App.vue'
import HippieNav from 'hippie-nav'
import { createApp } from 'vue'

const app = createApp(App)

app.use(HippieNav)

app.mount('#app')
