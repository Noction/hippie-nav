import { isActionConfig } from '@/types/typePredicates'
import { ResultItem, ResultWithId } from '@/types'

export const transformDataToResultData = (data: ResultWithId[]): ResultItem[] => {
  return data.map(item => ({
    data: item,
    type: isActionConfig(item) ? 'action' : 'route'
  }))
}