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

<script lang="ts">
export default {
  name: 'SearchModal'
}
</script>

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
    background-color: hsla(var(--hippie-secondary-color-base) var(--hippie-secondary-color-light) / 50%);
  }

  .modal-content {
    min-width: 560px;
    min-height: 50px;
    margin: 150px auto auto;
    background: #fff;
    border-radius: 1rem;
  }
</style>
