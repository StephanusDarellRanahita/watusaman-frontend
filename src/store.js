import { createStore } from 'vuex'
import router from './router'

export default createStore({
    state: {
        isLoggedIn: localStorage.getItem('token'),
        alert: {
            visible: false,
            message: '',
            background: '',
            text: ''
        },
        isInputResValid: false

    },
    mutations: {
        LOGIN(state) {
            state.isLoggedIn = true
        },
        LOGOUT(state) {
            state.isLoggedIn = false
        },
        SHOW_ALERT(state, payload) {
            state.alert.visible = payload.visible
            state.alert.message = payload.message
            state.alert.background = payload.background
            state.alert.text = payload.text
        },
        HIDE_ALERT(state) {
            state.alert.visible = false
            state.alert.message = ''
        },
        RESERVASI(state) {
            state.isInputResValid = !state.isInputResValid
        }
    },
    actions: {
        login({ commit }) {
            commit('LOGIN')
        },
        logout({ commit, dispatch }) {
            localStorage.removeItem('token');
            localStorage.removeItem('idUser');
            commit('LOGOUT')
            dispatch('navigateToLogin')
        },
        showAlert({ commit }, { message, background = '', text = ''}) {
            commit('SHOW_ALERT', { visible: true,message, background, text })
        },
        hideAlert({ commit }) {
            commit('HIDE_ALERT')
        },
        reservasi({ commit }) {
            commit('RESERVASI')
        },
        navigateToLogin() {
            router.push({name: 'Login'})
        }
    }
    
})