<script lang="ts" setup>
import { defineProps } from 'vue'
const { shown } = defineProps({
  shown: {
    default: false,
    type: Boolean
  }
})
const emit = defineEmits({
  close: () => true
})

function close () {
  emit('close')
}
</script>

<template>
  <div
    v-if="shown"
    class="modal"
    @click.stop="close"
  >
    <div class="modal__content" @click.stop>
      <slot />
    </div>
  </div>
</template>

<style scoped>
  .modal {
    position: fixed;
    inset: 0;
    display: flex;
    background: rgb(0 0 0 / 50%);
  }

  .modal__content {
    min-width: 300px;
    min-height: 50px;
    padding: 20px;
    margin: 150px auto auto;
    background: white;
    border-radius: 12px;
  }
</style>
