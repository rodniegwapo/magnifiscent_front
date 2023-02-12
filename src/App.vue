<template>
  <v-app>
    <template v-if="!mounting">
      <template v-if="login">
        <navigation v-model="drawer"/>
        <v-app-bar
          app dark clipped-left
          class="black"
        >
          <v-app-bar-nav-icon
            @click="drawer = !drawer"
          ></v-app-bar-nav-icon>
          <v-toolbar-title class="d-flex">
            <v-img
              src="/logo.png"
              width="30" height="30"
              class="mr-2"
            />
            <span class="d-none d-md-block pr-2">Magnifiscent500</span>
            <span class="d-block d-md-none pr-2">M500</span>
            Premium
          </v-toolbar-title>
          <v-spacer />
          <v-menu
            v-model="notification" bottom
            origin="center center"
            transition="scale-transition"
            :offset-y="true"
            nudge-bottom="10"
            min-width="200px"
          >
            <template v-slot:activator="{ on }">
              <v-badge
                v-if="profile.role.name === 'User'"
                :content="totalUnreadNotifications" :value="totalUnreadNotifications"
                color="red" overlap
                class="mr-4"
              >
                <v-icon v-on="on">
                  fas fa-bell
                </v-icon>
              </v-badge>
            </template>
            <v-card class="elevation-0 pa-0" dark>
              <v-card-text class="pa-0">
                <v-list dense rounded>
                  <v-list-item v-for="(no, index) in notifications" :key="index">
                    <v-list-item-action>
                      <v-icon style="font-size: 16px;">fas fa-gift</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title class="text-left" style="font-size: 14px;">
                        {{ no.title }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="notifications.length > 0"
                    @click="goToNotificationPage"
                  >
                    <v-list-item-content>
                      <v-list-item-title
                        class="text-center cursor-pointer primary--text" style="font-size: 14px;"
                      >
                        Open Notifications
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item v-else>
                    <v-list-item-content>
                      <v-list-item-title
                        class="text-center cursor-pointer primary--text" style="font-size: 14px;"
                      >
                        No available notifications
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-menu>
          <v-menu
            bottom
            origin="center center"
            transition="scale-transition"
            :offset-y="true"
            nudge-bottom="10"
            min-width="200px"
          >
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" class="ml-2 elevation-0" fab small>
                <v-avatar :class="roleColor(profile.role.name)" size="35">
                  <span v-if="profile.first_name && ! profile.avatar" class="white--text text-button">
                    {{ profile.first_name.substr(0, 1) + profile.last_name.substr(0, 1) }}
                  </span>
                  <img
                    v-else alt="avatar"
                    :class="borderColorByRole(profile.role.name)"
                    :src="profile.avatar"
                  />
                </v-avatar>
              </v-btn>
            </template>
            <v-card class="elevation-0 pa-0" dark>
              <v-card-text class="pa-0">
                <v-list dense rounded>
                  <v-list-item
                    to="/profile" link
                    active-class="custom-yellow"
                  >
                    <v-list-item-action>
                      <v-icon style="font-size: 20px;">fas fa-user-circle</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title
                        class="text-left"
                        style="font-size: 14px;"
                      >
                        Profile
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    @click="logOut()"
                    link active-class="primary white--text"
                  >
                    <v-list-item-action>
                      <v-icon style="font-size: 20px;">fas fa-sign-out-alt</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title class="text-left" style="font-size: 14px;">
                        Log Out
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-menu>
        </v-app-bar>
      </template>
      <v-main class="grey darken-3">
        <v-container fluid class="h-full">
          <router-view></router-view>
        </v-container>
      </v-main>
      <v-snackbar
        v-model="snackbar"
        :timeout="snackbarTimeout"
        top right
      >
        <template v-slot:default>
          <div class="py-2 pl-2 d-flex align-center">
            <div class="pr-2">
              <v-icon large :color="snackbarType">
                fas {{ snackbarType === 'success' ? 'fa-smile-beam' : 'fa-frown' }}
              </v-icon>
            </div>
            <div>{{ snackbarText }}</div>
          </div>
        </template>
        <template v-slot:action="{ attrs }">
          <div class="pa-2">
            <v-btn
              @click="snackbar = false"
              color="primary" text fab v-bind="attrs" small
            >
              <v-icon small>fas fa-times</v-icon>
            </v-btn>
          </div>
        </template>
      </v-snackbar>
    </template>
    <page-loading v-else />
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import Navigation from '@/components/Navigation'
import PageLoading from '@/components/PageLoading'

export default {
  name: 'App',
  components: {
    Navigation,
    PageLoading
  },
  data: () => ({
    drawer: null,
    mounting: true,
    notification: false
  }),
  async mounted () {
    if (this.login) {
      await this.getProfile()
      this.mounting = false
    } else {
      this.mounting = false
    }
  },
  computed: {
    ...mapGetters({
      login: 'login',
      profile: 'profile',
      role: 'role',
      snackbarText: 'snackbarText',
      snackbarType: 'snackbarType',
      snackbarTimeout: 'snackbarTimeout',
      totalUnreadNotifications: 'totalUnreadNotifications',
      notifications: 'notifications'
    }),
    snackbar: {
      get () {
        return this.$store.getters.snackbar
      },
      set (value) {
        this.$store.commit('setSnackbar', value)
      }
    }
  },
  watch: {
    async notification (newV) {
      if (newV) {
        await this.$axios.post('/user/notifications/read')
        this.$store.commit('readNotifications')
      }
    }
  },
  methods: {
    async logOut () {
      await this.$axios.post('/log-out')
      this.logOutClient()
    },
    logOutClient () {
      this.$cookies.keys().forEach(cookie => this.$cookies.remove(cookie))
      this.$store.commit('reset')
      this.$router.push('/login')
    },
    goToNotificationPage () {
      const path = '/user/notification'
      if (this.$route.path !== path) {
        this.$router.push(path)
      }
    },
    async getProfile () {
      try {
        await this.$store.dispatch('getProfile')
        if (this.role === 'User') {
          await this.$store.dispatch('getAccounts')
          await this.$store.dispatch('getNotifications')
        }
      } catch (e) {
        this.logOutClient()
      }
    }
  }
}
</script>

<style>
.yellow-brand-color {
  background-color: linear-gradient(90deg,#bf953f,#fcf6ba,#b38728,#fbf5b7,#aa771c);
}
</style>
