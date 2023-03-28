import './style.css'
import 'hippie-nav/dist/style.css'
import App from './App.vue'
// @ts-ignore
import HippieNav from 'hippie-nav'
import { createApp } from 'vue'
import router from "./router";
import HomeView from "./components/HomeView.vue";

const app = createApp(App)
const app1 = createApp(HomeView)

app.use(router)
app1.use(router)
app1.use(HippieNav,{
    fgh: 'fghjk'
})

app.mount('#app')

app1.mount('#app2')
