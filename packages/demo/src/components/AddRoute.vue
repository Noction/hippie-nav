<template>
  <div class="footer add-route">
    <div class="flex">
      <h3 class="add-route-text">
        {{ momRoute.name
          ? `You are creating a child route for ${momRoute.name}`
          : "You are creating a route" }}
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
import { RouteRecordNormalized } from 'vue-router'
import { PropType, defineComponent } from 'vue'
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
      const fullPathOfMomRoute = getFullPath(momRoute.name, this.$router)
      const isChildOfChild = slashCounter(fullPathOfMomRoute as string) === 2

      const routes = this.$router.getRoutes()
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
      this.route = {
        aliases: '',
        displayName: '',
        path:''
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
