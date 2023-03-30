<script lang="ts">
import {onKeyboardShortcut} from "./util/keyboard";
import SearchModal from "./components/SearchModal.vue";
import SearchPan from './components/SearchPan.vue'
import {defineComponent, PropType} from "vue";
import {HippieNavConfig} from "./types";

const {Index} = require("flexsearch");

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
      current: -1
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
    }
  },
  mounted() {
    onKeyboardShortcut(['ctrl+k', 'meta+k'], (event) => {
      this.showModal = true;
      event.preventDefault();
    })
    const index = new Index({
      encode: 'balance',
      tokenize: 'forward',
      threshold: 1,
      resolution: 3,
      depth: 2,
      doc: {
        id: 'path',
        field: ['name', 'aliases'],
      },
    })
    this.validConfig.forEach((item) => {
      index.add(item);
    });

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
    searchInput() {
      const resultsSet = new Set();
      this.validConfig.forEach((route) => {
        if (route.name.toLowerCase().includes(this.searchInput.toLowerCase())) {
          resultsSet.add(route)
        }
        if (route.aliases.includes(this.searchInput.toLowerCase())) {
          resultsSet.add(route)
        }
      })
      this.results = Array.from(resultsSet) as HippieNavConfig
      if (this.searchInput === "") {
        this.results = []
      }
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
        :modelValue="searchInput"
        @update:modelValue="newValue => searchInput = newValue"
    />
    <hr>
    <div>
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
