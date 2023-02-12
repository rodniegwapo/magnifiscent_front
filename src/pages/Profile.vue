<template>
  <div class="pa-6">
    <v-card dark>
      <v-card-title class="headline primary--text">
        <v-row>
          <v-col cols="12" md="6" sm="12">
            <v-icon class="mr-3" small color="primary">fas fa-user</v-icon>
            <small>Personal Information</small>
          </v-col>
          <v-col>
            <v-row>
              <v-col cols="12" md="6" sm="12">
                <v-btn
                  class="primary black--text" block
                  @click="showEditProfile(profile)"
                >
                  <v-icon small class="mr-2">fas fa-edit</v-icon>
                  Edit
                </v-btn>
              </v-col>
              <v-col cols="12" md="6" sm="12">
                <v-btn
                  color="primary black--text" block
                  @click="changePasswordDialog = true"
                >
                  <v-icon small class="mr-2">fas fa-edit</v-icon>
                  Change Password
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text v-if="profile.role">
        <v-row>
          <v-col cols="12" md="4" sm="12" class="pa-5">
            <div class="d-flex justify-center w-full align-center h-full">
              <v-avatar :class="roleColor(profile.role.name)" size="180" class="mb-10">
                <span v-if="profile.first_name && ! profile.avatar" class="white--text text-h2">
                  {{ profile.first_name.substr(0, 1) + profile.last_name.substr(0, 1) }}
                </span>
                <img
                  v-else alt="avatar"
                  :class="borderColorByRole(profile.role.name)"
                  :src="profile.avatar"
                />
              </v-avatar>
            </div>
          </v-col>
          <v-col cols="12" md="8" sm="12" class="pa-5">
            <table class="w-full">
              <tr>
                <td class="py-2" style="width: 200px;"><b>First Name</b></td>
                <td class="py-2"> {{ profile.first_name }} </td>
              </tr>
              <tr>
                <td class="py-2" style="width: 200px;"><b>Middle Name</b></td>
                <td class="py-2"> {{ profile.middle_name }} </td>
              </tr>
              <tr>
                <td class="py-2" style="width: 200px;"><b>Last Name</b></td>
                <td class="py-2"> {{ profile.last_name }} </td>
              </tr>
              <tr>
                <td class="py-2" style="width: 200px;"><b>Username</b></td>
                <td class="py-2"> {{ profile.username }} </td>
              </tr>
              <tr>
                <td class="py-2" style="width: 200px;"><b>Email</b></td>
                <td class="py-2"> {{ profile.email }} </td>
              </tr>
              <tr>
                <td class="py-2" style="width: 200px;"><b>Address</b></td>
                <td class="py-2"> {{ profile.address }} </td>
              </tr>
              <tr>
                <td class="py-2" style="width: 200px;"><b>Mobile Number</b></td>
                <td class="py-2"> {{ profile.mobile_no }} </td>
              </tr>
              <template v-if="profile.role.name === 'User'">
                <tr>
                  <td class="py-2" style="width: 200px;"><b>BDO Account</b></td>
                  <td class="py-2"> {{ profile.bdo_account }} </td>
                </tr>
                <tr>
                  <td class="py-2" style="width: 200px;"><b>Security Bank Account</b></td>
                  <td class="py-2"> {{ profile.security_bank_account }} </td>
                </tr>
                <tr>
                  <td class="py-2" style="width: 200px;"><b>Eastwest Account</b></td>
                  <td class="py-2"> {{ profile.eastwest_account }} </td>
                </tr>
              </template>
            </table>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <!-- Change Password Dialog -->
    <v-dialog
      v-model="changePasswordDialog" persistent max-width="500"
      overlay-opacity="0.6"
      overlay-color="grey"
    >
      <v-form lazy ref="changePasswordForm" @submit.prevent="changePass">
        <v-card>
          <v-card-title class="pb-8">
          <v-icon class="mr-2" color="primary">fas fa-user</v-icon>
            <span class="headline primary--text"><small>Update Password</small></span>
            <v-spacer />
            <v-btn
              :disabled="submitting"
              @click="$refs.changePasswordForm.reset(), changePasswordDialog = false"
              fab text small
              color="primary"
            >
              <v-icon>fas fa-times</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" class="py-1">
                <v-text-field
                  label="Current Password"
                  v-model="changePasswordForm.current_password"
                  :error="!!errors.current_password"
                  :error-messages="errors.current_password ? errors.current_password : []"
                  :rules="[ v => !!v || 'Current password is required.' ]"
                  outlined flat dense
                  type="password"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="py-1">
                <v-text-field
                  label="New Password"
                  v-model="changePasswordForm.new_password"
                  :error="!!errors.new_password"
                  :error-messages="errors.new_password ? errors.new_password : []"
                  outlined flat dense
                  :rules="[ v => !!v || 'New Password is required.' ]"
                  type="password"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="py-1">
                <v-text-field
                  label="Confirm New Password"
                  v-model="changePasswordForm.confirm_new_password"
                  :error="!!errors.confirm_new_password"
                  :error-messages="errors.confirm_new_password ? errors.confirm_new_password : []"
                  outlined flat dense
                  :rules="[
                    v => !!v || 'Confirm New Password is required.',
                    v => v === changePasswordForm.new_password || 'Confirm New Password and New Password doesn\'t match.'
                  ]"
                  type="password"
                ></v-text-field>
              </v-col>           
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary" text
              @click="$refs.changePasswordForm.reset(), changePasswordDialog = false"
            >
              close
            </v-btn>
            <v-btn
              color="primary" text
              :disabled="submitting"
              :loading="submitting"
              type="submit"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <!-- Edit Profile Dialog -->
    <v-dialog
      v-model="editProfileDialog" persistent :max-width="profile.role.name == 'User' ? '500px' : '900px'"
      overlay-opacity="0.6"
      overlay-color="grey"
      v-if="profile && profile.role"
    >
      <v-form lazy ref="editProfileForm" @submit.prevent="updateProfile">
        <v-card dark>
          <v-card-title class="pb-8">
            <v-icon class="mr-2" color="primary">fas fa-user</v-icon>
            <span class="headline primary--text"><small>Edit Profile</small></span>
            <v-spacer />
            <v-btn
              :disabled="submitting"
              @click="$refs.editProfileForm.reset(), editProfileDialog = false"
              fab text small
              color="primary"
            >
              <v-icon>fas fa-times</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row>
              <template v-if="profile.role.name === 'Admin'">
                <v-col cols="12" md="4" sm="12" class="py-1">
                  <v-text-field
                    v-model="editProfileForm.first_name"
                    :rules="[ v => !!v || 'First name is required.' ]"
                    label="First name"
                    name="first_name"
                    prepend-inner-icon="fas fa-user"
                    outlined flat dense
                    type="text" class="required"
                  />
                </v-col>
                <v-col cols="12" md="4" sm="12" class="py-1">
                  <v-text-field
                    v-model="editProfileForm.middle_name"
                    label="Middle name"
                    name="middle_name"
                    prepend-inner-icon="fas fa-user"
                    outlined flat
                    dense type="text"
                  />
                </v-col>
                <v-col cols="12" md="4" sm="12" class="py-1">
                  <v-text-field
                    v-model="editProfileForm.last_name"
                    :rules="[ v => !!v || 'Last name is required.' ]"
                    label="Last Name"
                    name="last_name"
                    prepend-inner-icon="fas fa-user"
                    outlined flat dense
                    type="text" class="required"
                  />
                </v-col>
                <v-col cols="12" md="4" sm="12" class="py-1">
                  <v-text-field
                    v-model="editProfileForm.username"
                    :error="errors.username ? true : false"
                    :error-messages="errors.username ? errors.username : []"
                    :rules="[ v => !!v || 'Username is required.' ]"
                    label="Username" name="username"
                    prepend-inner-icon="fas fa-user"
                    outlined flat dense type="text"
                    class="required"
                  />
                </v-col>
                <v-col cols="12" md="4" sm="12" class="py-1">
                  <v-text-field
                    v-model="editProfileForm.email"
                    label="Email" name="email"
                    :error="errors.email ? true : false"
                    :error-messages="errors.email ? errors.email : []"
                    :rules="[
                      v => !!v || 'Email is required.',
                      v => /.+@.+\..+/.test(v) || 'Email is invalid.'
                    ]"
                    prepend-inner-icon="fas fa-envelope"
                    outlined flat dense type="text"
                    class="required"
                  />
                </v-col>
                <v-col cols="12" md="4" sm="12" class="py-1">
                  <v-text-field
                    v-model="editProfileForm.mobile_no"
                    :error="!!errors.mobile_no"
                    :error-messages="errors.mobile_no ? errors.mobile_no : []"
                    label="Mobile Number" name="mobile_no"
                    prepend-inner-icon="fas fa-mobile"
                    outlined flat dense type="text"
                  />
                </v-col>
                <v-col cols="12" md="6" sm="12" class="py-1">
                  <v-text-field
                    v-model="editProfileForm.address"
                    label="Address" name="address"
                    :rules="profile.role && profile.role.name === 'User' ? [ v => !!v || 'Address is required.' ] : []"
                    prepend-inner-icon="fas fa-map-marker-alt"
                    outlined flat dense type="text"
                    :class="userRole === 'User' ? 'required' : ''"
                  />
                </v-col>
              </template>
              <v-col cols="12" :md="profile.role.name == 'User' ? '12' : '6'" sm="12" class="py-1">
                <v-file-input
                  v-model="editProfileForm.avatar"
                  class="file-input-small-chips"
                  label="Avatar" dense outlined chips
                  accept="image/png, image/jpeg, image/bmp"
                  prepend-icon="fas fa-user"
                ></v-file-input>
              </v-col>
              <template v-if="profile.role.name == 'User'">
                <v-col cols="12">
                  Please add at least one bank account. <span class="red--text">*</span>
                </v-col>
                <v-col cols="12" class="py-1">
                  <v-text-field
                    v-model="editProfileForm.bdo_account"
                    label="BDO" name="bdo_account"
                    prepend-inner-icon="fas fa-university"
                    outlined flat dense type="text"
                  />
                </v-col>
                <v-col cols="12" class="py-1">
                  <v-text-field
                    v-model="editProfileForm.eastwest_account"
                    label="Eastwest" name="eastwest_account"
                    prepend-inner-icon="fas fa-university"
                    outlined flat dense type="text"
                  />
                </v-col>
                <v-col cols="12" class="py-1">
                  <v-text-field
                    v-model="editProfileForm.security_bank_account"
                    label="Security Bank" name="security_bank_account"
                    prepend-inner-icon="fas fa-university"
                    outlined flat dense type="text"
                  />
                </v-col>
              </template>
            </v-row>
          </v-card-text>
          <v-card-actions class="pt-0">
            <v-spacer></v-spacer>
            <v-btn
              @click="editProfileDialog = false"
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
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  data: () => ({
    changePasswordDialog: false,
    editProfileDialog: false,
    editProfileForm: {},
    changePasswordForm: {},
    loading: false,
    errors: {},
    submitting: false
    
  }),
  mounted() {
  },
  computed: {
    ...mapGetters({
      profile: 'profile',
      profileDialog: 'profileDialog'
    }),
    userRole () {
      return this.editProfileForm.role ? this.editProfileForm.role.name : ''
    }
  },
  methods: {
    showEditProfile(profile){
      this.editProfileForm = Object.assign({}, profile)
      delete this.editProfileForm.avatar
      this.editProfileDialog = true
    },
    async updateProfile() {
      if (this.$refs.editProfileForm.validate()) {
        const form = this.editProfileForm
        const doesntHaveBank = ! form.bdo_account && ! form.eastwest_account && ! form.security_bank_account
        if (form.role.name === 'User' && doesntHaveBank) {
          this.showSnackbar('error', 'Please add at least one bank account.')
        } else {
          try {
            this.submitting = true
            const payload = new FormData()
            for (let key in form) {
              if (form[key]) {
                payload.append(key, form[key])
              }
            }
            const res = await this.$axios.post('/profile/update-info', payload)
            this.$store.commit('setProfile', res.data.data)
            this.showSnackbar('success', 'User has been updated successfully.')
            this.editProfileDialog = false
            this.$refs.editProfileForm.reset()
            this.reset()
          } catch (e) {
            this.errors = e.response && e.response.data.errors ? e.response.data.errors : {}
            this.showSnackbar('error', e.response ? e.response.data.message : e.message)
          } finally {
            this.submitting = false
          }
        }
      }
    },
    async changePass () {
      if (this.$refs.changePasswordForm.validate()) {
        try {
          this.submitting = true
          const payload = this.changePasswordForm
          await this.$axios.post('/profile/update-password', payload)
          this.changePasswordDialog = false
          this.showSnackbar('success', 'User has been updated successfully.')
          this.$refs.changePasswordForm.reset()
          this.reset()
        } catch (e) {
          this.errors = e.response && e.response.data.errors ? e.response.data.errors : {}
        } finally {
          this.submitting = false
        }
      }
    },
    reset () {
      this.editProfileDialog = false
      this.changePasswordDialog = false
      this.errors = {}
    }
  }
}
</script>
