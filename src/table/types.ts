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
    type: Array,
    default: (): Array<any> => {
      return []
    },
  },
  columns: { // 列数据
    type: Array as PropType<ColumnPublicProps[]>,
    default: (): ColumnPublicProps[] => {
      return []
    },
  },
  pagination: {
    type: [Object as PropType<paginationType>, Boolean],
    default: (): paginationType | false => {
      return false
    },
  },
  maxHeight: {
    type: [Number, String],
    default: -1,
  },
}
export const columnProps = {
  title: { // 列标题
    type: String,
    default: '',
  },
  name: { // 列名
    type: String,
    default: '',
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

export type TablePublicProps = IxPublicPropTypes<typeof tableProps>
export type ColumnPublicProps = IxPublicPropTypes<typeof columnProps>



