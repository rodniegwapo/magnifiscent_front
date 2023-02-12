<template>
  <div class="d-flex justify-center align-center h-full">
    <v-row v-if="! loading">
      <v-col cols="12" sm="8" md="4" offset-md="4" offset-sm="2">
        <v-card class="w-full" dark>
          <v-form @submit.prevent="updatePassword" ref="updatePassword" lazy>
            <div class="d-flex justify-center py-8" >
              <img class="w-1/2" src="/logo.png" alt="" />
            </div>
            <div class="px-16">
              <v-text-field
                v-model="form.new_password"
                type="password"
                :rules="[ v => !!v || 'Password is required.' ]"
                label="Password"
                prepend-inner-icon="fas fa-key"
                outlined class="required"
              />
              <v-text-field
                v-model="form.confirm_new_password"
                type="password"
                :rules="[
                  v => !!v || 'Confirm Password is required.',
                  v => v === form.new_password || 'Confirm Password and Password doesn\'t match.'
                ]"
                label="Confirm Password"
                prepend-inner-icon="fas fa-key"
                outlined class="required"
              />
              <v-btn
                type="submit" color="primary" block
                class="black--text"
                :class="{ 'pointer-events-none': submitting }"
                :loading="submitting"
              > Update Password </v-btn>
            </div>
          </v-form>
          <v-hover v-slot="{ hover }">
            <div
              @click="$router.push('/login')"
              :class="hover ? 'primary--text' : 'white--text'"
              class="d-flex w-full justify-end px-16 py-4 text-overline cursor-pointer"
            >
              Cancel
            </div>
          </v-hover>
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
    passwordReset: {},
    submitting: false
  }),
  mounted () {
    this.getPasswordReset()
  },
  methods: {
    async getPasswordReset () {
      try {
        this.loading = true
        const passwordReset = await this.$axios.get('/password-reset/' + this.$route.params.token)
        this.passwordReset = passwordReset.data.data
      } catch (e) {
        this.$router.push('/page-not-found')
      } finally {
        this.loading = false
      }
    },
    async updatePassword () {
      if (this.$refs.updatePassword.validate()) {
        try {
          this.submitting = true
          this.form.token = this.passwordReset.token
          await this.$axios.post('/update-password', this.form)
          this.showSnackbar('success', 'Your password is updated successfully.')
          this.errors = {}
          this.$router.push('/login')
        } catch (e) {
          this.errors = e.response && e.response.data.errors ? e.response.data.errors : {}
          this.showSnackbar('error', e.response ? e.response.data.message : e.message)
        } finally {
          this.submitting = false
        }
      }
    }
  }
}
</script>
