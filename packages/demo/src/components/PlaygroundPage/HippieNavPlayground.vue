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
      :actions="actions"
      :routes="routes"
    />
    <router-view class="view" />
  </div>
</template>

<script lang="ts">
import { HippieNav } from 'hippie-nav'
import { actions } from '../../pages/PlaygroundPage/PlaygroundPage.vue'
import { useRouter } from 'vue-router'
import { defineComponent, ref } from 'vue'
export interface ActionConfig {
  name: string,
  action: () => void,
  description?: string,
  aliases: string[]
}
export default defineComponent({
  name: 'HippieNavPlayground',
  setup () {
    const hippieNavRef = ref<InstanceType<typeof HippieNav>>()
    const router = useRouter()
    const routes = router.getRoutes()

    return { hippieNavRef, routes }
  },
  data () {
    return {
      actions
    }
  },
  methods: {
    openModal () {
      this.hippieNavRef?.openModal()
    }
  }
})
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
