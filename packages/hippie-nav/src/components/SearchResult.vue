<template>
  <div v-if="results.length > 0">
    <h2 class="text">
      Results
    </h2>
    <div
      v-for="(result, index) in results"
      :key="uniqueKey(result.data.name)"
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
  <div v-else-if="results?.length === 0 && input !== ''">
    Nothing have found
  </div>
</template>

<script lang="ts">
import { ResultItem } from '../types'
import SearchResultItem from './SearchResultItem.vue'
import { uniqueKey } from '../util/uniqueKey'
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
      type: Array as PropType<ResultItem[]>,
      required: false,
      default: [] as ResultItem[]
    },
    searchInput: {
      type: String,
      required: true
    }
  },
  emits: ['closeModal', 'mouseOver'],
  methods: { uniqueKey }
})
</script>
