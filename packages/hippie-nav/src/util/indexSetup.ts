import { ActionConfig } from '../types'
import { Document } from 'flexsearch'
import { RouteRecordNormalized } from 'vue-router'

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

export const indexSetup = (type: IndexType): Document<any> => {
  return type === 'route' ? new Document({
    charset: 'latin:extra',
    document: {
      id: 'id',
      index: ['name', 'aliases', 'path']
    },
    preset: 'match',
    tokenize: 'full'
  }) : new Document({
    charset: 'latin:extra',
    document: {
      id: 'id',
      index: ['name', 'aliases']
    },
    preset: 'match',
    tokenize: 'full'
  })
}
