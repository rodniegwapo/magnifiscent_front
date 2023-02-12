<template>
  <div class="pa-6">
    <v-data-table
      :loading="loading"
      :headers="headers"
      :items="directReferrals.data"
      :options.sync="pagination"
      :footer-props="{
        itemsPerPageOptions: itemsPerPageOptions
      }"
      :server-items-length="directReferrals.meta ? directReferrals.meta.total : 0"
      class="elevation-1 overflow-hidden" dark
    >
      <template v-slot:top>
        <v-container
          class="grey darken-4 elevation-1 pt-6 px-7"
          style="max-width: 100%!important;"
        >
          <v-row>
            <v-col cols="12" md="12" sm="12" class="primary--text headline">
              <v-btn
                @click="reloadDirectReferrals"
                x-small fab color="primary" class="mr-3 elevation-0"
              >
                <v-icon class="black--text" small>fas fa-redo-alt</v-icon>
              </v-btn>
              <small>Direct Referrals</small>
            </v-col>
          </v-row>
        </v-container>
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
    disablePagination: false,
    pagination: { page: 1, itemsPerPage: 10 },
    headers: [
      { text: 'Account', align: 'start', sortable: false, value: 'account.name' },
      { text: 'Referred Account', align: 'start', sortable: false, value: 'referred_account.name' },
      { text: 'Referred Middle Name', align: 'start', sortable: false, value: 'referred_account.middle_name' },
      { text: 'Referred Last Name', align: 'start', sortable: false, value: 'referred_account.last_name' },
      { text: 'Date Added', align: 'start', sortable: true, value: 'created_at', width: '250px' }
    ],
    directReferrals: {}
  }),
  mounted () {
    this.getDirectReferrals()
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
          this.getDirectReferrals()
        }
      },
      deep: true
    },
    selectedAccount () {
      this.reloadDirectReferrals()
    }
  },
  methods: {
    async reloadDirectReferrals () {
      this.disablePagination = true
      this.pagination.page = 1
      await this.getDirectReferrals()
      this.disablePagination = false
    },
    async getDirectReferrals () {
      try {
        this.loading = true
        const payload = {
          page: this.pagination.page, limit: this.pagination.itemsPerPage,
          meta_type: 'Direct Referral',
          account_id: this.selectedAccount ? this.selectedAccount.id : null
        }
        if (this.pagination.sortBy && this.pagination.sortBy.length > 0) {
          this.$set(payload, 'order_by', this.pagination.sortBy[0])
          this.$set(payload, 'order_desc', this.pagination.sortDesc[0] ? 1 : 0)
        }
        const directReferrals = await this.$axios.get('/user/transactions', { params: payload })
        this.directReferrals = directReferrals.data
      } catch (e) {
        this.showSnackbar('error', e.response ? e.response.data.message : e.message)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
