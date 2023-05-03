<template>
  <div class="route-items">
    <div class="title">
      <span class="name">
        <i-carbon-branch />
        Route Items
      </span>
    </div>
    <div class="box-content">
      <ul v-for="route in _routesFlatten" :key="route.name">
        <li class="box-list">
          <div class="box-list-main">
            <h5>{{ route.name }}</h5>
            <hippie-button :collapsed="route.name === showRouteConfig" @action="setShowRouteConfig(route.name)" />
          </div>
          <ul v-if="route.name === showRouteConfig" class="box-list-secondary">
            <li>displayName: {{ route.name }}</li>
            <li>Path:{{ route.path }}</li>
            <li v-if="route.meta.aliases">
              Aliases: {{ route.meta.aliases }}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import HippieButton from '../common/HippieBtnCollapse.vue'
import { flattenRoutes } from '../../util/flattenRoutes'
import { normalizeRoutes } from '../../util/normalizeRoutes'
import { PropType, defineComponent } from 'vue'
import { RouteRecordNormalized, RouteRecordRaw } from 'vue-router'

export default defineComponent({
  name: 'BoxRouteItems',
  components: { HippieButton },
  props: {
    routes: {
      type: Array as PropType<RouteRecordRaw[]>,
      required: true
    }
  },
  data () {
    return {
      showRouteConfig: '' as RouteRecordRaw['name']
    }
  },
  computed: {
    _routesFlatten () {
      const routesWithoutChildPaths = normalizeRoutes(this.routes) as RouteRecordNormalized[]

      return flattenRoutes(flattenRoutes(routesWithoutChildPaths))
    }
  },
  methods: {
    setShowRouteConfig (routeName: RouteRecordRaw['name']) {
      if (routeName === this.showRouteConfig) {
        this.showRouteConfig = ''
        return
      }
      this.showRouteConfig = routeName
    }
  }
})
</script>

<style scoped>
  .box-list {
    display: flex;
    flex-direction: column;
  }

  .box-list-main {
    display: flex;
    justify-content: space-between;
    margin-top: 2px;
  }
</style>
