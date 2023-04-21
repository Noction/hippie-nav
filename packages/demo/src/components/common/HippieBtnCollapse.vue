<template>
  <button class="button-39" @click="action">
    <img src="/triangle.svg" :class="{ 'button-collapsed': collapsed }">
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HippieBtnCollapse',
  props: {
    collapsed: {
      type: Boolean,
      required: true
    }
  },
  emits: ['action'],
  methods: {
    action () {
      this.$emit('action')
    }
  }
})
</script>

<style scoped>
  button {
    margin-left: 5px;
    cursor: pointer;
    background-color: transparent;
    border-color: transparent;
  }

  img {
    width: 17px;
    height: 17px;
  }

  .button-collapsed {
    transform: rotate(90deg);
  }
</style>
