<template>
  <div class="searchPanel">
    <img
      class="searchPanelIcon"
      src="../assets/glass.svg"
      alt=""
    >
    <input
      ref="input"
      :value="props.modelValue"
      class="searchPanelInput"
      type="text"
      placeholder="Search"
      @input="emits('update-model-value', ($event.target as HTMLInputElement).value )"
      @keydown.esc.prevent="emits('close')"
      @keydown.down.prevent="emits('next')"
      @keydown.up.prevent="emits('previous')"
      @keydown.enter.prevent="emits('goto')"
    >
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps<{  modelValue: string }>()

const emits = defineEmits(['close', 'update-model-value', 'next', 'previous', 'goto'])

const input = ref<HTMLInputElement | null>(null)

onMounted(() => {
  input.value?.focus()
})
</script>

<style scoped>
  .searchPanelIcon {
    width: 20px;
    height: 20px;
  }

  .searchPanel {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  .searchPanelInput {
    padding: 10px;
    margin-left: 20px;
    font-size: 30px;
    color: #1a1a1a;
    background-color: white;
    border: 0 white;
    outline: none;
  }
</style>
