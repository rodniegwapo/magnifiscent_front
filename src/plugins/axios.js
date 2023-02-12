import Vue from 'vue'
import axios from 'axios'

const _axios = axios.create({
  baseURL: process.env.VUE_APP_API_ENDPOINT + '/api'
})

Plugin.install = function(Vue) {
  Vue.axios = _axios
  window.axios = _axios
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios
      }
    },
    $axios: {
      get() {
        return _axios
      }
    }
  })
}

Vue.use(Plugin)

export default Plugin
