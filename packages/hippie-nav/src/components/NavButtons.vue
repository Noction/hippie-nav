<template>
  <footer class="key-caps">
    <div class="key-cap-content">
      <div class="key-cap-btn">
        <icon-arrow-down />
      </div>
      <div class="key-cap-btn">
        <icon-arrow-up />
      </div>
      <span>to navigate</span>
    </div>
    <div class="key-cap-content">
      <div class="key-cap-btn">
        <icon-enter />
      </div>
      <span>to select</span>
    </div>
    <div class="key-cap-content">
      <div class="key-cap-btn">
        <icon-escape />
      </div>
      <span>to close</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
import IconArrowDown from '../assets/icons/arrow-down.svg?component'
import IconArrowUp from '../assets/icons/arrow-up.svg?component'
import IconEnter from '../assets/icons/enter.svg?component'
import IconEscape from '../assets/icons/escape.svg?component'

</script>

<style lang="scss">
  .key-caps {
    position: sticky;
    bottom: 0;
    z-index: 60;
    display: flex;
    column-gap: 1rem;
    align-items: center;
    justify-content: flex-start;
    padding: var(--hippie-spacing-m) var(--hippie-spacing-l);

    .key-cap-content {
      display: flex;
      column-gap: var(--hippie-spacing-xs);
      align-items: center;
      font-size: var(--hippie-text-xs);

      .key-cap-btn {
        display: flex;
        padding: var(--hippie-spacing-xs);
        color: var(--hippie-footer-color);
        border-radius: 5px;
      }

      span { color: var(--hippie-footer-color); }
    }
  }
</style>
