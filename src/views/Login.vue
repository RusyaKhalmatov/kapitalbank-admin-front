<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout justify-center class="mt-5">
        <v-flex xs12 sm12 md4>
          <v-card>
            <v-toolbar flat color="primary">
              <v-toolbar-title>
                Авторизация
              </v-toolbar-title>
            </v-toolbar>
            <v-stepper v-model="step">
              <v-stepper-items>
                <v-stepper-content step="login">
                  <v-card-text>
                    <v-text-field
                      v-model="login"
                      label="Логин"
                      autofocus
                      prepend-icon="mdi-account"
                      :disabled="loader"
                      @keyup.native.enter="checkForLogin"
                    />
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer/>
                    <v-btn :loading="loader"
                           color="primary"
                           @click.native="checkForLogin">
                      <span>Войти</span>
                    </v-btn>
                  </v-card-actions>
                </v-stepper-content>
                <v-stepper-content step="password">
                  <v-card-text>
                    <v-layout row wrap>
                      <v-flex xs12>
                        <v-text-field
                          disabled
                          v-model="login"
                          prepend-icon="mdi-account">
                        </v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-text-field
                          label="Пароль"
                          :disabled="loader"
                          autofocus
                          :type="showPassword ? 'text' : 'password'"
                          prepend-icon="mdi-lock"
                          v-model="password"
                          :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                          @click:append="() => showPassword = !showPassword"
                          @keyup.native.enter="authorization"
                        >
                        </v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <a @click="redirect('passwordReset',{login})">Reset Password</a>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn :loading="loader"
                           color="primary"
                           @click.native="authorization">
                      <span>login</span>
                    </v-btn>
                  </v-card-actions>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>
<script>

  export default {
    name: "Login",
    data() {
      return {
        login: null,
        password: null,
        showPassword: false,
        rememberMe: false,
        step: "login",
        device: {},
      }
    },
    methods: {
      checkForLogin() {
        let self = this;
        self.loader = true;
        self.$http.get(self.$store.getters.newApiUrl + '/check-user', {
          params: {
            phone: self.login
          }
        }).then(() => {
          self.loader = false;
          self.step = "password";
        }).catch(response => {
          self.loader = false;
          if (response.status === 400) {
            self.infoMessage("User doesn't exist!");
          }
          this.handleError(response)
        });
      },
      authorization() {
        let self = this;
        self.$http.post(self.$store.getters.newApiUrl + "/login-admin", {
          phone: self.login,
          password: self.password
        }).then(response => {
          let authData = response.data.data;
          if (authData && authData.token) {
            self.$store.commit('roles', authData.roles);
            self.$store.commit('token', authData.token);
            self.redirect('profile');
          }
        }, self.handleError);
      }
    },
    mounted() {
      this.registerDevice()
        .then(data => {
          this.device = data
        });
      this.$store.commit('token', null);
    }
  }
</script>
<style scoped>

</style>
