<template>
  <div
    v-if="route"
    :class="{ selected: colored }"
    class="hippie-result-item"
    @click="goto(route.path)"
    @mouseover="$emit('mouseOver', result)"
  >
    <slot name="routeItemRoute" v-bind="result">
      <p v-highlight="{ keyword: searchInput }" v-html="result.data.name" />
    </slot>
  </div>
  <div
    v-if="_action"
    :class="{ selected: colored }"
    class="hippie-result-item"
    @click="_action.action"
    @mouseover="$emit('mouseOver', result)"
  >
    <slot name="resultItemAction" v-bind="result">
      <p v-highlight="{ keyword: searchInput }" v-html="result.data.name" />
    </slot>
  </div>
</template>

<script lang="ts">
import { RouteRecordNormalized } from 'vue-router'
import { isActionConfig } from '@/types/typePredicates'
import { ActionConfig, ResultItem } from '@/types'
import { PropType, defineComponent } from 'vue'

export default defineComponent({
  name: 'SearchResultItem',
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
      required: true
    }
  },
  emits: ['closeModal', 'mouseOver'],
  computed: {
    _action (): ActionConfig | undefined {
      if (isActionConfig(this.result.data)) {
        return this.result.data
      }
      return undefined
    },
    route (): RouteRecordNormalized | undefined {
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
  .selected {
    background-color: var(--hippie-hover)
  }

  .hippie-result-item {
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 10px;

    .hippie-highlighted {
      color: inherit;
    }

    p {
      color: var(--hippie-font-color);
    }
  }
</style>
