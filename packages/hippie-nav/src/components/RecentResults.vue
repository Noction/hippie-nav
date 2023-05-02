<template>
  <div>
    <h3 class="hippie-font-color-main">
      Recent results
    </h3>
    <div
      v-for="result in recentResults"
      :key="result.data.id"
      class="pointer"
      @click="handleOnClick(result)"
    >
      <search-result-item
        :result="result"
        :colored="selected === result.data.id"
        @mouse-over="handleOnMouseOver"
        @mouse-out="selected = -1"
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
import SearchResultItem from '@/components/SearchResultItem.vue'
import { isActionConfig } from '@/types/typePredicates'
import { PropType, defineComponent } from 'vue'

export default defineComponent({
  name: 'RecentResults',
  components: { SearchResultItem },
  props: {
    recentResults: {
      type: Array as PropType<ResultItem[]>,
      required: true
    }
  },
  data () {
    return {
      selected: -1
    }
  },
  methods: {
    handleOnClick (result: ResultItem) {
      if (isActionConfig(result.data)) {
        const action = result.data

        action.action()
        return
      }
      const route = result.data

      this.$router.push(route.path)
    },
    handleOnMouseOver (result: ResultItem) {
      this.selected = result.data.id
    }
  }
})
</script>

<style>
  .pointer {
    cursor: pointer;
  }
</style>
