<template>
  <div
    v-if="props.shown"
    class="modal"
    @click.stop="close"
  >
    <div class="modalContent" @click.stop>
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  shown: {
    default: false,
    type: Boolean
  }
})

const emit = defineEmits({
  close: () => true
})

function close (): void {
  emit('close')
}
</script>

<style scoped>
  .modal {
    position: fixed;
    inset: 0;
    display: flex;
    background: rgb(0 0 0 / 50%);
  }

  .modalContent {
    min-width: 300px;
    min-height: 50px;
    padding: 20px;
    margin: 150px auto auto;
    background: white;
    border-radius: 12px;
  }
</style>
