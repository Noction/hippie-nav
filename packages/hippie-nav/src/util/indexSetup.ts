import { Document } from 'flexsearch'
import { RouteRecordNormalized } from 'vue-router'
import { isActionConfig } from '@/types/typePredicates'
import { ActionConfig, IndexOptionsHippieNav } from '@/types'

export interface IndexFields {
  id: string,
  index: string[]
}
export type IndexType = 'route' | 'action'

export const indexAdd = (index: Document<any>, data: RouteRecordNormalized[] | ActionConfig[], type: IndexType) => {
  if (type === 'route') {
    data.sort((a, b) => {
      const nameA = String(a.name).toUpperCase() || ''
      const nameB = String(b.name).toUpperCase() || ''

      return nameA.localeCompare(nameB)
    }).forEach(route => {
      if (!isActionConfig(route)) {
        index.add({ aliases: route.meta.aliases, id: route.path, name: route.name, path: route.path })
      }
    })
  } else if (type === 'action') {
    data.forEach(action => {
      if (isActionConfig(action)) {
        index.add({ aliases: action.aliases, id: action.name })
      }
    })
  }
}

export const indexSetup = (type: IndexType, indexFields: IndexFields): Document<IndexOptionsHippieNav> => {
  return new Document({
    charset: 'latin:extra',
    document: indexFields,
    preset: 'match',
    tokenize: 'forward'
  })
}
