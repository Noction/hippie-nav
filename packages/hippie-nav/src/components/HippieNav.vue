<template>
  <div class="hippie-nav">
    <transition name="hippie">
      <search-modal
        :shown="showModal"
        :input="searchInput"
        @close="closeModal"
      >
        <search-pan
          v-model="searchInput"
          @close="showModal = false"
          @next="move('next')"
          @previous="move('previous')"
          @goto="goto"
        />
        <div v-if="recentResults.length > 0 && !searchInput">
          <expand-transition>
            <search-result
              :search-input="searchInput"
              :results="recentResults"
              :current="current"
              :input="searchInput"
              @mouse-over="handleMouseOver"
              @close-modal="closeModal"
            >
              <template #resultItemRoute="route">
                <slot name="resultItemRoute" v-bind="route" />
              </template>
              <template #resultItemAction="action">
                <slot name="resultItemAction" v-bind="action" />
              </template>
            </search-result>
          </expand-transition>
        </div>
        <expand-transition>
          <search-result
            :search-input="searchInput"
            :results="results"
            :current="current"
            :input="searchInput"
            @mouse-over="handleMouseOver"
            @close-modal="closeModal"
          >
            <template #resultItemRoute="route">
              <slot name="resultItemRoute" v-bind="route" />
            </template>
            <template #resultItemAction="action">
              <slot name="resultItemAction" v-bind="action" />
            </template>
          </search-result>
        </expand-transition>
        <div v-if="results.length === 0 && searchInput !== ''" class="no-result">
          No results for <b>“{{ searchInput }}“</b>
        </div>
        <nav-buttons v-if="searchInput" />
      </search-modal>
    </transition>
  </div>
</template>

<script setup lang="ts">
import ExpandTransition from './ExpandTransition.vue'
import NavButtons from './NavButtons.vue'
import SearchModal from './SearchModal.vue'
import SearchPan from './SearchPan.vue'
import SearchResult from './SearchResult.vue'
import { assignIdsArray } from '@/util/assignIdsArray'
import { excludedPaths } from '@/index'
import { filterExcludedPaths } from '@/util/filterExcludedPaths'
import { isActionConfig } from '@/types/typePredicates'
import { isMatchingShortcut } from '@/util/keyboard'
import { transformDataToResultData } from '@/util/transformFlexDataToResult'
import { useEventListener } from '@vueuse/core'
import { useFlexSearch } from '@noction/vue-use-flexsearch'
import { useRouter } from 'vue-router'
import { ActionConfig, IndexOptionsHippieNav, ResultItem } from '@/types'
import { Document, IndexOptionsForDocumentSearch } from 'flexsearch'
import { PropType, Ref, computed, defineComponent, inject, onBeforeMount, onMounted, ref, watch } from 'vue'
import {
  addLocalStorageRecentResults,
  extractLocalStoreRecentResults
} from '@/util/persistiveLocalStorage'
import { indexAdd, indexSetup } from '@/util/indexSetup'

const props = defineProps({
  actions: {
    default: [] as ActionConfig[],
    required: false,
    type: Array as PropType<ActionConfig[]>
  }
})

const router = useRouter()
const current = ref(0)
const optionsExcludedPaths = ref<string[]>(inject(excludedPaths))
const indexActions = ref<Document<IndexOptionsForDocumentSearch<IndexOptionsHippieNav>>>()
const indexRoutes = ref<Document<IndexOptionsForDocumentSearch<IndexOptionsHippieNav>>>()

const recentResults= ref<ResultItem[]>([]) as Ref<ResultItem[]>
const results = ref<ResultItem[]>([]) as Ref<ResultItem[]>
const searchInput= ref('')
const showModal= ref(false)
const routes = router.getRoutes()
let cleanUp: ()  => void = null
const validRoutes = computed(() => {
  if (!optionsExcludedPaths.value) {
    return routes
  }
  return filterExcludedPaths(routes, optionsExcludedPaths.value)
})

