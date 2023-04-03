<template>
  <h3 class="text" :class="{ selected: colored }">
    {{ result.name }}
  </h3>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue'
import { RouteRecordNormalized } from 'vue-router'

export default defineComponent({
  props: {
    result: {
      type: Object as PropType<RouteRecordNormalized>,
      required: true
    },
    colored: {
      type: Boolean,
      required: true
    }
  }
})
</script>

<style scoped>
  .selected {
    background-color: #009175;
  }
</style>
