<template>
  <div class="pa-6">
    <v-card color="basil">
      <v-card-title class="text-center py-6 primary--text headline">
        <v-btn
          @click="parentDepth = 0, getTableOfExit()"
          x-small fab color="primary" class="mr-3 elevation-0"
        >
          <v-icon class="black--text" small>fas fa-redo-alt</v-icon>
        </v-btn>
        Table of Exit
        <v-spacer />
        <span class="white--text">
          <span class="primary--text pr-2">₱</span>
          {{ money(selectedToe.value) }}
        </span>
      </v-card-title>
      <v-tabs
        v-model="tab"
        background-color="primary"
        grow center-active
        slider-color="black"
      >
        <v-tab
          v-for="(item, index) in tableOfExits" :key="index"
          :class="[
            'white--text',
            tabColors[index],
            index > (tableOfExit.latest_table_no - 1) || (loading && index > 0) ? 'pointer-events-none' : ''
          ]"
        >
          {{ item.name }}
        </v-tab>
      </v-tabs>
      <div>
        <v-card v-if="!loading" flat class="pa-5">
          <v-card-title class="px-2 pt-2 pb-6">
            <v-btn
              @click="parentDepth += 1, getTableOfExit()"
              :disabled="! tableOfExit.has_parent_same_level"
              class="primary black--text" small
            >View Previous Table</v-btn>
          </v-card-title>
          <v-card-text>
            <v-row >
              <v-col cols="12" class="pa-1">
                <table-of-exit-seat
                  :seat="tableOfExit.position1"
                  :color="tabColors[tab]"
                  @click-profile="selectedSeat = tableOfExit.position1, showAccountDialog = true"
                />
              </v-col>
              <v-col cols="12" md="6" sm="12" class="pa-1">
                <table-of-exit-seat
                  :seat="tableOfExit.position2"
                  :color="tabColors[tab]"
                  @click-profile="selectedSeat = tableOfExit.position2, showAccountDialog = true"
                />
              </v-col>
              <v-col cols="12" md="6" sm="12" class="pa-1">
                <table-of-exit-seat
                  :seat="tableOfExit.position3"
                  :color="tabColors[tab]"
                  @click-profile="selectedSeat = tableOfExit.position3, showAccountDialog = true"
                />
              </v-col>
              <v-col cols="12" md="3" sm="12" class="pa-1">
                <table-of-exit-seat
                  :seat="tableOfExit.position4"
                  :color="tabColors[tab]"
                  @click-profile="selectedSeat = tableOfExit.position4, showAccountDialog = true"
                />
              </v-col>
              <v-col cols="12" md="3" sm="12" class="pa-1">
                <table-of-exit-seat
                  :seat="tableOfExit.position5"
                  :color="tabColors[tab]"
                  @click-profile="selectedSeat = tableOfExit.position5, showAccountDialog = true"
                />
              </v-col>
              <v-col cols="12" md="3" sm="12" class="pa-1">
                <table-of-exit-seat
                  :seat="tableOfExit.position6"
                  :color="tabColors[tab]"
                  @click-profile="selectedSeat = tableOfExit.position6, showAccountDialog = true"
                />
              </v-col>
              <v-col cols="12" md="3" sm="12" class="pa-1">
                <table-of-exit-seat
                  :seat="tableOfExit.position7"
                  :color="tabColors[tab]"
                  @click-profile="selectedSeat = tableOfExit.position7, showAccountDialog = true"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <div v-else style="min-height: 580px;">
          <page-loading style="margin-top: -100px;" />
        </div>
      </div>
    </v-card>
    <v-dialog
      v-model="showAccountDialog" width="550px"
      overlay-opacity="0.6"
      overlay-color="grey"
    >
      <v-card dark>
        <v-card-title class="pb-8">
          <v-icon class="mr-2" color="primary">fas fa-user</v-icon>
          <span class="headline primary--text"><small>Account Information</small></span>
          <v-spacer />
          <v-btn
            @click="showAccountDialog = false"
            fab text small
            color="primary"
          >
            <v-icon>fas fa-times</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text v-if="selectedSeat && selectedSeat.user">
          <div class="text-center mb-7">
            <v-avatar class="success" size="150">
              <span v-if="selectedSeat.user.first_name && ! selectedSeat.user.avatar" class="white--text text-h3">
                {{ selectedSeat.user.first_name.substr(0, 1) + selectedSeat.user.last_name.substr(0, 1) }}
              </span>
              <img
                v-else alt="avatar"
                class="success"
                :src="selectedSeat.user.avatar"
              />
            </v-avatar>
          </div>
          <table class="w-full">
            <tr>
              <td class="py-2"><b>Account Name</b></td>
              <td class="py-2"> {{ selectedSeat.user.username + ' ' + selectedSeat.name }} </td>
            </tr>
            <tr>
              <td class="py-2"><b>First Name</b></td>
              <td class="py-2"> {{ selectedSeat.user.first_name }} </td>
            </tr>
            <tr>
              <td class="py-2"><b>Middle Name</b></td>
              <td class="py-2"> {{ selectedSeat.user.middle_name }} </td>
            </tr>
            <tr>
              <td class="py-2"><b>Last Name</b></td>
              <td class="py-2"> {{ selectedSeat.user.last_name }} </td>
            </tr>
            <tr>
              <td class="py-2"><b>Username</b></td>
              <td class="py-2"> {{ selectedSeat.user.username }} </td>
            </tr>
            <tr>
              <td class="py-2"><b>Email</b></td>
              <td class="py-2"> {{ selectedSeat.user.email }} </td>
            </tr>
            <tr>
              <td class="py-2"><b>Mobile Number</b></td>
              <td class="py-2"> {{ selectedSeat.user.mobile_no }} </td>
            </tr>
          </table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showAccountDialog = false">
            <b>Close</b>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PageLoading from '@/components/PageLoading'
import TableOfExitSeat from '@/components/TableOfExitSeat'

export default {
  components: {
    PageLoading,
    TableOfExitSeat
  },
  data: () => ({
    tab: null,
    showAccountDialog: false,
    loading: true,
    selectedToe: {},
    selectedSeat: {},
    tableOfExit: {},
    parentDepth: 0,
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    tabColors: ['blue darken-3', 'orange darken-3', 'teal', 'deep-purple darken-1', 'red darken-3']
  }),
  mounted () {
    this.getTableOfExit()
  },
  computed: {
    ...mapGetters({
      selectedAccount: 'selectedAccount',
      tableOfExits: 'tableOfExits'
    })
  },
  watch: {
    tab (newV) {
      this.selectedToe = this.tableOfExits[newV]
      this.parentDepth = 0
      this.getTableOfExit()
    },
    selectedAccount () {
      this.tab = 0
      this.parentDepth = 0
      this.getTableOfExit()
    }
  },
  methods: {
    async getTableOfExit () {
      if (this.selectedToe.level) {
        try {
          this.loading = true
          const tableOfExit = await this.$axios.get('/user/table-of-exits', {
            params: {
              account_id: this.selectedAccount.id, table_level: this.selectedToe.level,
              parent_depth: this.parentDepth
            }
          })
          this.tableOfExit = tableOfExit.data.data
        } catch (e) {
          this.tableOfExit = {}
        } finally {
          this.loading = false
        }
      }
    }
  }
}
</script>
