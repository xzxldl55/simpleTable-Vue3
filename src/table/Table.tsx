/**
 * Created by uedc on 2021/10/11.
 */

import { computed, defineComponent, Ref, ref, watch } from '@vue/composition-api'
import { TablePublicProps, tableProps, paginationType } from './types'
import Column from './Column'
import { sortBy } from 'lodash-es'
import './index.css'

export default defineComponent({
  name: 'Table',
  props: tableProps,
  setup(props: TablePublicProps, { slots, emit }) {
    const classes = useClasses(props)
    const style = useStyle(props)
    let sortConf = ref({
      sortKey: '',
      sort: false
    }); // 当前表格排序配置（升序/降序）
    let pagination: paginationType | false = props.pagination as unknown as paginationType | false;
    let tableData = useTableData(props, pagination, sortConf) // 获取table数据【关联props.data, 分页，排序】

    // 侦听分页器变化，当外部分页器变化时重新覆盖组件内部分页器
    watch(() => props.pagination, (val) => pagination = (val as unknown as paginationType | false))

    const count = computed(() => { // 数据条目总数
      if (Array.isArray(props.data)) {
        return props.data.length
      }
      return 0
    })
    const size = computed(() => { // 总页数
      if (pagination) {
        return Math.ceil(count.value / pagination.pageSize)
      }
      return 0
    })

    // 排序
    const sortTable = (name: string) => {

      // 回到首页
      if (pagination) {
        pagination.pageIndex = 1
      }

      // 当前sortBy非name，则初始化按照name升序排序
      if (sortConf.value.sortKey !== name) {
        sortConf.value.sortKey = name
        sortConf.value.sort = true
      } else { // 正按照当前列排序，将排序方式取反
        sortConf.value.sort = !sortConf.value.sort
      }

      // 抛出排序事件
      emit('sort', { name, sort: sortConf.value.sort })
    }

    // 切换页码
    const changePage = (index: number) => {
      if (!pagination) {
        return
      }
      if (pagination.pageIndex === index) {
        return
      }
      pagination.pageIndex = index;

      // 页码切换事件
      emit('page-change', index)
    }


    return () => {
      const operators = slots.operator
      const tableColumns = props.columns || []
      return (
        <table class={classes.value}>
          {/* 表头 */}
          <thead vShow={props.showHeader}>
            <tr>
              {
                tableColumns.map(column => {

                  // TODO：如何消灭IxPublicPropTypes带来的undefind类型
                  return slots[column.name] ?
                    <th>{ slots[column.name]({ column }) }</th> :
                    <Column title={column.title}
                            name={column.name}
                            canSort={column.canSort}
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
                      tableColumns.map(column => {
                        return <td column-data-name={column.name}>{ column.renderFn ? column.renderFn(item[column.name]) : item[column.name] }</td>
                      })
                    }
                    <td class="center">
                      {/* TODO: 在Linux上运行时报错不给使用 ?. 语法，待确认是什么语法插件没配上 */}
                      { operators ? operators({ item }) : '' }
                    </td>
                  </tr>)
              })
            }
          </tbody>
          {/* 分页器 */}
          <div class="pagination center">
            {
              pagination ? 
              (
                new Array(size.value).fill(1).map((v, i) => {
                  return <button class={['pagination-btn', { 'on': pagination.pageIndex === i + 1 }]}
                                 onClick={changePage.bind(null, i + 1)}>{ i + 1 }</button>
                })
              ) :
              ''
            }
          </div>
        </table>
      )
    }
  },
})

// 类名处理
function useClasses (props: TablePublicProps) {
  return computed(() => {
    return {
      'simple-table': true,
      'test-class': props.test,
    }
  })
}

// tBody样式处理
function useStyle (props: TablePublicProps) {
  return computed(() => {
    return {
      maxHeight: typeof props.maxHeight === 'string' ? props.maxHeight : props.maxHeight + 'px'
    }
  })
}

// 返回应渲染的Table数据（在函数内进行对数据处理，如分页、排序等）
function useTableData (props: TablePublicProps, pagination: paginationType | false, sortConf: Ref<{ sortKey: string; sort: boolean }>) {
  return computed(() => {
    if (!props.data) {
      return []
    }
    if (!pagination) {
      return props.data
    }

    // ... TODO：ect 其他功能添加，如 已选列表prop的处理

    const start = (pagination.pageIndex - 1) * pagination.pageSize
    const end = start + pagination.pageSize

    // 检测是否需要按某列排序
    if (sortConf.value.sortKey) {
      return sortConf.value.sort ? 
        sortBy(props.data, (obj: { [x: string]: any }) => obj[sortConf.value.sortKey]).slice(start, end) :
        sortBy(props.data, (obj: { [x: string]: any }) => obj[sortConf.value.sortKey]).reverse().slice(start, end)
    }
    return props.data.slice(start, end)
  })
}