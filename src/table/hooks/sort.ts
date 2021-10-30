/**
 * 排序逻辑处理Hook
 */

import { reactive } from '@vue/composition-api'
import { TSortState } from '../types'
import debug from 'debug'

const DEBUG = debug('table:sort')

const ASE = 1
const DES = 0

type sortHook = {
  sortState: TSortState
  handleSort: (name: string) => void
}

const useSort = (): sortHook => {
  const sortState: TSortState = reactive({
    name: '',
    direction: DES,
  })

  const handleSort = (name: string) => {

    // 当前点击列非正在排序列
    if (sortState.name !== name) {
      sortState.name = name
      sortState.direction = ASE
    } else { // 当前点击列正参与排序，此时将其逆转
      sortState.direction = Number(!sortState.direction) as (0 | 1)
    }

    DEBUG('sort by', name, sortState.direction ? ' 升序' : ' 降序' )
  }

  return {
    sortState,
    handleSort,
  }
}

export default useSort
