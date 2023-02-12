<template>
  <div class="pa-6">
    <v-data-table
      :loading="loading"
      :headers="headers"
      :items="transactions.data"
      :options.sync="pagination"
      :footer-props="{
        itemsPerPageOptions: itemsPerPageOptions
      }"
      :server-items-length="transactions.meta ? transactions.meta.total : 0"
      class="elevation-1 overflow-hidden" dark
    >
      <template v-slot:top>
        <v-container
          class="grey darken-4 elevation-1 pt-6 px-7"
          style="max-width: 100%!important;"
        >
          <v-row>
            <v-col cols="12" md="8" sm="12" class="primary--text headline">
              <v-btn
                @click="reloadTransactions"
                x-small fab color="primary" class="mr-3 elevation-0"
              >
                <v-icon class="black--text" small>fas fa-redo-alt</v-icon>
              </v-btn>
              <small>Transactions</small>
            </v-col>
            <v-col cols="12" md="4" sm="12">
              <v-select
                v-model="transactionType"
                :disabled="loading"
                prepend-inner-icon="fas fa-handshake"
                :items="['Table Of Exit', 'Direct Referral', 'Encashment', 'Monthly Sharing Poll']"
                label="Type"
                clearable dense dark outlined
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </template>
      <template v-slot:item.meta.type="{ item }">
        <div class="justify-center layout">
          <v-chip
            small dark
            :class="item.meta.type === 'Encashment' ? 'red' : 'primary black--text'"
          >
            {{ item.meta.type }}
          </v-chip>
        </div>
      </template>
      <template v-slot:item.created_at="{ item }">
        {{ date(item.created_at, 'MMMM D, YYYY - hh:mm a') }}
      </template>
      <template v-slot:item.amount="{ item }">
        <span class="primary--text text-button" style="font-size: 18px!important;">₱</span>
        {{ money(item.amount) }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    loading: false,
    transactionType: '',
    disablePagination: false,
    pagination: { page: 1, itemsPerPage: 10 },
    headers: [
      { text: 'Account', align: 'start', sortable: false, value: 'account.name' },
      { text: 'Type', align: 'center', sortable: false, value: 'meta.type' },
      { text: 'Amount', align: 'start', sortable: true, value: 'amount', width: '150px' },
      { text: 'Date Added', align: 'start', sortable: true, value: 'created_at', width: '250px' }
    ],
    transactions: {}
  }),
  mounted () {
    this.getTransactions()
  },
  computed: {
    ...mapGetters({
      itemsPerPageOptions: 'itemsPerPageOptions',
      selectedAccount: 'selectedAccount'
    })
  },
  watch: {
    pagination: {
      handler () {
        if (! this.disablePagination) {
          this.getTransactions()
        }
      },
      deep: true
    },
    selectedAccount () {
      this.reloadTransactions()
    },
    transactionType () {
      this.reloadTransactions()
    }
  },
  methods: {
    async reloadTransactions () {
      this.disablePagination = true
      this.pagination.page = 1
      await this.getTransactions()
      this.disablePagination = false
    },
    async getTransactions () {
      try {
        this.loading = true
        const payload = {
          page: this.pagination.page, limit: this.pagination.itemsPerPage,
          confirmed: 1, meta_type: this.transactionType,
          account_id: this.selectedAccount ? this.selectedAccount.id : null
        }
        if (this.pagination.sortBy && this.pagination.sortBy.length > 0) {
          this.$set(payload, 'order_by', this.pagination.sortBy[0])
          this.$set(payload, 'order_desc', this.pagination.sortDesc[0] ? 1 : 0)
        }
        const transactions = await this.$axios.get('/user/transactions', { params: payload })
        this.transactions = transactions.data
      } catch (e) {
        this.showSnackbar('error', e.response ? e.response.data.message : e.message)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
