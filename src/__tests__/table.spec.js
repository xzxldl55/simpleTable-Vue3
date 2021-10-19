import { mount } from '@vue/test-utils'
import { TestTable } from '../table/index'

const staffMockData = [
  {
    name: 'Alice',
    age: 29,
    sex: 0,
  },
  {
    name: 'Tom',
    age: 27,
    sex: 1,
  },
  {
    name: 'Jerry',
    age: 26,
    sex: 0,
  },
  {
    name: 'Jerry1',
    age: 26,
    sex: 0,
  },
  {
    name: 'Jerry2',
    age: 26,
    sex: 0,
  },
  {
    name: 'Jerry3',
    age: 26,
    sex: 0,
  },
  {
    name: 'Jerry4',
    age: 26,
    sex: 0,
  },
  {
    name: 'Jerry5',
    age: 26,
    sex: 0,
  },
  {
    name: 'Jerry6',
    age: 26,
    sex: 0,
  },
  {
    name: 'Jerry7',
    age: 7,
    sex: 0,
  },
  {
    name: 'Jerry8',
    age: 5,
    sex: 0,
  },
  {
    name: 'Jerry9',
    age: 12,
    sex: 0,
  },
  {
    name: 'Jerry10',
    age: 88,
    sex: 0,
  },
  {
    name: 'Jerry11',
    age: 77,
    sex: 0,
  },
  {
    name: 'Jerry12',
    age: 66,
    sex: 0,
  },
  {
    name: 'Jerry13',
    age: 26,
    sex: 0,
  },
  {
    name: 'Jerry14',
    age: 24,
    sex: 0,
  },
  {
    name: 'Jerry15',
    age: 13,
    sex: 0,
  },
  {
    name: 'Jerry16',
    age: 31,
    sex: 0,
  },
  {
    name: 'Jerry17',
    age: 33,
    sex: 0,
  },
  {
    name: 'Jerry18',
    age: 22,
    sex: 0,
  },
  {
    name: 'Jerry19',
    age: 17,
    sex: 0,
  },
  {
    name: 'Jerry20',
    age: 16,
    sex: 0,
  },
  {
    name: 'Jerry21',
    age: 15,
    sex: 0,
  },
  {
    name: 'Jerry22',
    age: 14,
    sex: 0,
  },
  {
    name: 'Jerry23',
    age: 13,
    sex: 0,
  },
  {
    name: 'Jerry24',
    age: 12,
    sex: 0,
  },
  {
    name: 'Jerry25',
    age: 11,
    sex: 0,
  },
]
const tableColumns = [
  {
    name: 'name',
    title: '姓名',
  },
  {
    name: 'age',
    title: '年龄',
    canSort: true,
  },
  {
    name: 'sex',
    title: '性别',
    renderFn: val => {
      return val ? '男' : '女'
    },
  },
]
const tablePagination = {
  pageSize: 10, // 每页大小
  pageIndex: 1, // 当前页码
}
const defaultProps = {
  data: staffMockData,
  columns: tableColumns,
  pagination: tablePagination,
  maxHeight: 240,
  showHeader: true,
}

describe('Table', () => {
  const TableMount = options => mount(TestTable, options)
  test('开始测试', () => {
    expect(1).toBe(1)
  })

  test('render Default', () => {
    const wrapper = TableMount({ props: defaultProps })
    expect(wrapper.html()).toMatchSnapshot()
    expect(() => {
      wrapper.vm.$forceUpdate()
      wrapper.vm.$destroy()
    }).not.toThrow()
  })

  test('props test', async () => {
    const wrapper = TableMount({
      props: {
        test: true,
        ...defaultProps,
      },
    })

    expect(wrapper.find('.test-class').exists()).toBeTruthy()

    // 1. 分页配置测试 --> 校验pageIndex/pageSize设置结果
    expect(wrapper.findAll('.simple-table > tbody > tr').length).toEqual(10)
    expect(wrapper.find('.pagination-btn.on').html()).toEqual('1')

    // 2. maxHeight最大高度测试，获取Tbody实际高度
    expect(wrapper.find('.simple-table > tbody').attributes('style')).toContain('max-height: 240px')
    await wrapper.setProps({ props: { maxHeight: -1 } })
    expect(wrapper.find('.simple-table > tbody').attributes('style')).not.toContain('max-height: 240px')

    // 3. showHeader，尝试find('table > thead')，查看其display是否为none
    expect(wrapper.find('.simple-table > thead').element.getClientRects.length).toEqual(1)
    await wrapper.setProps({ props: { showHeader: false } })
    expect(wrapper.find('.simple-table > thead').element.getClientRects.length).toEqual(0)

    // 4. 列数据测试，传入renderFn，校验实际结果
    expect(wrapper.findAll('.simple-table td[column-data-name=sex]').filter(node => !['男', '女'].includes(node.html())).length).toEqual(0)
  })

  test('sort data', () => {
    const wrapper = TableMount({
      props: defaultProps,
    })

    {
      // 按年龄排序
      wrapper.find('.simple-table th[column-name=age] .column-sort').click() // 模拟点击排序
      const ageData = Array.from(wrapper.findAll('.simple-table td[column-data-name=age]')).map(node => Number(node.innerHTML))
      const ageSortBeforeStr = ageData.toString()

      // 检查是否升序排序了
      expect(ageSortBeforeStr).toEqual(ageData.sort((a, b) => a - b).toString())
    }

    {
      // 按年龄排序
      wrapper.find('.simple-table th[column-name=age] .column-sort').click() // 模拟点击排序
      const ageData = Array.from(wrapper.findAll('.simple-table td[column-data-name=age]')).map(node => Number(node.innerHTML))
      const ageSortBeforeStr = ageData.toString() // 将结果转换成字符串方便比较

      // 检查是否降序排序了
      expect(ageSortBeforeStr).toEqual(ageData.sort((a, b) => b - a).toString())
    }
  })

  test('pagination test', () => {
    const wrapper = TableMount({
      props: defaultProps,
    })

    // 检测默认配置
    expect(wrapper.find('.simple-table .pagination-btn.on').html()).toEqual('1')
    expect(wrapper.findAll('.simple-table tbody > tr').length).toEqual(10)

    // 切换页码，分页大小
    wrapper.setProps({ props: { pagination: { pageIndex: 2, pageSize: 12 } } })
    expect(wrapper.find('.simple-table .pagination-btn.on').html()).toEqual('2')
    expect(wrapper.findAll('.simple-table tbody > tr').length).toEqual(12)
  })
})
