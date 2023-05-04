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
    @click="handlerAction(actionItem)"
    @mouseover="$emit('mouseOver', result)"
    @mouseout="$emit('mouseOut')"
  >
    <slot name="resultItemAction" v-bind="result">
      <p v-highlight-search="{ keyword: searchInput }">
        {{ result.data.name }}
      </p>
    </slot>
  </div>
</template>

<script  setup lang="ts">
import { isActionConfig } from '@/types/typePredicates'
import textHighlight from '@/directives/textHighlight'
import { useRouter } from 'vue-router'
import { ActionConfig, ResultItem } from '@/types'
import { PropType, computed, defineComponent } from 'vue'

const props = defineProps({
  colored: {
    required: true,
    type: Boolean
  },
  result: {
    required: true,
    type: Object as PropType<ResultItem>
  },
  searchInput: {
    default: null,
    required: false,
    type: String
  }
})

const emits = defineEmits( ['closeModal', 'mouseOver', 'mouseOut'])

defineComponent({
  name: 'SearchResultItem'
})
const vHighlightSearch = textHighlight

const actionItem = computed(() => {
  if (isActionConfig(props.result.data)) {
    return props.result.data
  }
  return undefined
})
const routeItem = computed(() => {
  if (!isActionConfig(props.result.data)) {
    return props.result.data
  }
  return undefined
})
const router = useRouter()

function goto (path: string) {
  router.push(path)
  emits('closeModal')
}
function handlerAction (actionItem: ActionConfig) {
  actionItem.action
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
