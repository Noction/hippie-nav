<template>
  <div class="box">
    <div class="flex box__center">
      <h3 class="box-title ">
        Routes
      </h3>
      <button @click="addRoute">
        Add
      </button>
    </div>
    <ul
      v-for="route in routesWithoutChild"
      :key="route.path"
      class="box-content"
    >
      <li class="box-list">
        <h4>{{ route.name }}</h4>
        <hippie-button
          v-if="route.children?.length > 0"
          :collapsed="showChildPath === route.path"
          @action="setShowChildPath(route.path)"
        />
        <button v-if="route.path !== '/'" @click="$emit('add-child-route', route)">
          add child
        </button>
      </li>
      <h5>{{ route.path }}</h5>
      <div v-if="showChildPath === route.path">
        <ul
          v-for="childRoute in route.children"
          :key="childRoute.path"
        >
          <li class="box-list">
            <h5>{{ childRoute.name }}</h5>
            <hippie-button
              v-if="childRoute.children?.length > 0"
              :collapsed="showChildOfChildPath === childRoute.path"
              @action="setShowChildOfChildPath(childRoute.path)"
            />
            <button @click="$emit('add-child-route', childRoute)">
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
import HippieButton from './HippieBtnCollapse.vue'
import { RouteRecordRaw } from 'vue-router'
import { routeNormalize } from '../util/routeNormalize'
import { PropType, defineComponent } from 'vue'

export default defineComponent({
  name: 'BoxRoutes',
  components: { HippieButton },
  props: {
    routes: {
      type: Array as PropType<RouteRecordRaw[]>,
      required: true
    }
  },
  emits: ['add-route', 'add-child-route'],
  data () {
    return {
      showChildOfChildPath: '',
      showChildPath: ''
    }
  },
  computed: {
    routesWithoutChild () {
      if (this.routes?.length) {
        return routeNormalize(this.routes)
      } return this.routes
    }

  },
  methods: {
    addRoute () {
      this.$emit('add-route')
    },
    setShowChildOfChildPath (path: string) {
      if (this.showChildOfChildPath === path) {
        this.showChildOfChildPath = ''
        return
      }
      this.showChildOfChildPath = path
    },
    setShowChildPath (path: string) {
      if (this.showChildPath === path) {
        this.showChildPath = ''
        return
      }
      this.showChildPath = path
    }
  }

})
</script>

<style>
.box-title {
  margin-right: 10px;
}

.box__center {
  justify-content: center;
  align-items: center;
}
</style>
