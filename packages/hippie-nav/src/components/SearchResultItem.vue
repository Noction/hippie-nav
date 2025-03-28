<script setup lang="ts">
import type { AppOptions, ResultItem } from '@/types'
import textHighlight from '@/directives/textHighlight'
import { getValue } from '@/util/helpers'
import { computed } from 'vue'
import IconAction from '../assets/icons/action.svg?component'
import IconCrosshair from '../assets/icons/crosshair.svg?component'
import IconPage from '../assets/icons/page.svg?component'

const props = withDefaults(defineProps<{
  result: ResultItem
  searchInput?: string
  isRecentResult?: boolean
  options: AppOptions
}>(), { isRecentResult: false, searchInput: '' })

const emit = defineEmits<{
  (e: 'closeModal'): void
  (e: 'mouseOver'): void
  (e: 'mouseOut'): void
  (e: 'removeRecentResult'): void
  (e: 'goto'): void
}>()

const iconsComponents = {
  action: IconAction,
  route: IconPage,
}

const vHighlightSearch = textHighlight
const subtitle = computed(() => {
  if ('action' in props.result.data) {
    return props.result.data.description
  }

  return props.result.data.path
})

function handleOnClick() {
  emit('closeModal')
  emit('goto')
}

const displayText = computed(() => {
  if (props.result.type === 'action')
    return props.result.data.name

  const displayNamePath = props.options?.displayField?.route

  return getValue(props.result.data, displayNamePath) ?? props.result.data.name
})
</script>

<template>
  <li
    class="hippie-result-item"
    @mouseover="$emit('mouseOver')"
    @mouseout="$emit('mouseOut')"
  >
    <div class="hippie-result-item-content" @click="handleOnClick">
      <slot name="resultItem" v-bind="result">
        <component :is="iconsComponents[result.type]" class="type-icon" />
        <div class="item-info">
          <span
            v-highlight-search="{ keyword: searchInput }"
            class="title"
            v-text="displayText"
          />
          <span class="sub-title" v-text="subtitle" />
        </div>
      </slot>
    </div>
    <button
      v-if="isRecentResult"
      class="clear-btn"
      @click="emit('removeRecentResult')"
    >
      <IconCrosshair />
    </button>
  </li>
</template>

<style lang="scss">
.hippie-result-item {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: var(--hippie-spacing-m) var(--hippie-spacing-l);
  line-height: 1.5;
  cursor: pointer;
  transition: .07s ease-in;
  transition-property: background-color;

  .highlighted {
    color: var(--hippie-hit-highlighted-text-color);
    text-decoration-thickness: 2px;
    text-underline-offset: 2px;
  }

  .title, .type-icon { color: var(--hippie-hit-color); }

  .title { font-size: var(--hippie-text-sm); }

  .sub-title {
    font-size: var(--hippie-text-xs);
    opacity: .5;
  }

  &.selected {
    background-color: var(--hippie-primary-color);

    .title, .sub-title, .type-icon { color: var(--hippie-hit-active-color); }

    .highlighted {
      color: inherit;
      text-decoration-line: underline;
    }
  }

  .hippie-result-item-content {
    display: grid;
    grid: 1fr / var(--hippie-text-lg) 1fr;
    column-gap: var(--hippie-spacing-m);
    align-items: center;
    width: 95%;

    .item-info {
      display: flex;
      flex-direction: column;
    }
  }

  .clear-btn {
    height: var(--hippie-text-sm);
    color: inherit;
    background-color: transparent;
    border: 0;
    opacity: .5;
    transition: opacity .2s;

    > * { height: var(--hippie-text-sm) }
    &:hover { opacity: .75 }
  }
}
</style>
