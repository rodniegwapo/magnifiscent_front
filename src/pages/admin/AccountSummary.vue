<template>
  <div class="pa-6">
    <v-btn @click="$router.go(-1)" class="red mb-3" small>
      <v-icon small class="mr-2">fas fa-arrow-left</v-icon>
      Back
    </v-btn>
    <v-row class="mb-2" v-if="accounts.meta">
      <v-col cols="12" md="4" sm="12">
        <v-card>
          <v-card-title class="justify-center pb-2 text-h4" style="min-height: 90px;">
            <span class="primary--text text-h3 pr-2">₱</span>
            {{ money(accounts.meta.available_commission ? accounts.meta.available_commission : 0) }}
          </v-card-title>
          <v-card-text class="success--text text-center text-button">
            Available Commission
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4" sm="12">
        <v-card>
          <v-card-title class="justify-center pb-2 text-h4" style="min-height: 90px;">
            <span class="primary--text text-h3 pr-2">₱</span>
            {{ money(accounts.meta.total_encashment ? accounts.meta.total_encashment : 0) }}
          </v-card-title>
          <v-card-text class="text-center text-button">
            Total Encashment
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4" sm="12">
        <v-card>
          <v-card-title class="justify-center pb-2 text-h4" style="min-height: 90px;">
            {{ accounts.meta.total_account ? accounts.meta.total_account : 0 }}
          </v-card-title>
          <v-card-text class="text-center text-button">
            Total Account
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-data-table
      :loading="loading"
      :headers="headers"
      :items="accounts.data"
      :options.sync="pagination"
      :footer-props="{
        itemsPerPageOptions: itemsPerPageOptions
      }"
      :server-items-length="accounts.meta ? accounts.meta.total : 0"
      class="elevation-1 overflow-hidden" dark
    >
      <template v-slot:top>
        <v-container
          class="grey darken-4 elevation-1 pt-6 px-7"
          style="max-width: 100%!important;"
        >
          <v-row>
            <v-col cols="12" class="primary--text headline">
              <v-btn
                @click="reloadAccounts"
                x-small fab color="primary" class="mr-3 elevation-0"
              >
                <v-icon class="black--text" small>fas fa-redo-alt</v-icon>
              </v-btn>
              <small>Accounts</small>
            </v-col>
          </v-row>
        </v-container>
      </template>
      <template v-slot:item.monthly_sharing.total_directs="{ item }">
        <div class="justify-center layout" v-if="item.monthly_sharing">
          <v-chip small dark :class="isQualified(item.monthly_sharing) ? 'primary black--text' : 'red'">
            {{ isQualified(item.monthly_sharing)
              ? 'Qualified' : item.monthly_sharing.total_directs + ' / ' + item.monthly_sharing.required_directs }}
          </v-chip>
        </div>
      </template>
      <template v-slot:item.available_income="{ item }">
        <span class="primary--text text-button" style="font-size: 18px!important;">₱</span>
        {{ money(item.available_income) }}
      </template>
      <template v-slot:item.created_at="{ item }">
        {{ date(item.created_at, 'MMMM D, YYYY - hh:mm a') }}
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
      { text: 'Account', align: 'start', sortable: true, value: 'name' },
      { text: 'Available Income', align: 'start', sortable: false, value: 'available_income' },
      { text: 'Monthly Sharing', align: 'center', sortable: false, value: 'monthly_sharing.total_directs' },
      { text: 'Date Registered', align: 'start', sortable: true, value: 'created_at', width: '250px' }
    ],
    accounts: {}
  }),
  mounted () {
    this.getAccounts()
  },
  computed: {
    ...mapGetters({
      itemsPerPageOptions: 'itemsPerPageOptions'
    })
  },
  watch: {
    pagination: {
      handler () {
        if (! this.disablePagination) {
          this.getAccounts()
        }
      },
      deep: true
    },
    selectedAccount () {
      this.reloadAccounts()
    },
    transactionType () {
      this.reloadAccounts()
    }
  },
  methods: {
    isQualified (monthlySharing) {
      return monthlySharing.required_directs <= monthlySharing.total_directs
    },
    async reloadAccounts () {
      this.disablePagination = true
      this.pagination.page = 1
      await this.getAccounts()
      this.disablePagination = false
    },
    async getAccounts () {
      try {
        this.loading = true
        let payload = {
          page: this.pagination.page, limit: this.pagination.itemsPerPage
        }
        payload = {...payload, ...this.$route.params}
        if (this.pagination.sortBy && this.pagination.sortBy.length > 0) {
          this.$set(payload, 'order_by', this.pagination.sortBy[0])
          this.$set(payload, 'order_desc', this.pagination.sortDesc[0] ? 1 : 0)
        }
        const accounts = await this.$axios.get('/admin/accounts-summary', { params: payload })
        this.accounts = accounts.data
      } catch (e) {
        this.showSnackbar('error', e.response ? e.response.data.message : e.message)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
