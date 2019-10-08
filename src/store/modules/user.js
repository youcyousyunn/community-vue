import { login, qryUserInfo } from '@/api/user'
import { setToken, getToken, removeToken } from '@/utils/auth' // 从cookie获取令牌
const state = {
  token: getToken(),
  accountId: '',
  name: '',
  avatarUrl: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ACCOUNT_ID: (state, accountId) => {
    state.accountId = accountId
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR_URL: (state, avatarUrl) => {
    state.avatarUrl = avatarUrl
  }
}

const actions = {
  // 用户登录
  login ({ commit }, userInfo) {
    const { username, password } = userInfo
    console.log(userInfo)
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(res => {
        const { token, accountId, name, avatarUrl } = res.data
        setToken(token)
        commit('SET_ACCOUNT_ID', accountId)
        commit('SET_NAME', name)
        commit('SET_AVATAR_URL', avatarUrl)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  getUserInfo ({ commit, state }) {
    return new Promise((resolve, reject) => {
      qryUserInfo().then(res => {
        const { accountId, name, avatarUrl } = res.data
        commit('SET_ACCOUNT_ID', accountId)
        commit('SET_NAME', name)
        commit('SET_AVATAR_URL', avatarUrl)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 移除令牌
  resetToken ({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
