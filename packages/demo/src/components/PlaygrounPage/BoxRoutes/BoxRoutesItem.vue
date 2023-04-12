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
import HippieBtnCollapse from '../../common/HippieBtnCollapse.vue'
import { PropType, defineComponent } from 'vue'
import {  RouteRecordRaw } from 'vue-router'

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
  emits: ['setShowChildPath', 'addChildRoute'],
  methods: {
    addChildRoute (route: RouteRecordRaw) {
      this.$emit('addChildRoute', route)
    },
    setShowChildPath (path: string) {
      this.$emit('setShowChildPath', path)
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
