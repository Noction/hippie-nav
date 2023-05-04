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
          <recent-results :recent-results="recentResults">
            <template #recentResultItem="result">
              <slot name="recentResultItem" v-bind="result" />
            </template>
          </recent-results>
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
        <nav-buttons v-if="searchInput" />
      </search-modal>
    </transition>
  </div>
</template>

<script lang="ts">
import ExpandTransition from './ExpandTransition.vue'
import NavButtons from './NavButtons.vue'
import RecentResults from './RecentResults.vue'
import { RouteRecordNormalized } from 'vue-router'
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
import { ActionConfig, IndexOptionsHippieNav, ResultItem } from '@/types'
import { Document, IndexOptionsForDocumentSearch } from 'flexsearch'
import { PropType, defineComponent, inject, ref } from 'vue'
import {
  addLocalStorageRecentResults,
  extractLocalStoreRecentResults
} from '@/util/persistiveLocalStorage'
import { indexAdd, indexSetup } from '@/util/indexSetup'

export default defineComponent({
  name: 'HippieNav',
  components: {
    ExpandTransition,
    NavButtons,
    RecentResults,
    SearchModal,
    SearchPan,
    SearchResult
  },
  expose: ['fullReindex', 'openModal'],
  props: {
    actions: {
      type: Array as PropType<ActionConfig[]>,
      required: true
    },
    routes: {
      type: Array as PropType<RouteRecordNormalized[]>,
      required: true
    }
  },
  data () {
    return {
      current: 0,
      excludedPaths: inject(excludedPaths) as string[],
      indexActions: {} as Document<IndexOptionsForDocumentSearch<IndexOptionsHippieNav>>,
      indexRoutes: {} as Document<IndexOptionsForDocumentSearch<IndexOptionsHippieNav>>,
      recentResults: [] as ResultItem[],
      results: [] as ResultItem[],
      searchInput: '',
      showModal: false
    }
  },
  cleanUp : null,
  computed: {
    validRoutes () {
      if (!this.excludedPaths) {
        return this.routes
      }
      return filterExcludedPaths(this.routes, this.excludedPaths)
    }
  },
  watch: {
    searchInput (newSearchInput) {
      this.results = []

      const queryRef = ref(newSearchInput)
      const { results: routesResults } = useFlexSearch(
        queryRef,
        ref(this.indexRoutes),
        ref(assignIdsArray(this.validRoutes))
      )
      const { results: actionsResults } = useFlexSearch(
        queryRef,
        ref(this.indexActions),
        ref(assignIdsArray(this.actions))
      )

      this.results = [
        ...transformDataToResultData(routesResults.value),
        ...transformDataToResultData(actionsResults.value)
      ]
      this.current = 0
    }
  },
  mounted () {
    this.$options.cleanUp = useEventListener('keydown', event => {
      if (isMatchingShortcut(['ctrl+k', 'meta+k'])) {
        this.openModal()
        event.preventDefault()
      }
    })

    const indexFields = { id: 'id', index: ['name', 'aliases'] }

    this.indexActions = indexSetup('action', indexFields)
    indexAdd(this.indexActions, assignIdsArray(this.actions), 'action')
    this.fullReindex()
    this.recentResults = extractLocalStoreRecentResults(this.actions, this.routes)
  },
  beforeMount () {
    if (this.$options.cleanUp) {
      this.$options.cleanUp()
    }
  },
  methods: {
    addRecentResult (result: ResultItem) {
      this.recentResults.unshift(result)
      if (this.recentResults.length > 3) {
        this.recentResults.pop()
      }
      addLocalStorageRecentResults(this.recentResults)
    },
    closeModal () {
      this.showModal = false
      this.searchInput = ''
    },
    fullReindex () {
      const indexFields = { id: 'id', index: ['name', 'aliases', 'path'] }

      this.indexRoutes = indexSetup('route', indexFields)
      indexAdd(this.indexRoutes, assignIdsArray(this.validRoutes), 'route')
    },
    goto () {
      const result = this.results[this.current]

      if (!isActionConfig(result.data)) {
        const route = result.data

        this.$router.push(route.path)
      } else {
        const actionItem = result.data

        actionItem.action()
      }
      this.addRecentResult(result)
      this.closeModal()
    },
    handleMouseOver (e: ResultItem) {
      this.current = this.results?.findIndex(r => r.data.name === e.data.name)
    },
    move (direction: 'next' | 'previous') {
      if (direction === 'next' && this.results.length - 1 > this.current) {
        this.current++
      } else if (direction === 'previous' && this.current > 0) {
        this.current--
      }
    },
    openModal () {
      this.showModal = true
    }
  }
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
</style>
