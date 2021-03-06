import Vue from 'vue';
import Vuetify from 'vuetify';
import App from './App.vue';
import mixins from './plugins/mixins';
import router from './router';
import store from "./store";
import VueResource from 'vue-resource';
import 'vuetify/dist/vuetify.min.css'; // Ensure you are using css-loader
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import "@mdi/font/css/materialdesignicons.css"; // Ensure you are using css-loader
import numberFormatFilter from "./plugins/numberFormatFilter";
import colors from './colors';
import SnackbarMessage from './components/snackbar/SnackbarMessage';
import VFilePicker from './components/VFilePicker/VFilePicker';
import VDatePicker from './components/VDatePicker/VDatePicker';
import downloadExcel from 'vue-json-excel';
import millisToDate from "./plugins/millisToDate";
import millisToTime from "./plugins/millisToTime";
import timestampToDate from "./plugins/timestampToDateFilter";
import VDateTimePicker from "./components/VDateTimePicker/VDateTimePicker";
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import fingerprint from "./plugins/fingerprint";
import moment from 'moment';
import VueLivePreview from 'vue-live-preview'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import VueTheMask from 'vue-the-mask'
import VueChatScroll from 'vue-chat-scroll'
import VueClipboard from 'vue-clipboard2'
import VueScrollTo from 'vue-scrollto';

import { Form } from 'ant-design-vue'
import '@/assets/css/update.css';

Vue.use(VueChatScroll)
Vue.use(VueTheMask)
Vue.use(VueClipboard)
Vue.use(VueScrollTo)

Vue.use(Form)

// CodeMirror options
Vue.use(VueLivePreview, {
  theme: 'material',
  tabSize: 2,
  lineNumbers: true,
})

Vue.use(moment);
Vue.use(mixins);
Vue.use(numberFormatFilter);
Vue.use(SnackbarMessage);
Vue.use(VueResource);
Vue.use(VFilePicker);
Vue.use(VDatePicker);
Vue.use(downloadExcel);
Vue.use(millisToDate);
Vue.use(millisToTime);
Vue.use(timestampToDate);
Vue.use(VDateTimePicker);
Vue.use(VueQuillEditor, {});
Vue.component('downloadExcel', downloadExcel);

Vue.prototype.$fingerPrint = fingerprint;
Vue.use(Vuetify, {
    iconfont: 'mdi',
    theme: {
        primary: colors[0],
        accent: colors[1],
        error: colors[2],
        cancel: colors[2],
        warning: colors[4],
        info: colors[5],
        success: colors[6],
        danger: colors[3]
    }
});
Vue.config.productionTip = false;

Vue.http.headers.common['Content-Type'] = 'application/json'
Vue.http.headers.common['token'] = store.getters.token;
// Vue.http.headers.common['device-id'] = store.getters.deviceId;
// Vue.http.headers.common['app-version'] = store.getters.appVersion;
// Vue.http.headers.common['lang'] = 'ru'

Vue.http.interceptors.push(function(request, next) {
  console.log('request_URL = ', request.url);
  const is??pi5CheckServiceUrl = request.url.includes("/proxyReport/api/report");

  if (!is??pi5CheckServiceUrl){
    request.headers.set('device-id', store.getters.deviceId);
    request.headers.set('app-version', store.getters.appVersion);
    request.headers.set('lang', 'ru');
  } else {
    request.headers.set('token', '44561b2c-ceac-46d8-a8b5-9123ddb6856d');
  }

  next();
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
