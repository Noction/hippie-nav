<template>
  <div class="container">
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
  name: 'HippieNavPlayground',
  computed: {
    excludedPaths (): Array<string> {
      return []
    },
    routes (): Array<RouteRecordNormalized> {
      return this.$router.getRoutes()
    }
  }
})
</script>

<style scoped>
.container {
  margin: 20px;
}
</style>
