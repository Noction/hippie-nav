import { Document } from 'flexsearch'
import { isActionConfig } from '@/types/typePredicates'
import {  IndexOptionsHippieNav, ResultWithId } from '@/types'

export interface IndexFields {
  id: string,
  index: string[]
}
export type IndexType = 'route' | 'action'

export const indexAdd = (index: Document<any>, data: ResultWithId[], type: IndexType) => {
  if (type === 'route') {
    data.sort((a, b) => {
      const nameA = String(a.name).toUpperCase() || ''
      const nameB = String(b.name).toUpperCase() || ''

      return nameA.localeCompare(nameB)
    }).forEach(route => {
      if (!isActionConfig(route)) {
        index.add({ aliases: route.meta.aliases, id: route.id, name: route.name, path: route.path })
      }
    })
  } else if (type === 'action') {
    data.forEach(action => {
      if (isActionConfig(action)) {
        index.add({ aliases: action.aliases, id: action.id })
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
