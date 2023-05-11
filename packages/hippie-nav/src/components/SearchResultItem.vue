<template>
  <div
    :class="{ selected: colored }"
    class="hippie-result-item"
    @mouseover="$emit('mouseOver', result)"
    @mouseout="$emit('mouseOut')"
  >
    <div @click="handler(result)">
      <slot
        name="resultItem"
        v-bind="result"
      >
        <p v-highlight-search="{ keyword: searchInput }">
          {{ displayText }}
        </p>
      </slot>
    </div>
    <button
      class="clear-btn"
      @click="emit('removeRecentResult')"
    >
      <icon-crosshair
        v-if="isRecentResult"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import IconCrosshair from '../assets/icons/crosshair.svg?component'
import { hippieNavOptions } from '@/index'
import { isActionConfig } from '@/types/typePredicates'
import textHighlight from '@/directives/textHighlight'
import { useRouter } from 'vue-router'
import { HippieNavMeta, ResultItem } from '@/types'
import { computed, inject } from 'vue'

const props = withDefaults(defineProps<{
  colored: boolean,
  result: ResultItem
  searchInput: string
  isRecentResult?: boolean
}>(), { isRecentResult: false, searchInput: null })

const emit = defineEmits<{
  (e: 'closeModal'): void,
  (e: 'mouseOver', result: ResultItem): void,
  (e: 'mouseOut'): void,
  (e: 'removeRecentResult'): void
}>()

const vHighlightSearch = textHighlight
const router = useRouter()
const options = inject(hippieNavOptions)

function handler (result: ResultItem) {
  if (isActionConfig(result.data)) {
    result.data.action()
    emit('closeModal')
    return
  }
  router.push(result.data.path)
  emit('closeModal')
}

const displayText = computed(() => {
  const isRoute = props.result.type === 'route'
  const isHippieMeta = options.displayField.route.meta === 'hippie'
  const isOwnMeta = !options.displayField.route.meta && options.displayField.route.field
  const { field } = options.displayField.route

  if (!isActionConfig(props.result.data) && isHippieMeta && isRoute) {
    const hippieMeta = props.result.data.meta.hippieNavMeta

    if (hippieMeta) {
      const metaField = (hippieMeta as HippieNavMeta)[field]

      if (typeof metaField !== 'string') return props.result.data.name

      return metaField
    }
  }

  if (!isActionConfig(props.result.data) && isOwnMeta && isRoute) {
    const { meta } = props.result.data
    const metaField = meta[field]

    if (typeof metaField !== 'string') return props.result.data.name

    return metaField
  }

  return props.result.data.name
})

</script>

<style lang="scss">
  .hippie-result-item {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding: var(--hippie-spacing-m) var(--hippie-spacing-l);

    .highlighted {
      color: hsl(var(--hippie-primary-color-base) var(--hippie-primary-color-light))
    }

    p {
      color: hsl(var(--hippie-secondary-color-base) 20%)
    }

    button {
      cursor: pointer;
    }

    &:hover,
    &.selected {
      background-color: hsl(var(--hippie-primary-color-base) var(--hippie-primary-color-light));

      p {
        color: #fff;
      }

      .highlighted {
        color: inherit;
        text-decoration: underline;
        text-decoration-thickness: 1px;
        text-underline-offset: 2px;
      }
    }

    .clear-btn {
      --btn-light: 50%;

      height: var(--hippie-text-sm);
      color: hsl(var(--hippie-secondary-color-base) var(--btn-light));
      background-color: transparent;
      border: 0;
      transition: color .2s;

      > * {
        height: var(--hippie-text-sm)
      }

      &:hover {
        --btn-light: 20%
    }
    }
  }

</style>
