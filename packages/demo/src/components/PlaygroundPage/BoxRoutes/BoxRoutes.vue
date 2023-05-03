<template>
  <div class="routes">
    <div class="title">
      <span class="name">
        <i-carbon-cube />
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
        <box-routes-item
          box-type="parent"
          :route="route"
          :collapsed="showChildPath === route.path"
          :has-children="route.hasOwnProperty('children') && route.path !== '/'"
          @set-show-child-path="setShowPath($event, 'child')"
          @add-child-route="addChildRoute"
        />
        <ul v-if="showChildPath === route.path && route.children">
          <li v-for="childRoute in route.children" :key="childRoute.path">
            <box-routes-item
              box-type="child"
              :route="childRoute"
              :has-children="childRoute.hasOwnProperty('children')"
              :collapsed="showChildOfChildPath === childRoute.path"
              @set-show-child-path="setShowPath($event, 'childOfChild')"
              @add-child-route="addChildRoute"
            />
            <ul v-if="showChildOfChildPath === childRoute.path && childRoute.children">
              <li v-for="childOfChildRoute in childRoute.children" :key="childOfChildRoute.name">
                <box-routes-item
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

<script lang="ts">
import BoxRoutesItem from './BoxRoutesItem.vue'
import { normalizeRoutes } from '../../../util/normalizeRoutes'
import { PropType, defineComponent } from 'vue'
import { RouteRecordNormalized, RouteRecordRaw } from 'vue-router'

export default defineComponent({
  name: 'BoxRoutes',
  components: { BoxRoutesItem },
  props: {
    routes: {
      type: Array as PropType<RouteRecordRaw[]>,
      required: true
    }
  },
  emits: ['addRoute', 'addChildRoute'],
  data () {
    return {
      showChildOfChildPath: '',
      showChildPath: ''
    }
  },
  computed: {
    routesWithoutChild () {
      return normalizeRoutes(this.routes)
    }
  },
  methods: {
    addChildRoute (e: RouteRecordNormalized) {
      this.$emit('addChildRoute', e)
    },
    addRoute () {
      this.$emit('addRoute')
    },
    setShowPath (path: string, type: string) {
      if (type === 'childOfChild') {
        this.showChildOfChildPath = this.showChildOfChildPath === path ? '' : path
      } else if (type === 'child') {
        this.showChildPath = this.showChildPath === path ? '' : path
      }
    }
  }
})
</script>
