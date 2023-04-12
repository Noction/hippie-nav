import { ActionConfig, IndexOptionsHippieNav } from '../shared/types'
import { Document } from 'flexsearch'
import { RouteRecordNormalized } from 'vue-router'

export interface IndexFields {
  id: string,
  index: string[]
}
export type IndexType = 'route' | 'action'

export const indexAdd = (index: Document<any>, data: RouteRecordNormalized[] | ActionConfig[], type: IndexType) => {
  if (type === 'route') {
    const routes = data as RouteRecordNormalized[]

    routes.sort((a, b) => {
      const nameA = String(a.name).toUpperCase() || ''
      const nameB = String(b.name).toUpperCase() || ''

      return nameA.localeCompare(nameB)
    }).forEach((route: RouteRecordNormalized) => {
      index.add({ aliases: route.meta.aliases, id: route.path, name: route.name, path: route.path })
    })
  } else if (type === 'action') {
    const actions = data as ActionConfig[]

    actions.forEach(action => {
      index.add({ aliases: action.aliases, id: action.name })
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
