import { createStore } from 'vuex'
import router from './router'
import { message } from 'ant-design-vue'

export default createStore({
    state: {
        isLoggedIn: localStorage.getItem('token'),
        isLoggedInDana: localStorage.getItem('tokenDana'),
        alert: {
            visible: false,
            message: '',
            background: '',
            text: ''
        },
        isInputResValid: false,
        isPaymentOpen: false

    },
    mutations: {
        LOGIN(state) {
            state.isLoggedIn = true
        },
        LOGINDANA(state) {
            state.isLoggedInDana = true
        },
        LOGOUTDANA(state) {
            state.isLoggedInDana = false
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
        },
        PAYMENT(state) {
            state.isPaymentOpen = true
        },
        CLOSEPAYMENT(state) {
            state.isPaymentOpen = false
        }
    },
    actions: {
        login({ commit }) {
            commit('LOGIN')
        },
        loginDana({ commit }) {
            commit('LOGINDANA')
        },
        logout({ commit, dispatch }) {
            localStorage.removeItem('token');
            localStorage.removeItem('idUser');
            commit('LOGOUT')
            dispatch('navigateToLogin')
        },
        logoutDana({ commit, dispatch }) {
            localStorage.removeItem('tokenDana');
            localStorage.removeItem('idUserDana');
            commit('LOGOUTDANA')
            dispatch('navigateToLoginDana')
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
        payment({ commit }) {
            commit('PAYMENT')
        },
        closepayment({ commit }) {
            commit('CLOSEPAYMENT')
        },
        navigateToLogin() {
            router.push({name: 'Login'})
        },
        navigateToLoginDana() {
            router.push({name: 'LoginDana'})
        }
    }
    
})