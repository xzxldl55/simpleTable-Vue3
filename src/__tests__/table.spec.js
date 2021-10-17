import { mount } from '@vue/test-utils'
import { TestTable } from '../table'

describe('Table', () => {
  const TableMount = options => mount(TestTable, options)

  test('render', () => {
    const wrapper = TableMount()
    expect(wrapper.html()).toMatchSnapshot()
    expect(() => {
      wrapper.vm.$forceUpdate()
      wrapper.vm.$destroy()
    }).not.toThrow()
  })

  test('props test', () => {
    const wrapper = TableMount({
      propsData: {
        test: true,
      },
    })

    expect(wrapper.find('.test-class').exists()).toBeTruthy()
  })
})
