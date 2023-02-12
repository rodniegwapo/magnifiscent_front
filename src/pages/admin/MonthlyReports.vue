<template>
  <div>
    <template v-if="! loading">
      <div class="px-6 pb-6">
        <div class="d-flex text-uppercase pb-5 pt-5 tracking-widest text-2xl font-weight-bold text-shadow">
          <v-row>
            <v-col cols="12" md="6" sm="12"> Sales </v-col>
            <v-col cols="12" md="6" sm="12" class="d-flex">
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
              <v-btn
                @click="getSummary()"
                x-small fab color="primary" class="ml-3 elevation-0"
              >
                <v-icon class="black--text" small>fas fa-redo-alt</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </div>
        <v-row>
          <v-col
            v-for="(sale, index) in summary.sales ? summary.sales : []"
            :key="index" cols="12" md="4" sm="12"
          >
            <v-card dark>
              <v-card-title class="text-4xl d-flex justify-center">
                <span class="primary--text pr-2">₱</span>
                {{ money(sale.value) }}
              </v-card-title>
              <v-card-text class="text-center text-button">
                {{ sale.name }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <div class="text-uppercase py-5 tracking-widest text-2xl font-weight-bold text-shadow">
          Deductions
        </div>
        <v-row>
          <v-col
            v-for="(ded, index) in summary.deductions ? summary.deductions : []"
            :key="index" cols="12" :md="index >= 3 ? '6' : '4'" sm="12"
          >
            <v-card dark>
              <v-card-title class="text-4xl d-flex justify-center">
                <span class="primary--text pr-2">₱</span>
                {{ money(ded.value) }}
              </v-card-title>
              <v-card-text class="text-center text-button">
                {{ ded.name }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <div class="text-uppercase py-5 tracking-widest text-2xl font-weight-bold text-shadow">
          Encashments
        </div>
        <v-row>
          <v-col
            v-for="(encashment, index) in summary.encashments ? summary.encashments : []"
            :key="index" cols="12" md="6" sm="12"
          >
            <v-card dark>
              <v-card-title class="text-4xl d-flex justify-center">
                <span class="primary--text pr-2">₱</span>
                {{ money(encashment.value) }}
              </v-card-title>
              <v-card-text
                class="text-center text-button"
                :class="{ 'primary--text': encashment.name === 'Total' }"
              >
                {{ encashment.name }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <div class="text-uppercase py-5 tracking-widest text-2xl font-weight-bold text-shadow">
          Monthly Sharing (BOD)
        </div>
        <v-row>
          <v-col
            v-for="(ms, index) in summary.monthly_sharing ? summary.monthly_sharing : []"
            :key="index" cols="12" md="6" sm="12"
          >
            <v-card dark>
              <v-card-title class="text-4xl d-flex justify-center">
                  <span class="primary--text pr-2">₱</span>
                  {{ money(ms.value) }}
              </v-card-title>
              <v-card-text class="primary--text text-center text-button">
                {{ ms.name }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </template>
    <div v-else>
      <page-loading style="margin-top: -80px;"/>
    </div>
  </div>
</template>

<script>
import PageLoading from '@/components/PageLoading'
import moment from 'moment'

export default {
  components: {
    PageLoading
  },
  data: () => ({
    yearAndMonth: moment().format('YYYY-MM'),
    menu: false,
    loading: true,
    summary: {}
  }),
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
      this.getSummary()
    }
  },
  mounted () {
    this.getSummary()
  },
  methods: {
    async getSummary () {
      try {
        this.loading = true
        const summary = await this.$axios.get('/admin/monthly-reports', {
          params: {
            year: this.year,
            month: this.month
          }
        })
        this.summary = summary.data.data
      } catch (e) {
        this.showSnackbar('error', e.response ? e.response.data.message : e.message)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
