<template>
  <div
    v-if="result.data.path"
    :class="{ selected: colored }"
    @click="goto(result.data.path)"
    @mouseover="$emit('mouse-over', result)"
  >
    <slot name="routeItemRoute" v-bind="result" />
  </div>
  <div
    v-if="result.data.action"
    :class="{ selected: colored }"
    @click="result.data.action"
    @mouseover="$emit('mouse-over', result)"
  >
    <slot name="resultItemAction" v-bind="result" />
  </div>
</template>

<script lang="ts">
import { ResultItem } from '../HippieNav.vue'
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
    }
  },
  emits: ['close-modal', 'mouse-over'],
  methods: {
    goto (path: string) {
      this.$router.push(path)
      this.$emit('close-modal')
    }
  }
})
</script>

<style scoped>
.selected {
  background-color: rgba(110, 107, 107, 0.65);
}
</style>
