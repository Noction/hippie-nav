<template>
  <div class="hippie-nav">
    <transition name="hippie">
      <search-modal
        :shown="showModal"
        @close="closeModal"
      >
        <search-pan
          ref="searchPan"
          v-model="searchInput"
          @close="closeModal"
          @next="move('next')"
          @previous="move('previous')"
          @goto="goto"
        />
        <div class="search-results">
          <expand-transition>
            <div v-if="recentResults.length && !searchInput">
              <search-result-item
                v-for="(resultItem, index) in recentResults"
                :key="index"
                is-recent-result
                :search-input="searchInput"
                :result="resultItem"
                :class="{ selected: index === current }"
                @mouse-over="handleMouseOver(resultItem, 'recentResults')"
                @close-modal="closeModal"
                @remove-recent-result="removeRecentResult(index, resultItem)"
              >
                <template #resultItem="result">
                  <slot name="resultItem" v-bind="result" />
                </template>
              </search-result-item>
            </div>
            <div v-else-if="results.length">
              <search-result-item
                v-for="(resultItem, index) in results"
                :key="resultItem.data.id"
                :search-input="searchInput"
                :class="{ selected: index === current }"
                :result="resultItem"
                @mouse-over="handleMouseOver(resultItem, 'results')"
                @close-modal="closeModal"
              >
                <template #resultItem="result">
                  <slot name="resultItem" v-bind="result" />
                </template>
              </search-result-item>
            </div>
          </expand-transition>
        </div>
        <div v-if="results.length === 0 && searchInput !== ''" class="no-result">
          No results for <b>“{{ searchInput }}“</b>
        </div>
        <nav-buttons v-if="searchInput" />
      </search-modal>
    </transition>
  </div>
</template>

