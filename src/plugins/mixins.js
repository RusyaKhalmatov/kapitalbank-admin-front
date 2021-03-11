const globalHandler = {
  install(Vue) {
    Vue.mixin({
      data() {
        return {
          loader: false
        }
      },
      methods: {
        hasItem(obj, key, default_value = null){
          return typeof obj[key] !== 'undefined' ? obj[key] : default_value
        },
        registerDevice() {
          let self = this;
          self.$fingerPrint.then(value => {
            self.device.deviceId = value;
            self.device.name = "ADMIN";
            self.$http.post(self.$store.getters.newApiUrl + '/device', self.device)
              .then(() => {
                self.$store.commit('deviceId', value);
              }, self.handleError);
          })
        },
        handleError(response) {
          if (response.status === 401) {
            this.loader = false;
            this.redirect('login');
          }
          if (response.status === 423) {
            this.loader = false;
            this.registerDevice();
          }
          this.loader = false;
          this.$store.commit('errorMessage', response.data.errorMessage);
        },
        redirect(name, params) {
          this.$router.push({name: name, params: params});
        },
        successMessage(response) {
          this.$store.commit('successMessage', response);
        },
        infoMessage(message) {
          this.$store.commit('infoMessage', message);
        },
        errorMessage(message) {
          this.$store.commit('errorMessage', message);
        }
      }
    });
  }
};
export default globalHandler;
