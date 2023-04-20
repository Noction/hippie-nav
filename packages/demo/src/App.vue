<template>
  <div id="nav">
    <router-link to="/">
      Home
    </router-link>
    <router-link to="/play">
      Playground
    </router-link>
    <router-link to="/about">
      About
    </router-link>
  </div>
  <router-view />
</template>

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
