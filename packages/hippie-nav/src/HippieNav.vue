<template>
  <search-modal
    :shown="showModal"
    :input="searchInput"
    @close="closeModal"
  >
    <search-pan
      :model-value="searchInput"
      @close="showModal = false"
      @next="move('next')"
      @previous="move('previous')"
      @goto="goto"
      @update-model-value="newValue => searchInput = newValue"
    />
    <hr>
    <div v-if="recentResults.length > 0">
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
        @mouse-over="onMouseOver"
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
    <hr>
    <nav-buttons />
  </search-modal>
</template>

<script lang="ts">
import ExpandTransition from './components/ExpandTransition.vue'
import NavButtons from './components/NavButtons.vue'
import RecentResults from './components/RecentResults.vue'
import SearchModal from './components/SearchModal.vue'
import SearchPan from './components/SearchPan.vue'
import SearchResult from './components/SearchResult.vue'
import { excludedPaths } from './index'
import { filterExcludedPaths } from './util/filterExcludedPaths'
import { onKeyboardShortcut } from './util/keyboard'
import { useFlexSearch } from './util/useFlexSearch.js'
import { ActionConfig, IndexOptionsHippieNav, ResultItem } from './types'
import { Document, IndexOptionsForDocumentSearch } from 'flexsearch'
import { PropType, defineComponent, inject } from 'vue'
import { RouteRecordNormalized, RouteRecordRaw } from 'vue-router'
import { indexAdd, indexSetup } from './util/indexSetup'

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
      resultsActions: [] as ActionConfig[],
      resultsRoutes: [] as RouteRecordNormalized[],
      searchInput: '',
      showModal: false
    }
  },
  computed: {
    validConfig () {
      if (!this.excludedPaths) {
        return this.routes
      }
      return filterExcludedPaths(this.routes, this.excludedPaths)
    }
  },
  watch: {
    searchInput (value: string) {
      this.results = []
      this.resultsRoutes = useFlexSearch(value, this.indexRoutes, this.validConfig, 'route')
      this.resultsActions = useFlexSearch(value, this.indexActions, this.actions, 'action')
      if (this.resultsRoutes?.length > 0) {
        this.resultsRoutes.forEach((r: RouteRecordNormalized) => {
          this.results.push({ data: r, type: 'route' })
        })
      }

      if (this.resultsActions?.length > 0) {
        this.resultsActions.forEach((r: ActionConfig) => {
          this.results.push({ data: r, type: 'action' })
        })
      }
      this.current = 0
    }
  },
  mounted () {
    onKeyboardShortcut(['ctrl+k', 'meta+k'], event => {
      this.openModal()
      event.preventDefault()
    })
    const indexFields = { id: 'id', index: ['name', 'aliases'] }

    this.indexActions = indexSetup('action', indexFields)
    indexAdd(this.indexActions, this.actions, 'action')
    this.fullReindex()
  },
  methods: {
    closeModal () {
      this.showModal = false
      this.searchInput = ''
    },
    fullReindex () {
      const indexFields = { id: 'id', index: ['name', 'aliases', 'path'] }

      this.indexRoutes = indexSetup('route', indexFields)
      indexAdd(this.indexRoutes, this.validConfig, 'route')
    },
    goto () {
      const result = this.results[this.current]

      if (result.type === 'route') {
        const route = result.data as RouteRecordRaw

        this.$router.push(route.path)
      } else if (result.type === 'action') {
        const actionItem = result.data as ActionConfig

        actionItem.action()
      }
      this.recentResults.push(result)
      if (this.recentResults.length > 3) {
        this.recentResults.shift()
      }
      this.closeModal()
    },
    move (direction: 'next' | 'previous') {
      if (direction === 'next' && this.results.length - 1 > this.current) {
        this.current++
      } else if (direction === 'previous' && this.current > 0) {
        this.current--
      }
    },
    onMouseOver (e: ResultItem) {
      this.current = this.results?.findIndex(r => r.data.name === e.data.name)
    },
    openModal () {
      this.showModal = true
    }
  }
})

</script>

<style>
  img {
    width: 40px;
    height: 40px;
  }

  hr {
    height: 1px;
    margin: 2px;
    border: 3px;
    box-shadow: inset 0 12px 12px -12px rgb(0 0 0 / 50%);
  }
</style>
