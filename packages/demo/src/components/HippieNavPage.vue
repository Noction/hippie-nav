<template>
  <h1 class="text-xl">HippieNav Search</h1>
  <div>
    <div id="playground"></div>
  </div>
</template>

<script>
import { createApp, defineComponent, onMounted } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

export default defineComponent({
  mounted () {
    const routes = [
      { path: '/', component: { template: '<div>Home</div>' } },
      { path: '/about', component: { template: '<div>About</div>' } },
    ]
    const router = createRouter({
      history: createWebHistory(),
      routes,
    })
    onMounted(() => {
      const playground = createApp(FlexSearchPlay)
      playground.use(router)
      playground.mount('#playground')
    })
  }
})
</script>

<style scoped>

</style>
