<template>
  <transition
    ref="wrap"
    name="expand"
    @after-enter="afterEnter"
    @enter="enter"
    @leave="leave"
  >
    <slot />
  </transition>
</template>

<script setup lang="ts">
import { RendererElement, onMounted, ref } from 'vue'

const lastHeight = ref<string>('')
const wrap = ref<HTMLElement>()

onMounted(() => {
  if (!(wrap.value instanceof Element)) {
    return
  }
  if (wrap.value) {
    lastHeight.value = getComputedStyle(wrap.value).height
  }
})

function afterEnter (element: HTMLElement) {
  element.style.height = 'auto'
}

function enter (element: RendererElement) {
  const { width } = getComputedStyle(element as HTMLElement)

  element.style.width = width
  element.style.position = 'absolute'
  element.style.visibility = 'hidden'
  element.style.height = 'auto'
  const { height } = getComputedStyle(element as HTMLElement)

  /* eslint-disable no-param-reassign */
  element.style.width = null
  element.style.position = null
  element.style.visibility = null
  element.style.height = lastHeight.value ?? 0
  getComputedStyle(element as HTMLElement).height
  requestAnimationFrame(() => {
    element.style.height = height
    lastHeight.value = height
  })
}

function leave (element: RendererElement) {
  const { height } = getComputedStyle(element as HTMLElement)

  element.style.height = height
  getComputedStyle(element as HTMLElement).height
  requestAnimationFrame(() => {
    element.style.height = 0
  })
}
</script>

<style>
  .expand-enter-active, .expand-leave-active {
    overflow: hidden;
    transition: height .2s ease-in-out .1s;
  }

  .expand-enter, .expand-leave-to { height: 0; }
</style>

<style scoped>
  * {
    will-change: height;
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
  }
</style>
