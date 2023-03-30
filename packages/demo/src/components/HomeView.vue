<template>
  <div>
    <hippie-nav :config="config" :routes="routes" :excludedPaths="excludedPaths"/>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {RouteRecordRaw} from "vue-router";
import {config} from "../config/hippie-nav.config";


export default defineComponent({
  name: 'HomeView',
  data() {
    return {
      config
    }
  },
  computed: {
    routes(): Array<String> {
      return this.$router.options.routes.map((r: RouteRecordRaw) => r.path)
    },
    excludedPaths(): Array<String> {
      return ['/second']
    }
  }
})
</script>

<style scoped>

</style>
