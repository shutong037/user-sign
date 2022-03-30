const state = {
  token: undefined
}

const mutations = {
  SET_TOKEN: (state, value) => {
    state.token = value
  }
}

const actions = {
  addToken({commit}, val) {
    commit('SET_TOKEN', val)
  }
}

export default {
  state,
  mutations,
  actions
}
