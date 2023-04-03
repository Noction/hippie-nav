<template>
  <div>
    <hippie-nav
      :routes="routes"
      :excluded-paths="excludedPaths"
    />
    <router-view />
  </div>
</template>

<script lang="ts">
import { RouteRecordNormalized } from 'vue-router'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomeView',
  computed: {
    excludedPaths (): Array<string> {
      return ['/about']
    },
    routes (): Array<RouteRecordNormalized> {
      return this.$router.getRoutes()
    }
  }
})
</script>

<style scoped>

</style>
