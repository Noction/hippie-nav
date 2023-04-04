<template>
  <div class="box">
    <h3 class="box-title">
      Routes
    </h3>
    <ul
      v-for="route in routes"
      :key="route.path"
      class="box-content"
    >
      <li class="box-list">
        <h4>{{ route.name }}</h4>
        <hippie-button v-if="route.children" @action="setShowChildPath(route.path)" />
      </li>
      <h5>{{ route.path }}</h5>
      <div v-if="showChildPath === route.path">
        <ul
          v-for="childRoute in route.children"
          :key="childRoute.path"
        >
          <li><h5>{{ childRoute.name }}</h5></li>
        </ul>
      </div>
    </ul>
  </div>
</template>

<script lang="ts">
import { RouteRecordRaw } from 'vue-router'
import { PropType, defineComponent } from 'vue'
import HippieButton from './HippieBtnCollapse.vue'

export default defineComponent({
  name: 'BoxRoutes',
  components: { HippieButton },
  props: {
    routes: {
      type: Array as PropType<RouteRecordRaw[]>,
      required: true
    }
  },
  data () {
    return {
      showChildPath: ''
    }
  },
  methods: {
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

</style>
