<template>
  <v-app>
    <navigation/>
    <v-toolbar
      app
      :clipped-left="$vuetify.breakpoint.mdAndUp"
      fixed
      color="primary"
      v-if="$store.getters.toolbar"
    >
      <v-toolbar-side-icon @click.stop="navigation = !navigation"/>
      <v-toolbar-title>
        <span class="headline"><h5 style="margin:0">{{userName}}</h5></span>
      </v-toolbar-title>
      <v-spacer/>
      <toolbar-widget/>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <v-layout justify-center align-center>
          <router-view/>
        </v-layout>
      </v-container>
    </v-content>
    <snackbar-message v-model="$store.getters.message" :color="$store.getters.color"/>
  </v-app>
</template>

<script>
  import Navigation from '@/components/navigation/Navigation';
  import ToolbarWidget from '@/components/widget/ToolbarWidget';
  import SnackbarMessage from "@/components/snackbar/SnackbarMessage";
  import { mapActions } from 'vuex'

  export default {
    name: 'app',
    components: {
      SnackbarMessage,
      Navigation,
      ToolbarWidget
    },
    beforeMount() {
      let self = this;
      let token = window.localStorage.getItem("token");
      let deviceId = window.localStorage.getItem("deviceId");
      if (!token) {
        self.$store.commit('navigation', false);
        self.$store.commit('toolbar', false);
        self.redirect('login');
      } else if (!self.$store.getters.token) {
        self.$store.commit('token', token);
        self.$store.commit('deviceId', deviceId);
      }
    },
    computed: {
      navigation: {
        get() {
          return this.$store.getters.navigation;
        },
        set(value) {
          this.$store.commit('navigation', value);
        }
      },
      userName: {
        get() {
          return this.$store.getters.userName;
        },
        // set(value) {
        //     this.$store.commit('userName', value);
        // }
      }
    },
    methods: {
      // ...mapActions(['getLanguageList']) COMMENT

      // loadUser() {
      //     let self = this;
      //     self.$http.get(self.$store.getters.apiUrl + `/user`).then(response => {
      //         self.userName = response.data.data.message;
      //     }, self.handleError);
      // }
    },
    mounted() {
      // this.registerDevice()
      //   .then(() => {
      //     this.getLanguageList()
      //       .catch(err => this.handleError(err))
      //   }) COMMENT
      if (this.$route.name !== 'login') {
        console.log("TESTING....")
      }
      // if (!self.userName) {
      //     self.loadUser();
      // }
    }
  }
</script>

<style>
  @media all and (max-width: 500px) {
    .headline {
      font-size: 15px !important;
    }

    h5 {
      margin: 0;
    }
  }
</style>
