/**
 * 表格体数据处理 Hook
 * Table表格当前页渲染数据, 返回当前页应该渲染的Table数据（在函数内进行对数据处理，如分页、排序，筛选等）
 */

import { Ref, computed } from '@vue/composition-api'
import { sortBy } from 'lodash-es'
import { SafeAny, TFilterState, TPageConf, TSortState, tableState } from '../../types'

const useTableData = (
  state: tableState,
  sortState: TSortState,
  filterState: TFilterState,
  pageState: TPageConf | undefined,
  setPageCount: (count: number) => void,
): Ref<Record<string, SafeAny>[]> => {
  const tableData = computed(() => {

    // [TODO]: 后续添加远程表格处理
    // if (state.loadApi) {
    //   // 收集远程表格参数
    //   const params: TLoadApiParams = {
    //     filter: filterState.filter,
    //     searchValue: filterState.searchValue,
    //     name: sortState.name,
    //     direction: sortState.direction,
    //     pageIndex: 0,
    //     pageSize: 0,
    //   }

    //   let { data, count } = await state.loadApi(params) // Promise化改造 --> 针对Promise化后可能出现的响应性丢失问题，可以在watchEffect内部执行useTableData来收集依赖

    //   data = state.handleResData ? state.handleResData(data) : data // props - 对最终得到数据做处理

    //   setPageCount(count) // 更新条目总数 --> 更新分页器按钮个数

    //   return data
    // }

    // 以下皆为本地数据展示功能项
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
    setPageCount(resData.length)

    // 4. 获取当前分页配置
    const start = (pageState.pageIndex - 1) * pageState.pageSize
    const end = start + pageState.pageSize

    // 5. 检测是否需要按某列排序
    if (sortState.name) {
      return sortState.direction ?
        sortBy(resData, (obj: Record<string, SafeAny>) => obj[sortState.name]).slice(start, end) :
        sortBy(resData, (obj: Record<string, SafeAny>) => obj[sortState.name]).reverse().slice(start, end)
    }

    // 6. 最终返回当前页数据
    return resData.slice(start, end)
  })

  return tableData
}

export default useTableData
