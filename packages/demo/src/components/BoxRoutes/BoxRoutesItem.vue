<template>
  <li class="box-routes-item">
    <div class="flex">
      <h4>{{ route.name }}</h4>
      <div class="flex box-routes-btns">
        <hippie-btn-collapse
          v-if="hasChildren"
          :collapsed="collapsed"
          @click="setShowChildPath(route.path)"
        />
        <button
          v-if="route.path !== '/'"
          class="button-add"
          @click="addChildRoute(route)"
        >
          add
          +
        </button>
      </div>
    </div>
    <slot name="slote" />
    <h5>{{ route.path }}</h5>
  </li>
</template>

<script lang="ts">
import HippieBtnCollapse from '../HippieBtnCollapse.vue'
import { PropType, defineComponent } from 'vue'
import { RouteRecordNormalized, RouteRecordRaw } from 'vue-router'

export default defineComponent({
  name: 'BoxRoutesItem',
  components: {
    HippieBtnCollapse
  },
  props: {
    collapsed: {
      type: Boolean,
      required: true
    },
    hasChildren: {
      type: Boolean,
      required: true
    },
    route: {
      type: Object as PropType<RouteRecordRaw>,
      required: true
    }
  },
  emits: ['set-show-child-path', 'add-child-route'],
  methods: {
    addChildRoute (route: RouteRecordNormalized) {
      this.$emit('add-child-route', route)
    },
    setShowChildPath (path: string) {
      this.$emit('set-show-child-path', path)
    }
  }
})
</script>

<style scoped>
.box-routes-item {
  margin-top: 2px;
}

.box-routes-btns {
  margin-left: auto;
}
</style>
