<template>
  <v-card flat class="pt-3 px-3" :class="color">
    <center>
      <v-avatar
        @click="$emit('click-profile')"
        size="60" class="rounded-circle mx-auto"
        :class="seat ? (seat.user ? 'success cursor-pointer' : 'black') : 'white'"
      >
        <template v-if="seat">
          <template v-if="seat.user">
            <img
              v-if="seat.user.avatar" alt="avatar"
              :src="seat.user.avatar"
            />
            <span v-else class="text-h6">
              {{ seat.user.first_name.substr(0, 1) + seat.user.last_name.substr(0, 1) }}
            </span>
          </template>
          <img v-else alt="magnifiscent500 logo" src="/logo.png" height="100%" />
        </template>
        <v-icon v-else color="black"> fas fa-chair </v-icon>
      </v-avatar>
    </center>
    <p class="text-center pt-2 text-button" style="text-transform: none!important;">
      {{ seat ? (seat.user ? seat.user.username + ' ' + seat.name : 'Admin') : 'Available Slot' }}
    </p>
  </v-card>
</template>

<script>
export default {
  props: {
    seat: {
      type: Object,
      required: false
    },
    color: {
      type: String,
      required: true
    }
  }
}
</script>