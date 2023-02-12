<template>
  <div class="pa-6">
    <v-data-table
      :loading="loading"
      :headers="headers"
      :items="tickets.data"
      :options.sync="pagination"
      :footer-props="{
        itemsPerPageOptions: itemsPerPageOptions
      }"
      :server-items-length="tickets.meta ? tickets.meta.total : 0"
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
                @click="reloadTickets"
                x-small fab color="primary" class="mr-3 elevation-0"
              >
                <v-icon class="black--text" small>fas fa-redo-alt</v-icon>
              </v-btn>
              <small>Ticket Management</small>
            </v-col>
            <v-col cols="12" md="4" sm="12">
              <v-text-field
                v-model="search"
                :disabled="loading"
                label="Search Ticket..."
                prepend-inner-icon="fas fa-ticket-alt"
                outlined color="primary"
                clearable flat dense dark
                type="text"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="12">
              <v-select
                v-model="status"
                :disabled="loading"
                prepend-inner-icon="fas fa-ticket-alt"
                :items="[
                  { text: 'Pending', value: 'pending' },
                  { text: 'Active', value: 'active' },
                  { text: 'Closed', value: 'closed' }
                ]"
                label="Status"
                clearable dense dark outlined
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </template>
      <template v-slot:item.created_at="{ item }">
        {{ item.created_at ? date(item.created_at, 'MMMM D, YYYY - hh:mm a') : '' }}
      </template>
      <template v-slot:item.status="{ item }">
        <v-chip
          dark :color="ticketStatusColor(item.status)"
          class="text-capitalize"
        >{{ item.status }}</v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <div class="justify-center layout">
          <v-btn
            @click="selectedTicket = item, showTicketDialog = true"
            dark fab x-small
            class="elevation-0 blue"
          >
            <v-icon dark small>fas fa-search</v-icon>
          </v-btn>
          <v-btn
            @click="editTicketForm = Object.assign({}, item), editTicketDialog = true"
            dark fab x-small
            class="elevation-0 ml-2 yellow darken-3"
          >
            <v-icon dark small>fas fa-edit</v-icon>
          </v-btn>
          <v-btn
            @click="selectedTicket = item, deleteTicketDialog = true"
            dark fab x-small
            class="elevation-0 ml-2 red"
          >
            <v-icon dark small>fas fa-trash</v-icon>
          </v-btn>
        </div>
      </template>
    </v-data-table>
    <!-- Show Ticket Dialog -->
    <v-dialog
      v-model="showTicketDialog" persistent max-width="700px"
      overlay-opacity="0.6"
      overlay-color="grey"
    >
      <v-card dark>
        <v-card-title class="pb-8">
          <v-icon class="mr-2" color="primary">fas fa-bullhorn</v-icon>
          <span class="headline primary--text"><small>Ticket Information</small></span>
          <v-spacer />
          <v-btn
            :disabled="submitting"
            @click="showTicketDialog = false"
            fab text small color="primary"
          >
            <v-icon>fas fa-times</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-card class="px-0 elevation-0">
            <v-card-text>
              <ul class="no-bullets">
                <li class="py-2"> Issue </li>
                <li class="py-2 white--text"> {{ selectedTicket.issue }} </li>
                <li class="py-2"> Issued By </li>
                <li v-if="selectedTicket.user" class="py-2 white--text">
                  {{ selectedTicket.user.first_name + ' ' + selectedTicket.user.last_name }}
                  <span class="px-3">-</span>
                  {{ selectedTicket.user.username }}
                </li>
                <li class="py-2"> Description </li>
                <li class="py-2 white--text"> {{ selectedTicket.description }}</li>
                <li class="py-2"> Note </li>
                <li class="py-2 white--text"> {{ selectedTicket.note }} </li>
                <li class="py-2"> Image </li>
                <li class="py-2 white--text">
                  <v-btn
                    v-if="selectedTicket.image" @click="openImage(selectedTicket.image)"
                    class="primary black--text" small
                  >
                    Open Image
                  </v-btn>
                </li>
                <li class="py-2"> Date Reported </li>
                <li class="py-2 white--text"> {{ date(selectedTicket.created_at, 'MMMM D, YYYY - hh:mm a') }} </li>
              </ul>
            </v-card-text>
          </v-card>
        </v-card-text>
        <v-card-actions class="pt-0">
            <v-spacer></v-spacer>
            <v-btn
              @click="showTicketDialog = false"
              color="primary" text
              :disabled="submitting"
            >
              <b>Close</b>
            </v-btn>
          </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Edit Ticket Dialog -->
    <v-dialog
      v-model="editTicketDialog" persistent max-width="700px"
      overlay-opacity="0.6"
      overlay-color="grey"
    >
      <v-form lazy ref="editTicketForm" @submit.prevent="editTicket">
        <v-card dark>
          <v-card-title class="pb-8">
            <v-icon class="mr-2" color="primary">fas fa-ticket-alt</v-icon>
            <span class="headline primary--text"><small>Edit Ticket</small></span>
            <v-spacer />
            <v-btn
              :disabled="submitting"
              @click="$refs.editTicketForm.reset(), editTicketDialog = false"
              fab text small color="primary"
            >
              <v-icon>fas fa-times</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editTicketForm.issue"
                  label="Issue" 
                  readonly
                  prepend-inner-icon="fas fa-ticket-alt"
                  outlined flat dense
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="editTicketForm.description"
                  outlined rows="3"
                  label="Description"
                  readonly dense
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="editTicketForm.note"
                  outlined rows="3"
                  label="Note" dense
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="editTicketForm.status"
                  prepend-inner-icon="fas fa-ticket-alt"
                  :items="[
                    { text: 'Pending', value: 'pending' },
                    { text: 'Active', value: 'active' },
                    { text: 'Closed', value: 'closed' }
                  ]"
                  label="Status" dense dark outlined
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="pt-0">
            <v-spacer></v-spacer>
            <v-btn
              @click="$refs.editTicketForm.reset(), editTicketDialog = false"
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
    <!-- Delete Ticket Dialog -->
    <v-dialog
      v-model="deleteTicketDialog" max-width="290"
      overlay-opacity="0.6"
      overlay-color="grey"
    >
      <v-card dark>
        <v-card-title class="headline">Are you sure ?</v-card-title>
        <v-card-text>
          This Ticket will be deleted.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary" text
            :disabled="submitting"
            @click="deleteTicketDialog = false"
          >
            <b>Cancel</b>
          </v-btn>
          <v-btn
            color="primary" text
            :loading="submitting"
            :disabled="submitting"
            @click="deleteTicket"
          >
            <b>Confirm</b>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    editTicketForm: {},
    selectedTicket: {},
    search: null,
    status: 'pending',
    loading: false,
    submitting: false,
    editTicketDialog: false,
    showTicketDialog: false,
    deleteTicketDialog: false,
    disablePagination: false,
    pagination: { page: 1, itemsPerPage: 10 },
    headers: [
      { text: 'Issue', align: 'start', sortable: true, value: 'issue' },
      { text: 'Date Reported', align: 'start', sortable: true, value: 'created_at' },
      { text: 'Status', align: 'start', sortable: true, value: 'status' },
      { text: 'Actions', align: 'center', sortable: false, value: 'actions' }
    ],
    tickets: {}
  }),
  mounted () {
    this.getTickets()
  },
  computed: {
    ...mapGetters({
      itemsPerPageOptions: 'itemsPerPageOptions'
    })
  },
  watch: {
    search: _.debounce(function () {
      this.reloadTickets()
    }, 500),
    status: _.debounce(function () {
      this.reloadTickets()
    }, 500),
    pagination: {
      handler () {
        if (! this.disablePagination) {
          this.getTickets()
        }
      },
      deep: true
    }
  },
  methods: {
    openImage (image) {
      window.open(image);
    },
    async reloadTickets () {
      this.disablePagination = true
      this.pagination.page = 1
      await this.getTickets()
      this.disablePagination = false
    },
    async getTickets () {
      try {
        this.loading = true
        const payload = {
          page: this.pagination.page, limit: this.pagination.itemsPerPage,
          search: this.search, status: this.status
        }
        if (this.pagination.sortBy && this.pagination.sortBy.length > 0) {
          this.$set(payload, 'order_by', this.pagination.sortBy[0])
          this.$set(payload, 'order_desc', this.pagination.sortDesc[0] ? 1 : 0)
        }
        const tickets = await this.$axios.get('/admin/tickets', { params: payload })
        this.tickets = tickets.data
      } catch (e) {
        this.showSnackbar('error', e.response ? e.response.data.message : e.message)
      } finally {
        this.loading = false
      }
    },
    async editTicket () {
      if (this.$refs.editTicketForm.validate()) {
        try {
          this.submitting = true
          await this.$axios.put('/admin/tickets/' + this.editTicketForm.id, this.editTicketForm)
          this.$refs.editTicketForm.reset()
          this.reset()
          this.showSnackbar('success', 'Ticket has been updated successfully.')
        } catch (e) {
          this.showSnackbar('error', e.response ? e.response.data.message : e.message)
        } finally {
          this.submitting = false
        }
      }
    },
    async deleteTicket () {
      try {
        this.submitting = true
        await this.$axios.delete('/admin/tickets/' + this.selectedTicket.id)
        this.reset()
        this.showSnackbar('success', 'Ticket has been deleted successfully.')
      } catch (e) {
        this.showSnackbar('error', e.response ? e.response.data.message : e.message)
      } finally {
        this.submitting = false
      }
    },
    reset () {
      this.getTickets()
      this.editTicketDialog = false
      this.deleteTicketDialog = false
    }
  }
}
</script>
