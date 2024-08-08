import { createStore } from 'vuex'

const store = createStore({
  state: {
    isAuthenticated: !!localStorage.getItem('token')
  },
  mutations: {
    setAuthenticated (state, isAuthenticated) {
      state.isAuthenticated = isAuthenticated
    }
  },
  actions: {
    login ({ commit }) {
      commit('setAuthenticated', true)
    },
    logout ({ commit }) {
      commit('setAuthenticated', false)
    }
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated
  }
})

export default store
