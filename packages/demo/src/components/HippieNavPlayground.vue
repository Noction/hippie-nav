<template>
  <div class="container">
    <hippie-nav
      :routes="routes"
      :excluded-paths="excludedPaths"
    />
    <div class="main">
      <div class="view">
        <router-view />
      </div>
      <div v-if="!showAddRoute" class="footer">
        <box-routes :routes="routesWithMeta" />
        <box-router-config :routes="routesWithMeta" />
        <box-config :excluded-paths="excludedPaths" />
        <box-routes />
      </div>
      <add-route v-if="showAddRoute" />
    </div>
  </div>
</template>

<script lang="ts">
import AddRoute from './AddRoute.vue'
import BoxConfig from './BoxConfig.vue'
import BoxRouterConfig from './BoxRouteConfig.vue'
import BoxRoutes from './BoxRoutes.vue'
import { defineComponent } from 'vue'
import { RouteRecordNormalized, RouteRecordRaw  } from 'vue-router'

export default defineComponent({
  name: 'HippieNavPlayground',
  components: { AddRoute, BoxConfig, BoxRouterConfig, BoxRoutes },
  data () {
    return {
      showAddRoute: true
    }
  },
  computed: {
    excludedPaths (): Array<string> {
      return ['/test', '/test1', 'test2', '/test3']
    },
    routes (): Array<RouteRecordNormalized> {
      return this.$router.getRoutes()
    },
    routesWithMeta (): RouteRecordRaw[] {
      return [...this.$router.options.routes]
    }
  }
})
</script>

<style>
.container {
  margin: 20px;-webkit-box-shadow: inset -1px 3px 8px 5px #1F87FF, 2px 5px 16px 0px #0B325E, 5px 5px 15px 5px rgba(202,243,255,0);
  box-shadow: inset -1px 3px 8px 5px #1F87FF, 2px 5px 16px 0px #0B325E, 5px 5px 15px 5px rgba(202,243,255,0);
}

.main {
  display: flex;
  flex-direction: column;
}

.view {
  height: 60vh;
  padding: 20px;
}

.footer {
  align-self: center;
  display: flex;
  padding: 10px;
  width: 98%;
  height: 25vh;
}
</style>
