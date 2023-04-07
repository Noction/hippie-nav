<template>
  <div class="footer add-route">
    <div class="flex">
      <h3 class="add-route-text">
        {{
          momRoute.name
            ? `You are creating a child route for ${momRoute.name}`
            : 'You are creating a route'
        }}
      </h3>
      <button @click="momRoute.name !== '' ? addRoute(momRoute) : addRoute">
        +
      </button>
    </div>
    <input
      v-model="route.displayName"
      type="text"
      placeholder="displayName"
    >
    <input
      v-model="route.path"
      type="text"
      placeholder="path"
    >
    <input
      v-model="route.aliases"
      type="text"
      placeholder="aliases: main, home"
    >
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue'
import { RouteRecordName, RouteRecordNormalized } from 'vue-router'
import { getFullPath } from '../util/getFullRoute'
import { slashCounter } from '../util/slashCounter'

export default defineComponent({
  name: 'AddRoute',
  props: {
    momRoute: {
      type: Object as PropType<RouteRecordNormalized>,
      required: false,
      default: {} as RouteRecordNormalized
    }
  },
  emits: ['close'],
  data () {
    return {
      route: {
        aliases: '',
        displayName: '',
        path: ''
      },
      wrongDisplayName: false,
      wrongPath: false
    }
  },
  methods: {
    addRoute (momRoute: RouteRecordNormalized) {
      const routes = this.$router.getRoutes()

      const fullPathOfMomRoute = momRoute.name ? getFullPath(momRoute.name, routes) : undefined

      console.log(fullPathOfMomRoute)
      const isChildOfChild = momRoute.name ? slashCounter(fullPathOfMomRoute as string) === 2 : false
      const component = { template: `<div>${this.route.displayName}</div>` }
      const aliases = this.route.aliases.split(',')
      const path = momRoute.path ? momRoute.path + this.route.path : this.route.path

      routes.forEach(r => {
        if (r.name === this.route.displayName) {
          this.wrongDisplayName = true
        }
        if (r.path === path) {
          this.wrongPath = true
        }
      })
      if (this.wrongPath || this.wrongDisplayName) {
        return
      }
      if (!isChildOfChild) {
        if (!momRoute.name) {
          this.$router.addRoute({
            component,
            meta: { aliases },
            name: this.route.displayName,
            path: this.route.path
          })
        } else {
          if (momRoute.name) {
            const newChild = {
              component,
              meta: { aliases },
              name: this.route.displayName,
              path: this.route.path.replace(/\//g, '')
            }
            const children = [...momRoute.children, newChild]

            this.$router.removeRoute(momRoute.name)
            momRoute.children = children
            this.$router.addRoute(momRoute)
          }
        }
      } else {
        if (fullPathOfMomRoute) {
          const splittedRoute = fullPathOfMomRoute.split('/')
          const parent = routes.find(r => r.path === `/${splittedRoute[1]}`) as RouteRecordNormalized
          const childOfParent = parent.children.find(c => c.path === splittedRoute[2]) as RouteRecordNormalized

          const route = {
            ...parent,
            children: [
              ...parent.children,
              {
                ...childOfParent,
                children: childOfParent.children ? [
                  childOfParent?.children,
                  {
                    component,
                    name: this.route.displayName,
                    path: this.route.path.replace(/\//g, '')
                  }
                ] : [
                  {
                    component,
                    name: this.route.displayName,
                    path: this.route.path.replace(/\//g, '')
                  }
                ]
              }
            ]
          }

          this.$router.removeRoute(parent.name as RouteRecordName)
          this.$router.addRoute(route as RouteRecordNormalized)
        }
      }
      this.route = {
        aliases: '',
        displayName: '',
        path: ''
      }
      this.$emit('close')
    }
  }
})
</script>

<style scoped>
.add-route {
  background-color: var(--secondary-color);
  border-radius: 20px;
  padding: 20px;
  flex-direction: column;
}

.add-route-text {
  margin-top: 11px;
  align-self: baseline;
}

input {
  width: 20%;
  margin-top: 11px;
  padding: 11px;
}

button {
  margin-left: 20px;
  align-self: baseline;
  padding: 11px;
}

</style>