<script setup lang="ts">
import ExpandTransition from '@/components/ExpandTransition.vue'
import NavButtons from './NavButtons.vue'
import SearchModal from './SearchModal.vue'
import SearchPan from './SearchPan.vue'
import SearchResultItem from '@/components/SearchResultItem.vue'
import { hippieNavOptions } from '@/index'
import { isActionConfig } from '@/types/typePredicates'
import { isMatchingShortcut } from '@/util/keyboard'
import { useFlexSearch } from '@noction/vue-use-flexsearch'
import { useRouter } from 'vue-router'
import { ActionConfig, IndexOptionsHippieNav, ResultItem, ResultWithId } from '@/types'
import { Document, IndexOptionsForDocumentSearch } from 'flexsearch'
import { HippieLocalStorage, usePersistiveLocalStorage } from '@/composable/usePersistiveLocalStorage'
import { Ref, computed, inject, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { assignIdsArray, filterExcludedPaths, transformDataToResultData } from '@/util/helpers'
import { indexAdd, indexSetup } from '@/util/indexSetup'
import { useEventListener, useLocalStorage } from '@vueuse/core'

const props = withDefaults(defineProps<{
  actions?: ActionConfig[]
}>(), { actions: () => [] as ActionConfig[] })

const searchPan = ref<InstanceType<typeof SearchPan>>()
const router = useRouter()
const current = ref(0)
const options = inject(hippieNavOptions)
const indexActions = ref<Document<IndexOptionsForDocumentSearch<IndexOptionsHippieNav>>>()
const indexRoutes = ref<Document<IndexOptionsForDocumentSearch<IndexOptionsHippieNav>>>()
const recentResults = ref<ResultItem[]>([]) as Ref<ResultItem[]>
const results = shallowRef<ResultItem[]>([])
const searchInput = ref('')
const showModal = ref(false)
const routes = router.getRoutes()
const validRoutes = computed(() => {
  if (!options) return routes

  return filterExcludedPaths(routes, options.excludedPaths)
})
let cleanUp: () => void = null

watch([searchInput], () => {
  results.value = []
  const { results: routesResults }: { results: Ref<ResultWithId[]> } = useFlexSearch(
    searchInput,
    indexRoutes,
    ref(assignIdsArray(validRoutes.value))
  )
  const { results: actionsResults }: { results: Ref<ResultWithId[]> } = useFlexSearch(
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

function reindexRoutes () {
  const routesIndexFields = options.indexFields.routes
  const indexFields = { id: 'id', index: routesIndexFields ?? ['path', 'name'] }

  indexRoutes.value = indexSetup('route', indexFields)
  indexAdd(indexRoutes.value, assignIdsArray(validRoutes.value), 'route')
}

function addRecentResult (result: ResultItem) {
  const idx = recentResults.value.findIndex(recentResult => {
    if (recentResult.type !== result.type) return false

    return recentResult.data.name === result.data.name
  })

  if (~idx) {
    const elementZero = recentResults.value[idx]
    const filteredRecentResults = recentResults.value.filter(rs => rs.data.id !== elementZero.data.id)

    recentResults.value = [elementZero, ...filteredRecentResults]
  } else {
    recentResults.value.unshift(result)
    if (recentResults.value.length > 3) recentResults.value.pop()
  }
}

function goto () {
  if (current.value < 0) return
  let result: ResultItem

  if (results.value.length !== 0) {
    result = results.value[current.value]
  } else result = recentResults.value[current.value]

  if (isActionConfig(result.data)) {
    result.data.action()
  } else {
    router.push(result.data.path)
  }
  addRecentResult(result)
  closeModal()
}

function handleMouseOver (e: ResultItem, type: 'recentResults' | 'results') {
  if (type === 'results') {
    current.value = results.value?.findIndex(r => r.data.id === e.data.id)
    return
  }
  current.value = recentResults.value?.findIndex(r => r.data.id === e.data.id)
}

function move (direction: 'next' | 'previous') {

  if (direction === 'next') {
    const isNextResult = results.value.length - 1 > current.value && results.value.length !== 0
    const isNextRecentResult = recentResults.value.length - 1 > current.value && recentResults.value.length !== 0

    if (isNextResult || isNextRecentResult) {
      current.value++
      return
    }
  }
  const isPrevious = direction === 'previous' && current.value > 0

  if (isPrevious) current.value--
}

function setupActionsIndex () {
  const actionsIndexFields = options.indexFields.actions
  const indexFields = { id: 'id', index: actionsIndexFields ?? ['name'] }

  indexActions.value = indexSetup('action', indexFields)
  indexAdd(indexActions.value, assignIdsArray(props.actions), 'action')
}

function setupShortcuts () {
  const cleanUpOpenModal = useEventListener('keydown', event => {
    if (isMatchingShortcut(['ctrl+k', 'meta+k'])) {
      current.value = 0
      showModal.value = !showModal.value

      if (showModal.value === false) searchInput.value = ''

      event.preventDefault()
    }
  })

  const cleanUpTabPrevent = useEventListener('keydown', event => {
    if (isMatchingShortcut(['tab'])) {
      if (showModal.value === true) searchPan.value.focusInput()

      event.preventDefault()
    }
  })

  cleanUp = function () {
    cleanUpOpenModal()
    cleanUpTabPrevent()
  }
}

function removeRecentResult (resultIndex: number, resultItem: ResultItem) {
  recentResults.value = recentResults.value.filter((rs, idx) => idx !== resultIndex)
  const keyRef = useLocalStorage(HippieLocalStorage, '')

  const array = JSON.parse(keyRef.value)

  if (!Array.isArray(array)) return

  const recentResultsLocalStorage = array.filter(item => {
    if (item.type === resultItem.type) {
      return resultItem.data.name !== item.name
    }
    return true
  })

  keyRef.value = JSON.stringify(recentResultsLocalStorage)
}

defineExpose({ openModal, reindexRoutes })

usePersistiveLocalStorage(recentResults, props.actions)

onMounted(() => {
  setupShortcuts()
  setupActionsIndex()
  reindexRoutes()
})

onBeforeUnmount(() => {
  if (cleanUp) cleanUp()
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
    0% {
      transform: scale3d(.9, .9, .9)
    }

    55% {
      transform: scale3d(.98, .98, .98)
    }

    100% {
      transform: scale3d(1, 1, 1)
    }
  }

  @keyframes fade {
    0% {
      opacity: 0
    }

    50% {
      opacity: .75
    }

    100% {
      opacity: 1
    }
  }

  .no-result {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--hippie-spacing-2xl);
    color: hsl(var(--hippie-secondary-color-base) 20%)
  }
</style>
