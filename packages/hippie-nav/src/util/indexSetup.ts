import { Document } from 'flexsearch'
import { RouteMeta } from 'vue-router'
import { isActionConfig } from '@/types/typePredicates'
import { IndexFields, IndexOptionsHippieNav, ResultWithId } from '@/types'

const isStringArray = (arr: unknown) =>  Array.isArray(arr) && arr.every(i => typeof i === 'string')

function validateMeta (meta: RouteMeta): RouteMeta  {
  for (const metaKey in meta) {
    if (typeof meta[metaKey] !== 'string' && !isStringArray(meta[metaKey])) {
      delete meta[metaKey]
    }
  }
  return meta
}

export function addIndex (index: Document<unknown>, data: ResultWithId[]) {
  data.forEach(item => {
    if (isActionConfig(item)) {
      index.add(item.id, { aliases: item?.aliases ?? '', description: item.description ?? '', name: item.name })
    } else {
      const { hippieNavMeta } = item.meta
      const metaData = hippieNavMeta ?? validateMeta(item.meta)

      if (typeof metaData === 'object') {
        index.add(item.id, { name: item.name, path: item.path, ...metaData })
      }
    }
  })
}

export function indexSetup (indexFields: IndexFields): Document<IndexOptionsHippieNav> {
  return new Document({
    charset: 'latin:extra',
    document: indexFields,
    preset: 'match',
    tokenize: 'forward'
  })
}
