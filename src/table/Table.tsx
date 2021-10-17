/**
 * Created by uedc on 2021/10/11.
 */

import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import { TablePublicProps, tableProps, paginationType, ColumnPublicProps } from './types'
import Column from './Column'
import { sortBy } from 'lodash-es'
import './index.css'

export default defineComponent({
  name: 'Table',
  props: tableProps,
  setup(props: TablePublicProps, { slots }) {
    const classes = useClasses(props)
    const style = useStyle(props)
    const tableColumns = useTableColumns(props)
    const tableData = useTableData(props)
    const count = computed(() => {
      return props.data?.length || 0
    })
    const size = computed(() => {
      return Math.ceil(count.value / props.pagination.pageSize)
    })
    const sortMap = new Map(); // 当前已排序的列信息（升序/降序）


    // 排序
    const sortData = (name: string) => {

      // 回到首页
      props.pagination.pageIndex = 1

      // 没有排序过/值为false时，进行升序
      if (!sortMap.get(name)) {
        props.data = sortBy(props.data, (obj: { [x: string]: any }) => obj[name])
        sortMap.set(name, 1);
        return;
      }
      
      // 降序排序
      props.data = sortBy(props.data, (obj: { [x: string]: any }) => obj[name]).reverse()
      sortMap.set(name, 0)
    }

    // 改变页码
    const changePage = (index: number) => {
      if (props.pagination.pageIndex === index) {
        return
      }
      props.pagination.pageIndex = index;
    }


    return () => {
      const operators = slots.operator?.()
      return (
        <table class={classes.value}>
          {/* 表头 */}
          <thead>
            <tr>
              {
                tableColumns?.value?.map(column => {
                  return <Column title={column.title}
                                 name={column.name}
                                 canSort={column.canSort}
                                 onClick={sortData} />
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
              tableData?.value?.map(item => {
                return (<tr>
                    {
                      tableColumns?.value?.map(column => {
                        return <td>{ column.renderFn ? column.renderFn(item[column.name]) : item[column.name] }</td>
                      })
                    }
                    <td class="center">
                      { operators }
                    </td>
                  </tr>)
              })
            }
          </tbody>
          {/* 分页器 */}
          <div class="pagination center">
            {
              props.pagination ? 
              (
                new Array(size.value).fill(1).map((v, i) => {
                  return <span class={['pagination-btn', { 'on': props.pagination.pageIndex === i + 1 }]}
                               onClick={changePage.bind(null, i + 1)}>{ i + 1 }</span>
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

function useClasses (props: TablePublicProps) {
  return computed(() => {
    return {
      'test-class': props.test,
    }
  })
}
function useStyle (props: TablePublicProps) {
  return computed(() => {
    return {
      maxHeight: typeof props.maxHeight === 'string' ? props.maxHeight : props.maxHeight + 'px'
    }
  })
}
function useTableColumns (props: TablePublicProps) {
  return ref(props.columns)
}

// 处理表格体数据（主要是数据分页过滤）
function useTableData (props: TablePublicProps) {
  const pagination = props.pagination as unknown as paginationType;
  return computed(() => {
    if (!pagination) {
      return props.data
    }
    const start = (pagination.pageIndex - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    return props?.data?.slice(start, end)
  })
}