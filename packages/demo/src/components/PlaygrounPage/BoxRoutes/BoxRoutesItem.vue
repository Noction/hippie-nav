<template>
  <div class="flex">
    <h4 :class="boxType">
      {{ route.name }}
    </h4>
    <div class="flex box-routes-btns">
      <hippie-btn-collapse
        v-if="hasChildren"
        :collapsed="Boolean(collapsed)"
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
  <h5 :class="boxType + 'Path'">
    {{ boxType !== 'parent' ? `/${route.path}` : route.path }}
  </h5>
</template>

<script lang="ts">
import HippieBtnCollapse from '../../common/HippieBtnCollapse.vue'
import {  RouteRecordRaw } from 'vue-router'
import { PropType, defineComponent } from 'vue'

export default defineComponent({
  name: 'BoxRoutesItem',
  components: {
    HippieBtnCollapse
  },
  props: {
    boxType: {
      type: String as PropType<'parent' | 'child' | 'grandChild'>,
      required: true
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    hasChildren: {
      type: Boolean,
      required: false,
      default: false
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
.box-routes-btns {
  margin-left: auto;
}

.parent {
    font-size: 16px;
}

.parentPath {
    font-size: 14px;
    font-weight: lighter;
}

.child {
    font-size: 14px;
}

.childPath {
    font-size: 12px;
    font-weight: lighter;
}

.grandChild {
    font-size: 12px;
}

.grandChildPath {
    font-size: 10px;
    font-weight: lighter;
}

</style>
