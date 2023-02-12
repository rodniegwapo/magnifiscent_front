<template>
  <div  class="d-flex justify-center align-center h-full">
    <v-row v-if="! loading">
      <v-col cols="12" sm="8" md="8" offset-md="2" offset-sm="2">
        <v-card class="overflow-hidden">
          <v-row>
            <v-col cols="12" sm="12" md="5" class="pa-0">
              <v-card class="w-full h-full rounded-0 py-10 d-flex flex-column" dark>
                <div class="d-flex justify-center py-8 h-full align-center">
                  <img class="w-1/2" src="/logo.png" alt="" />
                </div>
                <v-hover v-slot="{ hover }">
                  <div
                    @click="$router.push('/login')"
                    style="position: absolute; bottom: 0px;"
                    class="d-flex w-full justify-end px-16 py-4 text-overline cursor-pointer"
                    :class="hover ? 'primary--text' : 'white--text'"
                  >
                    Already have an account ?
                  </div>
                </v-hover>
              </v-card>
            </v-col>
            <v-col cols="12" sm="12" md="7" class="pa-0">
              <v-form lazy ref="form" @submit.prevent="register">
                <v-card class="grey darken-4 h-full rounded-0 py-10 px-4">
                  <v-card-text>
                    <v-row>
                      <v-col v-if="referrer && referrer.user" cols="12" class="py-1">
                        <v-text-field
                          label="Reffered By"
                          :value="accountRefferer"
                          prepend-inner-icon="fas fa-user"
                          outlined flat dense readonly
                        />
                      </v-col>
                      <v-col cols="12" class="py-1">
                        <v-text-field
                          v-model="form.package_code"
                          :error="!!errors.package_code"
                          :error-messages="errors.package_code ? errors.package_code : []"
                          label="Package Code" class="required"
                          :rules="[ v => !!v || 'Package Code is required.' ]"
                          prepend-inner-icon="fas fa-cubes"
                          outlined flat dense
                        />
                      </v-col>
                      <v-col cols="12" md="6" sm="12" class="py-1">
                        <v-text-field
                          v-model="form.first_name"
                          :rules="[ v => !!v || 'First Name is required.' ]"
                          label="First Name" class="required"
                          prepend-inner-icon="fas fa-user"
                          outlined flat dense
                        />
                      </v-col>
                      <v-col cols="12" md="6" sm="12" class="py-1">
                        <v-text-field
                          v-model="form.middle_name"
                          :rules="[ v => !!v || 'Middle Name is required.' ]"
                          label="Middle Name"
                          prepend-inner-icon="fas fa-user"
                          outlined flat dense
                        />
                      </v-col>
                      <v-col cols="12" md="6" sm="12" class="py-1">
                        <v-text-field
                          v-model="form.last_name"
                          :rules="[ v => !!v || 'Last Name is required.' ]"
                          label="Last Name" class="required"
                          prepend-inner-icon="fas fa-user"
                          outlined flat dense
                        />
                      </v-col>
                      <v-col cols="12" md="6" sm="12" class="py-1">
                        <v-text-field
                          v-model="form.mobile_no"
                          :error="!!errors.mobile_no"
                          :error-messages="errors.mobile_no ? errors.mobile_no : []"
                          :rules="[ v => !!v || 'Mobile Number is required.' ]"
                          label="Mobile Number" class="required"
                          prepend-inner-icon="fas fa-user"
                          outlined flat dense
                        />
                      </v-col>
                      <v-col cols="12" md="12" sm="12" class="py-1">
                        <v-text-field
                          v-model="form.address"
                          label="Address" name="address"
                          :rules="[ v => !!v || 'Address is required.' ]"
                          prepend-inner-icon="fas fa-map-marker-alt"
                          outlined flat dense type="text"
                          class="required"
                        />
                      </v-col>
                      <v-col cols="12" md="6" sm="12" class="py-1">
                        <v-text-field
                          v-model="form.email"
                          :error="!!errors.email"
                          :error-messages="errors.email ? errors.email : []"
                          :rules="[
                            v => !!v || 'Email is required.',
                            v => /.+@.+\..+/.test(v) || 'Email is invalid.'
                          ]"
                          label="Email" class="required"
                          prepend-inner-icon="fas fa-user"
                          outlined flat dense
                        />
                      </v-col>
                      <v-col cols="12" md="6" sm="12" class="py-1">
                        <v-text-field
                          v-model="form.username"
                          :error="!!errors.username"
                          :error-messages="errors.username ? errors.username : []"
                          :rules="[ v => !!v || 'Username is required.' ]"
                          label="Username" class="required"
                          prepend-inner-icon="fas fa-user"
                          outlined flat dense
                        />
                      </v-col>
                      <v-col cols="12" class="py-1">
                        <v-text-field
                          v-model="form.password"
                          type="password"
                          :rules="[ v => !!v || 'Password is required.' ]"
                          :error="!!errors.password"
                          :error-messages="errors.password ? errors.password : []"
                          label="Password" class="required"
                          prepend-inner-icon="fas fa-key"
                          outlined flat dense
                        />
                      </v-col>
                      <v-col cols="12" class="py-1">
                        <v-text-field
                          v-model="form.confirm_password"
                          type="password" class="required"
                          :rules="[
                            v => !!v || 'Confirm Password is required.',
                            v => v === form.password || 'Confirm Password and Password doesn\'t match.'
                          ]"
                          label="Confirm Password"
                          prepend-inner-icon="fas fa-key"
                          outlined flat dense
                        />
                      </v-col>
                      <v-col cols="12">
                        <div class="d-flex justify-space-between">
                          <v-checkbox
                            v-model="form.agree"
                            color="primary"
                            class="terms-and-conditions"
                            hide-details
                          ></v-checkbox>
                          <span class="text-overline cursor-pointer">
                            I agree to the
                            <span class="primary--text" @click="openTermsOfService"> Terms of Service.</span>
                          </span>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions class="px-4">
                    <v-btn
                      type="submit" color="primary" block
                      class="black--text"
                      :class="{ 'pointer-events-none': submitting }"
                      :loading="submitting"
                    > Register </v-btn>
                  </v-card-actions>
                </v-card>
              </v-form>
            </v-col> 
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <page-loading v-else />
  </div>
