<template>
  <v-navigation-drawer
    v-model="inputValue"
    app dark clipped
    v-if="profile && profile.role"
    class="grey darken-4"
  >
    <div class="w-full h-full">
      <div class="w-full h-full">
      <v-divider></v-divider>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title text-center">
            {{ profile.full_name }}
          </v-list-item-title>
          <v-list-item-subtitle
            class="text-center text-button"
            :class="roleColor(profile.role.name, true)"
          >
            {{ profile.role.name }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <template v-if="profile.role.name === 'User'">
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-content>
            <v-autocomplete
              v-model="selectedAccountModel"
              :items="accounts"
              class="remove-error-message-slot"
              prepend-inner-icon="fas fa-user"
              item-text="name"
              label="Account" return-object
              dense outlined
            ></v-autocomplete>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-btn
              @click="showReferral()"
              :disabled="! selectedAccountModel" class="primary black--text" block
            >
              Referral Link
            </v-btn>
            <v-btn
              @click="addAccountDialog = true"
              class="primary black--text mt-2" block
            >
              Add Account
            </v-btn>
          </v-list-item-content>
        </v-list-item>
      </template>
      <v-divider></v-divider>
      <v-list dense nav rounded dark class="mt-5">
        <v-list-item
          v-for="item in items"
          :key="item.title"
          :to="item.path"
          :disabled="!! item.middleware && selectedAccount === null"
          active-class="custom-yellow"
        >
          <v-list-item-icon>
            <v-icon small>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>
  </div>
  <!-- Show Referral Link Dialog -->
  <v-dialog
      v-model="showReferralDialog" max-width="500"
      overlay-opacity="0.6"
      overlay-color="grey"
    >
      <v-card dark>
        <v-card-title class="headline primary--text">Referral Link</v-card-title>
        <v-card-text class="py-6" id="copy-code">
          <v-text-field
            v-model="referralLink"
            outlined readonly label="Referral Link"
            type="text"
          >
            <template v-slot:append-outer>
              <v-tooltip :value="showCodeTooltip" top>
                <template v-slot:activator="{ attrs }">
                  <v-btn
                    @click="copyCode" v-bind="attrs"
                    class="primary black--text"
                    style="margin-top: -17px; height: 55px;"
                  >Copy</v-btn>
                </template>
                <span>Referral Link Copied !</span>
              </v-tooltip>
            </template>
            <div id="copy-code"></div>
          </v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary" text
            @click="showReferralDialog = false"
          >
            <b>Close</b>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Show Referral Link Dialog -->
  <v-dialog
      v-model="addAccountDialog" max-width="500"
      overlay-opacity="0.6" persistent
      overlay-color="grey"
    >
      <v-form ref="addAccountForm" lazy @submit.prevent="addAccount">
        <v-card dark>
          <v-card-title class="headline primary--text">Add Account</v-card-title>
          <v-card-text class="py-6" id="copy-code">
            <v-row>
              <v-col v-if="selectedAccountModel" cols="12" class="py-2">
                <v-select
                  :value="selectedAccountModel"
                  :items="accounts"
                  prepend-inner-icon="fas fa-user"
                  item-text="name" readonly
                  label="Referrer" return-object
                  dense outlined
                ></v-select>
              </v-col>
              <v-col cols="12" class="py-2">
                <v-text-field
                  v-model="addAccountForm.package_code"
                  label="Package Code" outlined flat dense
                  prepend-inner-icon="fas fa-user"
                  :error="!!errors.package_code"
                  :error-messages="errors.package_code ? errors.package_code : []"
                  :rules="[ v => !!v || 'Package Code is required.' ]"
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
              <v-btn
                @click="resetAddAccount"
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
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex'
import adminNavigation from '@/json/admin-navigation.json'
import sellerNavigation from '@/json/seller-navigation.json'
import userNavigation from '@/json/user-navigation.json'

export default {
  props: {
    value: {
      type: Boolean,
      required: false
    }
  },
  data: () => ({
    adminItems: adminNavigation,
    sellerItems: sellerNavigation,
    userItems: userNavigation,
    showCodeTooltip: false,
    showReferralDialog: false,
    referralLink: '',
    addAccountDialog: false,
    addAccountForm: {},
    errors: {},
    submitting: false
  }),
  computed: {
    ...mapGetters({
      profile: 'profile',
      role: 'role',
      accounts: 'accounts',
      selectedAccount: 'selectedAccount'
    }),
    items () {
      switch (this.role) {
        case 'Admin':
          return this.adminItems
        case 'Seller':
          return this.sellerItems
        default:
          return this.userItems
      }
    },
    inputValue: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    },
    selectedAccountModel: {
      get () {
        return this.selectedAccount
      },
      set (val) {
        this.$cookies.set('account', val)
        this.$store.commit('setSelectedAccount', val)
      } 
    }
  },
  methods: {
    showReferral () {
      this.referralLink = window.location.origin + '/register/' + this.selectedAccount.code
      this.showReferralDialog = true
    },
    copyCode () {
      const el = document.createElement('textarea')
      el.value = this.referralLink
      document.getElementById('copy-code').appendChild(el)
      el.select()
      document.execCommand('Copy')
      document.getElementById('copy-code').removeChild(el)
      this.showCodeTooltip = true
      setTimeout(() => {
        this.showCodeTooltip = false
      }, 1000)
    },
    goTo (path) {
      if (this.$route.path !== path) {
        this.$router.push(path)
      }
    },
    call (middleware, path) {
      this[middleware](path)
    },
    async addAccount () {
      if (this.$refs.addAccountForm.validate()) {
        try {
          this.submitting = true
          this.addAccountForm.referrer_id = this.selectedAccountModel ? this.selectedAccountModel.id : null
          await this.$axios.post('/user/accounts', this.addAccountForm)
          this.resetAddAccount()
          this.showSnackbar('success', 'Account has been registered successfully.')
          this.$store.dispatch('getAccounts')
        } catch (e) {
          this.errors = e.response && e.response.data.errors ? e.response.data.errors : {}
          this.showSnackbar('error', e.response ? e.response.data.message : e.message)
        } finally {
          this.submitting = false
        }
      }
    },
    resetAddAccount () {
      this.errors = {}
      this.addAccountForm = {}
      this.$refs.addAccountForm.resetValidation()
      this.addAccountDialog = false
    }
  }
}
</script>

<style scoped>
a {
    font-size: 15px;
    color: #757575  !important;
    text-decoration: none;
}
i {
  width: 10px;
  margin-left: 15px;
}
</style>
