/* eslint-disable @typescript-eslint/no-explicit-any */

import type { PropOptions, PropType } from 'vue-types/dist/types'
type Prop<T, D = T> = PropOptions<T, D> | PropType<T>
type PublicRequiredKeys<T> = {
  [K in keyof T]: T[K] extends { required: true } ? K : never
}[keyof T]

type PublicOptionalKeys<T> = Exclude<keyof T, PublicRequiredKeys<T>>
type InferPropType<T> = T extends null
  ? any // null & true would fail to infer
  : T extends { type: null | true }
    ? any // As TS issue https://github.com/Microsoft/TypeScript/issues/14829 // somehow `ObjectConstructor` when inferred from { (): T } becomes `any` // `BooleanConstructor` when inferred from PropConstructor(with PropMethod) becomes `Boolean`
    : T extends ObjectConstructor | { type: ObjectConstructor }
      ? Record<string, any>
      : T extends BooleanConstructor | { type: BooleanConstructor }
        ? boolean
        : T extends Prop<infer V, infer D>
          ? unknown extends V
            ? D
            : V
          : T

// eslint-disable-next-line @typescript-eslint/ban-types
export type IxPublicPropTypes<O> = O extends object
  ? { [K in PublicRequiredKeys<O>]: InferPropType<O[K]> } & { [K in PublicOptionalKeys<O>]?: InferPropType<O[K]> }
  : { [K in string]: any }

export interface paginationType {
  pageIndex: number
  pageSize: number
}

export type tableState = {
  data: Record<string, any>[]
  filters: string[]
  columns: ColumnPublicProps[]
  showHeader: boolean
}

export type TSortState = {
  name: string
  direction: 0 | 1
}

export type TFilterState = {
  filter: string
  searchValue: string
}

export interface TPageConf extends paginationType {
  count: number // 数据条目总数
}

// Props 定义在这里
export const tableProps = {
  data: { // 表格数据
    type: Array as PropType<Record<string, any>>,
    default: (): Array<Record<string, any>> => {
      return []
    },
    required: true,
  },
  columns: { // 列数据
    type: Array as PropType<ColumnPublicProps[]>,
    default: (): ColumnPublicProps[] => {
      return []
    },
    required: true,
  },
  showHeader: { // 是否显示表头
    type: Boolean,
    default: true,
  },
  pagination: { // 分页配置
    type: [Object as PropType<paginationType>, false],
    default: (): paginationType | false => {
      return false
    },
  },
  maxHeight: { // 表格体最大高度配置（默认按照内容撑开即高度为auto，配置后超出限制则滚动页面）
    type: [Number, String],
    default: -1,
  },
  filters: { // 可筛选字段
    type: Array,
    default: (): Array<string> => {
      return []
    },
  },
}
export const columnProps = {
  name: { // 列名 --> 即唯一标识id
    type: String,
    default: '',
    required: true,
  },
  title: { // 列标题
    type: String,
    default: '',
  },
  canSort: {
    type: Boolean,
    default: false,
  },
  renderFn: {
    type: Function || undefined,
    default: undefined,
  },
  sortState: {
    type: Object as PropType<TSortState>,
    default: (): TSortState => {
      return { name: '', direction: 0 }
    },
  },
}


export type TablePublicProps = IxPublicPropTypes<typeof tableProps>
export type ColumnPublicProps = IxPublicPropTypes<typeof columnProps>



