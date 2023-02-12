import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import '@fortawesome/fontawesome-free/css/all.min.css'
Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'fa',
  },
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: '#FBC02D'
      }
    }
  }
})
