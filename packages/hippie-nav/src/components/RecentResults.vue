<template>
  <div>
    <h3 class="hippie-font-color-main">
      Recent results
    </h3>
    <div
      v-for="(result) in recentResults"
      :key="generateUniqueKey(result.data.name)"
      class="pointer"
      @click="onClick(result)"
    >
      <slot name="recentResultItem" v-bind="result">
        <span class="hippie-font-color">
          {{ result.data.name }}
        </span>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { RouteRecordNormalized } from 'vue-router'
import { generateUniqueKey } from '../util/generateUniqueKey'
import { ActionConfig, ResultItem } from '../types'
import { PropType, defineComponent } from 'vue'

export default defineComponent({
  name: 'RecentResults',
  props: {
    recentResults: {
      type: Array as PropType<ResultItem[]>,
      required: true
    }
  },
  methods: {
    generateUniqueKey,
    onClick (result: ResultItem) {
      if (result.type === 'action') {
        const action = result.data as ActionConfig

        action.action()
        return
      }
      const route = result.data as RouteRecordNormalized

      this.$router.push(route.path)
    }
  }
})
</script>

<style>
  .pointer {
    cursor: pointer;
  }
</style>
