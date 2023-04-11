<template>
  <div class="search-panel">
    <img
      class="search-panel__icon"
      src="../assets/glass.svg"
      alt=""
    >
    <input
      ref="input"
      :value="props.modelValue"
      class="search-panel__input"
      type="text"
      placeholder="Search"
      @input="emits('update-model-value', $event.target.value)"
      @keydown.esc.prevent="emits('close')"
      @keydown.down.prevent="emits('next')"
      @keydown.up.prevent="emits('previous')"
      @keydown.enter.prevent="emits('goto')"
    >
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface SearchPanProps {
  modelValue: string
}

const props = defineProps<SearchPanProps>()

const emits = defineEmits(['close', 'update-model-value', 'next', 'previous', 'goto'])

const input = ref<HTMLInputElement | null>(null)

onMounted(() => {
  input.value?.focus()
})
</script>

<style scoped>
  .search-panel__icon {
    width: 20px;
    height: 20px;
  }

  .search-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  .search-panel__input {
    padding: 10px;
    margin-left: 20px;
    font-size: 30px;
    color: #1a1a1a;
    background-color: white;
    border: 0 white;
    outline: none;
  }
</style>
