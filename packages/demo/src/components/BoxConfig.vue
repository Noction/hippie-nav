<template>
  <div class="box">
    <h3 class="box-title">
      Config
    </h3>
    <div class="box-content">
      <h5>Search fields</h5>
      <span>["name", "aliases"]</span>
      <h5>Excluded paths</h5>
      <span>{{ excludedPaths }}</span>
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
  name: 'BoxConfig',
  props: {
    excludedPaths: {
      type: Array as PropType<string[]>,
      required: true
    }
  },
  emits: ['add-excluded-path'],
  data () {
    return {
      excludedPathModel: ''
    }
  },
  methods: {
    addExcludedPath () {
      this.$emit('add-excluded-path', this.excludedPathModel)
      this.excludedPathModel = ''
    }
  }

})
</script>
