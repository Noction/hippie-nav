<template>
  <div v-if="results?.length !== 0">
    <div
      v-for="(result, index) in results"
      :key="result.data.id"
    >
      <search-result-item
        :search-input="searchInput"
        :colored="index === current"
        :result="result"
        @mouse-over="$emit('mouseOver', result)"
        @close-modal="$emit('closeModal')"
      >
        <template #routeItemRoute="route">
          <slot name="resultItemRoute" v-bind="route" />
        </template>
        <template #resultItemAction="resultAction">
          <slot name="resultItemAction" v-bind="resultAction" />
        </template>
      </search-result-item>
    </div>
  </div>
</template>

<script lang="ts">
import { ResultItem } from '@/types'
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
      type: Array as PropType<ResultItem[]>,
      required: true,
      default: [] as ResultItem[]
    },
    searchInput: {
      type: String,
      required: true
    }
  },
  emits: ['closeModal', 'mouseOver']
})
</script>
