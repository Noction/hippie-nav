<script setup lang="ts">
import IconTriangle from '../../assets/icons/triangle.svg?component'

defineProps<{
  collapsed: boolean
}>()

defineEmits<{
  (e: 'action'): void
}>()
</script>

<template>
  <button class="button-39" @click="$emit('action')">
    <IconTriangle class="triangle-icon" :class="{ 'button-collapsed': collapsed }" />
  </button>
</template>

<style scoped>
  button {
    margin-left: 5px;
    cursor: pointer;
    background-color: transparent;
    border-color: transparent;
  }

  .triangle-icon {
    width: 17px;
    height: 17px;
  }

  .button-collapsed {
    transform: rotate(90deg);
  }
</style>
