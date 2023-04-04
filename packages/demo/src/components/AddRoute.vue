<template>
  <div class="footer add-route">
    <div class="flex">
      <h3 class="add-route-text">
        You are creating a route
      </h3>
      <button>+</button>
    </div>
    <input
      v-model="route.displayName"
      type="text"
      placeholder="displayName"
    >
    <input
      v-model="route.path"
      type="text"
      placeholder="path"
    >
    <input
      v-model="route.aliases"
      type="text"
      placeholder="aliases: main, home"
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AddRoute',
  data () {
    return {
      route: {
        aliases: '',
        displayName: '',
        path: ''
      }
    }
  },
  methods: {
    addRoute () {
      const routes = 'commit'
      const component = { template: `<div>${this.route.displayName}</div>` }
    }
  }
})
</script>

<style scoped>
.add-route {
  background-color: var(--secondary-color);
  border-radius: 20px;
  padding: 20px;
  flex-direction: column;
}

.add-route-text {
  margin-top: 11px;
  align-self: baseline;
}

input {
  width: 20%;
  margin-top: 11px;
  padding: 11px;
}

button {
  margin-left: 20px;
  align-self: baseline;
  padding: 11px;
}

</style>
