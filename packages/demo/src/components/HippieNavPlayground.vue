<template>
  <div class="container">
    <hippie-nav
      ref="hippieNav"
      :routes="routes"
      :excluded-paths="excludedPaths"
    />
    <div class="main">
      <div class="view">
        <router-view />
      </div>
      <div v-if="!showAddRoute" class="footer">
        <box-routes
          :routes="routes"
          @add-route="showAddRoute = !showAddRoute"
          @add-child-route="addChildRoute"
        />
        <box-router-config :routes="routes" />
        <box-config :excluded-paths="excludedPaths" />
        <box-routes />
      </div>
      <add-route
        v-if="showAddRoute"
        :mom-route="momRoute"
        @close="forceRender"
      />
    </div>
  </div>
</template>

<script lang="ts">
import AddRoute from './AddRoute.vue'
import BoxConfig from './BoxConfig.vue'
import { RouteRecordNormalized } from 'vue-router'
import BoxRouterConfig from './BoxRouteConfig.vue'
import BoxRoutes from './BoxRoutes.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HippieNavPlayground',
  components: { AddRoute, BoxConfig, BoxRouterConfig, BoxRoutes },
  data () {
    return {
      momRoute: {} as RouteRecordNormalized,
      routes: this.$router.getRoutes(),
      showAddRoute: false
    }
  },
  computed: {
    excludedPaths (): Array<string> {
      return ['/test', '/test1', 'test2', '/test3']
    }
  },
  methods: {
    addChildRoute (e: RouteRecordNormalized) {
      this.momRoute = e
      this.showAddRoute = !this.showAddRoute
    },
    async forceRender () {
      this.showAddRoute = !this.showAddRoute
      this.routes = this.$router.getRoutes()
      await this.$nextTick()
      this.$refs.hippieNav.fullReindex()
      this.momRoute = {} as RouteRecordNormalized
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
