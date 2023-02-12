<template>
  <div class="d-flex justify-center align-center h-full">
    <v-row>
      <v-col cols="12" sm="8" md="4" offset-md="4" offset-sm="2">
        <v-card class="w-full" dark>
          <v-form @submit.prevent="resetPassword" ref="resetPassword" lazy>
            <div class="d-flex justify-center py-8" >
              <img class="w-1/2" src="/logo.png" alt="" />
            </div>
            <div class="px-16">
              <v-text-field
                v-model="form.username"
                prepend-inner-icon="fas fa-user"
                :rules="[ v => !!v || 'Email or Username is required' ]"
                :error="!!errors.username"
                :error-messages="errors.username ? errors.username : []"
                label="Email or Username"
                outlined class="required"
              ></v-text-field>
              <v-btn
                type="submit" color="primary" block
                class="black--text"
                :class="{ 'pointer-events-none': submitting }"
                :loading="submitting"
              > Reset Password </v-btn>
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
  </div>
</template>
<script>
export default {
  data: () => ({
    form: {},
    errors: {},
    submitting: false
  }),
  methods: {
    async resetPassword () {
      if (this.$refs.resetPassword.validate()) {
        try {
          this.submitting = true
          await this.$axios.post('/reset-password', this.form)
          this.showSnackbar('success', 'Please check your email.')
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
