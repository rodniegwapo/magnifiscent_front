<template>
  <div>
    <template v-if="! loading">
      <div class="px-6 pb-6">
        <div class="d-flex text-uppercase pb-5 pt-5 tracking-widest text-2xl font-weight-bold text-shadow">
          Package Codes
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
            v-for="(pc, index) in summary.package_codes ? summary.package_codes : []"
            :key="index" cols="12" md="4" sm="12"
          >
            <v-card dark>
              <v-card-title class="text-4xl d-flex justify-center">
                {{ pc.value }}
              </v-card-title>
              <v-card-text class="text-center text-button" :class="index === 2 ? 'blue--text' : ''">
                {{ pc.name }}
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
        const summary = await this.$axios.get('/seller/dashboard')
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
