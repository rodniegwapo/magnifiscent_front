<template>
  <div class="pa-6">
    <v-data-table
      :loading="loading"
      :headers="headers"
      :items="topDistributors"
      :disable-pagination="true"
      :hide-default-footer="true"
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
                @click="getTopDistributors()"
                x-small fab color="primary" class="mr-3 elevation-0"
              >
                <v-icon class="black--text" small>fas fa-redo-alt</v-icon>
              </v-btn>
              <small>Top {{ top }} Distributors</small>
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
          </v-row>
        </v-container>
      </template>
      <template v-slot:item.rank="{ item, index }">
        <span class="primary--text text-button" style="font-size: 18px!important;">
          {{ index + 1 }}
        </span>
      </template>
      <template v-slot:item.total_income="{ item }">
        <span class="primary--text text-button" style="font-size: 18px!important;">₱</span>
        {{ money(item.total_income) }}
      </template>
    </v-data-table>
  </div>
</template>


<script>
import moment from 'moment'

export default {
  data: () => ({
    loading: false,
    menu: false,
    yearAndMonth: moment().format('YYYY-MM'),
    topDistributors: [],
    headers: [
      { text: 'Last Name', align: 'start', sortable: false, value: 'last_name' },
      { text: 'First Name', align: 'start', sortable: false, value: 'first_name' },
      { text: 'Middle Name', align: 'start', sortable: false, value: 'middle_name' },
      { text: 'Username', align: 'start', sortable: false, value: 'username' },
      { text: 'Rank', align: 'start', sortable: false, value: 'rank' },
      { text: 'Total Income', align: 'start', sortable: false, value: 'total_income' }
    ],
    top: 50
  }),
  mounted () {
    this.getTopDistributors()
  },
  computed: {
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
    yearAndMonth () {
      this.getTopDistributors()
    }
  },
  methods: {
    async getTopDistributors () {
      try {
        this.loading = true
        const res = await this.$axios.get('/admin/users-top-distributors', {
          params: {
            year: this.year,
            month: this.month,
            top: this.top
          }
        })
        this.topDistributors = res.data.data
      } catch (e) {
        this.showSnackbar('error', e.response ? e.response.data.message : e.message)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
