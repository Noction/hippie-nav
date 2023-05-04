<template>
  <div
    v-if="routeItem"
    :class="{ selected: colored }"
    class="hippie-result-item"
    @click="goto(routeItem.path)"
    @mouseover="$emit('mouseOver', result)"
    @mouseout="$emit('mouseOut')"
  >
    <slot name="resultItemRoute" v-bind="result">
      <p v-highlight-search="{ keyword: searchInput }">
        {{ result.data.name }}
      </p>
    </slot>
  </div>
  <div
    v-if="actionItem"
    :class="{ selected: colored }"
    class="hippie-result-item"
    @click="actionItem.action"
    @mouseover="$emit('mouseOver', result)"
    @mouseout="$emit('mouseOut')"
  >
    <slot name="resultItemAction" v-bind="result">
      <p v-highlight-search="{ keyword: searchInput }" v-html="result.data.name" />
    </slot>
  </div>
</template>

<script lang="ts">
import { RouteRecordNormalized } from 'vue-router'
import { isActionConfig } from '@/types/typePredicates'
import textHighlight from '@/directives/textHighlight'
import { ActionConfig, ResultItem } from '@/types'
import { PropType, defineComponent } from 'vue'

export default defineComponent({
  name: 'SearchResultItem',
  directives: {
    highlightSearch: textHighlight
  },
  props: {
    colored: {
      type: Boolean,
      required: true
    },
    result: {
      type: Object as PropType<ResultItem>,
      required: true
    },
    searchInput: {
      type: String,
      required: false,
      default: null
    }
  },
  emits: ['closeModal', 'mouseOver', 'mouseOut'],
  computed: {
    actionItem (): ActionConfig | undefined {
      if (isActionConfig(this.result.data)) {
        return this.result.data
      }
      return undefined
    },
    routeItem (): RouteRecordNormalized | undefined {
      if (!isActionConfig(this.result.data)) {
        return this.result.data
      }
      return undefined
    }
  },
  methods: {
    goto (path: string) {
      this.$router.push(path)
      this.$emit('closeModal')
    }
  }
})
</script>

<style lang="scss">
  .hippie-result-item {
    padding: var(--hippie-spacing-m) var(--hippie-spacing-l);
    cursor: pointer;

    .hippie-highlighted { color: hsl(var(--hippie-secondary-color-base) 20%) }
    p { color: hsl(var(--hippie-secondary-color-base) 20%) }

    &:hover,
    &.selected {
      background-color: hsl(var(--hippie-primary-color-base) var(--hippie-primary-color-light));

      p { color: #fff; }
      .hippie-highlighted { color: inherit }
    }

  }
</style>
