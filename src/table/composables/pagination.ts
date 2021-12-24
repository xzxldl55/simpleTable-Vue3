/**
 * 分页逻辑处理Hook
 */

import { Ref, computed, reactive, watch } from '@vue/composition-api'
import { TPageConf, paginationType } from '../../types'
import debug from 'debug'

const DEBUG = debug('table:pagination')

type pageHook = {
  pageBtnSize: Ref<number>
  changePage: (index: number) => void
  goBefore: () => void
  goNext: () => void
  setPageCount: (count: number) => void
}

const usePagination = (pageConf: paginationType | undefined, count: number): [TPageConf | undefined, pageHook] => {

  // 如果传入的pageConf为false则表示不分页
  const pageState: TPageConf | undefined = pageConf ? reactive({
    pageIndex: pageConf.pageIndex,
    pageSize: pageConf.pageSize,
    count: count,
  }) : undefined

  // 总页数
  const pageBtnSize: Ref<number> = computed(() => {
    return pageState ? Math.ceil(pageState.count / pageState.pageSize) : 0
  })

  // 异常情况处理，当过滤数据后，按钮个数可能小于当前页码，此时需要重置一下取二者最小值
  watch(pageBtnSize, () => {
    pageState!.pageIndex = Math.min(pageBtnSize.value, pageState!.pageIndex)
  })

  const changePage = (index: number) => {

    // 这里当可调用改变页码函数时 pageState 一定存在
    pageState!.pageIndex = index
    DEBUG('change page to', index)
  }

  const goBefore = () => {
    const goBeforeRes = pageState!.pageIndex - 1
    pageState!.pageIndex = goBeforeRes <= 0 ? 1 : goBeforeRes
    DEBUG('go before')
  }

  const goNext = () => {
    const goNextRes = pageState!.pageIndex + 1
    pageState!.pageIndex = goNextRes > pageBtnSize.value ? pageBtnSize.value : goNextRes
    DEBUG('go next')
  }

  const setPageCount = (count: number) => {
    pageState!.count = count
  }

  return [
    pageState,
    {
      pageBtnSize,
      changePage,
      goBefore,
      goNext,
      setPageCount,
    },
  ]
}

export default usePagination
