<script lang="ts" setup>
const props = defineProps<{
  shown: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <div
    v-if="props.shown"
    class="modal"
    @click.stop="emit('close')"
  >
    <div class="modal-content" @click.stop>
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .modal {
    position: fixed;
    inset: 0;
    z-index: 60;
    display: flex;
    align-items: flex-start;
    padding: 150px;
    background-color: var(--hippie-backdrop-color);

    .modal-content {
      position: relative;
      min-width: 560px;
      min-height: 50px;
      max-height: 100%;
      margin: 0 auto;
      overflow: hidden auto;
      background-color: var(--hippie-bg-color);
      border-radius: 1rem;
      box-shadow: 0 0 70px #0000004a;
    }
  }
</style>
