/**
 * 表格体数据处理 Hook
 * Table表格当前页渲染数据, 返回当前页应该渲染的Table数据（在函数内进行对数据处理，如分页、排序，筛选等）
 */

import { Ref, computed } from '@vue/composition-api'
import { sortBy } from 'lodash-es'
import { TFilterState, TPageConf, TSortState, tableState } from '../types'

const useTableData = (
  state: tableState,
  sortState: TSortState,
  filterState: TFilterState,
  pageState: false | TPageConf,
): Ref<Array<Record<string, unknown>>> => {
  const tableData = computed(() => {
    let resData = state.data || []

    const { filter, searchValue } = filterState

    // 1. filter & searchValue 按照关键词过滤数据
    if (filter && searchValue) {
      const renderFn = state.columns.filter(column => column.name === filter)[0].renderFn
      resData = resData.filter(data => {

        // 支持被renderFn自定义渲染后数据的过滤
        const renderData = (renderFn ? renderFn(data[filter]) : data[filter]).toString()
        return renderData.toLocaleLowerCase()
          .includes(searchValue.toLocaleLowerCase())
      })
    }

    // 2. 不分页 ｜ 空数据直接返回
    if (!resData || !pageState) {
      return resData
    }

    // 3. 更新数据条目总数 --> 更新页码数（PS：注意需要放在最后一个对resData赋值语句之后 return 跳出之前，确保数据准确性）
    pageState.count = resData.length

    // 4. 获取当前分页配置
    const start = (pageState.pageIndex - 1) * pageState.pageSize
    const end = start + pageState.pageSize

    // 5. 检测是否需要按某列排序
    if (sortState.name) {
      return sortState.direction ?
        sortBy(resData, (obj: Record<string, unknown>) => obj[sortState.name]).slice(start, end) :
        sortBy(resData, (obj: Record<string, unknown>) => obj[sortState.name]).reverse().slice(start, end)
    }

    // 6. 最终返回当前页数据
    return resData.slice(start, end)
  })

  return tableData
}

export default useTableData
