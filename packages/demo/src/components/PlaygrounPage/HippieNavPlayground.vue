<template>
  <div class="container">
    <hippie-nav
      :routes="routes"
      :actions="actions"
    >
      <template #resultItemRoute="route">
        <h3 class="text search--result__item">
          {{ route.data.name }}
        </h3>
      </template>
      <template #resultItemAction="action">
        <h3 class="text search--result__item">
          {{ action.data.name }}
        </h3>
      </template>
      <template #recentResultItem="result">
        <h3 class="text search--result__item">
          {{ result.data.name }}
        </h3>
      </template>
    </hippie-nav>
    <router-view />
  </div>
</template>

<script lang="ts">

import '../../../../hippie-nav/dist/style.css'
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'HippieNavPlayground',
  data () {
    return {
      actions: [
        {
          action: () => {
            console.log('action')
          },
          aliases: ['logOut', 'signOut', 'exit'],
          name: 'Log out'
        },
        {
          action: () => {
            console.log('showGraph executed')
          },
          aliases: ['show', 'graph'],
          name: 'Show graph'
        }
      ],
      routes: this.$router.getRoutes()
    }
  }
})
</script>
