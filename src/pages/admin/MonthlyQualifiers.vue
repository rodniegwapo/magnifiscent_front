<template>
  <div class="pa-6">
    <v-data-table
      :loading="loading"
      :headers="headers"
      :items="users.data"
      :options.sync="pagination"
      :footer-props="{
        itemsPerPageOptions: itemsPerPageOptions
      }"
      :server-items-length="users.meta ? users.meta.total : 0"
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
                @click="reloadUsers()"
                x-small fab color="primary" class="mr-3 elevation-0"
              >
                <v-icon class="black--text" small>fas fa-redo-alt</v-icon>
              </v-btn>
              <small>Monthly Qualifiers</small>
            </v-col>
            <v-col cols="12" md="4" sm="12" class="pa-2">
              <v-menu
                v-model="menu" ref="menu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y max-width="290px" min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="yearAndMonth"
                    dense dark outlined
                    label="Select Year and Month"
                    prepend-inner-icon="fas fa-calendar-alt"
                    readonly v-bind="attrs" v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  color="primary"
                  v-model="yearAndMonth"
                  @input="menu = false"
                  type="month" no-title scrollable
                >
                </v-date-picker>
              </v-menu>
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
          </v-row>
        </v-container>
      </template>
      <template v-slot:item.actions="{ item }">
        <div class="justify-center layout">
          <v-btn
            @click="$router.push(`account-summary/${item.id}/${year}/${month}`)"
            dark fab x-small
            class="elevation-0 blue"
          >
            <v-icon dark small>fas fa-file-alt</v-icon>
          </v-btn>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import _ from 'lodash'

export default {
  data: () => ({
    loading: true,
    menu: false,
    yearAndMonth: moment().format('YYYY-MM'),
    pagination: { page: 1, itemsPerPage: 10 },
    search: null,
    headers: [
      { text: 'Last Name', align: 'start', sortable: true, value: 'last_name' },
      { text: 'First Name', align: 'start', sortable: true, value: 'first_name' },
      { text: 'Middle Name', align: 'start', sortable: true, value: 'middle_name' },
      { text: 'Username', align: 'start', sortable: true, value: 'username' },
      { text: 'Total Accounts', align: 'center', sortable: false, value: 'total_accounts' },
      { text: 'Total Qualified Accounts', align: 'center', sortable: false, value: 'total_qualified_accounts' },
      { text: 'Actions', align: 'center', sortable: false, value: 'actions' }
    ],
    users: {},
    disablePagination: false
  }),
  mounted () {
    this.getUsers()
  },
  computed: {
    ...mapGetters({
      itemsPerPageOptions: 'itemsPerPageOptions'
    }),
    year () {
      const year = this.date(this.yearAndMonth, 'YYYY')
      return parseInt(year)
    },
    month () {
      const month = this.date(this.yearAndMonth, 'MM')
      return parseInt(month)
    }
  },
  watch: {
    search: _.debounce(function () {
      this.reloadUsers()
    }, 500),
    pagination: {
      handler () {
        if (! this.disablePagination) {
          this.getUsers()
        }
      },
      deep: true
    },
    yearAndMonth () {
      this.reloadUsers()
    }
  },
  methods: {
    async reloadUsers () {
      this.disablePagination = true
      this.pagination.page = 1
      await this.getUsers()
      this.disablePagination = false
    },
    async getUsers () {
      try {
        this.loading = true
        const p = this.pagination
        const payload = {
          page: p.page, limit: p.itemsPerPage,
          year: this.year,
          month: this.month,
          search: this.search
        }
        if (p.sortBy && p.sortBy.length > 0) {
          this.$set(payload, 'order_by', p.sortBy[0])
          this.$set(payload, 'order_desc', p.sortDesc[0] ? 1 : 0)
        }
        const users = await this.$axios.get('/admin/users-monthly-qualifiers', { params: payload })
        this.users = users.data
      } catch (e) {
        this.showSnackbar('error', e.response ? e.response.data.message : e.message)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
