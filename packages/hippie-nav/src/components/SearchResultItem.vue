<template>
  <div
    v-if="result.data.path"
    :class="{ selected: colored }"
    @click="goto(result.data.path)"
    @mouseover="$emit('mouseOver', result)"
  >
    <slot name="routeItemRoute" v-bind="result" />
  </div>
  <div
    v-if="result.data.action"
    :class="{ selected: colored }"
    @click="result.data.action"
    @mouseover="$emit('mouseOver', result)"
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
  emits: ['closeModal', 'mouseOver'],
  methods: {
    goto (path: string) {
      this.$router.push(path)
      this.$emit('closeModal')
    }
  }
})
</script>

<style scoped>
  .selected {
    background-color: rgb(110 107 107 / 65%);
  }
</style>
