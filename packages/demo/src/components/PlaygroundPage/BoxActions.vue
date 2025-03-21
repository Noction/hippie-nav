<script setup lang="ts">
defineProps<{
  actions: { name: string, description?: string, aliases: string[] }[]
}>()
</script>

<template>
  <div class="route-actions">
    <div class="title">
      <span class="name">
        <ICarbonFunctionMath />
        Route Actions
      </span>
    </div>
    <ul
      v-for="action in actions"
      :key="action.name"
      class="box-content"
    >
      <li>
        <h3>{{ action.name }}</h3>
        <h4>Aliases: <span>{{ action.aliases }}</span></h4>
        <h4 v-if="action.description">
          Description: <span>{{ action.description }}</span>
        </h4>
      </li>
    </ul>
  </div>
</template>
