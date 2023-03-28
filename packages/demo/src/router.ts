import {createRouter, createWebHashHistory} from 'vue-router'
import HomeView from "./components/HomeView.vue";

const routes = [
    {path: '/', component: HomeView},
    {path: '/abc', component: HomeView},
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
