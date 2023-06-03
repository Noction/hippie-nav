<template>
  <div class="container">
    <nav>
      <ul class="flex">
        <li class="home-page">
          <RouterLink to="/">
            Home page
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/about">
            About page
          </RouterLink>
        </li>
        <button @click="openModal">
          Open Searchbar
        </button>
      </ul>
    </nav>
    <hippie-nav
      ref="hippieNavRef"
      :options="{ displayField: { route: 'meta.title' }, resultsLimit: 7 }"
    />
    <router-view class="view" />
  </div>
</template>

<script setup lang="ts">
import { HippieNav } from '@noction/hippie-nav'
import {  ref } from 'vue'

const hippieNavRef = ref<InstanceType<typeof HippieNav>>()

function openModal () {
  if (!hippieNavRef.value) return

  hippieNavRef.value.openModal()
}

</script>

<style scoped>
  .home-page {
    margin-right: 20px;
    margin-left: 25px;
  }

  nav {
    padding: 10px;
    background-color: hsl(215deg 61% 77% / 67%);
    border-radius: 25px;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  a:visited {
    color: inherit;
  }

  .view {
    padding: 20px;
  }

  button {
    margin-left: 20px;
  }
</style>
