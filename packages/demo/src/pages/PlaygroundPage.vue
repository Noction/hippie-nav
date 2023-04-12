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
      <box-routes
        v-if="!showAddRoute"
        :routes="routes"
        @add-route="setShowAddRoute(true)"
        @add-child-route="addChildRoute"
      />
      <add-route
        v-if="showAddRoute"
        :router="router"
        :mom-route="momRoute"
        @close="forceRender"
      />
      <box-route-items :routes="routes" />
      <box-route-config
        :routes="routes"
        :excluded-paths="excludedPaths"
        @add-excluded-path="addExcludedPath"
      />
      <box-actions :actions="actions" />
    </div>
  </div>
</template>

<script lang="ts">
import 'hippie-nav/dist/style.css'
import AddRoute from '../components/PlaygrounPage/HippieNavPlayground.vue'
import App from '../App.vue'
import BoxActions from '../components/PlaygrounPage/BoxActions.vue'
import BoxRouteConfig from '../components/PlaygrounPage/BoxRouteConfig.vue'
import BoxRouteItems from '../components/PlaygrounPage/BoxRouteItems.vue'
import BoxRoutes from '../components/PlaygrounPage/BoxRoutes/BoxRoutes.vue'
import HippieNavPlayground from '../components/PlaygrounPage/HippieNavPlayground.vue'
import hippieNav from 'hippie-nav'
import { RouteRecordNormalized, createMemoryHistory, createRouter } from 'vue-router'
import {  createApp, defineComponent } from 'vue'

const actions = [
  {
    action: () => {
      router.push('/')
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
]

const routes = [
  {
    component: { template: '<div>Home page</div>' },
    meta: {
      aliases: ['main', 'home']
    },
    name: 'Home Page',
    path: '/'
  },
  {
    component: { template: '<div>About Page</div>' },
    meta: {
      aliases: ['about', 'second']
    },
    name: 'About Page',
    path: '/about'
  },
  {
    children: [
      {
        children: [
          {
            component: { template: '<div>Child of child 2</div>' },
            name: 'Child of child',
            path: 'childOfChild'
          }
        ],
        component: { template: '<div>Child Page 1</div>' },
        name: 'Child Page 1',
        path: 'child1'
      }, {
        component: { template: '<div>Child Page 2</div>' },
        name: 'Child Page 2',
        path: 'child2'
      }
    ],
    meta: {
      aliases: ['child']
    },
    name: 'Child page ',
    path: '/child'
  }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes
})

export default defineComponent({
  name: 'PlaygroundPage',
  components: {
    AddRoute,
    BoxActions,
    BoxRouteConfig,
    BoxRouteItems,
    BoxRoutes
  },
  data () {
    return {
      actions,
      excludedPaths: ['/test', '/test1'],
      momRoute: {} as RouteRecordNormalized,
      playground: App,
      router,
      routes: routes as unknown as RouteRecordNormalized[],
      showAddRoute: false
    }
  },
  mounted () {
    this.initPlay()
  },
  methods: {
    addChildRoute (e: RouteRecordNormalized) {
      this.momRoute = e
      this.showAddRoute = !this.showAddRoute
    },
    addExcludedPath (e: string) {
      this.excludedPaths.push(e)
    },
    async forceRender () {
      this.setShowAddRoute(false)
      this.routes = this.router.getRoutes()
      await this.$nextTick()
      this.playground.unmount()
      await this.$nextTick()
      this.initPlay()
    },
    initPlay () {
      this.playground = createApp(HippieNavPlayground)

      this.playground.use(router)
      this.playground.use(hippieNav, {
        excludedPaths: this.excludedPaths
      })
      this.playground.mount('#playground')
    },
    setShowAddRoute (value: boolean) {
      this.showAddRoute = value
    }
  }

})

</script>

<style lang="scss">
  .playground-page {
    display: grid;
    grid: auto 1fr / 1fr;
    row-gap: 20px;
    height: 100%;
    padding-bottom: 20px;

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
