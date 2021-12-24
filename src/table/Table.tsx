/**
 * Created by uedc on 2021/10/11.
 */

import { computed, ComputedRef, defineComponent, reactive, Ref, watch } from '@vue/composition-api'
import { TablePublicProps, tableProps, ColumnPublicProps, tableState, TSortState, TFilterState, TPageConf, SafeAny } from '../types'
import Column from './components/Column'
import debug from 'debug'
import useSort from './composables/sort'
import useFilter from './composables/filter'
import usePagination from './composables/pagination'
import { VNode } from 'vue'
import useTableData from './composables/tableData'
import { intersection } from 'lodash-es'
import './index.css'

const DEBUG = debug('table:body')
const DEBUG_ERROR = debug('table:error')

export default defineComponent({
  name: 'Table',
  props: tableProps,
  setup(props: TablePublicProps, { slots }) {
    handlePropsError(props)
    const state: tableState = reactive({
      data: props.data as Record<string, any>[],
      columns: props.columns as ColumnPublicProps[],
      filters: props.filters as SafeAny as string[],
      showHeader: props.showHeader as boolean,
    })
    const style = useStyle(props)
    const [sortState, { handleSort }] = useSort()
    const [
      pageState,
      {
        pageBtnSize,
        changePage,
        goBefore,
        goNext,
        setPageCount,
      },
    ] = usePagination(props.pagination, state.data.length)
    const selectedFilter = computed(() => {
      return props.filters?.length ? (props.filters[0] as string) : ''
    })
    const [filterState, { search }] = useFilter(selectedFilter.value)
    const tableData = useTableData(state, sortState, filterState, pageState, setPageCount) // 获取当前页table数据【关联props.data, 分页，排序，筛选】

    // 监听数据变动，输出日志
    watch(tableData, (): void => {
      DEBUG('data change')
    })

    return () => {
      const header = renderHeader(state.filters, filterState, search)
      const columns = renderColumns(state, slots, sortState, handleSort)
      const body = renderBody(slots, tableData, style, state)
      const pagination = pageState ? renderPagination(pageState, pageBtnSize, changePage, goBefore, goNext) : ''
      return (
        <div class="simple-table">
          {/* 表头 */}
          {header}
          <table>
            {/* 表格列 */}
            {columns}
            {/* 表格主体 */}
            {body}
            {/* 分页器 */}
            <div class="pagination center">
              {pagination}
            </div>
          </table>
        </div>
      )
    }
  },
})

// 处理参数传输异常处理（非类型限制类型的内容型错误）
function handlePropsError (props: TablePublicProps) {
  const columnsName = props?.columns?.map(column => column.name)

  // 相同列名
  if ((columnsName as string[]).length !== new Set(columnsName).size) {
    const error = 'Column name can not the same'
    DEBUG_ERROR(error)
    throw Error(error)
  }

  // filters包括了非columns的参数
  if (intersection(columnsName, props.filters).length !== props.filters?.length) {
    const error = 'filters must be a column name'
    DEBUG_ERROR(error)
    throw Error(error)
  }
}

// tBody样式处理Hook
function useStyle(props: TablePublicProps) {
  return computed(() => {
    return {
      maxHeight: typeof props.maxHeight === 'string' ? props.maxHeight : props.maxHeight + 'px'
    }
  })
}

// 表格工具栏渲染
function renderHeader(
  filters: string[],
  filterState: TFilterState,
  search: (filter: string, searchValue: string) => void,
) {
  const onInputKeydown = (e: KeyboardEvent) => {
    const target = e.target as HTMLInputElement
    if (e.code === 'Enter') { // 按下Enter后进行搜索
      search(filterState.filter, target.value)
    }
  }
  const onSelectChange = (e: Event) => {
    const target = e.target as HTMLSelectElement

    // 切换Filter过滤器后清空searchValue
    search(target.value, '')
  }

  return (
    <header>
      {
        filters.length ?
          <div class="table-search-container right">
            <select class="table-search-select"
              name="tableFilter"
              value={filterState.filter}
              onChange={onSelectChange}>
              {
                filters.map(filter => <option value={filter}>{filter}</option>)
              }
            </select>
            <input class="table-search-input"
              type="text"
              value={filterState.searchValue}
              onKeydown={onInputKeydown} />
          </div>
          : ''
      }
    </header>
  )
}

function renderColumns(
  state: tableState,
  slots: Readonly<{ [name: string]: ((...args: any[]) => VNode[]) | undefined }>,
  sortState: TSortState,
  handleSort: (name: string) => void
) {
  return (
    <thead vShow={state.showHeader}>
      <tr>
        {
          state.columns.map((column) => {
            const slotColumn = slots[column.name as string]

            // 可支持slot[columns.name]自定义配置表头
            return slotColumn ?
              <th>{slotColumn({ column })}</th> :
              <Column title={column.title}
                name={column.name}
                canSort={column.canSort}
                sortState={sortState}
                onClick={handleSort} />
          })
        }
        {
          slots.operator ?
            <th>操作</th> :
            ''
        }
      </tr>
    </thead>
  )
}

function renderBody(
  slots: Readonly<{ [name: string]: ((...args: any[]) => VNode[]) | undefined }>,
  tableData: Ref<Record<string, SafeAny>[]>,
  style: ComputedRef<{ maxHeight: string }>,
  state: { data?: Record<string, any>[]; filters?: string[]; columns: any; showHeader?: boolean }
) {
  return (
    <tbody style={style.value}>
      {
        tableData.value.map((item: { [x: string]: any }) => {
          return (
            <tr>
              {
                state.columns.map((column: { renderFn: (arg0: any) => any | undefined; name: string }) => {
                  const content = (column.renderFn ? column.renderFn(item[column.name as string]) : item[column.name as string]) || '-'
                  return <td column-data-name={column.name}
                    title={content}>{content}</td>
                })
              }
              {/* 操作列渲染 */}
              <td class="table-body-operator center">
                {slots.operator ? slots.operator({ item }) : ''}
              </td>
            </tr>
          )
        })
      }
    </tbody>
  )
}

function renderPagination(
  pageState: TPageConf,
  pageBtnSize: Ref<number>,
  changePage: { (index: number): void; bind?: any },
  goBefore: () => void,
  goNext: () => void
) {
  return (
    <div>
      <button class="pagination-btn"
        onClick={goBefore}>&lt;</button>
      {
        new Array(pageBtnSize.value).fill(1).map((v, i) => {
          return <button class={['pagination-btn', { 'page-on': pageState.pageIndex === i + 1 }]}
            onClick={changePage.bind(null, i + 1)}>{i + 1}</button>
        })
      }
      <button class="pagination-btn"
        onClick={goNext}>&gt;</button>
    </div>
  )
}