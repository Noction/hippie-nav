<template>
  <div
    :class="{ selected: colored }"
    @click="goto(result.path)"
    @mouseover="$emit('mouse-over', result)"
  >
    <slot name="routeItem" v-bind="result" />
  </div>
</template>

<script lang="ts">
import { RouteRecordNormalized } from 'vue-router'
import { PropType, defineComponent } from 'vue'

export default defineComponent({
  name: 'SearchResultItem',
  props: {
    colored: {
      type: Boolean,
      required: true
    },
    result: {
      type: Object as PropType<RouteRecordNormalized>,
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
