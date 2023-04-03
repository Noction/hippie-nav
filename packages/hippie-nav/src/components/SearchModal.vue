<script lang="ts" setup>
import { defineProps } from 'vue'
const { shown } = defineProps({
  shown: {
    type: Boolean,
    default: false
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
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  display: flex;
}

.modal__content {
  margin: 150px auto auto;
  /*margin: auto;*/
  background: white;
  border-radius: 12px;
  min-height: 50px;
  min-width: 300px;
  padding: 20px;
}
</style>
