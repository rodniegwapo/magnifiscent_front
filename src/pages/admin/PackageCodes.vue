<template>
  <div class="pa-6">
    <v-data-table
      :loading="loading"
      :headers="headers"
      :items="packageCodes.data"
      :options.sync="pagination"
      :footer-props="{
        itemsPerPageOptions: itemsPerPageOptions
      }"
      :server-items-length="packageCodes.meta ? packageCodes.meta.total : 0"
      class="elevation-1 overflow-hidden" dark
    >
      <template v-slot:top>
        <v-container
          class="grey darken-4 elevation-1 pt-6 px-7"
          style="max-width: 100%!important;"
        >
          <v-row>
            <v-col cols="12" md="9" sm="12" class="primary--text headline">
              <v-btn
                @click="reloadPackageCodes()"
                x-small fab color="primary" class="mr-3 elevation-0"
              >
                <v-icon class="black--text" small>fas fa-redo-alt</v-icon>
              </v-btn>
              <small>Package Code Management</small>
            </v-col>
            <v-col cols="12" md="3" sm="12" class="pa-2">
              <v-btn
                @click="exportPackageCodes"
                :loading="exporting"
                :disabled="exporting"
                class="elevation-1 black--text"
                color="primary" block
              >
                <v-icon small class="mr-2">fas fa-file-export</v-icon>
                Export
              </v-btn>
            </v-col>
            <v-col cols="12">
              <v-row>
                <v-col cols="12" md="3" sm="12" class="py-2">
                  <v-autocomplete
                    v-model="sellerId"
                    :items="sellers"
                    :search-input.sync="searchSellerValue"
                    :loading="searchingSeller"
                    persistent-hint
                    item-text="full_name"
                    item-value="id" cache-items
                    label="Seller" clearable
                    prepend-inner-icon="fas fa-user"
                    dense outlined dark
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" md="3" sm="12" class="py-2">
                  <v-autocomplete
                    v-model="userId"
                    :items="users"
                    :search-input.sync="searchUserValue"
                    :loading="searchingUser"
                    item-text="full_name"
                    item-value="id" cache-items
                    label="Claimed By" clearable
                    prepend-inner-icon="fas fa-user"
                    dense outlined dark
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" md="3" sm="12" class="py-2">
                  <v-select
                    v-model="status"
                    :disabled="loading"
                    prepend-inner-icon="fas fa-cubes"
                    :items="[
                      { text: 'Available', value: 0 },
                      { text: 'Claimed', value: 1  }
                    ]"
                    label="Status"
                    clearable dense dark outlined
                  ></v-select>
                </v-col>
                <v-col cols="12" md="3" sm="12" class="pa-2">
                  <v-btn
                    @click="addPackageCodesDialog = true, searchSellerValue = null"
                    class="elevation-1 black--text"
                    color="primary" block
                  >
                    <v-icon small class="mr-2">fas fa-plus</v-icon>
                    Add Package Code(s)
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </template>
      <template v-slot:item.claimed_at="{ item }">
        {{ item.claimed_at ? date(item.claimed_at, 'MMMM D, YYYY - hh:mm a') : '' }}
      </template>
      <template v-slot:item.status="{ item }">
        <v-chip
          dark :color="item.claimed ? 'red' : 'green'"
          class="text-capitalize"
        >{{ item.claimed ? 'Claimed' : 'Available' }}</v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <div class="justify-center layout">
          <v-tooltip :value="showCodeTooltip === item.id" top>
            <template v-slot:activator="{ attrs }">
              <v-btn
                color="primary" v-bind="attrs" small
                class="elevation-0 ml-3 rounded-pill black--text"
                @click="copyCode(item.code, item.id)"
              >
                Copy
              </v-btn>
            </template>
            <span>Code Copied !</span>
          </v-tooltip>
        </div>
      </template>
    </v-data-table>
    <!-- Add Package Code(s) Dialog -->
    <v-dialog
      v-model="addPackageCodesDialog" persistent max-width="500px"
      overlay-opacity="0.6"
      overlay-color="grey"
    >
      <v-form lazy ref="addPackageCodesForm" @submit.prevent="addPackageCodes">
        <v-card dark>
          <v-card-title class="pb-8">
            <v-icon class="mr-2" color="primary">fas fa-cubes</v-icon>
            <span class="headline primary--text"><small>Add Package Code(s)</small></span>
            <v-spacer />
            <v-btn
              :disabled="submitting"
              @click="$refs.addPackageCodesForm.reset(), addPackageCodesDialog = false, searchSellerValue2 = null"
              fab text small
              color="primary"
            >
              <v-icon>fas fa-times</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  v-model="addPackageCodesForm.seller_id"
                  :items="sellers"
                  :search-input.sync="searchSellerValue2"
                  :loading="searchingSeller2"
                  persistent-hint cache-items
                  item-text="full_name"
                  item-value="id"
                  :rules="[ v => !!v || 'Seller is required.' ]"
                  label="Seller" clearable
                  prepend-inner-icon="fas fa-user"
                  dense outlined dark
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model.number="addPackageCodesForm.no_of_codes"
                  :rules="[
                    v => !!v || 'Number of codes is required.',
                    v => v <= 10000 || 'Maximum package codes to be created is 10000.'
                  ]"
                  label="Number of Codes"
                  prepend-inner-icon="fas fa-cubes"
                  outlined flat dense
                  type="number" class="required"
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="pt-0">
            <v-spacer></v-spacer>
            <v-btn
              @click="$refs.addPackageCodesForm.reset(), addPackageCodesDialog = false, searchSellerValue2 = null"
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
    <!-- Copy to Clipboard -->
    <div id="copy-code"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  data: () => ({
    loading: false,
    status: 0,
    code: '',
    sellerId: null,
    searchingSeller: false,
    searchSellerValue: null,
    searchingSeller2: false,
    searchSellerValue2: null,
    userId: null,
    searchingUser: false,
    searchUserValue: null,
    search: null,
    showCodeTooltip: null,
    packageCodes: {},
    addPackageCodesForm: {},
    sellers: [],
    users: [],
    exporting: false,
    addPackageCodesDialog: false,
    submitting: false,
    disablePagination: false,
    pagination: { page: 1, itemsPerPage: 10 },
    headers: [
      { text: 'Code', align: 'start', sortable: true, value: 'code' },
      { text: 'Date Claimed', align: 'start', sortable: true, value: 'claimed_at' },
      { text: 'Claimed By', align: 'start', sortable: false, value: 'claimed_by' },
      { text: 'Status', align: 'start', sortable: false, value: 'status' },
      { text: 'Actions', align: 'center', sortable: false, value: 'actions' }
    ]
  }),
  async mounted () {
    await this.searchSeller()
    await this.searchUser()
    this.getPackageCodes()
  },
  computed: {
    ...mapGetters({
      itemsPerPageOptions: 'itemsPerPageOptions'
    })
  },
  watch: {
    searchSellerValue: _.debounce(function () {
      this.searchSeller()
    }, 500),
    searchSellerValue2: _.debounce(function () {
      this.searchSeller2()
    }, 500),
    searchUserValue: _.debounce(function () {
      this.searchUser()
    }, 500),
    sellerId () {
      this.reloadPackageCodes()
    },
    userId () {
      this.reloadPackageCodes()
    },
    status () {
      this.reloadPackageCodes()
    },
    search: _.debounce(function () {
      this.reloadPackageCodes()
    }, 500),
    pagination: {
      handler () {
        if (! this.disablePagination) {
          this.getPackageCodes()
        }
      },
      deep: true
    }
  },
  methods: {
    copyCode (text, id) {
      const el = document.createElement('input')
      el.value = text
      document.getElementById('copy-code').appendChild(el)
      el.select()
      document.execCommand('Copy')
      document.getElementById('copy-code').removeChild(el)
      this.showCodeTooltip = id
      setTimeout(() => {
        this.showCodeTooltip = null
      }, 1000)
    },
    async exportPackageCodes () {
      try {
        this.exporting = true
        const p = this.pagination
        const payload = {
          claimed: this.status,
          seller_id: this.sellerId,
          user_id: this.userId
        }
        if (p.sortBy && p.sortBy.length > 0) {
          this.$set(payload, 'order_by', p.sortBy[0])
          this.$set(payload, 'order_desc', p.sortDesc[0] ? 1 : 0)
        }
        const res = await this.$axios.post('/admin/encryption/package-codes', payload)
        const link = process.env.VUE_APP_API_ENDPOINT + '/export/package-codes/' + res.data.data
        window.open(link)
      } catch (e) {
        this.showSnackbar('error', e.response ? e.response.data.message : e.message)
      } finally {
        this.exporting = false
      }
    },
    async reloadPackageCodes () {
      this.disablePagination = true
      this.pagination.page = 1
      await this.getPackageCodes()
      this.disablePagination = false
    },
    async searchSeller () {
      try {
        this.searchingSeller = true
        const sellers = await this.$axios.get('/admin/users', {
          params: {
            search: this.searchSellerValue,
            page: 1, limit: 10, role_slug: 'seller'
          }
        })
        this.sellers = sellers.data.data
      } catch (e) {
        this.showSnackbar('error', e.response ? e.response.data.message : e.message)
      } finally {
        this.searchingSeller = false
      }
    },
    async searchSeller2 () {
      try {
        this.searchingSeller2 = true
        const sellers = await this.$axios.get('/admin/users', {
          params: {
            search: this.searchSellerValue2,
            page: 1, limit: 10, role_slug: 'seller'
          }
        })
        this.sellers = sellers.data.data
      } catch (e) {
        this.showSnackbar('error', e.response ? e.response.data.message : e.message)
      } finally {
        this.searchingSeller2 = false
      }
    },
    async searchUser () {
      try {
        this.searchingUser = true
        const users = await this.$axios.get('/admin/users', {
          params: {
            search: this.searchUserValue,
            page: 1, limit: 10, role_slug: 'user'
          }
        })
        this.users = users.data.data
      } catch (e) {
        this.showSnackbar('error', e.response ? e.response.data.message : e.message)
      } finally {
        this.searchingUser = false
      }
    },
    async getPackageCodes () {
      try {
        this.loading = true
        const p = this.pagination
        const payload = {
          page: p.page, limit: p.itemsPerPage,
          claimed: this.status,
          seller_id: this.sellerId,
          user_id: this.userId
        }
        if (p.sortBy && p.sortBy.length > 0) {
          this.$set(payload, 'order_by', p.sortBy[0])
          this.$set(payload, 'order_desc', p.sortDesc[0] ? 1 : 0)
        }
        const packageCodes = await this.$axios.get('/admin/package-codes', { params: payload })
        this.packageCodes = packageCodes.data
      } catch (e) {
        this.showSnackbar('error', e.response ? e.response.data.message : e.message)
      } finally {
        this.loading = false
      }
    },
    async addPackageCodes () {
      if (this.$refs.addPackageCodesForm.validate()) {
        try {
          this.submitting = true
          await this.$axios.post('/admin/package-codes', this.addPackageCodesForm)
          this.getPackageCodes()
          this.showSnackbar('success', this.addPackageCodesForm.no_of_codes + ' package codes created successfully.')
          this.$refs.addPackageCodesForm.reset()
          this.addPackageCodesDialog = false
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
