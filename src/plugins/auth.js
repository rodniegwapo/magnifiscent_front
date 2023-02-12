import axios from 'axios'
import store from '@/vuex/index.js'
import cookies from 'vue-cookies'

if (cookies.isKey('token')) {
  axios.defaults.headers.common['Authorization'] = cookies.get('token')
  store.commit('setRole', cookies.get('role'))
  store.commit('setSelectedAccount', cookies.get('account') !== 'null' ? cookies.get('account') : null)
  store.commit('setLogIn', true)
}
