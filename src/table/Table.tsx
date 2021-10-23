/**
 * Created by uedc on 2021/10/11.
 */

import { computed, defineComponent, reactive, ref, watch } from '@vue/composition-api'
import { TablePublicProps, tableProps, paginationType, ColumnPublicProps } from './types'
import Column from './Column'
import { sortBy } from 'lodash-es'
import debug from 'debug'

const DEBUG = debug('table:body')

type tableState = {
  sortConf: {
    sortKey: string
    sort: boolean 
  }
  data: Record<string, any>[]
  filter: string
  searchValue: string
  filters: string[]
  pagination: false | { pageIndex: number; pageSize: number }
  columns: ColumnPublicProps[]
  count: number
}

export default defineComponent({
  name: 'Table',
  props: tableProps,
  setup(props: TablePublicProps, { slots, emit }) {
    const style = useStyle(props)
    const state: tableState = reactive({
      sortConf: { // 当前表格排序配置（升序/降序）
        sortKey: '',
        sort: false // true升序，false降序
      },
      data: props.data as Record<string, any>[],
      filter: props.filters?.length ? (props.filters[0] as string) : '',
      searchValue: '',
      filters: props.filters as unknown as string[],
      pagination: props.pagination as unknown as paginationType | false,
      columns: props.columns as ColumnPublicProps[],
      count: 0, // 当前数据条目总数（过滤后）
    })
    const tableData = useTableData(state) // 获取当前页table数据【关联props.data, 分页，排序，筛选】
    const size = computed(() => { // 定义当前分页总数
      if (state.pagination) {
        return Math.ceil(state.count / state.pagination.pageSize)
      }
      return 0
    })

    // 监听数据变动，输出日志
    watch(tableData, (): void => {
      DEBUG('data change')
    })


    // 总页数

    // 【排序】
    const sortTable = (name: string) => {

      // 回到首页
      if (state.pagination) {
        state.pagination.pageIndex = 1
      }

      // 当前sortBy非name，则初始化按照name升序排序
      if (state.sortConf.sortKey !== name) {
        state.sortConf.sortKey = name
        state.sortConf.sort = true
      } else { // 正按照当前列排序，将排序方式取反
        state.sortConf.sort = !state.sortConf.sort
      }

      DEBUG('sort by', name, state.sortConf.sort ? '升序' : '降序')

      // 抛出排序事件
      emit('sort', { name, sort: state.sortConf.sort })
    }

    // 【切换页码】
    const changePage = (index: number) => {
      if (!state.pagination) {
        return
      }
      if (state.pagination.pageIndex === index) {
        return
      }
      state.pagination.pageIndex = index;

      DEBUG('page change', index)

      // 页码切换事件
      emit('page-change', index)
    }

    return () => {
      const operators = slots.operator
      return (
        <div class="simple-table">
          {
            renderHeader(state.filters, state)
          }
          <table>
            {/* 表头 */}
            <thead vShow={props.showHeader}>
              <tr>
                {
                  state.columns.map(column => {
                    
                    // 可支持slot[columns.name]自定义配置表头
                    return slots[column.name] ?
                      <th>{ slots[column.name]({ column }) }</th> :
                      <Column title={column.title}
                              name={column.name}
                              canSort={column.canSort}
                              sortConf={state.sortConf}
                              onClick={sortTable} />
                  })
                }
                {
                  operators ?
                  <th>操作</th> :
                  ''
                }
              </tr>
            </thead>
            {/* 表格主体 */}
            <tbody style={style.value}>
              {
                tableData.value.map(item => {
                  return (<tr>
                      {
                        state.columns.map(column => {
                          const content = (column.renderFn ? column.renderFn(item[column.name]) : item[column.name]) || '-'
                          return <td column-data-name={column.name}
                                    title={content}>{ content }</td>
                        })
                      }
                      <td class="center">
                        { operators ? operators({ item }) : '' }
                      </td>
                    </tr>)
                })
              }
            </tbody>
            {/* 分页器 */}
            <div class="pagination center">
              {
                state.pagination ? 
                (
                  new Array(size.value).fill(1).map((v, i) => {
                    return <button class={['pagination-btn', { 'on': state.pagination.pageIndex === i + 1 }]}
                                  onClick={changePage.bind(null, i + 1)}>{ i + 1 }</button>
                  })
                ) :
                ''
              }
            </div>
          </table>
        </div>
      )
    }
  },
})

// tBody样式处理
function useStyle (props: TablePublicProps) {
  return computed(() => {
    return {
      maxHeight: typeof props.maxHeight === 'string' ? props.maxHeight : props.maxHeight + 'px'
    }
  })
}

// 返回应渲染的Table数据（在函数内进行对数据处理，如分页、排序，筛选等）
function useTableData (state: tableState) {
  return computed(() => {
    DEBUG('data change')

    let resData = state.data || []
    const {
      pagination,
      sortConf,
      filter,
      searchValue
    } = state

    // 1. filter & searchValue 按照关键词过滤数据
    if (filter && searchValue) {
      const renderFn = state.columns.filter(column => column.name === filter)[0].renderFn;
      resData = resData.filter(data => {

        // 支持renderFn的过滤
        const renderData = (renderFn ? renderFn(data[filter]) : data[filter]).toString()
        return renderData.toLocaleLowerCase()
          .includes(searchValue.toLocaleLowerCase())
      })
    }

    // 2. 更新数据条目总数（PS：注意需要放在最后一个对resData赋值语句之后 return 跳出之前，确保数据准确性）
    state.count = resData.length

    // 3. 不分页 ｜ 空数据直接返回
    if (!resData || !pagination) {
      return resData
    }

    // ... TODO：ect 其他功能添加，如 已选列表prop的处理

    // 4. 获取当前分页配置
    const start = (pagination.pageIndex - 1) * pagination.pageSize
    const end = start + pagination.pageSize

    // 5. 检测是否需要按某列排序
    if (sortConf.sortKey) {
      return sortConf.sort ?
        sortBy(resData, (obj: Record<string, any>) => obj[sortConf.sortKey]).slice(start, end) :
        sortBy(resData, (obj: Record<string, any>) => obj[sortConf.sortKey]).reverse().slice(start, end)
    }
    return resData.slice(start, end)
  })
}

// 表格工具栏渲染
function renderHeader (filters: string[], state: tableState) {
  return (
    <header>
      {
        filters.length ?
        <div class="table-search-container right">
          {/* TODO：无法使用v-model指令？待解决 */}
          <select class="table-search-select"
                  name="tableFilter"
                  value={state.filter}
                  onChange={(e: Event) => {
                    const target = e.target as HTMLSelectElement
                    state.filter = target.value

                    // 切换过滤器后自动清空搜索关键词
                    state.searchValue = ''
                  }}>
            {
              filters.map(filter => <option value={filter}>{filter}</option>)
            }
          </select>
          {/* TODO：无法使用v-model指令？待解决 */}
          <input class="table-search-input"
                 type="text"
                 value={state.searchValue}
                 onKeydown={search.bind(null, state)} />
        </div>
        : ''
      }
    </header>
  )
}

const search = (
  state: tableState,
  e: KeyboardEvent
) => {
  const target = e.target as HTMLInputElement
  if (e.code === 'Enter') {
    state.searchValue = target.value
    DEBUG('filter table data', state.filter, state.searchValue)
  }
}