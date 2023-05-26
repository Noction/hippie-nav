<template>
  <div class="search-panel">
    <icon-glass class="search-panel-icon" />
    <input
      ref="input"
      :value="props.modelValue"
      class="search-panel-input"
      type="text"
      placeholder="Search"
      maxlength="39"
      @input="emit('update:model-value', ($event.target as HTMLInputElement).value)"
      @keydown.esc.prevent="emit('close')"
      @keydown.down.prevent="emit('next')"
      @keydown.up.prevent="emit('previous')"
      @keydown.enter.prevent="emit('goto')"
    >
    <button
      v-if="props.modelValue"
      class="clear-btn"
      @click="clearInput"
    >
      <icon-crosshair />
    </button>
  </div>
</template>

<script setup lang="ts">
import IconCrosshair from '@/assets/icons/crosshair.svg?component'
import IconGlass from '@/assets/icons/glass.svg?component'
import { onMounted, ref } from 'vue'

const props = defineProps<{ modelValue: string }>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update:model-value', value: string ): void
  (e: 'next'): void
  (e: 'previous'): void
  (e: 'goto'): void
}>()

const input = ref<HTMLInputElement | null>()

defineExpose({ focusInput } )

function focusInput () {
  input.value.focus()
}

function clearInput () {
  emit('update:model-value', '')
  focusInput()
}

onMounted(() => {
  focusInput()
})

</script>

<style lang="scss">
  .search-panel {
    position: sticky;
    top: 0;
    z-index: 60;
    display: grid;
    grid-template: 1fr / auto 1fr auto;
    column-gap: var(--hippie-spacing-l);
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 4rem;
    padding: var(--hippie-spacing-l);
    background-color: white;

    .search-panel-icon {
      flex: none;
      height: var(--hippie-text-2xl);
      color: hsl(var(--hippie-secondary-color-base) var(--btn-light));
    }

    .search-panel-input {
      font-size: var(--hippie-text-2xl);
      color: hsl(var(--hippie-secondary-color-base) 20%);
      background-color: inherit;
      border: 0 white;
      outline: none;
    }

    .clear-btn {
      --btn-light: 50%;

      height: var(--hippie-text-2xl);
      color: hsl(var(--hippie-secondary-color-base) var(--btn-light));
      background-color: transparent;
      border: 0;
      transition: color .2s;

      > * { height: var(--hippie-text-sm) }

      &:hover { --btn-light: 20% }
    }
  }
</style>
