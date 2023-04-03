<template>
  <h2 class="text">
    Results
  </h2>
  <div v-for="(result, index) in results" :key="result.name">
    <SearchResultItem :colored="index === current" :result="result"/>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue'
import { RouteRecordNormalized } from 'vue-router'
import SearchResultItem from './SearchResultItem.vue'

export default defineComponent({
  name: 'SearchResult',
  components: { SearchResultItem },
  props: {
    results: {
      type: Array as PropType<RouteRecordNormalized[]>,
      required: true
    },
    current: {
      type: Number,
      required: true
    }
  }
})
</script>

<style scoped>

</style>
