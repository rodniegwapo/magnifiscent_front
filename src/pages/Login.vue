<template>
  <div  class="d-flex justify-center align-center h-full">
    <v-row>
      <v-col cols="12" sm="8" md="4" offset-md="4" offset-sm="2">
        <v-card class="w-full pb-8" dark>
          <v-form @submit.prevent="login" ref="login" lazy>
            <div class="d-flex justify-center py-8" >
              <img class="w-1/2" src="/logo.png" alt="" />
            </div>
            <div class="px-16">
              <v-text-field
                v-model="form.username"
                prepend-inner-icon="fas fa-user"
                :rules="[ v => !!v || 'Email or Username is required' ]"
                label="Email or Username"
                required outlined class="required"
              ></v-text-field>
              <v-text-field
                class="py-2 required"
                v-model="form.password"
                prepend-inner-icon="fas fa-key"
                :rules="[ v => !!v || 'Password is required' ]"
                label="Password" type="password"
                required outlined
              ></v-text-field>
              <v-hover v-slot="{ hover }">
                <div
                  @click="$router.push('/reset-password')"
                  :class="hover ? 'primary--text' : 'white--text'"
                  class="d-flex w-full justify-end pb-3 text-overline cursor-pointer"
                >
                  Forgot your password ?
                </div>
              </v-hover>
              <v-btn
                type="submit" color="primary" block
                class="black--text"
                :class="{ 'pointer-events-none': submitting }"
                :loading="submitting"
              > Login </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  data: () => ({
    form: {},
    submitting: false
  }),
  methods: {
    async login () {
      this.gate('admin')
      // if (this.$refs.login.validate()) {
      //   try {
      //     this.submitting = true
      //     // Authenticate
      //     this.form.grant_type = 'password'
      //     this.form.client_id = process.env.VUE_APP_CLIENT_ID
      //     this.form.client_secret = process.env.VUE_APP_CLIENT_SECRET
      //     const auth = await this.$axios.post('/oauth/token', this.form)
      //     // Get Profile
      //     const token = auth.data.token_type + ' ' + auth.data.access_token
      //     this.$axios.defaults.headers.common['Authorization'] = token
      //     const profile = await this.$store.dispatch('getProfile')
      //     // profile.role.name = "Admin"
      //     const role = profile.role.name
      //     // Get Accounts for User
      //     if (role === 'User') {
      //       const account = await this.$store.dispatch('getAccounts')
      //       this.$cookies.set('account', account)
      //     }
      //     // Save Info to Cookies
      //     this.$cookies.set('token', token, auth.data.expires_in)
      //     this.$cookies.set('role', role, auth.data.expires_in)
      //     // Redirect
      //     this.gate(role)
      //   } catch (e) {
      //     this.showSnackbar('error', 'Invalid Credentials.')
      //   } finally {
      //     this.submitting = false
      //   }
      // }
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
      // this.$router.push('/user/dashboard')
    }
  }
}
</script>
