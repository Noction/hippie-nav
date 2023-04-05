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
  }

})
</script>

<style scoped>

</style>
