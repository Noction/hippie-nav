<template>
  <div class="hippie-nav">
    <transition name="hippie">
      <search-modal :shown="showModal" @close="closeModal">
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
                :options="options"
                is-recent-result
                :search-input="searchInput"
                :result="resultItem"
                :class="{ selected: index === current }"
                data-test="recentResults"
                @mouse-over="handleMouseOver(resultItem, 'recentResults')"
                @close-modal="closeModal"
                @remove-recent-result="handleRemoveRecentResult(resultItem)"
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
                data-test="results"
                :options="options"
                :search-input="searchInput"
                :class="{ selected: index === current }"
                :result="resultItem"
                @goto="goto"
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
          No results for&nbsp;<b>“{{ searchInput }}“</b>
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
import { useFlexSearch } from '@noction/vue-use-flexsearch'
import { usePersistiveLocalStorage } from '@/composable/usePersistiveLocalStorage'
import { useRouter } from 'vue-router'
import { useShortcut } from '@/util/keyboard'
import { ActionConfig, AppOptions, HippieIndex, ResultItem, ResultWithId } from '@/types'
import { Ref, computed, inject, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { addIndex, indexSetup } from '@/util/indexSetup'
import { assignIdsArray, filterExcludedPaths, filterHiddenRoutes, transformDataToResultData } from '@/util/helpers'
import { defaultOptions, hippieNavOptions } from '@/index'

const props = withDefaults(defineProps<{
  actions?: ActionConfig[]
  options?: AppOptions
}>(), { actions: () => [] as ActionConfig[], options: () => defaultOptions })

defineExpose({ openModal, reindexRoutes })

const searchPan = ref<InstanceType<typeof SearchPan>>()
const router = useRouter()
const current = ref(0)
const options = ref( props.options || inject(hippieNavOptions))
const indexActions = ref<HippieIndex>()
const indexRoutes = ref<HippieIndex>()
const results = shallowRef<ResultItem[]>([])
const searchInput = ref('')
const showModal = ref(false)
const routes = router.getRoutes()
const validRoutes = computed(() => {
  if (!options.value.excludedPaths) return filterHiddenRoutes(routes)

  return filterExcludedPaths(filterHiddenRoutes(routes), options.value.excludedPaths)
})
const resultsLimit = options.value.resultsLimit ?? defaultOptions.resultsLimit
const { results: routesResults }: { results: Ref<ResultWithId[]> } = useFlexSearch(
  searchInput,
  indexRoutes,
  ref(assignIdsArray(validRoutes.value)),
  { limit: resultsLimit }
)
const { results: actionsResults }: { results: Ref<ResultWithId[]> } = useFlexSearch(
  searchInput,
  indexActions,
  ref(assignIdsArray(props.actions)),
  { limit: resultsLimit }
)
let cleanUp: () => void = null

watch([searchInput], () => {
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
  const routesIndexFields = options.value?.indexFields?.routes
  const indexFields = { id: 'id', index: routesIndexFields ?? defaultOptions.indexFields.routes }

  indexRoutes.value = indexSetup(indexFields)
  addIndex(indexRoutes.value, assignIdsArray(validRoutes.value))
}

function goto () {
  if (current.value < 0 || (results.value.length === 0 && searchInput.value !== '')) return

  let result: ResultItem

  if (results.value.length !== 0) {
    result = results.value[current.value]
  } else result = recentResults.value[current.value]

  if ('action' in result.data) {
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
  const actionsIndexFields = options.value?.indexFields?.actions ?? defaultOptions.indexFields.actions
  const indexFields = { id: 'id', index: actionsIndexFields }

  indexActions.value = indexSetup(indexFields)
  addIndex(indexActions.value, assignIdsArray(props.actions))
}

function handlerModalShortCut () {
  current.value = 0
  showModal.value = !showModal.value

  if (showModal.value === false) searchInput.value = ''
}

function handlerTabPreventShortCut () {
  if (showModal.value === true) searchPan.value.focusInput()
}

function setupShortcuts () {
  const cleanUpOpenModal = useShortcut(handlerModalShortCut, ['ctrl+k', 'meta+k'])
  const cleanUpTabPrevent = useShortcut(handlerTabPreventShortCut, ['tab'])

  cleanUp = function () {
    cleanUpOpenModal()
    cleanUpTabPrevent()
  }
}

function handleRemoveRecentResult (resultItem: ResultItem) {
  removeRecentResult(resultItem)
  searchPan.value.focusInput()
}

const {
  recentResults,
  addItem: addRecentResult,
  removeItem: removeRecentResult
} = usePersistiveLocalStorage(props.actions)

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

  .hippie-enter-active {
    animation: fade calc(var(--hippie-animate-duration) / 2);

    .modal-content { animation: pulse var(--hippie-animate-duration); }
  }

  .hippie-leave-active {
    animation: fade calc(var(--hippie-animate-duration) / 2) reverse;

    .modal-content { animation: pulse calc(var(--hippie-animate-duration)) reverse; }
  }

  .hippie-enter-from, .hippie-leave-to { opacity: 0; }

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
    color: var(--hippie-text-color)
  }
</style>
