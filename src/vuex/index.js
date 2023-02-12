/* eslint-disable */
import Vue from 'vue' 
import vuex from 'vuex'
import cookies from 'vue-cookies'
Vue.use(vuex) 

export default new vuex.Store({
  state: {
    profile: {},
    profileDialog: false,
    login: false,
    snackbar: false,
    text: '',
    timeout: 0,
    role: '',
    snackbarText: '',
    snackbarType: '',
    snackbarTimeoutDefault: 2500,
    snackbarTimeout: 1,
    role: '',
    accounts: [],
    selectedAccount: null,
    itemsPerPageOptions: [10, 25, 50, 100],
    adminFee: 25,
    tax: 10,
    minimumEncashment: 200,
    tableOfExits: [
      { name: 'Table 1', level: 1, value: 2000 },
      { name: 'Table 2', level: 2, value: 3000 },
      { name: 'Table 3', level: 3, value: 5000 },
      { name: 'Table 4', level: 4, value: 10000 },
      { name: 'Table 5', level: 5, value: 25000 }
    ],
    notifications: [],
    totalUnreadNotifications: 0
  },
  getters: {
    login: state => state.login,
    snackbar: state => state.snackbar,
    snackbarText: state => state.snackbarText,
    snackbarType: state => state.snackbarType,
    snackbarTimeout: state => state.snackbarTimeout,
    timeout: state => state.timeout,
    profile: state => state.profile,
    profileDialog: state => state.profileDialog,
    role: state => state.role,
    accounts: state => state.accounts,
    selectedAccount: state => state.selectedAccount,
    itemsPerPageOptions: state => state.itemsPerPageOptions,
    adminFee: state => state.adminFee,
    tax: state => state.tax,
    minimumEncashment: state => state.minimumEncashment,
    tableOfExits: state => state.tableOfExits,
    notifications: state => state.notifications,
    totalUnreadNotifications: state => state.totalUnreadNotifications
  },
  mutations: {
    setLogIn (state, payload) {
      state.login = payload
    },
    setRole (state, payload) {
      state.role = payload
    },
    setAccounts (state, payload) {
      state.accounts = payload
    },
    setSnackbar (state, payload) {
      state.snackbar = payload.value
      state.snackbarType = payload.type
      state.snackbarText = payload.text
      state.snackbarTimeout = payload.timeout ? payload.timeout : state.snackbarTimeoutDefault
    },
    setSelectedAccount (state, payload) {
      state.selectedAccount = payload
    },
    setProfile (state, payload) {
      state.profile = payload
    },
    reset (state) {
      state.role = ''
      state.selectedAccount = null
      state.accounts = []
      state.profile = {}
      state.login = false
    },
    readNotifications (state) {
      state.totalUnreadNotifications = 0
    }
  },
  actions: {
    async getProfile ({ commit, state }) {
      const res = await window.axios.get('/profile/info')
      const profile = res.data.data
      state.profile = profile
      state.role = profile.role.name
      state.login = true
      return profile
    },
    async getAccounts ({ commit, state }) {
      const res = await window.axios.get('/user/accounts', {
        params: { order_by: 'name', order_desc: 0 }
      })
      const accounts = res.data.data
      state.accounts = accounts
      if (! state.selectedAccount) {
        state.selectedAccount = accounts.length > 0 ? accounts[0] : null
      }
      return state.selectedAccount
    },
    async getNotifications ({ commit, state }) {
      const res = await window.axios.get('/user/notifications', {
        params: { page: 1, limit: 5 }
      })
      state.notifications = res.data.data
      state.totalUnreadNotifications = res.data.meta.total_unread_notifications
    }
  }
})
