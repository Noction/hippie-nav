<template>
  <div class="route-config">
    <div class="title">
      <span class="name">
        <i-carbon-settings />
        Route Config
      </span>
    </div>
    <div class="box-content">
      <h5>Search fields</h5>
      <span>["name", "aliases"]</span>
      <h5>
        Excluded paths:
        <span>{{ excludedPaths }}</span>
      </h5>
      <h5>Add excluded paths</h5>
      <div class="flex">
        <input v-model="excludedPathModel" type="text">
        <button @click="addExcludedPath">
          +
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue'

export default defineComponent({
  name: 'BoxRouteConfig',
  props: {
    excludedPaths: {
      type: Array as PropType<(string | RegExp)[]>,
      required: true
    }
  },
  emits: ['addExcludedPath'],
  data () {
    return {
      excludedPathModel: ''
    }
  },
  methods: {
    addExcludedPath () {
      this.$emit('addExcludedPath', this.excludedPathModel)
      this.excludedPathModel = ''
    }
  }

})
</script>
