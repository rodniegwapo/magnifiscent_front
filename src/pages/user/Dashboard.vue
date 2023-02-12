<template>
  <div>
    <template v-if="! loading && summary">
      <div class="px-6 pb-6">
        <div class="pt-5">
          <div class="d-flex text-uppercase pb-5 pt-3 tracking-widest text-2xl font-weight-bold text-shadow">
            Announcement !
            <v-spacer />
            <v-btn
              @click="getSummary()"
              x-small fab color="primary" class="mr-3 elevation-0"
            >
              <v-icon class="black--text" small>fas fa-redo-alt</v-icon>
            </v-btn>
          </div>
          <v-carousel
            cycle :show-arrows="false"
            height="350" continuous
            hide-delimiter-background
            class="rounded small-delimeter" dark
            interval="15000"
          >
            <v-carousel-item
              v-for="(ann, index) in summary.announcements && summary.announcements.length > 0
                ? summary.announcements : noAnnouncement"
              :key="index"
            >
              <v-sheet height="100%" dark>
                <v-card flat style="height: 300px; overflow: auto;">
                  <v-card-title>
                    {{ ann.title }}
                  </v-card-title>
                  <template v-if="ann.created_at">
                    <v-list-item-title class="px-4 primary--text">
                      {{ date(ann.created_at, 'MMMM D, YYYY - hh:mm a') }}
                    </v-list-item-title>
                    <v-card-text v-html="ann.description" class="control-image"></v-card-text>
                  </template>
                </v-card>
              </v-sheet>
            </v-carousel-item>
          </v-carousel>
        </div>
        <div class="d-flex text-uppercase pb-5 pt-3 tracking-widest text-2xl font-weight-bold text-shadow">
          Commissions
        </div>
        <v-row>
          <v-col
            v-for="(com, index) in summary.commissions ? summary.commissions : []"
            :key="index" cols="12" :md="index < 3 ? 4 : 6" sm="12"
          >
            <v-card dark>
              <v-card-title class="text-4xl d-flex justify-center">
                <span class="primary--text pr-2">₱</span>
                {{ money(com.value) }}
              </v-card-title>
              <v-card-text
                :class="com.name === 'Total Commission'
                  ? 'primary--text' : (com.name === 'Available Commission' ? 'success--text' : '')"
                class="text-center text-button"
              >
                {{ com.name }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <div class="text-uppercase py-5 tracking-widest text-2xl font-weight-bold text-shadow">
          Overall
        </div>
        <v-row>
          <v-col
            v-for="(ov, index) in summary.overall ? summary.overall : []"
            :key="index" cols="12" md="6" sm="12"
          >
            <v-card dark>
              <v-card-title class="text-4xl d-flex justify-center">
                <span class="primary--text pr-2">₱</span>
                {{ money(ov.value) }}
              </v-card-title>
              <v-card-text class="text-center text-button">
                {{ ov.name }}
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
            :key="index" cols="12" md="4" sm="12"
          >
            <v-card dark>
              <v-card-title class="text-4xl d-flex justify-center">
                <template v-if="ms.name === 'Total Monthly Sharing Amount'">
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
      </div>
    </template>
    <div v-else>
      <page-loading style="margin-top: -80px;"/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PageLoading from '@/components/PageLoading'

export default {
  components: {
    PageLoading
  },
  data: () => ({
    loading: true,
    summary: {},
    noAnnouncement: [
      { title: 'There is no announcement yet.', description: '' }
    ]
  }),
  mounted () {
    this.getSummary()
  },
  computed: {
    ...mapGetters({
      selectedAccount: 'selectedAccount'
    })
  },
  watch: {
    selectedAccount () {
      this.getSummary()
    }
  },
  methods: {
    async getSummary () {
      try {
        this.loading = true
        const accountId = this.selectedAccount ? ('/' + this.selectedAccount.id) : ''
        const summary = await this.$axios.get('/user/dashboard' + accountId)
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
