<template>
  <div>
    <h3 class="text">
      Recent results
    </h3>
    <div v-for="(result) in recentResults" :key="result.data.name + Math.random()">
      <slot name="recentResultItem" v-bind="result" />
    </div>
  </div>
</template>

<script lang="ts">
import { ResultItem } from '../HippieNav.vue'
import { PropType, defineComponent } from 'vue'

export default defineComponent({
  name: 'RecentResults',
  props: {
    recentResults: {
      type: Array as PropType<ResultItem[]>,
      required: true
    }
  }
})
</script>
