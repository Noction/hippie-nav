<template>
  <div
    :class="{ selected: colored }"
    class="hippie-result-item"
    @click="handler(result)"
    @mouseover="$emit('mouseOver', result)"
    @mouseout="$emit('mouseOut')"
  >
    <slot
      name="resultItem"
      v-bind="result"
    >
      <p v-highlight-search="{ keyword: searchInput }">
        {{ result.data.name }}
      </p>
    </slot>
  </div>
</template>

<script  setup lang="ts">
import { ResultItem } from '@/types'
import { isActionConfig } from '@/types/typePredicates'
import textHighlight from '@/directives/textHighlight'
import { useRouter } from 'vue-router'

withDefaults(defineProps<{
  colored: boolean,
  result: ResultItem
  searchInput: string
}>(), { searchInput: null })

const emits = defineEmits<{
  (e: 'closeModal'): void,
  (e: 'mouseOver', result: ResultItem): void,
  (e: 'mouseOut'): void,
}>()

const vHighlightSearch = textHighlight
const router = useRouter()

function handler (result: ResultItem) {
  if (isActionConfig(result.data)) {
    result.data.action()
    emits('closeModal')
    return
  }
  router.push(result.data.path)
  emits('closeModal')
}

</script>

<style lang="scss">
  .hippie-result-item {
    padding: var(--hippie-spacing-m) var(--hippie-spacing-l);
    cursor: pointer;

    .highlighted { color: hsl(var(--hippie-primary-color-base) var(--hippie-primary-color-light)) }
    p { color: hsl(var(--hippie-secondary-color-base) 20%) }

    &:hover,
    &.selected {
      background-color: hsl(var(--hippie-primary-color-base) var(--hippie-primary-color-light));

      p { color: #fff; }

      .highlighted {
        color: inherit;
        text-decoration: underline;
        text-decoration-thickness: 1px;
        text-underline-offset: 2px;
      }
    }
  }
</style>
