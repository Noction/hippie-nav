<script lang="ts">
import type { PropType } from 'vue'
import type { RouteRecordNormalized, RouteRecordRaw } from 'vue-router'
import { defineComponent } from 'vue'
import { normalizeRoutes } from '../../../util/helpers'
import BoxRoutesItem from './BoxRoutesItem.vue'

export default defineComponent({
  name: 'BoxRoutes',
  components: { BoxRoutesItem },
  props: {
    routes: {
      type: Array as PropType<RouteRecordRaw[]>,
      required: true,
    },
  },
  emits: ['addRoute', 'addChildRoute'],
  data() {
    return {
      showChildOfChildPath: '',
      showChildPath: '',
    }
  },
  computed: {
    routesWithoutChild() {
      return normalizeRoutes(this.routes)
    },
  },
  methods: {
    addChildRoute(e: RouteRecordNormalized) {
      this.$emit('addChildRoute', e)
    },
    addRoute() {
      this.$emit('addRoute')
    },
    setShowPath(path: string, type: string) {
      if (type === 'childOfChild') {
        this.showChildOfChildPath = this.showChildOfChildPath === path ? '' : path
      }
      else if (type === 'child') {
        this.showChildPath = this.showChildPath === path ? '' : path
      }
    },
  },
})
</script>

<template>
  <div class="routes">
    <div class="title">
      <span class="name">
        <ICarbonCube />
        routes
      </span>
    </div>
    <button @click="$emit('addRoute')">
      add route
    </button>
    <ul>
      <li
        v-for="route in routesWithoutChild"
        :key="route.path"
      >
        <BoxRoutesItem
          box-type="parent"
          :route="route"
          :collapsed="showChildPath === route.path"
          :has-children="route.hasOwnProperty('children') && route.path !== '/'"
          @set-show-child-path="setShowPath($event, 'child')"
          @add-child-route="addChildRoute"
        />
        <ul v-if="showChildPath === route.path && route.children">
          <li v-for="childRoute in route.children" :key="childRoute.path">
            <BoxRoutesItem
              box-type="child"
              :route="childRoute"
              :has-children="childRoute.hasOwnProperty('children')"
              :collapsed="showChildOfChildPath === childRoute.path"
              @set-show-child-path="setShowPath($event, 'childOfChild')"
              @add-child-route="addChildRoute"
            />
            <ul v-if="showChildOfChildPath === childRoute.path && childRoute.children">
              <li v-for="childOfChildRoute in childRoute.children" :key="childOfChildRoute.name">
                <BoxRoutesItem
                  box-type="grand-child"
                  :route="childOfChildRoute"
                />
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
