import store from '../vuex/index.js'
import moment from 'moment'

export default {
  methods: {
    showSnackbar (type, text, timeout = null) {
      store.commit('setSnackbar', { value: true, type: type, text: text, timeout: timeout })
    },
    roleColor (role, text = false) {
      switch (role) {
        case 'Admin':
          return text ? 'primary--text' : 'primary black--text'
        case 'Seller':
          return text ? 'blue--text' : 'blue white--text'
        default:
          return text ? 'success--text' : 'success white--text'
      }
    },
    borderColorByRole (role) {
      switch (role) {
        case 'Admin':
          return 'border primary--border'
        case 'Seller':
          return 'border blue--border'
        default:
          return 'border success--border'
      }
    },
    ticketStatusColor (status) {
      switch (status) {
        case 'pending':
          return 'primary black--text'
        case 'active':
          return 'success white--text'
        default:
          return 'secondary'
      }
    },
    date (date = null, format = 'YYYY-MM-DD hh:mm:ss') {
      const d = date ? moment(date) : moment()
      return d.format(format)
    },
    money (amount, symbol = '') {
        return (symbol + parseFloat(amount).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))
    }
  }
}
