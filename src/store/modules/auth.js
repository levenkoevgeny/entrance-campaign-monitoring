import { authApi } from "@/api/auth/authAPI"
import { getLocalToken, saveLocalToken, removeLocalToken } from "@/utils"

const state = () => ({
  token: null,
  isLoggedIn: false,
  isLogInError: null,
  user: { is_preloaded_data: true, is_staff: false },
})

// getters
const getters = {
  getToken(state) {
    return state.token
  },
  getIsLoggedIn(state) {
    return state.isLoggedIn
  },
  getIsLogInError(state) {
    return state.isLogInError
  },
  getUser(state) {
    return state.user
  },
}

// actions
const actions = {
  async actionLogIn({ commit }, payload) {
    commit("errors/clearErrorsList", null, {
      root: true,
    })
    try {
      let { username, password } = payload
      const response = await authApi.logInGetToken(username, password)
      const data = await response.data
      const token = data.access
      if (token) {
        saveLocalToken(token)
        commit("setToken", token)
        commit("setLoggedIn", true)
        commit("setIsLogInError", false)

        const response = await authApi.getUserData()
        const userData = await response.data
        commit("setUserData", userData)
      }
    } catch (error) {}
  },

  async actionCheckLoggedIn({ state, commit, dispatch }) {
    if (!state.isLoggedIn) {
      let token = state.token
      if (!token) {
        const localToken = getLocalToken()
        if (localToken) {
          commit("setToken", localToken)
          token = localToken
        }
      }
      if (token) {
        try {
          const response = await authApi.getUserData()
          const userData = await response.data
          commit("setUserData", userData)
          commit("setLoggedIn", true)
        } catch (error) {
          dispatch("actionRemoveLogIn")
        }
      } else {
        dispatch("actionRemoveLogIn")
      }
    }
  },

  async actionRemoveLogIn({ state, commit }) {
    removeLocalToken()
    commit("setToken", null)
    commit("setLoggedIn", false)
    commit("setUserData", { is_preloaded_data: true, is_staff: false })
  },
}

// mutations
const mutations = {
  setLoggedIn(state, payload) {
    state.isLoggedIn = payload
  },
  setToken(state, payload) {
    state.token = payload
  },
  setUserData(state, payload) {
    state.user = payload
  },
  setIsLogInError(state, payload) {
    state.isLogInError = payload
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
