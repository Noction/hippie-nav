import { IndexFields } from '@/util/indexSetup'
import { ResultWithId } from '@/types/types'

export interface ActionConfig {
  name: string,
  action: () => void
  aliases?: string[]
  description?: string[]
}

export interface AppOptions {
  excludedPaths: (string | RegExp)[]
  indexFields: {
    routes: string[],
    actions?: string[],
  },
  displayField?: {
    route: {
      meta?: 'hippie'
      field: string
    },
  }
}

export interface HippieNavMeta {
  [key: string]: string;
}

export interface IndexOptionsHippieNav {
  charset: 'latin:extra',
  document: IndexFields,
  preset: 'match',
  tokenize: 'forward'
}

export interface ResultItem {
  type: 'route' | 'action',
  data: ResultWithId
}