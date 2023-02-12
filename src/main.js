import Vue from 'vue'
import App from './App.vue'
import mixins from './plugins/mixins.js'
import vuetify from './plugins/vuetify'
import router from './router/index.js'
import store from './vuex/index.js'
import './plugins/auth.js'
import './plugins/axios.js'
import './plugins/cookies.js'
import './assets/css/app.css'

Vue.mixin(mixins)
Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
