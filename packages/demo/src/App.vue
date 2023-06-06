<template>
  <playground-page />
</template>

<script setup lang="ts">
import PlaygroundPage from './pages/PlaygroundPage/PlaygroundPage.vue'
</script>

<style lang="scss">

  html, body {
    display: block;
    height: 100%;
    padding: 0;
    margin: 0;
  }

  #app {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 0 15px;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    color: #2c3e50;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #nav {
    padding: 30px;
    text-align: center;

    a {
      font-weight: 700;
      color: #2c3e50;

      &.router-link-exact-active{
        color: #42b983;
      }
    }
  }
</style>
