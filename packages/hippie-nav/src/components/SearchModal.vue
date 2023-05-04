<template>
  <div
    v-if="props.shown"
    class="modal"
    @click.stop="close"
  >
    <div class="modal-content" @click.stop>
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  shown: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

function close (): void {
  emit('close')
}
</script>

<style lang="scss" scoped>
  .modal {
    position: fixed;
    inset: 0;
    z-index: 60;
    display: flex;
    align-items: flex-start;
    padding: 150px;
    background-color: hsla(var(--hippie-secondary-color-base) var(--hippie-secondary-color-light) / 50%);

    .modal-content {
      position: relative;
      min-width: 560px;
      min-height: 50px;
      max-height: 100%;
      margin: 0 auto;
      overflow-y: auto;
      background: #fff;
      border-radius: 1rem;
    }
  }

</style>
