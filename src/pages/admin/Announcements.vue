<template>
  <div class="pa-6">
    <v-data-table
      :loading="loading"
      :headers="headers"
      :items="announcements.data"
      :options.sync="pagination"
      :footer-props="{
        itemsPerPageOptions: itemsPerPageOptions
      }"
      :server-items-length="announcements.meta ? announcements.meta.total : 0"
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
                @click="reloadAnnouncements"
                x-small fab color="primary" class="mr-3 elevation-0"
              >
                <v-icon class="black--text" small>fas fa-redo-alt</v-icon>
              </v-btn>
              <small>Announcement Management</small>
            </v-col>
            <v-col cols="12" md="8" sm="12">
              <v-row>
                <v-col cols="12" md="6" sm="12">
                  <v-text-field
                    v-model="search"
                    :disabled="loading"
                    label="Search Announcement..."
                    prepend-inner-icon="fas fa-bullhorn"
                    outlined color="primary"
                    clearable flat dense dark
                    type="text"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" sm="12">
                  <v-btn
                    @click="showAddDialog"
                    class="elevation-1 black--text"
                    color="primary" block
                  >
                    <v-icon small class="mr-2">fas fa-plus</v-icon>
                    Post Announcement
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </template>
      <template v-slot:item.created_at="{ item }">
        {{ item.created_at ? date(item.created_at, 'MMMM D, YYYY - hh:mm a') : '' }}
      </template>
      <template v-slot:item.actions="{ item }">
        <div class="justify-center layout">
          <v-btn
            @click="selectedAnnouncement = item, showAnnouncementDialog = true"
            dark fab x-small
            class="elevation-0 blue"
          >
            <v-icon dark small>fas fa-search</v-icon>
          </v-btn>
          <v-btn
            @click="showEditDialog(item)"
            dark fab x-small
            class="elevation-0 ml-2 yellow darken-3"
          >
            <v-icon dark small>fas fa-edit</v-icon>
          </v-btn>
          <v-btn
            @click="selectedAnnouncement = item, deleteAnnouncementDialog = true"
            dark fab x-small
            class="elevation-0 ml-2 red"
          >
            <v-icon dark small>fas fa-trash</v-icon>
          </v-btn>
        </div>
      </template>
    </v-data-table>
    <!-- Show Announcement Dialog -->
    <v-dialog
      v-model="showAnnouncementDialog" persistent max-width="500px"
      overlay-opacity="0.6"
      overlay-color="grey"
    >
      <v-card dark>
        <v-card-title class="pb-8">
          <v-icon class="mr-2" color="primary">fas fa-bullhorn</v-icon>
          <span class="headline primary--text"><small>Announcement Information</small></span>
          <v-spacer />
          <v-btn
            :disabled="submitting"
            @click="showAnnouncementDialog = false"
            fab text small color="primary"
          >
            <v-icon>fas fa-times</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-card class="px-0 elevation-0">
            <v-card-text>
              <ul class="no-bullets">
                <li class="py-2"> Title </li>
                <li class="py-2 white--text"> {{ selectedAnnouncement.title }} </li>
                <li class="py-2"> Description </li>
                <li class="py-2 white--text control-image" v-html="selectedAnnouncement.description"></li>
                <li class="py-2"> Date Posted </li>
                <li class="py-2 white--text">
                  {{ date(selectedAnnouncement.created_at, 'MMMM D, YYYY - hh:mm a') }}
                </li>
              </ul>
            </v-card-text>
          </v-card>
        </v-card-text>
        <v-card-actions class="pt-0">
            <v-spacer></v-spacer>
            <v-btn
              @click="showAnnouncementDialog = false"
              color="primary" text
              :disabled="submitting"
            >
              <b>Close</b>
            </v-btn>
          </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Add Announcement Dialog -->
    <v-dialog
      v-model="addAnnouncementDialog" persistent max-width="500px"
      overlay-opacity="0.6"
      overlay-color="grey"
    >
      <v-form lazy ref="addAnnouncementForm" @submit.prevent="addAnnouncement">
        <v-card dark>
          <v-card-title class="pb-8">
            <v-icon class="mr-2" color="primary">fas fa-bullhorn</v-icon>
            <span class="headline primary--text"><small>Add Announcement</small></span>
            <v-spacer />
            <v-btn
              :disabled="submitting"
              @click="closeAddDialog"
              fab text small color="primary"
            >
              <v-icon>fas fa-times</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="addAnnouncementForm.title"
                  :rules="[ v => !!v || 'Title is required.' ]"
                  label="Title"
                  prepend-inner-icon="fas fa-cubes"
                  outlined flat dense class="required"
                />
              </v-col>
              <v-col cols="12">
                <v-card class="white rounded overflow-hidden black--text">
                  <vue-editor
                    v-model="addAnnouncementForm.description"
                    :use-custom-image-handler="true"
                    @image-added="handleImageAdded"
                    @image-removed="handleImageRemoved"
                    :editorToolbar="customToolbar"
                  ></vue-editor>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="pt-0">
            <v-spacer></v-spacer>
            <v-btn
              @click="closeAddDialog"
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
    <!-- Edit Announcement Dialog -->
    <v-dialog
      v-model="editAnnouncementDialog" persistent max-width="500px"
      overlay-opacity="0.6"
      overlay-color="grey"
    >
      <v-form lazy ref="editAnnouncementForm" @submit.prevent="editAnnouncement">
        <v-card dark>
          <v-card-title class="pb-8">
            <v-icon class="mr-2" color="primary">fas fa-bullhorn</v-icon>
            <span class="headline primary--text"><small>Edit Announcement</small></span>
            <v-spacer />
            <v-btn
              :disabled="submitting"
              @click="closeEditDialog"
              fab text small color="primary"
            >
              <v-icon>fas fa-times</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editAnnouncementForm.title"
                  :rules="[ v => !!v || 'Title is required.' ]"
                  label="Title"
                  prepend-inner-icon="fas fa-cubes"
                  outlined flat dense class="required"
                />
              </v-col>
              <v-col cols="12">
                <v-card class="white rounded overflow-hidden black--text">
                  <vue-editor
                    v-model="editAnnouncementForm.description"
                    :use-custom-image-handler="true"
                    @image-added="handleImageAdded"
                    @image-removed="handleImageRemoved"
                    :editorToolbar="customToolbar"
                  ></vue-editor>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="pt-0">
            <v-spacer></v-spacer>
            <v-btn
              @click="closeEditDialog"
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
    <!-- Delete Announcement Dialog -->
    <v-dialog
      v-model="deleteAnnouncementDialog" max-width="290"
      overlay-opacity="0.6"
      overlay-color="grey"
    >
      <v-card dark>
        <v-card-title class="headline">Are you sure ?</v-card-title>
        <v-card-text>
          This announcement will be deleted.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary" text
            :disabled="submitting"
            @click="deleteAnnouncementDialog = false"
          >
            <b>Cancel</b>
          </v-btn>
          <v-btn
            color="primary" text
            :loading="submitting"
            :disabled="submitting"
            @click="deleteAnnouncement"
          >
            <b>Confirm</b>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor"
