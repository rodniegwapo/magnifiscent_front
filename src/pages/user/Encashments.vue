<template>
  <div class="pa-6">
    <v-row class="mb-2" v-if="selectedAccount">
      <v-col cols="12" md="4" sm="12">
        <v-card>
          <v-card-title class="justify-center pb-2 text-h4">
            <span class="primary--text text-h3 pr-2">₱</span>
            {{ money(encashments.meta ?encashments.meta.available_commission : 0) }}
          </v-card-title>
          <v-card-text class="text-center text-button">
            Available Commission
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4" sm="12">
        <v-card>
          <v-card-title class="justify-center pb-2 text-h4">
            {{ tax }}<span class="primary--text text-h3 pl-2">%</span>
          </v-card-title>
          <v-card-text class="text-center text-button">
            Tax
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4" sm="12">
        <v-card>
          <v-card-title class="justify-center pb-2 text-h4">
            <span class="primary--text text-h3 pr-2">₱</span>
            {{ money(adminFee) }}
          </v-card-title>
          <v-card-text class="text-center text-button">
            Admin Fee
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-data-table
      :loading="loading"
      :headers="headers"
      :items="encashments.data"
      :options.sync="pagination"
      :footer-props="{
        itemsPerPageOptions: itemsPerPageOptions
      }"
      :server-items-length="encashments.meta ? encashments.meta.total : 0"
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
                @click="reloadEncashments()"
                x-small fab color="primary" class="mr-3 elevation-0"
              >
                <v-icon class="black--text" small>fas fa-redo-alt</v-icon>
              </v-btn>
              <small>Encashments</small>
            </v-col>
            <v-col cols="12" md="4" sm="12" class="py-2">
              <v-btn
                @click="addEncashmentDialog = true"
                class="elevation-1 black--text"
                color="primary" block
                :disabled="! encashments.meta
                  || (encashments.meta && encashments.meta.available_commission < minimumEncashment)"
              >
                <v-icon small class="mr-2">fas fa-plus</v-icon>
                Request Encashment
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </template>
      <template v-slot:item.created_at="{ item }">
        {{ date(item.created_at, 'MMMM D, YYYY - hh:mm a') }}
      </template>
      <template v-slot:item.amount="{ item }">
        <span v-if="item.meta" class="primary--text text-button" style="font-size: 18px!important;">₱</span>
        {{ money(item.meta.net_amount) }}
      </template>
      <template v-slot:item.actions="{ item }">
        <div class="justify-center layout">
          <v-btn
            @click="selectedEncashment = item, showEncashmentDialog = true"
            dark fab x-small
            class="elevation-0 ml-2 blue"
          >
            <v-icon dark small>fas fa-search</v-icon>
          </v-btn>
        </div>
      </template>
    </v-data-table>
    <!-- Show Encashment Dialog -->
    <v-dialog
      v-model="showEncashmentDialog" persistent max-width="500px"
      overlay-opacity="0.6"
      overlay-color="grey"
    >
      <v-card dark>
        <v-card-title class="pb-8">
          <v-icon class="mr-2" color="primary">fas fa-money-check</v-icon>
          <span class="headline primary--text"><small>Encashment Request Information</small></span>
          <v-spacer />
          <v-btn
            :disabled="submitting"
            @click="showEncashmentDialog = false"
            fab text small color="primary"
          >
            <v-icon>fas fa-times</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-card class="px-0 elevation-0">
            <v-card-text v-if="selectedEncashment.account && selectedEncashment.account">
              <table class="w-full">
                <tr>
                  <td class="py-1">Account</td>
                  <td class="py-1 white--text">{{ selectedEncashment.account.name }}</td>
                </tr>
                <tr>
                  <td class="py-1">Payment Channel</td>
                  <td class="py-1 white--text">{{ selectedEncashment.meta.payment_channel }}</td>
                </tr>
                <tr v-if="selectedEncashment.bank_account">
                  <td class="py-1">Bank Account</td>
                  <td class="py-1 primary--text">{{ selectedEncashment.bank_account }}</td>
                </tr>
                <tr>
                  <td class="py-1">Mobile Number</td>
                  <td class="py-1 white--text">{{ selectedEncashment.mobile_no }}</td>
                </tr>
                <tr>
                  <td class="py-1">Amount</td>
                  <td class="py-1 white--text">
                    <span class="primary--text text-button" style="font-size: 18px!important;">₱</span>
                    {{ selectedEncashment.amount }}
                  </td>
                </tr>
                <tr>
                  <td class="py-1">Tax</td>
                  <td class="py-1 white--text">
                    <span class="red--text text-button" style="font-size: 18px!important;">₱</span>
                    {{ selectedEncashment.meta.tax_fee }}
                  </td>
                </tr>
                <tr>
                  <td class="py-1">Admin Fee</td>
                  <td class="py-1 white--text">
                    <span class="red--text text-button" style="font-size: 18px!important;">₱</span>
                    {{ selectedEncashment.meta.admin_fee }}
                  </td>
                </tr>
                <tr>
                  <td class="py-1">Net Amount</td>
                  <td class="py-1 white--text">
                    <span class="primary--text text-button" style="font-size: 18px!important;">₱</span>
                    {{ selectedEncashment.meta.net_amount }}
                  </td>
                </tr>
                <tr>
                  <td class="py-1">Date Requested</td>
                  <td class="py-1 white--text">
                    {{ date(selectedEncashment.created_at, 'MMMM D, YYYY - hh:mm a') }}
                  </td>
                </tr>
              </table>
            </v-card-text>
          </v-card>
        </v-card-text>
        <v-card-actions class="pt-0">
            <v-spacer></v-spacer>
            <v-btn
              @click="showEncashmentDialog = false"
              color="primary" text
              :disabled="submitting"
            >
              <b>Close</b>
            </v-btn>
          </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Add Encashment Dialog -->
    <v-dialog
      v-model="addEncashmentDialog" persistent max-width="500px"
      overlay-opacity="0.6"
      overlay-color="grey"
    >
      <v-form lazy ref="addEncashmentForm" @submit.prevent="addEncashment">
        <v-card dark>
          <v-card-title class="pb-8">
            <v-icon class="mr-2" color="primary">fas fa-money-check</v-icon>
            <span class="headline primary--text"><small>Request Encashment</small></span>
            <v-spacer />
            <v-btn
              :disabled="submitting"
              @click="closeAddDialog()"
              fab text small color="primary"
            >
              <v-icon>fas fa-times</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" class="py-1">
                <v-text-field
                  v-model="addEncashmentForm.amount"
                  :rules="[
                    v => !!v || 'The amount is required.',
                    v => v >= minimumEncashment || 'The minimum encashment is ' + minimumEncashment,
                    v => parseFloat(v) <= encashments.meta.available_commission || 'Not enough balance.'
                  ]"
                  type="number"
                  label="Amount" outlined flat dense
                  prepend-inner-icon="fas fa-money-check"
                />
              </v-col>
              <v-col cols="6" class="py-1">
                <v-text-field
                  :value="totalTax" readonly
                  label="Tax" outlined flat dense
                  prepend-inner-icon="fas fa-money-check"
                />
              </v-col>
              <v-col cols="6" class="py-1">
                <v-text-field
                  :value="adminFee" readonly
                  label="Admin Fee" outlined flat dense
                  prepend-inner-icon="fas fa-money-check"
                />
              </v-col>
              <v-col cols="6" class="py-1">
                <v-text-field
                  :value="totalTax + adminFee" readonly
                  label="Total Fee" outlined flat dense
                  prepend-inner-icon="fas fa-money-check"
                />
              </v-col>
              <v-col cols="6" class="py-1">
                <v-text-field
                  :value="addEncashmentForm.amount ?
                    addEncashmentForm.amount - (totalTax + adminFee) : 0" readonly
                  label="Net Amount" outlined flat dense
                  prepend-inner-icon="fas fa-money-check"
                />
              </v-col>
              <v-col cols="12" class="py-1">
                 <v-select
                    v-model="addEncashmentForm.payment_channel_type"
                    prepend-inner-icon="fas fa-money-check"
                    :rules="[ v => !!v || 'Payment channel type is required.' ]"
                    :items="['Bank', 'Padala Center']"
                    label="Payment Channel Type"
                    dense dark outlined
                  ></v-select>
              </v-col>
              <v-col v-if="addEncashmentForm.payment_channel_type" cols="12" class="py-1">
                <v-select
                  v-model="addEncashmentForm.payment_channel"
                  :items="paymentChannels"
                  :rules="[ v => !!v || 'Payment channel is required.' ]"
                  prepend-inner-icon="fas fa-money-check"
                  :label="payment_channel_type"
                  dense dark outlined
                >
                  <template v-slot:selection="data">
                    <table class="w-full py-2">
                      <tr>
                        <td>
                          <img :src="data.item.img" width="80px" class="rounded"/>
                        </td>
                        <td class="text-right">{{ data.item.text }}</td>
                      </tr>
                    </table>
                  </template>
                  <template v-slot:item="data">
                    <table class="w-full py-2">
                      <tr>
                        <td>
                          <img :src="data.item.img" width="80px" class="rounded"/>
                        </td>
                        <td class="text-right">{{ data.item.text }}</td>
                      </tr>
                    </table>
                  </template>
                </v-select>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="pt-0">
            <v-spacer></v-spacer>
            <v-btn
              @click="closeAddDialog()"
              color="primary" text
              :disabled="submitting"
            >
              <b>Close</b>
            </v-btn>
            <v-btn
              color="primary" text
              :loading="submitting"
              :disabled="submitting"
              type="submit"
            >
              <b>Save</b>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    addEncashmentDialog: false,
    showEncashmentDialog: false,
    addEncashmentForm: {},
    loading: true,
    submitting: false,
    pagination: { page: 1, itemsPerPage: 10 },
    selectedEncashment: {},
    errors: {},
    search: null,
    headers: [
      { text: 'Account', align: 'start', sortable: false, value: 'account.name' },
      { text: 'Date Requested', align: 'start', value: 'created_at' },
      { text: 'Net Amount', align: 'start', sortable: true, value: 'amount' },
      { text: 'Actions', align: 'center', sortable: false, value: 'actions', width: '120px' }
    ],
    encashments: {},
    disablePagination: false
  }),
  mounted () {
    this.getEncashments()
  },
  computed: {
    ...mapGetters({
      itemsPerPageOptions: 'itemsPerPageOptions',
      selectedAccount: 'selectedAccount',
      tax: 'tax',
      adminFee: 'adminFee',
      minimumEncashment: 'minimumEncashment'
    }),
    totalTax () {
      let tax = 0
      if (this.addEncashmentForm.amount) {
        tax = this.addEncashmentForm.amount * (this.tax / 100)
      }
      return tax
    },
    paymentChannels () {
      switch (this.addEncashmentForm.payment_channel_type) {
        case 'Bank':
          return [
            { text: 'BDO', img: '/banks/bdo.png' },
            { text: 'Eastwest', img: '/banks/eastwest.png' },
            { text: 'Security Bank', img: '/banks/security_bank.jpg' }
          ]
        case 'Padala Center':
          return [
            { text: 'Palawan Pawnshop', img: '/payment_centers/palawan.jpg' },
            { text: 'M Lhuillier', img: '/payment_centers/ml.jpg' },
            { text: 'Cebuana Lhuillier', img: '/payment_centers/cebuana.jpg' }
          ]
        default:
          return []
      }
    }
  },
  watch: {
    status () {
      this.reloadEncashments()
    },
    pagination: {
      handler () {
        if (! this.disablePagination) {
          this.getEncashments()
        }
      },
      deep: true
    },
    selectedAccount () {
      this.reloadEncashments()
    }
  },
  methods: {
    closeAddDialog () {
      this.addEncashmentForm = {}
      this.$refs.addEncashmentForm.resetValidation()
      this.addEncashmentDialog = false
    },
    async reloadEncashments () {
      this.disablePagination = true
      this.pagination.page = 1
      await this.getEncashments()
      this.disablePagination = false
    },
    async getEncashments () {
      try {
        this.loading = true
        const p = this.pagination
        const payload = {
          page: p.page, limit: p.itemsPerPage,
          meta_type: 'Encashment',
          account_id: this.selectedAccount ? this.selectedAccount.id : null
        }
        if (p.sortBy && p.sortBy.length > 0) {
          this.$set(payload, 'order_by', p.sortBy[0])
          this.$set(payload, 'order_desc', p.sortDesc[0] ? 1 : 0)
        }
        const encashments = await this.$axios.get('/user/transactions', { params: payload })
        this.encashments = encashments.data
      } catch (e) {
        this.showSnackbar('error', e.response ? e.response.data.message : e.message)
      } finally {
        this.loading = false
      }
    },
    async addEncashment () {
      if (this.$refs.addEncashmentForm.validate()) {
        try {
          this.submitting = true
          this.addEncashmentForm.account_id = this.selectedAccount.id
          await this.$axios.post('/user/transactions/encashment', this.addEncashmentForm)
          this.$refs.addEncashmentForm.resetValidation()
          this.addEncashmentForm = {}
          this.getEncashments()
          this.addEncashmentDialog = false
          this.showSnackbar('success', 'Encashment request has been submitted successfully.')
        } catch (e) {
          this.showSnackbar('error', e.response ? e.response.data.message : e.message)
        } finally {
          this.submitting = false
        }
      }
    }
  }
}
</script>
