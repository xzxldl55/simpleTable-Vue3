<template>
  <div>
    <TestTable :data="tableData"
               :columns="tableColumns"
               :pagination="tablePagination"
               :max-height="240">
      <template slot="operator">
        <a href="#">新增</a>
        <a href="#">删除</a>
      </template>
    </TestTable>
  </div>
</template>

<script lang="ts">
import { TestTable } from '../src/table'
import { defineComponent, reactive } from '@vue/composition-api'

export default defineComponent({
  name: 'App',
  components: {
    TestTable,
  },
  setup() {
    const tableData = reactive([
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
    ])
    const tableColumns = reactive([
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
        renderFn: (val: number) => {
          return val ? '男' : '女'
        },
      },
    ])
    const tablePagination = reactive({
      pageSize: 10, // 每页大小
      pageIndex: 1, // 当前页码
    })

    return { tableData, tableColumns, tablePagination }
  },
})
</script>
