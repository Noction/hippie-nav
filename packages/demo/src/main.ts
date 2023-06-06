import './style.css'
import App from './App.vue'
import HippieBtnCollapse from './components/common/HippieBtnCollapse.vue'
import { createApp } from 'vue'

const app = createApp(App)

app.component('HippieBtnCollapse', HippieBtnCollapse)

app.mount('#app')
