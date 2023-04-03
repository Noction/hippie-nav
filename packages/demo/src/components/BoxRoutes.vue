<template>
  <div class="box">
    <h3 class="box-title">
      Routes
    </h3>
    <div
      v-for="route in routes"
      :key="route.path"
      class="box-content"
    >
      <div style="display: flex">
        <h4>{{ route.name }}</h4>
        <button v-if="route.children" @click.prevent="setShowChildPath(route.path)">
          >
        </button>
      </div>
      <h5>{{ route.path }}</h5>
      <div v-if="showChildPath === route.path">
        <div
          v-for="childRoute in route.children"
          :key="childRoute.path"
        >
          <h5>{{ childRoute.name }}</h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ConfigBoxRoutes',
  data () {
    return {
      showChildPath: ''
    }
  },
  computed: {
    routes () {
      console.log(this.$router.options.routes)
      return this.$router.options.routes
    }
  },
  methods: {
    setShowChildPath (path: string) {
      console.log(this.showChildPath === path)
      if (this.showChildPath === path) {
        this.showChildPath = ''
        return
      }
      this.showChildPath = path
    }
  }
})
</script>

<style scoped>
.box-content {
  margin-left: 20px;
  display: flex;
  flex-direction: column;
}
</style>
