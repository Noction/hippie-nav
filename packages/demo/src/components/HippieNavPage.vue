<template>
  <h1 class="text">
    Welcome to HippieNav Playground
  </h1>
  <div>
    <div id="playground" />
  </div>
</template>

<script>
import AboutPage from '../pages/AboutPage.vue'
import ChildPage1 from '../pages/ChildPage1.vue'
import HomePage from '../pages/HomePage.vue'
import HomeView from './HippieNavPlayground.vue'
import hippieNav from 'hippie-nav'
import { createApp, defineComponent } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    component: HomePage,
    meta: {
      aliases: ['main', 'home']
    },
    name: 'Home Page',
    path: '/'
  },
  {
    component: AboutPage,
    meta: {
      aliases: ['about', 'second']
    },
    name: 'About Page',
    path: '/about'
  },
  {
    children: [
      {
        component: ChildPage1,
        name: 'Child Page 1',
        path: 'child1'
      }, {
        component: ChildPage1,
        name: 'Child Page 2',
        path: 'child2'
      }
    ],
    meta: {
      aliases: ['child']
    },
    name: 'Child page ',
    path: '/child'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default defineComponent({
  name: 'HippieNavPage',
  mounted () {
    const playground = createApp(HomeView)

    playground.use(router)
    playground.use(hippieNav)
    playground.mount('#playground')
  }
})
</script>

<style scoped>
.text {
  margin-left: 50px;
  margin-top: 20px;
}
</style>
