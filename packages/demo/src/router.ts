import { createRouter, createWebHistory } from 'vue-router'

const AboutPage = () => import('./pages/AboutPage/AboutPage.vue')
const HomePage = () => import('./pages/HomePage/HomePage.vue')
const PlaygroundPage = () => import( './pages/PlaygroundPage/PlaygroundPage.vue')

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
