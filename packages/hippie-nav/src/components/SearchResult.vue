<template>
  <h2 class="text">
    Results
  </h2>
  <div v-for="(result, index) in results" :key="result.path">
    <search-result-item
      :colored="index === current"
      :result="result"
    />
  </div>
</template>

<script lang="ts">
import { RouteRecordNormalized } from 'vue-router'
import SearchResultItem from './SearchResultItem.vue'
import { PropType, defineComponent } from 'vue'

export default defineComponent({
  name: 'SearchResult',
  components: { SearchResultItem },
  props: {
    current: {
      type: Number,
      required: true
    },
    results: {
      type: Array as PropType<RouteRecordNormalized[]>,
      required: true
    }
  }
})
</script>
