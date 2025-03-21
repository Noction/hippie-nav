<script lang="ts">
import type { PropType } from 'vue'
import type { Router, RouteRecordNormalized } from 'vue-router'
import { defineComponent } from 'vue'
import { countSlashes } from '../../util/helpers'

function getFullPath(name: RouteRecordNormalized['name'], routes: RouteRecordNormalized[]): string | undefined {
  const route = routes.find(r => r.name === name)

  return route?.path
}

function hasDuplicateName(routes: RouteRecordNormalized[], name: string): boolean {
  return routes.some(r => r.name === name)
}

function hasDuplicatePath(routes: RouteRecordNormalized[], path: string): boolean {
  return routes.some(r => r.path === path)
}

export default defineComponent({
  name: 'AddRoute',
  props: {
    momRoute: {
      type: Object as PropType<RouteRecordNormalized>,
      required: false,
      default: {} as RouteRecordNormalized,
    },
    router: {
      type: Object as PropType<Router>,
      required: true,
    },
  },
  emits: ['close'],
  data() {
    return {
      route: {
        aliases: '',
        displayName: '',
        path: '/',
      },
    }
  },
  computed: {
    text() {
      if (this.momRoute.name) {
        return `You are creating a child route for ${this.momRoute.name.toString()}`
      }
      return 'You are creating a route'
    },
  },
  methods: {
    addRoute(): void {
      const routes = this.router.getRoutes()
      const copyOfMomRoute = JSON.parse(JSON.stringify(this.momRoute))
      const fullPathOfMomRoute: string | undefined = copyOfMomRoute.name && getFullPath(copyOfMomRoute.name, routes)
      const isChildOfChild: boolean = fullPathOfMomRoute ? countSlashes(fullPathOfMomRoute) === 2 : false
      const component = { template: `<div>${this.route.displayName}</div>` }
      const aliases: string[] = this.route.aliases.split(',')
      const path: string = copyOfMomRoute.path ? `${copyOfMomRoute.path}${this.route.path}` : this.route.path
      const areEmptyFields: boolean = this.route.displayName.trim() === '' || this.route.path.trim() === ''
      const areDuplicates = hasDuplicateName(routes, this.route.displayName) || hasDuplicatePath(routes, path)

      if (areDuplicates || areEmptyFields) {
        return
      }
      if (!isChildOfChild) {
        if (!copyOfMomRoute.name) {
          this.router.addRoute({
            component,
            meta: { hippieNavFields: { aliases } },
            name: this.route.displayName,
            path: this.route.path,
          })
        }
        else if (copyOfMomRoute.name) {
          if (copyOfMomRoute.name) {
            const newChild = {
              component,
              meta: { aliases },
              name: this.route.displayName,
              path: this.route.path.replace(/\//g, ''),
            }
            const children = copyOfMomRoute.children
              ? [...copyOfMomRoute.children, newChild]
              : [newChild]

            this.router.removeRoute(copyOfMomRoute.name)
            copyOfMomRoute.children = children
            this.router.addRoute(copyOfMomRoute)
          }
        }
      }
      else if (isChildOfChild) {
        if (fullPathOfMomRoute) {
          const splittedRoute = fullPathOfMomRoute.split('/')
          const parent: RouteRecordNormalized = routes.find(r => r.path === `/${splittedRoute[1]}`) as RouteRecordNormalized
          const childOfParent = parent.children.find(c => c.path === splittedRoute[2]) as RouteRecordNormalized
          const childOfChildRoute = {
            component,
            name: this.route.displayName,
            path: this.route.path.replace(/\//g, ''),
          }

          const route = {
            ...parent,
            children: parent.children.map((child) => {
              if (child.name === childOfParent.name) {
                return {
                  ...child,
                  children: [
                    ...(child.children || []),
                    childOfChildRoute,
                  ],
                }
              }
              return child
            }),
          }

          if (parent.name) {
            this.router.removeRoute(parent.name)
          }

          this.router.addRoute(route as RouteRecordNormalized)
        }
      }
      this.route = {
        aliases: '',
        displayName: '',
        path: '/',
      }
      this.$emit('close')
    },
  },
})
</script>

<template>
  <div class="routes">
    <button @click="addRoute">
      add
    </button>
    <button @click="$emit('close')">
      back
    </button>
    <div class="title">
      <span class="name">{{ text }}</span>
    </div>
    <div>
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
  </div>
</template>

<style scoped>
  input {
    width: 100%;
    padding: 11px;
    margin-top: 5px;
  }

  button {
    width: fit-content;
    margin-left: 20px;
  }
</style>
