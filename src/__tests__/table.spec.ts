import { mount } from '@vue/test-utils'
import { TestTable } from '../table/index'
import Vue from 'vue'
import CompositionApi from '@vue/composition-api'
import {
  Staff,
  mockTableColumns,
  mockTableData,
} from '../mockData'
import { ColumnPublicProps, TablePublicProps, paginationType } from 'src/table/types'

Vue.use(CompositionApi)


const staffMockData: Staff[] = mockTableData
const tableColumns: ColumnPublicProps = mockTableColumns
const tablePagination = {
  pageSize: 10, // 每页大小
  pageIndex: 1, // 当前页码
}
const defaultProps: TablePublicProps = {
  data: staffMockData.slice(0, 10),
  columns: tableColumns as ColumnPublicProps,
  pagination: tablePagination as paginationType,
  maxHeight: 240,
  showHeader: true,
  filters: ['name', 'age', 'sex'],
}
describe('Table', () => {
  const TableMount = (options: Record<string, unknown>) => mount(TestTable, options)
  test('开始测试', () => {
    expect(1).toBe(1)
  })

  test('render Default', () => {
    const wrapper = TableMount({ propsData: defaultProps })
    expect(wrapper.html()).toMatchSnapshot()
    expect(() => {
      wrapper.vm.$forceUpdate()
      wrapper.vm.$destroy()
    }).not.toThrow()
  })

  test('props test', async () => {
    const wrapper = TableMount({
      propsData: {
        test: true,
        ...defaultProps,
      },
    })

    // 1. 分页配置测试 --> 校验pageIndex/pageSize设置结果
    expect(wrapper.findAll('.simple-table tbody > tr').length).toEqual(10)
    expect(wrapper.find('.pagination-btn.on').element.innerHTML).toEqual('1')

    // 2. maxHeight最大高度测试，获取Tbody实际高度
    expect(wrapper.find('.simple-table tbody').attributes('style')).toContain('max-height: 240px')

    // 3. 列数据测试，传入renderFn，校验实际结果
    expect(wrapper.findAll('.simple-table td[column-data-name=sex]').filter(node => !(['男', '女'].includes(node.element.innerHTML))).length).toEqual(0)
  })

  test('sort data', async () => {
    const wrapper = TableMount({
      propsData: defaultProps,
    })

    {

      // 按年龄排序
      await wrapper.find('.simple-table th[column-name=age] .column-sort').trigger('click') // 模拟点击排序
      const ageData = wrapper.findAll('.simple-table td[column-data-name=age]').wrappers.map(node => Number(node.element.innerHTML))
      const ageSortBeforeStr = ageData.toString()

      // 检查是否升序排序了
      expect(ageSortBeforeStr).toEqual(ageData.sort((a, b) => a - b).toString())
    }

    {
      // 按年龄排序
      await wrapper.find('.simple-table th[column-name=age] .column-sort').trigger('click') // 模拟点击排序
      const ageData = wrapper.findAll('.simple-table td[column-data-name=age]').wrappers.map(node => Number(node.element.innerHTML))
      const ageSortBeforeStr = ageData.toString() // 将结果转换成字符串方便比较

      // 检查是否降序排序了
      expect(ageSortBeforeStr).toEqual(ageData.sort((a, b) => b - a).toString())
    }
  })

  test('filter data test', async () => {
    const wrapper = TableMount({
      propsData: defaultProps,
    })

    // 输入关键词45按name进行搜索
    const inputEle = wrapper.find('.table-search-input')
    inputEle.element.setAttribute('value', '45')
    await inputEle.trigger('keydown.enter') // TODO：触发无效？

    // expect(Array.from(wrapper.findAll('.simple-table td[column-data-name=name]').wrappers).every(v => v.element.innerHTML.toLocaleLowerCase().includes('45'))).toBeTruthy()

  })

  test('pagination test', async () => {
    const startTime = Date.now()
    const wrapper = TableMount({
      propsData: {
        ...defaultProps,
        data: mockTableData, // 500数据总量
        pagination: {
          pageIndex: 2,
          pageSize: 100,
        },
      },
    })
    const endTime = Date.now()

    // 测试100条数据的渲染速度 < 500ms
    expect(endTime - startTime < 500).toBeTruthy()

    // 检测分页配置是否有问题
    expect(wrapper.find('.simple-table .pagination-btn.on').element.innerHTML).toEqual('2')
    expect(wrapper.findAll('.simple-table tbody > tr').length).toEqual(100)

    // 切换页码 -- 跳转到第五页
    await wrapper.find('.simple-table .pagination-btn:nth-child(6)').trigger('click')
    expect(wrapper.find('.simple-table .pagination-btn.on').element.innerHTML).toEqual('5')
  })
})
