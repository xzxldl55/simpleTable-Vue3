/**
 * 排序逻辑处理Hook
 */

import { reactive } from '@vue/composition-api'
import { TSortState } from '../../types'
import debug from 'debug'

const DEBUG = debug('table:sort')

const ASE = 1
const DES = 0

type sortHook = {
  handleSort: (name: string) => void
}

const useSort = (): [TSortState, sortHook] => {
  const sortState: TSortState = reactive({
    name: '',
    direction: ASE,
  })

  const handleSort = (name: string) => {

    // 每列的排序点击后的流程 --点击--> 【升序】 --点击--> 【降序】 --点击--> 【取消排序】
    if (sortState.name !== name) { // 1. 初次点击当前列 --> 升序
      sortState.name = name
      sortState.direction = ASE
    } else if (sortState.name == name && sortState.direction === DES) { // 3. 当再次点击当前列 && 当前为降序时，取消排序
      sortState.name = ''
    } else { // 2. 再次点击当前列，且此时不为降序，此时将其逆转为降序
      sortState.direction = Number(!sortState.direction) as (0 | 1)
    }

    DEBUG('sort by', name, sortState.direction ? ' 升序' : ' 降序' )
  }

  return [
    sortState,
    { handleSort },
  ]
}

export default useSort
