<template>
  <div class="pa-6">
    <v-card dark class="mb-6">
      <v-card-title class="text-4xl d-flex justify-center">
        <span class="primary--text pr-2">₱</span>
        {{ money(encashments.meta ? encashments.meta.total_unpaid : 0) }}
      </v-card-title>
      <v-card-text class="text-center text-button">
        Total Unpaid
      </v-card-text>
    </v-card>
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
            <v-col cols="12" md="4" sm="12" class="primary--text headline">
              <v-btn
                @click="reloadEncashments()"
                x-small fab color="primary" class="mr-3 elevation-0"
              >
                <v-icon class="black--text" small>fas fa-redo-alt</v-icon>
              </v-btn>
              <small>Encashment Management</small>
            </v-col>
            <v-col cols="12" md="4" sm="12" class="pa-2">
              <div>
                <v-text-field
                  v-model="search"
                  :disabled="loading"
                  label="Search User..."
                  prepend-inner-icon="fas fa-user"
                  outlined color="primary"
                  clearable flat dense dark
                  type="text"
                ></v-text-field>
              </div>
            </v-col>
            <v-col cols="12" md="4" sm="12" class="py-2">
              <v-select
                v-model="status"
                :disabled="loading"
                prepend-inner-icon="fas fa-money-check"
                :items="[
                  { text: 'Paid', value: 'paid' },
                  { text: 'Unpaid', value: 'unpaid' }
                ]"
                label="Status"
                dense dark outlined
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </template>
      <template v-slot:item.full_name="{ item }">
        {{ item.first_name }}
        <span v-show="item.middle_name">{{ item.middle_name }}</span>
        {{ item.last_name }}
      </template>
      <template v-slot:item.amount="{ item }">
        <span class="primary--text text-button" style="font-size: 18px!important;">₱</span>
        {{ money(item.encashment_details.net_amount) }}
      </template>
      <template v-slot:item.encashment_details.bank_account="{ item }">
        <span class="primary--text">{{ item.encashment_details.bank_account }}</span>
      </template>
      <template v-slot:item.status="{ item }">
        <div class="justify-center layout">
          <v-switch
            @click="showConfirmDialog(item)"
            color="success darken-1"
            :input-value="status === 'paid'"
            :success="status === 'paid'"
            :disabled="status === 'paid' || loading"
            readonly
          ></v-switch>
          <v-chip
            small dark class="mt-5 text-capitalize"
            :class="status === 'paid' ? 'success' : 'primary black--text'"
          >
            {{ status }}
          </v-chip>
        </div>
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
            <v-card-text v-if="selectedEncashment && selectedEncashment.encashment_details">
              <table class="w-full">
                <tr>
                  <td class="py-1">Requested By</td>
                  <td class="py-1 white--text">
                    {{ selectedEncashment.first_name }}
                    <span v-show="selectedEncashment.middle_name">{{ selectedEncashment.middle_name }}</span>
                    {{ selectedEncashment.last_name }}
                  </td>
                </tr>
                <tr>
                  <td class="py-1">Payment Channel</td>
                  <td class="py-1 white--text">{{ selectedEncashment.encashment_details.payment_channel }}</td>
                </tr>
                <tr v-if="selectedEncashment.encashment_details.bank_account">
                  <td class="py-1">Bank Account</td>
                  <td class="py-1 primary--text">{{ selectedEncashment.encashment_details.bank_account }}</td>
                </tr>
                <tr>
                  <td class="py-1">Mobile Number</td>
                  <td class="py-1 white--text">{{ selectedEncashment.mobile_no }}</td>
                </tr>
                <tr>
                  <td class="py-1">Amount</td>
                  <td class="py-1 white--text">
                    <span class="primary--text text-button" style="font-size: 18px!important;">₱</span>
                    {{ money(selectedEncashment.encashment_details.amount) }}
                  </td>
                </tr>
                <tr>
                  <td class="py-1">Tax</td>
                  <td class="py-1 white--text">
                    <span class="red--text text-button" style="font-size: 18px!important;">₱</span>
                    {{ money(selectedEncashment.encashment_details.tax_fee) }}
                  </td>
                </tr>
                <tr>
                  <td class="py-1">Admin Fee</td>
                  <td class="py-1 white--text">
                    <span class="red--text text-button" style="font-size: 18px!important;">₱</span>
                    {{ money(selectedEncashment.encashment_details.admin_fee) }}
                  </td>
                </tr>
                <tr>
                  <td class="py-1">Net Amount</td>
                  <td class="py-1 white--text">
                    <span class="primary--text text-button" style="font-size: 18px!important;">₱</span>
                    {{ money(selectedEncashment.encashment_details.net_amount) }}
                  </td>
                </tr>
                <tr>
                  <td class="py-1">Status</td>
                  <td class="py-1 text-capitalize" :class="status === 'paid' ? 'success--text' : 'primary--text'">
                    <v-chip
                      small dark class="mt-5 text-capitalize"
                      :class="status === 'paid' ? 'success' : 'primary black--text'"
                    >
                      {{ status }}
                    </v-chip>
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
    <!-- Toogle User Is Block Dialog -->
    <v-dialog
      v-model="approveEncashmentDialog" max-width="290"
      overlay-opacity="0.6"
      overlay-color="grey"
    >
      <v-card dark>
        <v-card-title class="headline">Are you sure ?</v-card-title>
        <v-card-text>
          This encashment will be paid.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary" text
            :disabled="submitting"
            @click="approveEncashmentDialog = false"
          >
            <b>Cancel</b>
          </v-btn>
          <v-btn
            color="primary" text
            :loading="submitting"
            :disabled="submitting"
            @click="approveEncashment"
          >
            <b>Confirm</b>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  data: () => ({
    showEncashmentDialog: false,
    approveEncashmentDialog: false,
    search: '',
    loading: true,
    submitting: false,
    pagination: { page: 1, itemsPerPage: 10 },
    selectedEncashment: {},
    errors: {},
    status: 'unpaid',
    users: [],
    headers: [
      { text: 'Requested By', align: 'start', sortable: false, value: 'full_name' },
      { text: 'Mobile No.', align: 'start', sortable: false, value: 'mobile_no', width: '120px' },
      { text: 'Payment Channel', align: 'start', sortable: false, value: 'encashment_details.payment_channel' },
      { text: 'Bank Account', align: 'start', sortable: false, value: 'encashment_details.bank_account' },
      { text: 'Net Amount', align: 'start', sortable: false, value: 'amount', width: '120px' },
      { text: 'Status', align: 'center', sortable: false, value: 'status', width: '120px' },
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
      itemsPerPageOptions: 'itemsPerPageOptions'
    })
  },
  watch: {
    status () {
      this.reloadEncashments()
    },
    userId () {
      this.reloadEncashments()
    },
    search: _.debounce(function () {
      this.reloadEncashments()
    }, 500),
    pagination: {
      handler () {
        if (! this.disablePagination) {
          this.getEncashments()
        }
      },
      deep: true
    }
  },
  methods: {
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
          status: this.status, user_id: this.userId,
          search: this.search
        }
        const encashments = await this.$axios.get('/admin/encashments/users', { params: payload })
        this.encashments = encashments.data
      } catch (e) {
        this.showSnackbar('error', e.response ? e.response.data.message : e.message)
      } finally {
        this.loading = false
      }
    },
    showConfirmDialog (item) {
      if (this.status === 'unpaid') {
        this.selectedEncashment = item
        this.approveEncashmentDialog = true
      }
    },
    async approveEncashment () {
      try {
        this.submitting = true
        await this.$axios.put('/admin/encashments/mark-as-paid/' + this.selectedEncashment.id)
        this.getEncashments()
        this.approveEncashmentDialog = false
        this.showSnackbar('success', 'Encashment has been paid successfully.')
      } catch (e) {
        this.showSnackbar('error', e.response ? e.response.data.message : e.message)
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>
