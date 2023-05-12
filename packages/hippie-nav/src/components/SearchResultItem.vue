<template>
  <div
    :class="{ selected: colored }"
    class="hippie-result-item"
    @mouseover="$emit('mouseOver', result)"
    @mouseout="$emit('mouseOut')"
  >
    <div class="hippie-result-item-content" @click="handler(result)">
      <slot
        name="resultItem"
        v-bind="result"
      >
        <component :is="iconsComponents[result.type]" class="type-icon" />
        <div class="item-info">
          <span
            v-highlight-search="{ keyword: searchInput }"
            class="title"
            v-text="result.data.name"
          />
          <span class="sub-title" v-text="subtitle" />
        </div>
      </slot>
    </div>
    <button
      class="clear-btn"
      @click="emits('removeRecentResult')"
    >
      <icon-crosshair v-if="isRecentResult" />
    </button>
  </div>
</template>

<script setup lang="ts">
import IconAction from '../assets/icons/action.svg?component'
import IconCrosshair from '../assets/icons/crosshair.svg?component'
import IconPage from '../assets/icons/page.svg?component'
import { ResultItem } from '@/types'
import { computed } from 'vue'
import { isActionConfig } from '@/types/typePredicates'
import textHighlight from '@/directives/textHighlight'
import { useRouter } from 'vue-router'

const props = withDefaults(defineProps<{
  colored: boolean,
  result: ResultItem
  searchInput: string
  isRecentResult?: boolean
}>(), { isRecentResult: false, searchInput: null })

const emits = defineEmits<{
  (e: 'closeModal'): void,
  (e: 'mouseOver', result: ResultItem): void,
  (e: 'mouseOut'): void,
  (e: 'removeRecentResult'): void
}>()

const iconsComponents = {
  action: IconAction,
  route: IconPage
}

const vHighlightSearch = textHighlight
const router = useRouter()
const subtitle = computed(() => {
  if (isActionConfig(props.result.data)) {
    return props.result.data.description
  } else {
    return props.result.data.path
  }
})

function handler (result: ResultItem) {
  if (isActionConfig(result.data)) {
    result.data.action()
  } else {
    router.push(result.data.path)
  }

  emits('closeModal')
}

</script>

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

    .highlighted { color: hsl(var(--hippie-primary-color-base) var(--hippie-primary-color-light)) }
    .title, .sub-title, .type-icon { color: hsl(var(--hippie-secondary-color-base) 20%) }

    .title {
      font-size: var(--hippie-text-sm);
    }

    .sub-title {
      font-size: var(--hippie-text-xs);
      opacity: .7;
    }

    &:hover,
    &.selected {
      background-color: hsl(var(--hippie-primary-color-base) var(--hippie-primary-color-light));

      .title, .sub-title, .type-icon { color: #fff; }

      .highlighted {
        color: inherit;
        text-decoration: underline;
        text-decoration-thickness: 1px;
        text-underline-offset: 2px;
      }
    }

    .hippie-result-item-content {
      display: grid;
      grid: 1fr / var(--hippie-text-lg) 1fr;
      column-gap: var(--hippie-spacing-m);
      align-items: center;

      .item-info {
        display: flex;
        flex-direction: column;
      }
    }

    .clear-btn {
      --btn-light: 50%;

      height: var(--hippie-text-sm);
      color: hsl(var(--hippie-secondary-color-base) var(--btn-light));
      background-color: transparent;
      border: 0;
      transition: color .2s;

      > * { height: var(--hippie-text-sm) }

      &:hover { --btn-light: 20% }
    }
  }
</style>
