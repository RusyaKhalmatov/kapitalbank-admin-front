const globalHandler = {
  install(Vue) {
    Vue.mixin({
      data() {
        return {
          loader: false
        }
      },
      computed: {
        formRules(){
          return {
            required: { required: true, message: 'Это поле обязательно к заполнению' }
          }
        }
      },
      methods: {
        hasItem(obj, key, default_value = null){
          return typeof obj[key] !== 'undefined' ? obj[key] : default_value
        },
        parseImageUrl(src){
          return src.replace('https://t-online.kapitalbank.uz', 'http://192.168.131.2:8091')
        },
        getImageBase64(img, callback) {
          const reader = new FileReader();
          reader.addEventListener('load', () => callback(reader.result));
          reader.readAsDataURL(img);
        },
        registerDevice() {
          return new Promise((resolve, reject) => {
            let self = this;
            self.$fingerPrint.then(value => {
              /*self.device.deviceId = value;
              self.device.name = "ADMIN";*/
              self.$http.post(self.$store.getters.newApiUrl + '/device', {
                deviceId: value,
                name: "ADMIN"
              })
                .then(() => {
                  self.$store.commit('deviceId', value);
                  resolve({
                    deviceId: value,
                    name: "ADMIN"
                  })
                }, self.handleError);
            })
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
          if (this.$route.name !== name) {
            this.$router.push({name: name, params: params});
          } else {
            console.info("DUPLICATE CHANGE ROUTER: ", name)
          }
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
