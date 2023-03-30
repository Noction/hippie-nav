import './style.css'
import 'hippie-nav/dist/style.css'
import App from './App.vue'
// @ts-ignore
import HippieNav from 'hippie-nav'
import { createApp } from 'vue'
import router from "./router";

const app = createApp(App)
app.use(HippieNav)
app.use(router)
app.mount('#app')

