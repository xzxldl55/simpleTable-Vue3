/**
 * 过滤/搜索 逻辑处理 Hook
 */

import { reactive } from '@vue/composition-api'
import { TFilterState } from '../../types'
import debug from 'debug'

const DEBUG = debug('table:filter')

type filterHook = {
  search: (filter: string, searchValue: string) => void
}

const useFilter = (selected: string): [TFilterState, filterHook] => {
  const filterState = reactive({
    filter: selected,
    searchValue: '',
  })

  const search = (filter: string, searchValue: string) => {
    filterState.filter = filter
    filterState.searchValue = searchValue
    DEBUG(`filter data, filter is ${filterState.filter} searchValue is ${filterState.searchValue}`)
  }

  return [
    filterState,
    { search },
  ]
}

export default useFilter
