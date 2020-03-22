import { login, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

const state = {
  token: getToken(),
  name: '',
  avatar: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { emailAccount, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ emailAccount: emailAccount.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_NAME', '管理员')
        commit('SET_TOKEN', getToken())
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response

        if (!data) {
          reject('网络错误，请重新登陆')
        }
        commit('SET_NAME', '管理员')
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },



  // remove token
  resetInfo({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_NAME','')
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

