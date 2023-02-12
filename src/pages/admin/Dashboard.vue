<template>
  <div>
    <template v-if="! loading">
      <div class="px-6 pb-6">
        <div class="d-flex text-uppercase pb-5 pt-5 tracking-widest text-2xl font-weight-bold text-shadow">
          Sales
          <v-spacer />
          <v-btn
            @click="getSummary()"
            x-small fab color="primary" class="mr-3 elevation-0"
          >
            <v-icon class="black--text" small>fas fa-redo-alt</v-icon>
          </v-btn>
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
        <div class="text-uppercase py-5 tracking-widest text-2xl font-weight-bold text-shadow">Users</div>
        <v-row>
          <v-col
            v-for="(user, index) in summary.users ? summary.users : []"
            :key="index" cols="12" :md="user.name === 'Total' ? 12 : 4" sm="12"
          >
            <v-card dark>
              <v-card-title
                class="text-4xl d-flex justify-center"
              >
                {{ user.value }}
              </v-card-title>
              <v-card-text
                class="text-center text-button"
                :class="{ 'primary--text': user.name === 'Total' }"
              >
                {{ user.name }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <div class="text-uppercase py-5 tracking-widest text-2xl font-weight-bold text-shadow">
          Accounts
        </div>
        <v-row>
          <v-col
            v-for="(account, index) in summary.accounts ? summary.accounts : []"
            :key="index" cols="12" md="4" sm="12"
          >
            <v-card dark>
              <v-card-title
                class="text-4xl d-flex justify-center"
              >
                {{ account.value }}
              </v-card-title>
              <v-card-text
                class="text-center text-button"
                :class="{ 'primary--text': account.name === 'Total' }"
              >
                {{ account.name }}
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
            :key="index" cols="12" md="4" sm="12"
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
          Monthly Sharing Poll
        </div>
        <v-row>
          <v-col
            v-for="(ms, index) in summary.monthly_sharing ? summary.monthly_sharing : []"
            :key="index" cols="12" md="6" sm="12"
          >
            <v-card dark>
              <v-card-title class="text-4xl d-flex justify-center">
                <template v-if="ms.name !== 'Qualified Accounts'">
                  <span class="primary--text pr-2">₱</span>
                  {{ money(ms.value) }}
                </template>
                <span v-else>{{ ms.value }}</span>
              </v-card-title>
              <v-card-text class="text-center text-button">
                {{ ms.name }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <div class="text-uppercase py-5 tracking-widest text-2xl font-weight-bold text-shadow">
          Other Income/s
        </div>
        <v-row>
          <v-col
            v-for="(oi, index) in summary.other_income ? summary.other_income : []"
            :key="index" cols="12"
          >
            <v-card dark>
              <v-card-title class="text-4xl d-flex justify-center">
                  <span class="primary--text pr-2">₱</span>
                  {{ money(oi.value) }}
              </v-card-title>
              <v-card-text class="primary--text text-center text-button">
                {{ oi.name }}
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

export default {
  components: {
    PageLoading
  },
  data: () => ({
    loading: true,
    summary: {}
  }),
  mounted () {
    this.getSummary()
  },
  methods: {
    async getSummary () {
      try {
        this.loading = true
        const summary = await this.$axios.get('/admin/dashboard')
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
