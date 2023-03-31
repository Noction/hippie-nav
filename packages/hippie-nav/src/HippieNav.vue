<script lang="ts">
import {onKeyboardShortcut} from "./util/keyboard";
import SearchModal from "./components/SearchModal.vue";
import SearchPan from './components/SearchPan.vue'
import {defineComponent, PropType} from "vue";
import {HippieNavConfig, HippieNavConfigRoute} from "./types";
import {useFlexSearch} from "./util/useFlexSearch.js";
import {Document} from "flexsearch";

export default defineComponent({
  components: {
    SearchModal,
    SearchPan
  },
  props: {
    routes: {
      type: Array as PropType<string[]>,
      required: true
    },
    excludedPaths: {
      type: Array as PropType<string[]>,
    },
    config: {
      type: Array as PropType<HippieNavConfig>,
      required: true
    }
  },
  data() {
    return {
      showModal: false,
      searchInput: "",
      results: [] as HippieNavConfig,
      recentResults: [] as HippieNavConfig,
      current: -1,
      index: {} as Document<Partial<HippieNavConfigRoute>>
    }
  },
  methods: {
    next() {
      if (this.results.length - 1 === this.current) {
        return
      }
      this.current++
    },
    previous() {
      if (this.current === 0) {
        return
      }
      this.current--
    },
    goto(index: number) {
      if (index) {
        this.$router.push(this.results[index].path)
      } else {
        this.$router.push(this.results[this.current].path)
      }
      this.recentResults.push(this.results[this.current])
      this.showModal = false
    }
  },
  mounted() {
    onKeyboardShortcut(['ctrl+k', 'meta+k'], (event) => {
      this.showModal = true;
      event.preventDefault();
    })
    this.index = new Document({
      preset: "match",
      tokenize: "full",
      document: {
        id: "id",
        index: ["name", "aliases", "path"]
      }
    })
    this.validConfig.forEach((route, idx) => {
      this.index.add({id: idx, name: route.name, aliases: route.aliases, path: route.path})
    })
  },
  computed: {
    validConfig() {
      if (!this.excludedPaths) {
        return this.config
      }
      return this.config.filter(route => {
        return !this.excludedPaths?.includes(route.path);
      })
    }
  },
  watch: {
    searchInput(value) {
      if (value === "") {
        this.results = []
      }
      this.results = useFlexSearch(value, this.index, this.validConfig)
      this.current = -1
    }
  }
})

</script>

<template>
  <SearchModal :shown="showModal" :input="searchInput" @close="showModal = false">
    <SearchPan
        @close="showModal = false"
        @next="next"
        @previous="previous"
        @goto="goto"
        :modelValue="searchInput"
        @update:modelValue="newValue => searchInput = newValue"
    />
    <hr>
    <div>
      <div v-if="recentResults.length > 0">
        <h3 class="text">
          Recent results
        </h3>
        <div v-for="(result) in recentResults" :key="result.name">
          <h4 class="text">{{ result.name }}</h4>
        </div>
      </div>
      <h2 class="text">
        Results
      </h2>
      <div v-for="(result, index) in results" :key="result.name">
        <h3 class="text" :class="{selected: index === current}">{{ result.name }}</h3>
      </div>
    </div>
  </SearchModal>
</template>
<style scoped>
.text {
  color: black;
  text-align: left;
  margin-left: 10px;
}

.selected {
  background-color: #009175;
}
</style>
