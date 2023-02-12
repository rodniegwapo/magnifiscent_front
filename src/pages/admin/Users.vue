<template>
  <div class="pa-6">
    <v-data-table
      :loading="loading"
      :headers="headers"
      :items="users.data"
      :options.sync="pagination"
      :footer-props="{
        itemsPerPageOptions: itemsPerPageOptions
      }"
      :server-items-length="users.meta ? users.meta.total : 0"
      class="elevation-1 overflow-hidden" dark
    >
      <template v-slot:top>
        <v-container
          class="grey darken-4 elevation-1 pt-6 px-7"
          style="max-width: 100%!important;"
        >
          <v-row>
            <v-col cols="12" class="primary--text headline">
              <v-btn
                @click="reloadUsers()"
                x-small fab color="primary" class="mr-3 elevation-0"
              >
                <v-icon class="black--text" small>fas fa-redo-alt</v-icon>
              </v-btn>
              <small>User Management</small>
            </v-col>
            <v-col cols="12">
              <v-row>
                <v-col cols="12" md="3" sm="12" class="pa-2">
                  <div>
                    <v-text-field
                      v-model="search"
                      :disabled="loading"
                      label="Search User..."
                      prepend-inner-icon="fas fa-user"
                      outlined color="primary"
                      clearable flat dense dark
                      type="text"
                    ></v-text-field>
                  </div>
                </v-col>
                <v-col cols="12" md="3" sm="12" class="py-2">
                  <v-select
                    v-model="roleId"
                    :disabled="loading"
                    prepend-inner-icon="fas fa-user"
                    :items="roles"
                    item-text="name"
                    item-value="id"
                    label="Role"
                    clearable dense dark outlined
                  ></v-select>
                </v-col>
                <v-col cols="12" md="3" sm="12" class="py-2">
                  <v-select
                    v-model="status"
                    :disabled="loading"
                    prepend-inner-icon="fas fa-user"
                    :items="[
                      { text: 'Active', value: 0 },
                      { text: 'Blocked', value: 1  }
                    ]"
                    label="Status"
                    clearable dense dark outlined
                  ></v-select>
                </v-col>
                <v-col cols="12" md="3" sm="12" class="pa-2">
                  <v-btn
                    @click="addUserDialog = true"
                    class="elevation-1 black--text"
                    color="primary" block
                  >
                    <v-icon small class="mr-2">fas fa-plus</v-icon>
                    Create User
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </template>
      <template v-slot:item.created_at="{ item }">
        {{ date(item.created_at, 'MMMM D, YYYY - hh:mm a') }}
      </template>
      <template v-slot:item.role="{ item }">
        <v-chip
          dark :color="roleColor(item.role.name)"
          class="text-capitalize"
        >{{ item.role.name }}</v-chip>
      </template>
      <template v-slot:item.status="{ item }">
        <div class="justify-center layout">
          <v-switch
            @click="selectedUser = item, toogleBlockedDialog = true"
            color="success darken-1"
            :input-value="! item.blocked"
            :success="! item.blocked"
            :error="item.blocked"
            :readonly="item.role.name !== 'Admin'"
            :disabled="item.role.name === 'Admin'"
          ></v-switch>
          <v-chip
            small dark class="mt-5"
            :class="item.blocked ? 'px-3' : 'px-5'"
            :color="! item.blocked ? 'success' : 'red'"
          >
            {{ item.blocked ? 'Blocked' : 'Active' }}
          </v-chip>
        </div>
      </template>
      <template v-slot:item.actions="{ item }">
        <div class="justify-center layout">
          <v-btn
            @click="selectedUser = item, showUserDialog = true"
            dark fab x-small
            class="elevation-0 blue"
          >
            <v-icon dark small>fas fa-search</v-icon>
          </v-btn>
          <v-btn
            :disabled="item.role.name !== 'User'"
            @click="$router.push(`account-summary/${item.id}/${year}/${month}`)"
            dark fab x-small
            class="elevation-0 ml-2 blue"
          >
            <v-icon dark small>fas fa-file-alt</v-icon>
          </v-btn>
          <v-btn
            @click="showEditUserDialog(item)"
            dark fab x-small
            :disabled="item.role.name === 'Admin'"
            class="elevation-0 ml-2 yellow darken-3"
          >
            <v-icon dark small>fas fa-edit</v-icon>
          </v-btn>
          <v-btn
            @click="showChangePasswordDialog(item)"
            dark fab x-small
            :disabled="item.role.name === 'Admin'"
            class="elevation-0 ml-2 yellow darken-3"
          >
            <v-icon dark small>fas fa-key</v-icon>
          </v-btn>
        </div>
      </template>
    </v-data-table>
    <!-- Show User Dialog -->
    <v-dialog
      v-model="showUserDialog" width="550px"
      overlay-opacity="0.6"
      overlay-color="grey"
    >
      <v-card dark>
        <v-card-title class="pb-8">
          <v-icon class="mr-2" color="primary">fas fa-user</v-icon>
          <span class="headline primary--text"><small>User Information</small></span>
          <v-spacer />
          <v-btn
            @click="showUserDialog = false"
            fab text small
            color="primary"
          >
            <v-icon>fas fa-times</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text v-if="selectedUser && selectedUser.role">
          <div class="text-center mb-7">
             <v-badge
              :content="selectedUser.blocked ? 'Blocked' : 'Active'"
              :color="selectedUser.blocked ? 'red' : 'green'"
              overlap
            >
              <v-avatar :class="roleColor(selectedUser.role.name)" size="150">
                <span v-if="selectedUser.first_name && ! selectedUser.avatar" class="white--text text-h3">
                  {{ selectedUser.first_name.substr(0, 1) + selectedUser.last_name.substr(0, 1) }}
                </span>
                <img
                  v-else alt="avatar"
                  :class="borderColorByRole(selectedUser.role.name)"
                  :src="selectedUser.avatar"
                />
              </v-avatar>
            </v-badge>
          </div>
          <table class="w-full">
            <tr>
              <td class="py-2" style="width: 210px;"><b>Role</b></td>
              <td class="py-2"> {{ selectedUser.role.name }} </td>
            </tr>
            <tr>
              <td class="py-2"><b>First Name</b></td>
              <td class="py-2"> {{ selectedUser.first_name }} </td>
            </tr>
            <tr>
              <td class="py-2"><b>Middle Name</b></td>
              <td class="py-2"> {{ selectedUser.middle_name }} </td>
            </tr>
            <tr>
              <td class="py-2"><b>Last Name</b></td>
              <td class="py-2"> {{ selectedUser.last_name }} </td>
            </tr>
            <tr>
              <td class="py-2"><b>Username</b></td>
              <td class="py-2"> {{ selectedUser.username }} </td>
            </tr>
            <tr>
              <td class="py-2"><b>Email</b></td>
              <td class="py-2"> {{ selectedUser.email }} </td>
            </tr>
            <tr>
              <td class="py-2"><b>Mobile Number</b></td>
              <td class="py-2"> {{ selectedUser.mobile_no }} </td>
            </tr>
            <template v-if="selectedUser.role.name === 'User'">
              <tr>
                <td class="py-2"><b>Address</b></td>
                <td class="py-2"> {{ selectedUser.address }} </td>
              </tr>
              <tr>
                <td class="py-2"><b>BDO</b></td>
                <td class="py-2"> {{ selectedUser.bdo_account }} </td>
              </tr>
              <tr>
                <td class="py-2"><b>Eastwest</b></td>
                <td class="py-2"> {{ selectedUser.eastwest_account }} </td>
              </tr>
              <tr>
                <td class="py-2"><b>Security Bank</b></td>
                <td class="py-2"> {{ selectedUser.security_bank_account }} </td>
              </tr>
            </template>
          </table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showUserDialog = false">
            <b>Close</b>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Add User Dialog -->
    <v-dialog
      v-model="addUserDialog" persistent max-width="900px"
      overlay-opacity="0.6"
      overlay-color="grey"
    >
      <v-form lazy ref="addUserForm" @submit.prevent="addUser">
        <v-card dark>
          <v-card-title class="pb-8">
            <v-icon class="mr-2" color="primary">fas fa-user</v-icon>
            <span class="headline primary--text"><small>Create User</small></span>
            <v-spacer />
            <v-btn
              :disabled="submitting"
              @click="$refs.addUserForm.reset(), addUserDialog = false"
              fab text small
              color="primary"
            >
              <v-icon>fas fa-times</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6" sm="12">
                <v-select
                  v-model="addUserForm.role"
                  prepend-inner-icon="fas fa-user"
                  :items="roles"
                  :rules="[ v => !!v || 'Role is required.' ]"
                  item-text="name"
                  label="Role" return-object
                  dense outlined class="required"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="4" sm="12" class="py-1">
                <v-text-field
                  v-model="addUserForm.first_name"
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
                  v-model="addUserForm.middle_name"
                  label="Middle name"
                  name="middle_name"
                  prepend-inner-icon="fas fa-user"
                  outlined flat
                  dense type="text"
                />
              </v-col>
              <v-col cols="12" md="4" sm="12" class="py-1">
                <v-text-field
                  v-model="addUserForm.last_name"
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
                  v-model="addUserForm.mobile_no"
                  :error="!!errors.mobile_no"
                  :error-messages="errors.mobile_no ? errors.mobile_no : []"
                  :rules="[ v => !!v || 'Mobile Number is required.' ]"
                  label="Mobile Number" name="mobile_no"
                  prepend-inner-icon="fas fa-mobile"
                  outlined flat dense type="text"
                  class="required"
                />
              </v-col>
              <v-col cols="12" md="4" sm="12" class="py-1">
                <v-text-field
                  v-model="addUserForm.username"
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
                  v-model="addUserForm.email"
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
              <v-col cols="12" md="6" sm="12" class="py-1">
                <v-text-field
                  v-model="addUserForm.address"
                  label="Address" name="address"
                  :rules="userRole === 'User' ? [ v => !!v || 'Address is required.' ] : []"
                  prepend-inner-icon="fas fa-map-marker-alt"
                  outlined flat dense type="text"
                  :class="userRole === 'User' ? 'required' : ''"
                />
              </v-col>
              <v-col cols="12" md="6" sm="12" class="py-1">
                <v-file-input
                  v-model="addUserForm.avatar"
                  class="file-input-small-chips"
                  label="Avatar"
                  dense outlined chips
                  :rules="[
                    v => !v || v.size < 3000000 || 'Avatar must not exceed 3mb.',
                  ]"
                  accept="image/png, image/jpeg, image/bmp"
                  prepend-icon="fas fa-user"
                ></v-file-input>
              </v-col>
              <template v-if="userRole === 'User'">
                <v-col cols="12">
                  Please add at least one bank account. <span class="red--text">*</span>
                </v-col>
                <v-col cols="12" md="4" sm="12" class="py-1">
                  <v-text-field
                    v-model="addUserForm.bdo_account"
                    label="BDO" name="bdo_account"
                    prepend-inner-icon="fas fa-university"
                    outlined flat dense type="text"
                  />
                </v-col>
                <v-col cols="12" md="4" sm="12" class="py-1">
                  <v-text-field
                    v-model="addUserForm.eastwest_account"
                    label="Eastwest" name="eastwest_account"
                    prepend-inner-icon="fas fa-university"
                    outlined flat dense type="text"
                  />
                </v-col>
                <v-col cols="12" md="4" sm="12" class="py-1">
                  <v-text-field
                    v-model="addUserForm.security_bank_account"
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
              @click="$refs.addUserForm.reset(), addUserDialog = false"
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
    <!-- Edit User Dialog -->
    <v-dialog
      v-model="editUserDialog" persistent max-width="900px"
      overlay-opacity="0.6"
      overlay-color="grey"
    >
      <v-form lazy ref="editUserForm" @submit.prevent="editUser">
        <v-card dark>
          <v-card-title class="pb-8">
            <v-icon class="mr-2" color="primary">fas fa-user</v-icon>
            <span class="headline primary--text"><small>Edit User</small></span>
            <v-spacer />
            <v-btn
              :disabled="submitting"
              @click="$refs.editUserForm.reset(), editUserDialog = false"
              fab text small
              color="primary"
            >
              <v-icon>fas fa-times</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4" sm="12" class="py-1">
                <v-text-field
                  v-model="editUserForm.first_name"
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
                  v-model="editUserForm.middle_name"
                  label="Middle name"
                  name="middle_name"
                  prepend-inner-icon="fas fa-user"
                  outlined flat
                  dense type="text"
                />
              </v-col>
              <v-col cols="12" md="4" sm="12" class="py-1">
                <v-text-field
                  v-model="editUserForm.last_name"
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
                  v-model="editUserForm.mobile_no"
                  :error="!!errors.mobile_no"
                  :error-messages="errors.mobile_no ? errors.mobile_no : []"
                  :rules="[ v => !!v || 'Mobile Number is required.' ]"
                  label="Mobile Number" name="mobile_no"
                  prepend-inner-icon="fas fa-mobile"
                  outlined flat dense type="text"
                  class="required"
                />
              </v-col>
              <v-col cols="12" md="4" sm="12" class="py-1">
                <v-text-field
                  v-model="editUserForm.username"
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
                  v-model="editUserForm.email"
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
              <v-col cols="12" md="6" sm="12" class="py-1">
                <v-text-field
                  v-model="editUserForm.address"
                  label="Address" name="address"
                  :rules="editUserRole === 'User' ? [ v => !!v || 'Address is required.' ] : []"
                  prepend-inner-icon="fas fa-map-marker-alt"
                  outlined flat dense type="text"
                  :class="userRole === 'User' ? 'required' : ''"
                />
              </v-col>
              <v-col cols="12" md="6" sm="12" class="py-1">
                  <v-file-input
                    v-model="editUserForm.avatar"
                    class="file-input-small-chips"
                    label="Avatar"
                    dense outlined chips
                    :rules="[
                      v => !v || v.size < 2000000 || 'ID Picture size should be less than 2 MB.',
                    ]"
                    accept="image/png, image/jpeg, image/bmp"
                    prepend-icon="fas fa-user"
                  ></v-file-input>
                </v-col>
              <template v-if="editUserRole === 'User'">
                <v-col cols="12">
                  Please add at least one bank account. <span class="red--text">*</span>
                </v-col>
                <v-col cols="12" md="4" sm="12" class="py-1">
                  <v-text-field
                    v-model="editUserForm.bdo_account"
                    label="BDO" name="bdo_account"
                    prepend-inner-icon="fas fa-university"
                    outlined flat dense type="text"
                  />
                </v-col>
                <v-col cols="12" md="4" sm="12" class="py-1">
                  <v-text-field
                    v-model="editUserForm.eastwest_account"
                    label="Eastwest" name="eastwest_account"
                    prepend-inner-icon="fas fa-university"
                    outlined flat dense type="text"
                  />
                </v-col>
                <v-col cols="12" md="4" sm="12" class="py-1">
                  <v-text-field
                    v-model="editUserForm.security_bank_account"
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
              @click="editUserDialog = false"
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
    <!-- Toogle User Is Block Dialog -->
    <v-dialog
      v-model="toogleBlockedDialog" max-width="290"
      overlay-opacity="0.6"
      overlay-color="grey"
    >
      <v-card dark>
        <v-card-title class="headline primary--text">Are you sure ?</v-card-title>
        <v-card-text>
          <span v-if="!selectedUser.blocked">This user will be blocked.</span>
          <span v-else>This user will be activated.</span>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary" text
            :disabled="submitting"
            @click="toogleBlockedDialog = false"
          >
            <b>Cancel</b>
          </v-btn>
          <v-btn
            color="primary" text
            :loading="submitting"
            :disabled="submitting"
            @click="toogleUserBlocked"
          >
            <b>Confirm</b>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
                  label="New Password"
                  v-model="changePasswordForm.new_password"
                  outlined flat dense
                  :error="errors.new_password ? true : false"
                  :error-messages="errors.new_password ? errors.new_password : []"
                  :rules="[ v => !!v || 'New Password is required.' ]"
                  type="password"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="py-1">
                <v-text-field
                  label="Confirm New Password"
                  v-model="changePasswordForm.confirm_new_password"
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  data: () => ({
    showUserDialog: false,
    addUserDialog: false,
    editUserDialog: false,
    changePasswordDialog: false,
    toogleBlockedDialog: false,
    loading: true,
    submitting: false,
    pagination: { page: 1, itemsPerPage: 10 },
    roleId: null,
    changePasswordForm: {},
    selectedUser: {},
    errors: {},
    addUserForm: {},
    editUserForm: {},
    status: null,
    roles: [],
    search: null,
    headers: [
      { text: 'Last Name', align: 'start', sortable: true, value: 'last_name' },
      { text: 'First Name', align: 'start', sortable: true, value: 'first_name' },
      { text: 'Middle Name', align: 'start', sortable: true, value: 'middle_name' },
      { text: 'Date Registered', align: 'start', sortable: true, value: 'created_at' },
      { text: 'Role', align: 'center', sortable: false, value: 'role' },
      { text: 'Status', align: 'center', sortable: false, value: 'status' },
      { text: 'Actions', align: 'center', sortable: false, value: 'actions' }
    ],
    users: {},
    disablePagination: false
  }),
  async mounted () {
    await this.getRoles()
    this.getUsers()
  },
  computed: {
    ...mapGetters({
      itemsPerPageOptions: 'itemsPerPageOptions'
    }),
    userRole () {
      return this.addUserForm.role ? this.addUserForm.role.name : ''
    },
    editUserRole () {
      return this.editUserForm.role ? this.editUserForm.role.name : ''
    },
    year () {
      const year = this.date(null, 'YYYY')
      return parseInt(year)
    },
    month () {
      const month = this.date(null, 'MM')
      return parseInt(month)
    }
  },
  watch: {
    status () {
      this.reloadUsers()
    },
    roleId () {
      this.reloadUsers()
    },
    search: _.debounce(function () {
      this.reloadUsers()
    }, 500),
    pagination: {
      handler () {
        if (! this.disablePagination) {
          this.getUsers()
        }
      },
      deep: true
    }
  },
  methods: {
    async reloadUsers () {
      this.disablePagination = true
      this.pagination.page = 1
      await this.getUsers()
      this.disablePagination = false
    },
    async getRoles () {
      const roles = await this.$axios.get('/roles')
      this.roles = roles.data.data
    },
    async getUsers () {
      try {
        this.loading = true
        const p = this.pagination
        const payload = {
          page: p.page, limit: p.itemsPerPage,
          role_id: this.roleId, search: this.search,
          blocked: this.status
        }
        if (p.sortBy && p.sortBy.length > 0) {
          this.$set(payload, 'order_by', p.sortBy[0])
          this.$set(payload, 'order_desc', p.sortDesc[0] ? 1 : 0)
        }
        const users = await this.$axios.get('/admin/users', { params: payload })
        this.users = users.data
      } catch (e) {
        this.showSnackbar('error', e.response ? e.response.data.message : e.message)
      } finally {
        this.loading = false
      }
    },
    async addUser () {
      if (this.$refs.addUserForm.validate()) {
        const form = this.addUserForm
        const doesntHaveBank = ! form.bdo_account && ! form.eastwest_account && ! form.security_bank_account
        if (this.addUserForm.role.name === 'User' && doesntHaveBank) {
          this.showSnackbar('error', 'Please add at least one bank account.')
        } else {
          try {
            this.submitting = true
            const payload = new FormData()
            for (let key in form) {
              if (form[key]) {
                if (key === 'role') {
                  payload.append('role_id', form[key].id)
                } else {
                  payload.append(key, form[key])
                }
              }
            }
            await this.$axios.post('/admin/users', payload)
            this.$refs.addUserForm.reset()
            this.reset()
            this.showSnackbar('success', 'User has been created successfully.')
          } catch (e) {
            this.errors = e.response && e.response.data.errors ? e.response.data.errors : {}
            this.showSnackbar('error', e.response ? e.response.data.message : e.message)
          } finally {
            this.submitting = false
          }
        }
      }
    },
    showEditUserDialog (item) {
      this.editUserForm = Object.assign({}, item)
      delete this.editUserForm.avatar
      this.editUserDialog = true
    },
    async editUser () {
      if (this.$refs.editUserForm.validate()) {
        const form = this.editUserForm
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
            await this.$axios.post('/admin/users/' + form.id, payload)
            this.$refs.editUserForm.reset()
            this.reset()
            this.showSnackbar('success', 'User has been updated successfully.')
          } catch (e) {
            this.errors = e.response && e.response.data.errors ? e.response.data.errors : {}
            this.showSnackbar('error', e.response ? e.response.data.message : e.message)
          } finally {
            this.submitting = false
          }
        }
      }
    },
    async toogleUserBlocked () {
      try {
        this.submitting = true
        if (this.selectedUser.blocked) {
          await this.$axios.post('/admin/users/' + this.selectedUser.id + '/restore')
        } else {
          await this.$axios.delete('/admin/users/' + this.selectedUser.id)
        }
        this.reset()
        const status = this.selectedUser.blocked ? 'activated' : 'blocked'
        this.showSnackbar('success', 'User has been ' + status + ' successfully.')
      } catch (e) {
        this.showSnackbar('error', e.response ? e.response.data.message : e.message)
      } finally {
        this.submitting = false
      }
    },
    showChangePasswordDialog (item) {
      this.changePasswordForm.user_id = item.id
      this.changePasswordDialog = true
    },
    async changePass () {
      if (this.$refs.changePasswordForm.validate()) {
        try {
          this.submitting = true
          const payload = this.changePasswordForm
          await this.$axios.post('/admin/users/password/update', payload)
          this.changePasswordDialog = false
          this.showSnackbar('success', 'User\'s password has been updated successfully.')
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
      this.getUsers()
      this.addUserDialog = false
      this.editUserDialog = false
      this.toogleBlockedDialog = false
      this.errors = {}
    }
  }
}
</script>
