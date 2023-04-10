<template>
  <div>
    <h3 class="text">
      Recent results
    </h3>
    <div v-for="(result) in recentResults" :key="result.name">
      <slot name="recentResultItem" v-bind="result" />
    </div>
  </div>
</template>

<script lang="ts">
import { RouteRecordNormalized } from 'vue-router'
import { PropType, defineComponent } from 'vue'

export default defineComponent({
  name: 'RecentResults',
  props: {
    recentResults: {
      type: Array as PropType<RouteRecordNormalized[]>,
      required: true
    }
  }
})
</script>
