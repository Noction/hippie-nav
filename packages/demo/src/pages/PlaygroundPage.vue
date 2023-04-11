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
      <div class="routes">
        <div class="title">
          <span class="name">
            <i-carbon-cube />
            routes
          </span>
        </div>
      </div>
      <div class="route-items">
        <div class="title">
          <span class="name">
            <i-carbon-branch />
            route items
          </span>
        </div>
      </div>
      <div class="route-config">
        <div class="title">
          <span class="name">
            <i-carbon-settings />
            route config
          </span>
        </div>
      </div>
      <div class="route-actions">
        <div class="title">
          <span class="name">
            <i-carbon-function-math />
            route actions
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import 'hippie-nav/dist/style.css'
import HippieNavPlayground from '../components/HippieNavPlayground.vue'
import hippieNav from 'hippie-nav'
import { createApp, onMounted } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'

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

onMounted(() => {
  const playground = createApp(HippieNavPlayground)

  playground.use(router)
  playground.use(hippieNav)
  playground.mount('#playground')
})
</script>

<style lang="scss" scoped>
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

      > * { padding: 10px }

      .playground {
        grid-area: playground;
        background-color: hsl(210deg 29% 95%);
        border-radius: 5px;
      }

      .routes { grid-area: routes; }
      .route-items { grid-area: route-items; }
      .route-config { grid-area: route-config; }
      .route-actions { grid-area: route-actions; }

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
