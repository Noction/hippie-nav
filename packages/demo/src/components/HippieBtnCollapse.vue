<template>
  <button class="button-39" @click="action">
    <img src="../assets/triangle.svg" :class="{ button__collapsed: collapsed }">
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HippieBtnCollapse',
  emits: ['action'],
  data () {
    return {
      collapsed: false
    }
  },
  methods: {
    action () {
      this.$emit('action')
      this.collapsed = !this.collapsed
    }
  }
})
</script>

<style scoped>
button {
  margin-left: 5px;
  background-color: transparent;
  border-color: transparent;
  cursor: pointer;
}
img {
  width: 17px;
  height: 17px;
}

.button__collapsed {
  -webkit-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
  -o-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  transform: rotate(90deg);
}
</style>
