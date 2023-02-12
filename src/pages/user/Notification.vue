<template>
  <div class="pa-6">
    <v-data-table
      :loading="loading"
      :headers="headers"
      :items="notifications.data"
      :options.sync="pagination"
      :footer-props="{
        itemsPerPageOptions: itemsPerPageOptions
      }"
      :server-items-length="notifications.meta ? notifications.meta.total : 0"
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
                @click="reloadNotifications"
                x-small fab color="primary" class="mr-3 elevation-0"
              >
                <v-icon class="black--text" small>fas fa-redo-alt</v-icon>
              </v-btn>
              <small>Notifications</small>
            </v-col>
          </v-row>
        </v-container>
      </template>
      <template v-slot:item.created_at="{ item }">
        {{ item.created_at ? date(item.created_at, 'MMMM D, YYYY - hh:mm a') : '' }}
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
      { text: 'Message', align: 'start', sortable: true, value: 'message' },
      { text: 'Date Notified', align: 'start', sortable: true, value: 'created_at' }
    ],
    notifications: {}
  }),
  mounted () {
    this.getNotifications()
  },
  computed: {
    ...mapGetters({
      itemsPerPageOptions: 'itemsPerPageOptions'
    })
  },
  watch: {
    pagination: {
      handler () {
        if (! this.disablePagination) {
          this.getNotifications()
        }
      },
      deep: true
    }
  },
  methods: {
    async reloadNotifications () {
      this.disablePagination = true
      this.pagination.page = 1
      await this.getNotifications()
      this.disablePagination = false
    },
    async getNotifications () {
      try {
        this.loading = true
        const payload = {
          page: this.pagination.page,
          limit: this.pagination.itemsPerPage, search: this.search
        }
        if (this.pagination.sortBy && this.pagination.sortBy.length > 0) {
          this.$set(payload, 'order_by', this.pagination.sortBy[0])
          this.$set(payload, 'order_desc', this.pagination.sortDesc[0] ? 1 : 0)
        }
        const notifications = await this.$axios.get('/user/notifications', { params: payload })
        this.notifications = notifications.data
      } catch (e) {
        this.showSnackbar('error', e.response ? e.response.data.message : e.message)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
