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

<script setup lang="ts">
import { ResultItem } from '@/types'
import SearchResultItem from './SearchResultItem.vue'
import {  PropType, defineComponent } from 'vue'

defineProps({
  current: {
    required: true,
    type: Number
  },
  results: {
    required: true,
    type: Array as PropType<ResultItem[]>
  },
  searchInput: {
    required: true,
    type: String
  }
})

defineEmits(['closeModal', 'mouseOver'])

defineComponent({
  name: 'SearchResult'
})

</script>