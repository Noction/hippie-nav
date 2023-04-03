<template>
  <div class="search-panel">
    <img
      class="search-panel__icon"
      src="../assets/glass.svg"
      alt=""
    >
    <input
      ref="searchPanInput"
      v-focus
      :value="modelValue"
      class="search-panel__input"
      type="text"
      placeholder="Search"
      @input="$emit('update:modelValue', $event.target.value)"
      @keydown.esc.prevent="$emit('close')"
      @keydown.down.prevent="$emit('next')"
      @keydown.up.prevent="$emit('previous')"
      @keydown.enter.prevent="$emit('goto')"
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const focus = {
  mounted: (el: HTMLInputElement) => {
    el.focus()
  }
}

export default defineComponent({
  directives: {
    focus
  },
  props: ['modelValue'],
  emits: ['close', 'update:modelValue', 'next', 'previous', 'goto']
})

</script>

<style scoped>
.search-panel__icon {
  width: 20px;
  height: 20px;
}

.search-panel {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-panel__input {
  margin-left: 20px;
  background-color: white;
  border: 0 white;
  color: #1a1a1a;
  font-size: 30px;
  padding: 10px;
  outline: none;
}
</style>
