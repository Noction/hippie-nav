<script setup lang="ts">
import {onKeyboardShortcut} from "./util/keyboard";
import SearchModal from "./components/SearchModal.vue";
import SearchPan from './components/SearchPan.vue'
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";

const showModal = ref(false);
const route = useRoute()
const router = useRouter()

onKeyboardShortcut(['ctrl+k', 'meta+k'], (event) => {
  showModal.value = true;
  event.preventDefault()
})
onMounted(() => {
  console.log("asdas", {router, route})
})

</script>

<template>
  <SearchModal :shown="showModal" @close="showModal = false">
    <SearchPan @close="showModal = false"/>
  </SearchModal>
</template>
<style scoped>

</style>
