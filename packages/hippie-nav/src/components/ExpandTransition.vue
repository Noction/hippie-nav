<template>
  <transition
    name="hippie-expand"
    @after-enter="afterEnter"
    @enter="enter"
    @leave="leave"
  >
    <slot />
  </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const lastHeight = ref<string>('')

function afterEnter (element: Element) {
  if (element instanceof HTMLElement) {
    element.style.height = 'auto'

    return
  }

  throw new Error('Element should be HTMLElement')
}

function enter (element: Element) {
  if (element instanceof HTMLElement) {
    const { width } = getComputedStyle(element)

    element.style.width = width
    element.style.position = 'absolute'
    element.style.visibility = 'hidden'
    element.style.height = 'auto'
    const { height } = getComputedStyle(element)

    element.style.width = null
    element.style.position = null
    element.style.visibility = null
    element.style.height = lastHeight.value ?? '0'
    getComputedStyle(element).height
    requestAnimationFrame(() => {
      element.style.height = height
      lastHeight.value = height
    })

    return
  }
  throw new Error('Element should be HTMLElement')
}

function leave (element: Element) {
  if (element instanceof HTMLElement) {
    const { height } = getComputedStyle(element)

    element.style.height = height
    getComputedStyle(element).height
    requestAnimationFrame(() => {
      element.style.height = '0'
    })

    return
  }

  throw new Error('Element should be HTMLElement')
}
</script>

<style>
.hippie-expand-enter-active,
.hippie-expand-leave-active {
  overflow: hidden;
  transition: .2s ease-in-out .1s, .2s ease-in-out;
  transition-property: height, opacity;
}

.hippie-expand-enter,
.hippie-expand-leave-to {
  height: 0;
}

.hippie-expand-enter-from,
.hippie-expand-leave-to {
  opacity: 0;
}
</style>

<style scoped>
  * {
    will-change: height;
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
  }
</style>
