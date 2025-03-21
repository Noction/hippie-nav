import type { Ref } from 'vue-demi'
import type { ResultWithId } from './types'

export type ActionConfig = {
  name: string
  action: () => void
  aliases?: string[]
  description?: string[]
}

export type AppOptions = {
  excludedPaths?: (string | RegExp)[]
  indexFields?: {
    routes: string[]
    actions?: string[]
  }
  displayField?: {
    route: string
  }
  resultsLimit?: number
}

export type IndexFields = {
  id: string
  index: string[]
}

export type IndexOptionsHippieNav = {
  charset: 'latin:extra'
  document: IndexFields
  preset: 'match'
  tokenize: 'forward'
}

export type ResultItem = {
  type: 'route' | 'action'
  data: ResultWithId
}

export type UsePersistiveLocalStorage = {
  addItem: (result: ResultItem) => void
  recentResults: Ref<ResultItem[]>
  removeItem: (resultItem: ResultItem) => void
}
