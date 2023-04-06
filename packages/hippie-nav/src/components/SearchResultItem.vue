<template>
  <div
    :class="{ selected: colored }"
    @click="goto(result.path)"
    @mouseover="$emit('mouse-over', result)"
  >
    <slot>
      <h3 class="text search--result__item">
        {{ result.name }}
      </h3>
    </slot>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue'
import { RouteRecordNormalized } from 'vue-router'

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

.search--result__item {
  padding: 7px;
  border-radius: 10px;
  color: #1a1a1a;
  font-weight: 700;
  cursor: pointer;
}
</style>
