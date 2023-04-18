<template>
  <div>
    <h3 class="text">
      Recent results
    </h3>
    <div
      v-for="(result) in recentResults"
      :key="generateUniqueKey(result.data.name)"
    >
      <slot name="recentResultItem" v-bind="result">
        <h3 class="text search--result__item">
          {{ result.data.name }}
        </h3>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { ResultItem } from '../types'
import { generateUniqueKey } from '../util/generateUniqueKey'
import { PropType, defineComponent } from 'vue'

export default defineComponent({
  name: 'RecentResults',
  props: {
    recentResults: {
      type: Array as PropType<ResultItem[]>,
      required: true
    }
  },
  methods: { generateUniqueKey }
})
</script>
