<template>
  <div class="search-panel">
    <img
      class="search-panel-icon"
      src="../assets/glass.svg"
      alt="glass"
    >
    <input
      ref="input"
      :value="props.modelValue"
      class="search-panel-input"
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

<script lang="ts">
export default {
  name: 'SearchPan'
}
</script>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps<{ modelValue: string }>()

const emits = defineEmits(['close', 'update-model-value', 'next', 'previous', 'goto'])

const input = ref<HTMLInputElement | null>(null)

onMounted(() => {
  input.value?.focus()
})
</script>

<style lang="scss">
.search-panel-icon {
    margin-right: 10px;
    width: 20px;
    height: 20px;
}

.search-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
}

.search-panel-input {
    font-size: 30px;
    color: #1a1a1a;
    background-color: inherit;
    border: 0 white;
    outline: none;
}
</style>
