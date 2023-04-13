<template>
  <div
    v-if="route"
    :class="{ selected: colored }"
    @click="goto(route.path)"
    @mouseover="$emit('mouseOver', result)"
  >
    <slot name="routeItemRoute" v-bind="result">
      <h3 v-text="result.data.name" />
    </slot>
  </div>
  <div
    v-if="_action"
    :class="{ selected: colored }"
    @click="_action.action"
    @mouseover="$emit('mouseOver', result)"
  >
    <slot name="resultItemAction" v-bind="result">
      <h3 v-text="result.data.name" />
    </slot>
  </div>
</template>

<script lang="ts">
import { RouteRecordNormalized } from 'vue-router'
import { ActionConfig, ResultItem } from '../types'
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
  computed: {
    _action (): ActionConfig {
      if (this.result.type === 'action') {
        return  this.result.data as ActionConfig
      } return  undefined
    },
    route (): RouteRecordNormalized {
      if (this.result.type === 'route') {
        return this.result.data as RouteRecordNormalized
      } else return undefined
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

<style scoped>
  .selected {
    background-color: rgb(110 107 107 / 65%);
  }
</style>
