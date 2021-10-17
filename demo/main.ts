import CompositionApi, { createApp, h } from '@vue/composition-api'
import Vue from 'vue'
import App from './App.vue'

import './style/index.less'

Vue.use(CompositionApi)

export function mount(
  options: { el: Element | string; routeBase: string; base: string } = {
    el: '#app',
    routeBase: '',
    base: '',
  },
): void {
  const { el } = options

  const app = createApp({
    render: () => h(App),
  })

  app.mount(el)
}

mount()
