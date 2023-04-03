<script lang="ts">
import { Document } from 'flexsearch'
import { PropType, defineComponent } from 'vue'
import { RouteRecordNormalized } from 'vue-router'
import SearchModal from './components/SearchModal.vue'
import SearchPan from './components/SearchPan.vue'
import SearchResult from './components/SearchResult.vue'
import { filterExcludedPaths } from './util/filterExcludedPaths'
import { indexAdd, indexSetup } from './util/indexSetup'
import { onKeyboardShortcut } from './util/keyboard'
import { useFlexSearch } from './util/useFlexSearch.js'

export default defineComponent({
  components: {
    SearchResult,
    SearchModal,
    SearchPan
  },
  props: {
    routes: {
      type: Array as PropType<RouteRecordNormalized[]>,
      required: true
    },
    excludedPaths: {
      type: Array as PropType<string[]>
    }
  },
  data () {
    return {
      showModal: false,
      searchInput: '',
      results: [] as RouteRecordNormalized[],
      recentResults: [] as RouteRecordNormalized[],
      current: -1,
      index: {} as Document<any>
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
      if (value === '') {
        this.results = []
      }
      this.results = useFlexSearch(value, this.index, this.validConfig)
      this.current = -1
    }
  },
  mounted () {
    onKeyboardShortcut(['ctrl+k', 'meta+k'], event => {
      this.showModal = true
      event.preventDefault()
    })
    this.index = indexSetup()
    indexAdd(this.index, this.validConfig)
  },
  methods: {
    next () {
      if (this.results.length - 1 === this.current) return
      this.current++
    },
    previous () {
      if (this.current === 0) return
      this.current--
    },
    goto (index: number) {
      if (index) {
        this.$router.push(this.results[index].path)
      } else {
        this.$router.push(this.results[this.current].path)
      }
      this.recentResults.push(this.results[this.current])
      this.recentResults = this.recentResults.slice(-3)
      this.showModal = false
    }
  }
})

</script>

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
      @update:modelValue="newValue => searchInput = newValue"
    />
    <hr>
    <div v-if="recentResults.length > 0">
      <h3 class="text">
        Recent results
      </h3>
      <div v-for="(result) in recentResults" :key="result.name">
        <h4 class="text">
          {{ result.name }}
        </h4>
      </div>
    </div>
    <SearchResult :results="results" :current="current"/>
  </search-modal>
</template>

<style scoped>

</style>
