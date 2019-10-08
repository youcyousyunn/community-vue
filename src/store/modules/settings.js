import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'

const { fixedHeader } = defaultSettings

const state = {
  theme: variables.theme,
  fixedHeader: fixedHeader
}

export default {
  namespaced: true,
  state
}
