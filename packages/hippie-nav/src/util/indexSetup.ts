import { Document } from 'flexsearch'
import { isActionConfig } from '@/types/typePredicates'
import { sortAzByName } from '@/util/helpers'
import {  IndexOptionsHippieNav, ResultWithId } from '@/types'

export interface IndexFields {
  id: string,
  index: string[]
}
export type IndexType = 'route' | 'action'

export function indexAdd (index: Document<unknown>, data: ResultWithId[], type: IndexType) {
  if (type === 'route') {
    sortAzByName(data).forEach(route => {
      if (!isActionConfig(route)) {
        index.add({ aliases: route.meta.aliases, id: route.id, name: route.name, path: route.path })
      }
    })
  }
  sortAzByName(data).forEach(action => {
    if (isActionConfig(action)) {
      index.add({ aliases: action.aliases, description: action.description ?? '', id: action.id })
    }
  })

}

export function indexSetup  (type: IndexType, indexFields: IndexFields): Document<IndexOptionsHippieNav> {
  return new Document({
    charset: 'latin:extra',
    document: indexFields,
    preset: 'match',
    tokenize: 'forward'
  })
}
