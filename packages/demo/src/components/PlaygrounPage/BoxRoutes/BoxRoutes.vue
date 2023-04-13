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
    <ul
      v-for="route in routesWithoutChild"
      :key="route.path"
      class="box-content"
    >
      <div v-if="route.children">
        <box-routes-item
          :route="route"
          :collapsed="showChildPath === route.path"
          :has-children="route.children.length > 0"
          @set-show-child-path="setShowPath($event, 'child')"
          @add-child-route="addChildRoute"
        />
      </div>
      <div v-if="showChildPath === route.path">
        <ul
          v-for="childRoute in route.children"
          :key="childRoute.path"
        >
          <li class="box-list">
            <h5>{{ childRoute.name }}</h5>
            <hippie-button
              v-if="childRoute.hasOwnProperty('children')"
              :collapsed="showChildOfChildPath === childRoute.path"
              @action="setShowPath(childRoute.path, 'childOfChild')"
            />
            <button @click="$emit('addChildRoute', childRoute)">
              add child
            </button>
          </li>
          <div v-if="showChildOfChildPath === childRoute.path">
            <ul v-for="childOfChild in childRoute.children" :key="childOfChild.path">
              <li>{{ childOfChild.name }}</li>
            </ul>
          </div>
        </ul>
      </div>
    </ul>
  </div>
</template>

<script lang="ts">
import BoxRoutesItem from './BoxRoutesItem.vue'
import HippieButton from '../../common/HippieBtnCollapse.vue'
import { routeNormalize } from '../../../util/routeNormalize'
import { PropType, defineComponent } from 'vue'
import { RouteRecordNormalized, RouteRecordRaw } from 'vue-router'
export default defineComponent({
  name: 'BoxRoutes',
  components: { BoxRoutesItem, HippieButton },
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
      return routeNormalize(this.routes)
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
