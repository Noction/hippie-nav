<template>
  <div class="box">
    <h3 class="box-title">
      Route Config
    </h3>
    <div class="box-content">
      <ul v-for="route in routesFlatten" :key="route.name">
        <li class="box-list">
          <div class="box-list-main">
            <h5>{{ route.name }}</h5>
            <hippie-button @action="setShowRouteConfig(route.name)" />
          </div>
          <ul v-if="route.name === showRouteConfig" class="box-list-secondary">
            <li>displayName: {{ route.name }}</li>
            <li>Path:{{ route.path }}</li>
            <li v-if="route.meta?.aliases">
              Aliases: {{ route.meta?.aliases }}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { RouteRecordRaw } from 'vue-router'
import { PropType, defineComponent } from 'vue'
import HippieButton from './HippieBtnCollapse.vue'

export default defineComponent({
  name: 'BoxRouteConfig',
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
    routesFlatten () {
      const routesFlatten = [] as RouteRecordRaw[]

      this.routes.forEach(r => {
        routesFlatten.push(r)
        if (r.children) {
          for (const child of r.children) {
            routesFlatten.push(child)
          }
        }
      })

      return routesFlatten
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
}
</style>
