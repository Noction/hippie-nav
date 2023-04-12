<template>
  <search-modal
    :shown="showModal"
    :input="searchInput"
    @close="showModal = false"
  >
    <search-pan
      :model-value="searchInput"
      @close="showModal = false"
      @next="next"
      @previous="previous"
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
    <search-result
      :results="results"
      :current="current"
      :input="searchInput"
      @mouse-over="onMouseOver"
      @close-modal="showModal = false"
    >
      <template #resultItemRoute="route">
        <slot name="resultItemRoute" v-bind="route" />
      </template>
      <template #resultItemAction="action">
        <slot name="resultItemAction" v-bind="action" />
      </template>
    </search-result>
    <hr>
    <nav-buttons />
  </search-modal>
</template>

<script lang="ts">
import { ActionConfig } from './types'
import { Document } from 'flexsearch'
import NavButtons from './components/NavButtons.vue'
import RecentResults from './components/RecentResults.vue'
import { RouteRecordNormalized } from 'vue-router'
import SearchModal from './components/SearchModal.vue'
import SearchPan from './components/SearchPan.vue'
import SearchResult from './components/SearchResult.vue'
import { excludedPaths } from './index'
import { filterExcludedPaths } from './util/filterExcludedPaths'
import { onKeyboardShortcut } from './util/keyboard'
import { useFlexSearch } from './util/useFlexSearch.js'
import { PropType, defineComponent, inject } from 'vue'
import { indexAdd, indexSetup } from './util/indexSetup'

export interface ResultItem {
  type: 'route' | 'action',
  data: RouteRecordNormalized | ActionConfig
}

export default defineComponent({
  name: 'HippieNav',
  components: {
    NavButtons,
    RecentResults,
    SearchModal,
    SearchPan,
    SearchResult
  },
  expose: ['fullReindex'],
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
      indexActions: {} as Document<any>,
      indexRoutes: {} as Document<any>,
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
    searchInput (value) {
      this.results = []
      this.resultsRoutes = useFlexSearch(value, this.indexRoutes, this.validConfig, 'route')
      this.resultsActions = useFlexSearch(value, this.indexActions, this.actions, 'action')
      if (this.resultsRoutes?.length > 0) {
        this.resultsRoutes.forEach((r: RouteRecordNormalized) => {
          this.results.push({
            data: r,
            type: 'route'
          })
        })
      }
      if (this.resultsActions?.length > 0) {
        this.resultsActions.forEach((r: ActionConfig) => {
          this.results.push({
            data: r,
            type: 'action'
          })
        })
      }
      this.current = 0
    }
  },
  mounted () {
    onKeyboardShortcut(['ctrl+k', 'meta+k'], event => {
      this.showModal = true
      event.preventDefault()
    })
    const indexFields = { id: 'id', index: ['name', 'aliases'] }

    this.indexActions = indexSetup('action', indexFields)
    indexAdd(this.indexActions, this.actions, 'action')
    this.fullReindex()
  },
  methods: {
    fullReindex () {
      const indexFields = { id: 'id', index: ['name', 'aliases', 'path'] }

      this.indexRoutes = indexSetup('route', indexFields)
      indexAdd(this.indexRoutes, this.validConfig, 'route')
    },
    goto () {
      if (this.results[this.current].type === 'route') {
        const route = this.results[this.current].data as RouteRecordNormalized

        this.$router.push(route.path)
      } else if (this.results[this.current].type === 'action') {
        const actionItem = this.results[this.current].data as ActionConfig

        actionItem.action()
      }
      this.recentResults.push(this.results[this.current])
      this.recentResults = this.recentResults.slice(-3)
      this.showModal = false
    },
    next () {
      if (this.results.length - 1 === this.current) return
      this.current++
    },
    onMouseOver (e: ResultItem) {
      this.current = this.results?.findIndex(r => r.data.name === e.data.name)
    },
    previous () {
      if (this.current === 0) return
      this.current--
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
  margin: 2px;
}
</style>
