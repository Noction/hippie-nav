<template>
  <div class="search-panel">
    <img class="search-panel__icon" src="../assets/glass.svg" alt="">
    {{ searchInput }}
    <input
        v-model="searchInput"
        class="search-panel__input"
        type="text"
        @keydown.esc="close"
        placeholder="Search"
    />
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue';

const emit = defineEmits({
  close: () => true,
});

function close() {
  emit('close')
}

const searchInput = ref('');


</script>

<style scoped>
.search-panel__icon {
  width: 20px;
  height: 20px;
}

.search-panel {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-panel__input {
  margin-left: 20px;
  background-color: white;
  border: 0 white;
  color: #1a1a1a;
  font-size: 30px;
  padding: 10px;
  outline: none;
}
</style>