watch([searchInput], () => {
  results.value = []
  const { results: routesResults } = useFlexSearch(
    searchInput,
    ref(indexRoutes.value),
    ref(assignIdsArray(validRoutes.value))
  )
  const { results: actionsResults } = useFlexSearch(
    searchInput,
    indexActions,
    ref(assignIdsArray(props.actions))
  )

  results.value = [
    ...transformDataToResultData(routesResults.value),
    ...transformDataToResultData(actionsResults.value)
  ]
  current.value = 0
})

function openModal () {
  showModal.value = true
}

function closeModal () {
  showModal.value = false
  searchInput.value = ''
}

function fullReindex () {
  const indexFields = { id: 'id', index: ['name', 'aliases', 'path'] }

  indexRoutes.value = indexSetup('route', indexFields)
  indexAdd(indexRoutes.value, assignIdsArray(validRoutes.value), 'route')
}

function addRecentResult (result: ResultItem) {
  recentResults.value.unshift(result)
  if (recentResults.value.length > 3) {
    recentResults.value.pop()
  }
  addLocalStorageRecentResults(recentResults.value)
}

function goto () {
  const result = results.value[current.value]

  if (!isActionConfig(result.data)) {
    const route = result.data

    router.push(route.path)
  } else {
    const actionItem = result.data

    actionItem.action()
  }
  addRecentResult(result)
  closeModal()
}

function handleMouseOver (e: ResultItem) {
  current.value = results.value?.findIndex(r => r.data.name === e.data.name)
}

function move (direction: 'next' | 'previous') {
  console.log('1')
  if (direction === 'next' && results.value.length - 1 > current.value) {
    current.value++
  } else if (direction === 'previous' && current.value > 0) {
    current.value--
  }
}

defineExpose({ fullReindex, openModal })

onMounted(() => {
  cleanUp = useEventListener('keydown', event => {
    if (isMatchingShortcut(['ctrl+k', 'meta+k'])) {
      openModal()
      event.preventDefault()
    }
  })

  const indexFields = { id: 'id', index: ['name', 'aliases'] }

  indexActions.value = indexSetup('action', indexFields)
  indexAdd(indexActions.value, assignIdsArray(props.actions), 'action')
  fullReindex()
  recentResults.value = extractLocalStoreRecentResults(props.actions, routes)
})

onBeforeMount(() => {
  if (cleanUp) {
    cleanUp()
  }
})

defineComponent({
  name: 'HippieNav'
})
</script>

<style lang="scss">
  @import "src/assets/styles";

  .hippie-nav {
    --hippie-animate-duration: .225s;

    box-sizing: border-box;
  }

  hr {
    height: 1px;
    margin: 2px;
    border: 3px;
    box-shadow: inset 0 12px 12px -12px rgb(0 0 0 / 50%);
  }

  .hippie-font-color-main {
    color: var(--hippie-secondary-color);
  }

  .hippie-font-color {
    color: var(--hippie-font-color);
  }

  .hippie-enter-active {
    animation: fade calc(var(--hippie-animate-duration) / 2);

    .modal-content {
      animation: pulse var(--hippie-animate-duration);
    }
  }

  .hippie-leave-active {
    animation: fade calc(var(--hippie-animate-duration) / 2) reverse;

    .modal-content {
      animation: pulse calc(var(--hippie-animate-duration)) reverse;
    }
  }

  .hippie-enter-from,
  .hippie-leave-to {
    opacity: 0;
  }

  @keyframes pulse {
    0% { transform: scale3d(.9, .9, .9) }
    55% { transform: scale3d(.98, .98, .98) }
    100% { transform: scale3d(1, 1, 1) }
  }

  @keyframes fade {
    0% { opacity: 0 }
    50% { opacity: .75 }
    100% { opacity: 1 }
  }

  .no-result {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--hippie-spacing-2xl);
  }
</style>
