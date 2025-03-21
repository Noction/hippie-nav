import { createApp } from 'vue'
import App from './App.vue'
import HippieBtnCollapse from './components/common/HippieBtnCollapse.vue'
import './style.css'

const app = createApp(App)

app.component('HippieBtnCollapse', HippieBtnCollapse)

app.mount('#app')
