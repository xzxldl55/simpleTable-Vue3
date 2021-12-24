<template>
  <div class="table_demo">
    <TestTable
      :data="tableData"
      :columns="tableColumns"
      :pagination="tablePagination"
      :filters="tableFilters"
    >
      <template #operator="{ item }">
        <a class="mr-1"
           href="javascript:void(0)"
           @click="addItem">新增</a>
        <a href="javascript:void(0)"
           @click="deleteItem(item)">删除</a>
      </template>
    </TestTable>
  </div>
</template>

<script lang="ts">
import { TestTable } from '../src/index'
import { defineComponent, ref } from '@vue/composition-api'
import {
  Staff,
  mockTableColumns,
  mockTableData,
} from '../src/mockData'
import { cloneDeep } from 'lodash-es'

const data = cloneDeep(mockTableData.slice(0, 50))

export default defineComponent({
  name: 'App',
  components: {
    TestTable,
  },
  setup() {
    const tableData = ref<Record<string, unknown>[]>(data)
    const tableColumns = ref(mockTableColumns)
    const tableFilters = ['name', 'age', 'sex']
    const tablePagination = {
      pageSize: 10, // 每页大小
      pageIndex: 1, // 当前页码
    }
    const deleteItem = (item: Staff) => {
      const deleteIndex = tableData.value.findIndex(data => data.name === item.name)
      tableData.value.splice(deleteIndex, 1)
    }
    const addItem = () => {
      alert('add')
    }

    return { tableData, tableColumns, tableFilters, tablePagination, deleteItem, addItem }
  },
})
</script>
<style lang="less" scoped>
.table_demo {
  width: 80%;
  margin: 50px auto;
}
</style>
