import {createRouter, createWebHashHistory} from 'vue-router'
import HomeView from "./components/HomeView.vue";

export enum AppRoutes  {
    HOME = 'home',
    ABC = 'abc'
}

export const RoutePath: Record<AppRoutes, string> = {
    [AppRoutes.HOME]: '/',
    [AppRoutes.ABC]: '/abc'
};


export const routes = [
    {path: RoutePath.home, component: HomeView},
    {path: RoutePath.abc, component: HomeView},
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
