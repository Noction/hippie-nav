<template>
  <div class="hippie-nav">
    <transition name="hippie">
      <search-modal :shown="showModal" @close="handleToggleModal">
        <search-pan
          ref="searchPan"
          v-model="searchInput"
          @close="handleToggleModal"
          @next="handleMove('next')"
          @previous="handleMove('previous')"
          @goto="goto"
        />
        <div class="search-results">
          <expand-transition>
            <transition-group
              v-if="recentResults.length && !searchInput"
              name="list"
              tag="ul"
            >
              <span class="recent-title">Recent</span>
              <search-result-item
                v-for="(resultItem, index) in recentResults"
                :key="index"
                :options="options"
                is-recent-result
                :search-input="searchInput"
                :result="resultItem"
                :class="{ selected: index === current }"
                data-test="recentResults"
                @goto="goto"
                @mouse-over="handleMouseOver(resultItem, 'recentResult')"
                @close-modal="handleToggleModal"
                @remove-recent-result="handleRemoveRecentResult(resultItem)"
              >
                <template #resultItem="result">
                  <slot name="resultItem" v-bind="result" />
                </template>
              </search-result-item>
            </transition-group>
            <transition-group
              v-else-if="results.length"
              name="list"
              tag="ul"
            >
              <search-result-item
                v-for="(resultItem, index) in results"
                :key="resultItem.data.id"
                data-test="results"
                :options="options"
                :search-input="searchInput"
                :class="{ selected: index === current }"
                :result="resultItem"
                :style="{ transitionDelay:`${index * 0.025}s` }"
                @goto="goto"
                @mouse-over="handleMouseOver(resultItem, 'result')"
                @close-modal="handleToggleModal"
              >
                <template #resultItem="result">
                  <slot name="resultItem" v-bind="result" />
                </template>
              </search-result-item>
            </transition-group>
          </expand-transition>
        </div>
        <div v-if="results.length === 0 && searchInput !== ''" class="no-result">
          No results for&nbsp;<b>“{{ searchInput }}“</b>
        </div>
        <nav-buttons v-if="recentResults.length || results.length" />
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
import { Ref, computed, inject, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue-demi'
import { addIndex, indexSetup } from '@/util/indexSetup'
import { assignIdsArray, filterExcludedPaths, filterHiddenRoutes, transformDataToResultData } from '@/util/helpers'
import { defaultOptions, hippieNavOptions } from '@/index'

const props = withDefaults(defineProps<{
  actions?: ActionConfig[]
  options?: AppOptions
}>(), { actions: () => [] as ActionConfig[], options: () => defaultOptions })

defineExpose({ openModal: handleToggleModal, reindexRoutes: setupIndexRoutes })

const searchPan = ref<InstanceType<typeof SearchPan>>()
const router = useRouter()
const current = ref(0)
const options = inject(hippieNavOptions, props.options)
const indexActions = ref<HippieIndex>()
const indexRoutes = ref<HippieIndex>()
const results = shallowRef<ResultItem[]>([])
const searchInput = ref('')
const showModal = ref(false)
const routes = router.getRoutes()
const validRoutes = computed(() => {
  if (!options.excludedPaths) return filterHiddenRoutes(routes)

  return filterExcludedPaths(filterHiddenRoutes(routes), options.excludedPaths)
})
const resultsLimit = options.resultsLimit ?? defaultOptions.resultsLimit

let cleanUp: () => void = null

watch([searchInput], () => {
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
  ].slice(0, resultsLimit)
  current.value = 0
})

function setupIndexRoutes () {
  const routesIndexFields = options?.indexFields?.routes ?? defaultOptions.indexFields.routes
  const indexFields = { id: 'id', index: routesIndexFields }

  indexRoutes.value = indexSetup(indexFields)
  addIndex(indexRoutes.value, assignIdsArray(validRoutes.value))
}

function goto () {
  let result: ResultItem

  if (results.value.length !== 0) {
    result = results.value[current.value]
  } else { result = recentResults.value[current.value] }

  if (result === undefined || (results.value.length === 0 && searchInput.value !== '')) return

  showModal.value = false
  searchInput.value = ''

  if ('action' in result.data) {
    result.data.action()
  } else {
    router.push(result.data.path)
  }
  addRecentResult(result)
}

function handleMouseOver (e: ResultItem, type: 'recentResult' | 'result') {
  if (type === 'result') {
    current.value = results.value?.findIndex(r => r.data.id === e.data.id)

    return
  }

  current.value = recentResults.value?.findIndex(r => r.data.id === e.data.id)
}

function handleMove (direction: 'next' | 'previous') {
  const isRecentResult = results.value.length === 0
  const maxCurrentValue = (isRecentResult ? recentResults.value.length : results.value.length) - 1

  if (direction === 'next' && current.value === maxCurrentValue) return current.value = 0

  if (direction === 'previous' && current.value === 0) return current.value = maxCurrentValue

  if (direction === 'next') return current.value++

  current.value--
}

function setupActionsIndex () {
  const actionsIndexFields = options?.indexFields?.actions ?? defaultOptions.indexFields.actions
  const indexFields = { id: 'id', index: actionsIndexFields }

  indexActions.value = indexSetup(indexFields)
  addIndex(indexActions.value, assignIdsArray(props.actions))
}

function handleToggleModal () {
  current.value = 0
  showModal.value = !showModal.value
  searchInput.value = ''
}

function setupToggleModalShortcut () {
  cleanUp = useShortcut(handleToggleModal, ['ctrl+k', 'meta+k'])
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
  setupToggleModalShortcut()
  setupActionsIndex()
  setupIndexRoutes()
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

    .search-results {
      ul { padding: 0 }

      .recent-title {
        padding: var(--hippie-spacing-s) var(--hippie-spacing-l);
        font-size: var(--hippie-text-xs);
        font-weight: 700;
        opacity: .5;
      }
    }

    .no-result {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--hippie-spacing-2xl);
      color: var(--hippie-text-color)
    }
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

  .list-enter-active,
  .list-leave-active {
    transition: all 0.2s ease;
  }

  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }

</style>
