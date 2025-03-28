<script lang="ts">
import type { PropType } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BoxRoutesItem',
  props: {
    boxType: {
      type: String as PropType<'parent' | 'child' | 'grand-child'>,
      required: true,
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasChildren: {
      type: Boolean,
      required: false,
      default: false,
    },
    route: {
      type: Object as PropType<RouteRecordRaw>,
      required: true,
    },
  },
  emits: ['setShowChildPath', 'addChildRoute'],
  methods: {
    addChildRoute(route: RouteRecordRaw) {
      this.$emit('addChildRoute', route)
    },
    setShowChildPath(path: string) {
      this.$emit('setShowChildPath', path)
    },
  },
})
</script>

<template>
  <div class="flex">
    <h4 :class="boxType">
      {{ route.name }}
    </h4>
    <div class="flex box-routes-btns">
      <HippieBtnCollapse
        v-if="hasChildren"
        :collapsed="Boolean(collapsed)"
        @click="setShowChildPath(route.path)"
      />
      <button
        v-if="route.path !== '/' && boxType !== 'grand-child'"
        class="button-add"
        @click="addChildRoute(route)"
      >
        add
        +
      </button>
    </div>
  </div>
  <h5 :class="`${boxType}-path`">
    {{ boxType !== 'parent' ? `/${route.path}` : route.path }}
  </h5>
</template>

<style scoped>
  .box-routes-btns {
    margin-left: auto;
  }

  .parent {
    font-size: 16px;
  }

  .parent-path {
    font-size: 14px;
    font-weight: 300;
  }

  .child {
    font-size: 14px;
  }

  .child-path {
    font-size: 12px;
    font-weight: 300;
  }

  .grand-child {
    font-size: 12px;
  }

  .grand-child-path {
    font-size: 10px;
    font-weight: 300;
  }
</style>
