/**
 * 分页逻辑处理Hook
 */

import { Ref, computed, reactive } from '@vue/composition-api'
import { TPageConf, paginationType } from '../types'
import debug from 'debug'

const DEBUG = debug('table:pagination')

type pageHook = {
  pageState: TPageConf | false
  pageBtnSize: Ref<number>
  changePage: (index: number) => void
  goBefore: () => void
  goNext: () => void
}

const usePagination = (pageConf: paginationType | false): pageHook => {

  // 如果传入的pageConf为false则表示不分页
  const pageState: TPageConf | false = pageConf ? reactive({
    pageIndex: pageConf.pageIndex,
    pageSize: pageConf.pageSize,
    count: 0,
  }) : false

  // 总页数
  const pageBtnSize: Ref<number> = computed(() => {
    return pageState ? Math.ceil(pageState.count / pageState.pageSize) : 0
  })

  const changePage = (index: number) => {
    if (!pageState) {
      return
    }
    pageState.pageIndex = index
    DEBUG('change page to', index)
  }

  const goBefore = () => {
    if (!pageState) {
      return
    }
    const goBeforeRes = pageState.pageIndex - 1
    pageState.pageIndex = goBeforeRes <= 0 ? 1 : goBeforeRes
    DEBUG('go before')
  }

  const goNext = () => {
    if (!pageState) {
      return
    }
    const goNextRes = pageState.pageIndex + 1
    pageState.pageIndex = goNextRes > pageBtnSize.value ? pageBtnSize.value : goNextRes
    DEBUG('go next')
  }

  return {
    pageState,
    pageBtnSize,
    changePage,
    goBefore,
    goNext,
  }
}

export default usePagination
