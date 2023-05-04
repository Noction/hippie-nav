<template>
  <div class="search-panel">
    <svg
      class="search-panel-icon"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        d="
          M19.71,18.29,16,14.61
          A9,9,0,1,0,14.61,16
          l3.68,3.68
          a1,1,0,0,0,1.42,0
          A1,1,0,0,0,19.71,18.29Z
          M2,9
          a7,7,0,1,1,12,4.93
          h0s0,0,0,0
          A7,7,0,0,1,2,9Z"
      />
    </svg>

    <input
      ref="input"
      :value="props.modelValue"
      class="search-panel-input"
      type="text"
      placeholder="Search"
      @input="emits('update:model-value', ($event.target as HTMLInputElement).value )"
      @keydown.esc.prevent="emits('close')"
      @keydown.down.prevent="emits('next')"
      @keydown.up.prevent="emits('previous')"
      @keydown.enter.prevent="emits('goto')"
    >
    <button
      v-if="props.modelValue"
      class="clear-btn"
      @click="emits('update:model-value', '')"
    >
      <svg viewBox="0 0 14 14" fill="currentColor">
        <path
          d="
            M8.41,7
            l5.3-5.29
            A1,1,0,1,0,12.29.29
            L7,5.59,1.71.29
            A1,1,0,0,0,.29,1.71
            L5.59,7,.29,12.29
            a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0
            L7,8.41
            l5.29,5.3
            a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps<{ modelValue: string }>()

const emits = defineEmits(['close', 'update:model-value', 'next', 'previous', 'goto'])

const input = ref<HTMLInputElement | null>(null)

onMounted(() => {
  input.value?.focus()
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
