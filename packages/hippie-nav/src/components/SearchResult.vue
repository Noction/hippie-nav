<template>
  <div v-if="results.length > 0">
    <h2 class="text">
      Results
    </h2>
    <div
      v-for="(result, index) in results"
      :key="result.path"
    >
      <search-result-item
        :colored="index === current"
        :result="result"
        @mouse-over="$emit('mouse-over', result)"
        @close-modal="$emit('close-modal')"
      />
    </div>
  </div>
  <div v-else-if="results.length === 0 && input !== ''">
    Nothing have found
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
    input: {
      type: String,
      required: true
    },
    results: {
      type: Array as PropType<RouteRecordNormalized[]>,
      required: false,
      default: [] as RouteRecordNormalized[]
    }
  },
  emits: ['close-modal', 'mouse-over']
})
</script>

<style>
.color__red {
  color: rebeccapurple;
}
</style>
