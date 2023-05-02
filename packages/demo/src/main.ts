import './style.css'
import App from './App.vue'
import HippieBtnCollapse from './components/common/HippieBtnCollapse.vue'
import { createApp } from 'vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.component('HippieBtnCollapse', HippieBtnCollapse)
app.mount('#app')
