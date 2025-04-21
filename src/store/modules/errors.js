const state = () => ({ errorsList: [] })

const getters = {
  getErrorsList(state) {
    return state.errorsList
  },
}

const mutations = {
  setErrorList(state, payload) {
    state.errorsList = [...state.errorsList, payload]
  },
  clearErrorsList(state) {
    state.errorsList = []
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
}
