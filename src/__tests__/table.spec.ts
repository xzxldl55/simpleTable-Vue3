import { mount } from '@vue/test-utils'
import { TestTable } from '../index'
import Vue from 'vue'
import CompositionApi from '@vue/composition-api'
import {
  Staff,
  mockTableColumns,
  mockTableData,
} from '../mockData'
import { ColumnPublicProps, SafeAny, TablePublicProps, paginationType } from 'src/types'

Vue.use(CompositionApi)


const staffMockData: Staff[] = mockTableData
const tableColumns: ColumnPublicProps = mockTableColumns
const tablePagination = {
  pageSize: 10, // 每页大小
  pageIndex: 1, // 当前页码
}
const defaultProps: TablePublicProps = {
  data: staffMockData,
  columns: tableColumns as ColumnPublicProps[],
  pagination: tablePagination as paginationType,
  maxHeight: 240,
  showHeader: true,
  filters: ['name', 'age', 'sex'],
}
describe('Table', () => {
  const TableMount = (options: Record<string, SafeAny>) => mount(TestTable, options)
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
        pagination: undefined,
      },
    })

    // 1. 不分页情况
    expect(wrapper.findAll('.simple-table tbody > tr').length).toEqual(500)

    // 3. maxHeight最大高度测试，获取Tbody实际高度
    expect(wrapper.find('.simple-table tbody').attributes('style')).toContain('max-height: 240px')

    //    传入string的maxHeight测试
    await wrapper.setProps({ maxHeight: '240rem' })
    expect(wrapper.find('.simple-table tbody').attributes('style')).toContain('max-height: 240rem')

    // 4. 列数据测试，传入renderFn，校验实际结果
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

    // 1. 输入关键词45按name进行搜索
    const inputEle = wrapper.find('.table-search-input')
    inputEle.setValue('45')
    await inputEle.trigger('keydown', {
      code: 'Enter',
    })

    expect(Array.from(wrapper.findAll('.simple-table td[column-data-name=name]').wrappers).every(v => v.element.innerHTML.toLocaleLowerCase().includes('45'))).toBeTruthy()

    // 2. 切换搜索字段为sex，搜索过滤出“男”
    const optionsEle = wrapper.find('.table-search-select').findAll('option')
    optionsEle.at(2).setSelected() // 选中第三个选项，即sex
    inputEle.setValue('男')
    await inputEle.trigger('keydown', {
      code: 'Enter',
    })
    expect(Array.from(wrapper.findAll('.simple-table td[column-data-name=sex]').wrappers).every(v => v.element.innerHTML.toLocaleLowerCase().includes('男'))).toBeTruthy()

    // 3. 不传入filters/空的filters，不显示header
    const wrapperNoFilter = TableMount({
      propsData: {
        ...defaultProps,
        filters: undefined,
      },
    })

    expect(wrapperNoFilter.find('.table-search-container').exists()).toBe(false)
  })

  test('pagination test', async () => {
    const startTime = Date.now()
    const wrapper = TableMount({
      propsData: {
        ...defaultProps,
        pagination: {
          pageIndex: 2,
          pageSize: 100,
        },
      },
    })
    const endTime = Date.now()

    // 1. 性能测试，测试100条数据的渲染速度 < 500ms
    expect(endTime - startTime < 500).toBeTruthy()

    // 2. 检测初始化分页配置是否有问题
    expect(wrapper.find('.simple-table .pagination-btn.page-on').element.innerHTML).toEqual('2')
    expect(wrapper.findAll('.simple-table tbody > tr').length).toEqual(100)

    // 3. 切换页码 -- 跳转到第五页
    await wrapper.find('.simple-table .pagination-btn:nth-child(6)').trigger('click')
    expect(wrapper.find('.simple-table .pagination-btn.page-on').element.innerHTML).toEqual('5')

    // 4. 上一页
    await wrapper.find('.simple-table .pagination-btn:first-child').trigger('click')
    expect(wrapper.find('.simple-table .pagination-btn.page-on').element.innerHTML).toEqual('4')

    // 5. 下一页
    await wrapper.find('.simple-table .pagination-btn:last-child').trigger('click')
    expect(wrapper.find('.simple-table .pagination-btn.page-on').element.innerHTML).toEqual('5')

    // 6. 测试在尾页（目前mock数据尾页即为5）时，点击下一页是否会正常处理，仍在尾页
    await wrapper.find('.simple-table .pagination-btn:last-child').trigger('click')
    expect(wrapper.find('.simple-table .pagination-btn.page-on').element.innerHTML).toEqual('5')

    // 7. 测试在首页时，点击上一页能否正常处理，仍在首页
    await wrapper.find('.simple-table .pagination-btn:nth-child(2)').trigger('click') // 跳到1页码
    await wrapper.find('.simple-table .pagination-btn:first-child').trigger('click') // 点击上一页
    expect(wrapper.find('.simple-table .pagination-btn.page-on').element.innerHTML).toEqual('1')
  })

  test('slot test', async () => {
    const wrapper = TableMount({
      propsData: defaultProps,
      slots: {
        operator: `
          <a class="mr-1"
            href="javascript:void(0)">新增</a>
        `,
        name: `<span class="diy-table-head">DIY</span>`,
      },
    })
    expect(wrapper.find('.table-body-operator').exists()).toBe(true)
    const diyHeadEle = wrapper.find('.diy-table-head')
    expect(diyHeadEle.exists()).toBe(true)
    expect(diyHeadEle.element.innerHTML).toBe('DIY')
  })

  // 其他异常状态测试
  test('error handle', async () => {
    try {
      TableMount({
        propsData: {
          ...defaultProps,
          columns: [
            {
              name: 'name',
              title: '姓名',
              canSort: true,
            },
            {
              name: 'name',
              title: '年龄',
              canSort: true,
            },
          ],
        },
      })
    } catch (e) {
      expect(e?.message).toBe('Column name can not the same')
    }
    try {
      TableMount({
        propsData: {
          ...defaultProps,
          filters: ['age', 'aaa'],
        },
      })
    } catch (e) {
      expect(e?.message).toBe('filters must be a column name')
    }
  })
})
