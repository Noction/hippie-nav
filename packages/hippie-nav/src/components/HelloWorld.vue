<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>

  <button type="button" @click="count++">count is {{ count }}</button>


  <h4>Kind of component in module</h4>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
