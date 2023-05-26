import { Document } from 'flexsearch'
import { isActionConfig } from '@/types/typePredicates'
import { IndexFields, IndexOptionsHippieNav, ResultWithId } from '@/types'

const isStringArray = (arr: unknown) =>  Array.isArray(arr) && arr.every(i => typeof i === 'string')

function validateMeta <T extends object> (meta: T): T  {
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
      const metaData = hippieNavMeta ?? item.meta

      if (typeof metaData === 'object') {
        const validatedMetaData = validateMeta(metaData)

        index.add(item.id, { name: item.name, path: item.path, ...validatedMetaData })
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
