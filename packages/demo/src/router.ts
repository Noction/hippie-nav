import { defineAsyncComponent } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

const AboutPage = defineAsyncComponent(() => import('./components/AboutPage/AboutPage.vue'))
const HomePage = defineAsyncComponent(() => import('./components/HomePage/HomePage.vue'))
const PlaygroundPage = defineAsyncComponent(() => import( './components/PlaygrounPage/PlaygroundPage.vue'))

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