</template>
<script>
import PageLoading from '@/components/PageLoading'

export default {
  components: {
    PageLoading
  },
  data: () => ({
    form: {},
    loading: true,
    errors: {},
    referrer: null,
    submitting: false
  }),
  async mounted () {
    const code = this.$route.params.referrer_code
    if (code) {
      await this.getReferrer(code)
    }
    this.loading = false
  },
  computed: {
    accountRefferer () {
      const user = this.referrer.user
      return user.first_name + ' ' + user.last_name + ' - ' + this.referrer.name
    }
  },
  methods: {
    openTermsOfService () {
      window.open('/terms-of-service')
    },
    async register () {
      if (this.$refs.form.validate()) {
        if (this.form.agree) {
          try {
            this.submitting = true
            if (this.referrer) {
              this.form.referrer_id = this.referrer.id
            }
            await this.$axios.post('/register', this.form)
            await this.login()
            this.errors = {}
            this.showSnackbar('success', 'You are registered successfully.')
          } catch (e) {
            this.errors = e.response && e.response.data.errors ? e.response.data.errors : {}
            this.showSnackbar('error', e.response ? e.response.data.message : e.message)
          } finally {
            this.submitting = false
          }
        } else {
          this.showSnackbar('error', 'You must agree to the Terms of Service.')
        }
      }
    },
    async login () {
      // Authenticate
      const auth = await this.$axios.post('/oauth/token', {
        grant_type: 'password',
        client_id: process.env.VUE_APP_CLIENT_ID,
        client_secret: process.env.VUE_APP_CLIENT_SECRET,
        username: this.form.username,
        password: this.form.password
      })
      // Get Profile
      const token = auth.data.token_type + ' ' + auth.data.access_token
      this.$axios.defaults.headers.common['Authorization'] = token
      const profile = await this.$store.dispatch('getProfile')
      const role = profile.role.name
      // Get Accounts for User
      if (role === 'User') {
        const account = await this.$store.dispatch('getAccounts')
        this.$cookies.set('account', account)
      }
      // Save Info to Cookies
      this.$cookies.set('token', token, auth.data.expires_in)
      this.$cookies.set('role', role, auth.data.expires_in)
      // Redirect
      this.gate(role)
    },
    gate (role) {
      switch (role) {
        case 'Admin':
          this.$router.push('/admin/dashboard')
          break
        case 'Seller':
          this.$router.push('/seller/dashboard')
          break
        default:
          this.$router.push('/user/dashboard')
          break
      }
    },
    async getReferrer (code) {
      try {
        const referrer = await this.$axios.get('/accounts/' + code)
        this.referrer = referrer.data.data
      } catch (e) {
        this.$router.push('/page-not-found')
      }
    }
  }
}
</script>
