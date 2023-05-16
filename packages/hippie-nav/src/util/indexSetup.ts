import { Document } from 'flexsearch'
import { isActionConfig } from '@/types/typePredicates'
import { IndexFields, IndexOptionsHippieNav, IndexType, ResultWithId } from '@/types'

export function indexAdd (index: Document<unknown>, data: ResultWithId[], type: IndexType) {
  if (type === 'route') {
    data.forEach(route => {
      if (!isActionConfig(route) && route.meta.hippieNavMeta && typeof route.meta.hippieNavMeta === 'object') {
        const { hippieNavMeta } = route.meta

        index.add(route.id, { name: route.name, path: route.path, ...hippieNavMeta })
      } else if (!isActionConfig(route)) {
        index.add(route.id, { name: route.name, path: route.path })
      }
    })
    return
  }
  data.forEach(action => {
    if (isActionConfig(action)) {
      index.add(action.id, { aliases: action?.aliases ?? '', description: action.description ?? '', name: action.name })
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
