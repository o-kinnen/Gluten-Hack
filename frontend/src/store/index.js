import { createStore } from 'vuex'

const store = createStore({
  state: {
    isAuthenticated: false
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
    },
    async checkAuthentication ({ commit }) {
      try {
        const response = await fetch(`${process.env.VUE_APP_URL_BACKEND}/users/check-auth`, {
          method: 'GET',
          credentials: 'include'
        })

        if (response.ok) {
          commit('setAuthenticated', true)
        } else {
          commit('setAuthenticated', false)
        }
      } catch (error) {
        commit('setAuthenticated', false)
        console.error('Failed to check authentication:', error)
      }
    }
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated
  }
})

export default store
