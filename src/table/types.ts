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

export type paginationType = {
  pageIndex: number
  pageSize: number
}

// Props 定义在这里
export const tableProps = {
  test: {
    type: Boolean,
    default: false,
  },
  data: { // 表格数据
    type: Array as PropType<Array<Object>>,
    default: (): Array<Object> => {
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
}
export const columnProps = {
  title: { // 列标题
    type: String,
    default: '',
  },
  name: { // 列名 --> 即唯一标识id
    type: String,
    default: '',
    required: true,
  },
  canSort: {
    type: Boolean,
    default: false,
  },
  renderFn: {
    type: Function,
    default: () => {
      return () => {}
    },
  },
}

// TODO：拆分出Pagination组件
// export const paginationProps = {
//   pageIndex: { // 当前页码
//     type: Number,
//     default: 1,
//   },
//   pageSize: { // 当前每页大小
//     type: Number,
//     default: 10,
//   },
//   count: { // 总行数
//     type: Number,
//     default: 0,
//   },
//   size: { // 分页数量
//     type: Number,
//     default: 0,
//   }
// }

export type TablePublicProps = IxPublicPropTypes<typeof tableProps>
export type ColumnPublicProps = IxPublicPropTypes<typeof columnProps>
// export type PaginationPublicProps = IxPublicPropTypes<typeof paginationProps>



