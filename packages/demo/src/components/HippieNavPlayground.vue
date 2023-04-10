<template>
  <div class="container">
    <hippie-nav
      ref="hippieNav"
      :routes="routes"
      :excluded-paths="excludedPaths"
      :actions="actions"
    >
      <template #resultItem="route">
        <h3 class="text search--result__item">
          {{ route.data.name }}
        </h3>
      </template>
      <template #resultItemAction="action">
        <h3 class="text search--result__item">
          {{ action.data.name }}
        </h3>
      </template>
      <template #recentResultItem="result">
        <h3 class="text search--result__item">
          {{ result.data.name }}
        </h3>
      </template>
    </hippie-nav>
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
        <box-config :excluded-paths="excludedPaths" @add-excluded-path="addExcludedPath" />
        <box-actions :actions="actions" />
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
import BoxActions from './BoxActions.vue'
import BoxConfig from './BoxConfig.vue'
import BoxRouterConfig from './BoxRouteConfig.vue'
import BoxRoutes from './BoxRoutes/BoxRoutes.vue'
import { RouteRecordNormalized } from 'vue-router'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HippieNavPlayground',
  components: { AddRoute, BoxActions, BoxConfig, BoxRouterConfig, BoxRoutes },
  data () {
    return {
      actions: [
        {
          action: () => {
            this.$router.push('/about')
          },
          aliases: ['logOut', 'signOut', 'exit'],
          name: 'Log out'
        },
        {
          action: () => {
            console.log('showGraph executed')
          },
          aliases: ['show', 'graph'],
          name: 'Show graph'
        }
      ],
      excludedPaths: ['/test', '/test1'],
      momRoute: {} as RouteRecordNormalized,
      routes: this.$router.getRoutes(),
      showAddRoute: false
    }
  },
  methods: {
    addChildRoute (e: RouteRecordNormalized) {
      this.momRoute = e
      this.showAddRoute = !this.showAddRoute
    },
    addExcludedPath (e: string) {
      console.log(e)
      this.excludedPaths.push(e)
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
  margin: 20px;
  -webkit-box-shadow: 0 50px 71px 33px rgba(0, 0, 0, 0.29);
  -moz-box-shadow: 0 50px 71px 33px rgba(0, 0, 0, 0.29);
  box-shadow: 0 50px 71px 33px rgba(0, 0, 0, 0.29);
  border-radius: 30px;
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
