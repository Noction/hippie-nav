<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import { computed, ref } from 'vue'
import { flattenRoutes, normalizeRoutes } from '../../util/helpers'
import HippieButton from '../common/HippieBtnCollapse.vue'

const props = defineProps<{
  routes: RouteRecordRaw[]
}>()

const showRouteConfig = ref('' as RouteRecordRaw['name'])
const routesFlatten = computed(() => {
  const routesWithoutChildPaths = normalizeRoutes(props.routes)

  return flattenRoutes(flattenRoutes(routesWithoutChildPaths))
})

function setShowRouteConfig(routeName: RouteRecordRaw['name']) {
  if (routeName === showRouteConfig.value) {
    showRouteConfig.value = ''
    return
  }
  showRouteConfig.value = routeName
}
</script>

<template>
  <div class="route-items">
    <div class="title">
      <span class="name">
        <ICarbonBranch />
        Route Items
      </span>
    </div>
    <div class="box-content">
      <ul v-for="route in routesFlatten" :key="route.name">
        <li class="box-list">
          <div class="box-list-main">
            <h5>{{ route.name }}</h5>
            <HippieButton :collapsed="route.name === showRouteConfig" @action="setShowRouteConfig(route.name)" />
          </div>
          <ul v-if="route.name === showRouteConfig" class="box-list-secondary">
            <li>displayName: {{ route.name }}</li>
            <li>Path:{{ route.path }}</li>
            <li v-if="route.meta">
              Aliases: {{ route.meta.aliases }}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

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