import { v4 as uuidv4 } from 'uuid'
import _ from 'lodash'
import { mapGetters } from 'vuex'

export default {
  components: {
    VueEditor
  },
  data: () => ({
    addAnnouncementForm: {},
    editAnnouncementForm: {},
    selectedAnnouncement: {},
    search: null,
    uuid: null,
    customToolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
      ['image']
    ],
    mustRemoved: true,
    loading: false,
    submitting: false,
    addAnnouncementDialog: false,
    editAnnouncementDialog: false,
    showAnnouncementDialog: false,
    deleteAnnouncementDialog: false,
    disablePagination: false,
    pagination: { page: 1, itemsPerPage: 10 },
    headers: [
      { text: 'Title', align: 'start', sortable: true, value: 'title' },
      { text: 'Date Posted', align: 'start', sortable: true, value: 'created_at' },
      { text: 'Actions', align: 'center', sortable: false, value: 'actions' }
    ],
    announcements: {}
  }),
  mounted () {
    this.getAnnouncements()
  },
  computed: {
    ...mapGetters({
      itemsPerPageOptions: 'itemsPerPageOptions'
    })
  },
  watch: {
     search: _.debounce(function () {
      this.reloadAnnouncements()
    }, 500),
    pagination: {
      handler () {
        if (! this.disablePagination) {
          this.getAnnouncements()
        }
      },
      deep: true
    }
  },
  methods: {
    async reloadAnnouncements () {
      this.disablePagination = true
      this.pagination.page = 1
      await this.getAnnouncements()
      this.disablePagination = false
    },
    async handleImageAdded (file, Editor, cursorLocation, resetUploader) {
      try {
        const formData = new FormData()
        formData.append('image', file)
        formData.append('uuid', this.uuid)
        const res = await this.$axios.post('/admin/announcements/image/add-image', formData)
        Editor.insertEmbed(cursorLocation, 'image', res.data.data)
        resetUploader()
      } catch (e) {
        this.showSnackbar('error', e.response ? e.response.data.message : e.message)
      }
    },
    async handleImageRemoved (image) {
      if (this.mustRemoved) {
        const endpoint = process.env.VUE_APP_API_ENDPOINT + '/storage/'
        const payload = { image: image.replace(endpoint, '') }
        try {
          await this.$axios.post('/admin/announcements/image/remove-image', payload)
        } catch (e) {
          this.showSnackbar('error', e.response ? e.response.data.message : e.message)
        }
      }
    },
    async getAnnouncements () {
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
        const announcements = await this.$axios.get('/announcements', { params: payload })
        this.announcements = announcements.data
      } catch (e) {
        this.showSnackbar('error', e.response ? e.response.data.message : e.message)
      } finally {
        this.loading = false
      }
    },
    showAddDialog () {
      this.uuid = uuidv4()
      this.addAnnouncementDialog = true
      this.mustRemoved = true
    },
    closeAddDialog () {
      this.mustRemoved = false
      this.addAnnouncementDialog = false
      this.addAnnouncementForm = {}
      this.$refs.addAnnouncementForm.reset()
    },
    showEditDialog (item) {
      this.editAnnouncementForm = Object.assign({}, item)
      this.uuid = this.editAnnouncementForm.uuid
      this.editAnnouncementDialog = true
      this.mustRemoved = true
    },
    closeEditDialog () {
      this.mustRemoved = false
      this.$refs.editAnnouncementForm.reset()
      this.editAnnouncementDialog = false
      this.editAnnouncementForm = {}
    },
    async addAnnouncement () {
      if (this.$refs.addAnnouncementForm.validate()) {
        if (this.addAnnouncementForm.description) {
          try {
            this.submitting = true
            this.mustRemoved = false
            this.addAnnouncementForm.uuid = this.uuid
            await this.$axios.post('/admin/announcements', this.addAnnouncementForm)
            this.reset()
            this.addAnnouncementForm = {}
            this.$refs.addAnnouncementForm.reset()
            this.showSnackbar('success', 'Announcement has been posted successfully.')
          } catch (e) {
            this.showSnackbar('error', e.response ? e.response.data.message : e.message)
          } finally {
            this.submitting = false
          }
        } else {
          this.showSnackbar('error', 'Announcement description is required.')
        }
      }
    },
    async editAnnouncement () {
      if (this.$refs.editAnnouncementForm.validate()) {
        if (this.editAnnouncementForm.description) {
          try {
            this.submitting = true
            this.mustRemoved = false
            await this.$axios.post('/admin/announcements/' + this.editAnnouncementForm.id, this.editAnnouncementForm)
            this.reset()
            this.editAnnouncementForm = {}
            this.$refs.editAnnouncementForm.reset()
            this.showSnackbar('success', 'Announcement has been updated successfully.')
          } catch (e) {
            this.showSnackbar('error', e.response ? e.response.data.message : e.message)
          } finally {
            this.submitting = false
          }
        } else {
          this.showSnackbar('error', 'Announcement description is required.')
        }
      }
    },
    async deleteAnnouncement () {
      try {
        this.submitting = true
        await this.$axios.delete('/admin/announcements/' + this.selectedAnnouncement.id)
        this.reset()
        this.showSnackbar('success', 'Announcement has been deleted successfully.')
      } catch (e) {
        this.showSnackbar('error', e.response ? e.response.data.message : e.message)
      } finally {
        this.submitting = false
      }
    },
    reset () {
      this.getAnnouncements()
      this.addAnnouncementDialog = false
      this.editAnnouncementDialog = false
      this.deleteAnnouncementDialog = false
    }
  }
}
</script>
