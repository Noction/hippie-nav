<template>
  <div class="search-panel">
    <img class="search-panel__icon" src="../assets/glass.svg" alt="">
    <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="search-panel__input"
        type="text"
        @keydown.esc="$emit('close')"
        @keydown.down.stop="$emit('next')"
        @keydown.up="$emit('previous')"
        @keydown.enter="$emit('goto')"
        placeholder="Search"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  props: ['modelValue'],
  emits: ['close', 'update:modelValue', 'next', 'previous', 'goto'],
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
