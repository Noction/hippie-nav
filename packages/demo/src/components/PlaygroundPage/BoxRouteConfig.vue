<template>
  <div class="route-config">
    <div class="title">
      <span class="name">
        <i-carbon-settings />
        Route Config
      </span>
    </div>
    <div class="box-content">
      <h5>Search fields</h5>
      <span>["name", "aliases"]</span>
      <h5>
        Excluded paths:
        <span>{{ excludedPaths }}</span>
      </h5>
      <h5>Add excluded paths</h5>
      <div class="flex">
        <input v-model="newExcludedPath" type="text">
        <button @click="addExcludedPath">
          +
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  excludedPaths: (string | RegExp)[]
}>()

const emits = defineEmits<{
  (e: 'addExcludedPath', excludedPath: string): void
}>()

const newExcludedPath = ref('')

function addExcludedPath () {
  emits('addExcludedPath', newExcludedPath.value)
  newExcludedPath.value = ''
}

</script>