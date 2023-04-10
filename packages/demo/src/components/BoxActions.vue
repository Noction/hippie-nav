<template>
  <div class="box">
    <h3 class="box-title">
      Actions
    </h3>
    <ul
      v-for="action in actions"
      :key="action.aliases"
      class="box-content"
    >
      <li>
        <h3>{{ action.name }}</h3>
        <h4>Aliases: <span>{{ action.aliases }}</span></h4>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { ActionConfig } from 'hippie-nav/src/types'
import {  PropType, defineComponent } from 'vue'

export default defineComponent({
  name: 'BoxActions',
  props: {
    actions: {
      type: Array as PropType<ActionConfig[]>,
      required: true
    }
  }
})
</script>
