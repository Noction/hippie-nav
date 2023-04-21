import { defineAsyncComponent } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

const AboutPage = defineAsyncComponent(() => import('./pages/AboutPage/AboutPage.vue'))
const HomePage = defineAsyncComponent(() => import('./pages/HomePage/HomePage.vue'))
const PlaygroundPage = defineAsyncComponent(() => import( './pages/PlaygroundPage/PlaygroundPage.vue'))

export const routes = [
  { component: HomePage, path: '/' },
  { component: PlaygroundPage, path: '/play' },
  { component: AboutPage, path: '/about' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
