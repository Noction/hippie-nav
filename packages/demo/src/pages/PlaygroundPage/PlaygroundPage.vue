<script setup lang="ts">
import type { App } from 'vue'
import type { RouteRecordNormalized } from 'vue-router'
import { createApp, nextTick, onMounted, ref } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import AddRoute from '../../components/PlaygroundPage/AddRoute.vue'
import BoxActions from '../../components/PlaygroundPage/BoxActions.vue'
import BoxRouteConfig from '../../components/PlaygroundPage/BoxRouteConfig.vue'
import BoxRouteItems from '../../components/PlaygroundPage/BoxRouteItems.vue'
import BoxRoutes from '../../components/PlaygroundPage/BoxRoutes/BoxRoutes.vue'
import HippieNavPlayground from '../../components/PlaygroundPage/HippieNavPlayground.vue'
import '@noction/hippie-nav/dist/style.css'

const routes = [
  {
    component: { template: '<div>Home page</div>' },
    name: 'Home Page',
    path: '/',
  },
  {
    component: { template: '<div>About Page</div>' },
    name: 'About Page',
    path: '/about',

  },
  {
    children: [
      {
        children: [
          {
            component: { template: '<div>Child of child 2</div>' },
            name: 'Child of child',
            path: 'childOfChild',
          },
        ],
        component: { template: '<div>Child Page 1</div>' },
        name: 'Child Page 1',
        path: 'child1',
      },
      {
        component: { template: '<div>Child Page 2</div>' },
        name: 'Child Page 2',
        path: 'child2',
      },
    ],
    meta: {
      title: '!Child page',
    },
    name: 'Child page ',
    path: '/child',
  },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

const actions = [
  {
    action: () => {
      router.push('/')
    },
    aliases: ['logOut', 'signOut', 'exit'],
    name: 'Log out',
  },
  {
    action: () => {
      router.push('/')
    },
    aliases: ['show', 'graph'],
    name: 'Show graph',
  },
]

const excludedPaths = ref(['/test', '/test1', /\/regex/] as (RegExp | string)[])
const momRoute = ref<RouteRecordNormalized>()
const showAddRoute = ref<boolean>(false)
let playground: App

onMounted(() => {
  initPlay()
})

function addChildRoute(route: RouteRecordNormalized) {
  momRoute.value = route
  showAddRoute.value = !showAddRoute.value
}

function addExcludedPath(path: string) {
  excludedPaths.value.push(path)
}

async function forceRender() {
  showAddRoute.value = false
  await nextTick()
  playground.unmount()
  await nextTick()
  initPlay()
}

function initPlay() {
  playground = createApp(HippieNavPlayground)

  playground.use(router)
  playground.mount('#playground')
}
</script>

<template>
  <div class="playground-page">
    <div class="intro">
      <h2>Hippie Nav Playground</h2>
      <span>
        Above playground, is a place where you can import or create/edit a route on the fly,
        to test it with ShortNav module. <br>
        To start the search, just use the <b>cmd/ctrl + K</b> keyboard shortcut. <br>
        Have fun, )).
      </span>
    </div>
    <div class="playground-wrapper">
      <div class="playground">
        <div id="playground" />
      </div>
      <BoxRoutes
        v-if="!showAddRoute"
        :routes="routes"
        @add-route="showAddRoute = true"
        @add-child-route="addChildRoute"
      />
      <AddRoute
        v-if="showAddRoute"
        :router="router"
        :mom-route="momRoute"
        @close="forceRender"
      />
      <BoxRouteItems :routes="routes" />
      <BoxRouteConfig
        :routes="routes"
        :excluded-paths="excludedPaths"
        @add-excluded-path="addExcludedPath"
      />
      <BoxActions :actions="actions" />
    </div>
  </div>
</template>

<style lang="scss">
  .playground-page {
    display: grid;
    grid: auto 1fr / 1fr;
    row-gap: 20px;
    height: 100%;
    padding-bottom: 20px;
    margin-top: 60px;

    .playground-wrapper {
      display: grid;
      grid:
        'playground playground playground playground' 1fr
        'routes route-items route-config route-actions' 200px
        / 1fr 1fr 1fr 1fr;
      gap: 15px;
      padding: 15px;
      border-radius: 5px;
      box-shadow: 0 0 15px 0 hsl(210deg 29% 75%);

      > * {
        padding: 10px
      }

      .playground {
        grid-area: playground;
        background-color: hsl(210deg 29% 95%);
        border-radius: 5px;
      }

      .routes {
        grid-area: routes;
      }

      .route-items {
        grid-area: route-items;
      }

      .route-config {
        grid-area: route-config;
      }

      .route-actions {
        grid-area: route-actions;
      }

      .routes,
      .route-items,
      .route-actions,
      .route-config {
        max-height: 100%;
        overflow-y: auto;
        border: 1px solid hsl(210deg 29% 75%);
        border-radius: 5px;

        .title {
          position: sticky;
          top: -10px;
          z-index: -1;
          display: grid;
          grid: 1fr / 1fr auto;
          place-items: center;
          margin-bottom: 2px;
          font-size: 14px;
          font-weight: 600;
          background-color: #fff;
          box-shadow: 0 0 0 1px #fff;

          .name {
            display: flex;
            grid-row: 1;
            grid-column: 1 / 3;
            column-gap: 4px;
            padding: 4px 0;
            text-transform: capitalize;
          }
        }
      }
    }
  }
</style>
