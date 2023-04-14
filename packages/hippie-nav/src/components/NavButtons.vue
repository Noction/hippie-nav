<template>
  <div class="buttons">
    <div class="buttons--item">
      <img src="../assets/page_up.svg" alt="">
      <img
        class="margin-left"
        src="../assets/page_down.svg"
        alt=""
      >
      <span class="margin-left">to navigate</span>
    </div>
    <div class="buttons--item">
      <img src="../assets/enter.svg" alt="">
      <span class="margin-left">to select</span>
    </div>
    <div class="buttons--item">
      <img src="../assets/escape.svg" alt="">
      <span class="margin-left">to cancel</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavButtons'
}
</script>

<style>
.buttons {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
}

.buttons--item {
    display: flex;
    align-items: center;
}
img {
    margin-right: 5px;
}
</style>
