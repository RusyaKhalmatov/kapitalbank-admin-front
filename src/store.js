import Vue from 'vue';
import Vuex from 'vuex';
import menu from './menu';

Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    languageList: [],

    uname: 'AVtO_L0aN_8f234_Ssmeiq',
    pass: '&*sk92jf8.1521aydd3810bx742n54kiygh2',
    token: '',
    cacheToken: 'SXJlYkJaYVcxa3JkSlBiWGtCcDA5ZUVLZllUVmQ3TXk=',
    roles: '',
    deviceId: '',
    appVersion: 'rootAdmin',
    navigation: true,
    userName: '',
    toolbar: true,
    // apiUrl: 'https://mobile.kapitalbank.uz/api',
    prodApiUrl: 'http://192.168.131.2:8082/api',
    prodApiUrl2: 'http://192.168.131.2:8091/api',
    apiUrl: 'http://192.168.131.2:8091/api',
    // apiUrl: 'http://192.168.132.1:8091/api',

    //avtoApiUrl: 'https://dev.kapitalbank.uz/api',
    avtoApiUrl: 'https://dev.kapitalbank.uz/api',
    //avtoApiUrl: 'http://192.168.120.10:8080/api',
    // newApiUrl: 'http://192.168.118.34:8091/api',
    newApiUrl: 'http://192.168.131.2:8091/api',

    // chatApiUrl: 'https://preprod-mobile.kapitalbank.uz/api',
    chatApiUrl: 'http://192.168.131.2:8091/api',

    // newApiUrl: 'http://192.168.117.51:8091/api',
    // apiUrl: 'https://mobile.kapitalbank.uz/api',
    // apiUrl: 'http://192.168.120.51:8082/api',                  //Mirror
    // apiUrl: 'http://192.168.118.20:8082/api',
    // apiUrl: 'http://192.168.120.3:8082/api',                    //prod1
    // apiUrl: 'http://192.168.119.3:8082/api',                    //dev
    // apiUrl: 'http://localhost:8082/api',
    // apiStomp: 'http://localhost:8082/ws',
    // apiStomp: 'http://192.168.120.51:8082/ws',
    apiStomp: 'http://192.168.120.23:8082/ws',
    // apiStomp: 'http://192.168.120.51:8082/ws',


    // apiStomp: 'http://mobile.kapitalbank.uz/ws',
    message: '',
    color: '',
    excelMeta: [
      [
        {
          'key': 'charset',
          'value': 'utf-8'
        }
      ]
    ],
    pagination: {
      page: 1,
      rowsPerPage: 10
    },
    chatBotName: '',
    chatBotType: '',
    chatBotParentId: '',
    listData: [],
    telegramBotUrl: 'http://192.168.120.9:8077/api',
    // telegramBotUrl: 'http://192.168.118.55:8077/api',
    // telegramBotUrl: 'http://192.168.119.5:8077/api',

    cardId: '',
    ecommerceUrl: 'https://api.kapitalbank.uz/api',
    ucellUrl: 'https://ek.kapitalbank.uz/api',
    ucellApiUrl: 'http://192.168.118.34:8079/api',

    beelineUrl: 'http://192.168.120.22:8078/api',

    // loyaltyUrl: 'http://192.168.120.51:8083/api',
    loyaltyUrl: 'http://192.168.131.2:8091/api',
    // loyaltyUrl: 'http://192.168.117.47:8083/api',

    statusAutoloan: '',
    branchAutoloan: '',
    employeeAutoloan: '',
    userId: '',
    socketUrl: {},
    newChatApiUrl: 'http://192.168.120.14:8081/api',
  },
  getters: {
    socketUrl: state => {
      return `http://192.168.120.14:8081/support?token=${state.token}&device-id=${state.deviceId}&lang=RU&app-version=${state.appVersion}`
    },
    newChatApiUrl: state => state.newChatApiUrl,
    ucellApiUrl: state => state.ucellApiUrl,
    prodApiUrl: state => state.prodApiUrl,
    uname: state => state.uname,
    pass: state => state.pass,
    socketApi: state => state.apiStomp,
    token: state => state.token,
    cacheToken: state => {
      return atob(state.cacheToken)
    },
    deviceId: state => state.deviceId,
    roles: state => {
      if (state.roles.length === 0) {
        state.roles = JSON.parse(window.localStorage.getItem('roles'));
      }
      return state.roles;
    },
    navigation: state => state.navigation,
    toolbar: state => state.toolbar,
    apiUrl: state => state.apiUrl,
    beelineUrl: state => state.beelineUrl,
    ucellUrl: state => state.ucellUrl,
    newApiUrl: state => state.prodApiUrl,
    newApiUrl2: state => state.prodApiUrl2,
    chatApiUrl: state => state.chatApiUrl,
    avtoApiUrl: state => state.avtoApiUrl,
    loyaltyUrl: state => state.loyaltyUrl,
    message: state => state.message,
    color: state => state.color,
    userName: state => {
      state.userName = window.localStorage.getItem('userName')
      return state.userName
    },
    menu: state => {
      if (state.roles.length === 0) {
        state.roles = JSON.parse(window.localStorage.getItem('roles'));
      }
      return state.roles && menu[state.roles] ? menu[state.roles] : [];
    },
    pagination: state => {
      return state.pagination;
    },
    excelMeta: state => state.excelMeta,
    chatBotName: state => {
      return state.chatBotName;
    },
    appVersion: state => state.appVersion,
    statusAutoloan: state => state.statusAutoloan,
    branchAutoloan: state => state.branchAutoloan,
    employeeAutoloan: state => state.employeeAutoloan,
    userId: state => {
      state.userId = window.localStorage.getItem('userId')
      return state.userId
    }
  },
  mutations: {
    setField(state, data){
      for (let i in data) {
        if (typeof state[i] !== 'undefined') {
          state[i] = data[i]
        }
      }
    },
    chatBotParentId(state, chatBotParentId) {
      state.chatBotParentId = chatBotParentId;
    },
    chatBotType(state, chatBotType) {
      state.chatBotType = chatBotType;
    },
    chatBotName(state, chatBotName) {
      state.chatBotName = chatBotName;
    },
    socketApi(state, apiStomp) {
      state.apiStomp = apiStomp;
    },
    pagination(state, pagination) {
      state.pagination = pagination;
    },
    userName(state, userName) {
      window.localStorage.setItem('userName', userName);
      state.userName = userName;
    },
    userId(state, id) {
      state.userId = id;
      if (id) {
        window.localStorage.setItem('userId', id);
      } else {
        window.localStorage.removeItem('userId');
      }
    },
    token(state, token) {
      state.token = token;
      Vue.http.headers.common['token'] = token;
      if (token) {
        state.toolbar = true;
        state.navigation = true;
        window.localStorage.setItem('token', token);
      } else {
        state.toolbar = false;
        state.navigation = false;
        window.localStorage.removeItem('token');
      }
    },
    roles(state, roles) {
      state.roles = roles;
      window.localStorage.setItem('roles', JSON.stringify(roles));
    },
    deviceId(state, deviceId) {
      state.deviceId = deviceId;
      Vue.http.headers.common['device-id'] = deviceId;
      if (deviceId) {
        window.localStorage.setItem('deviceId', deviceId);
      } else {
        window.localStorage.removeItem('deviceId');
      }
    },
    navigation(state, navigation) {
      state.navigation = navigation;
    },
    toolbar(state, toolbar) {
      state.toolbar = toolbar;
    },
    errorMessage(state, errorMessage) {
      state.message = errorMessage;
      state.color = 'error';
    },
    successMessage(state, successMessage) {
      state.message = successMessage;
      state.color = 'success';
    },
    infoMessage(state, infoMessage) {
      state.message = infoMessage;
      state.color = 'info';
    },
    message(state, message) {
      state.message = message;
    },
    color(state, color) {
      state.color = color;
    },
    statusAutoloan(state, statusAutoloan) {
      state.statusAutoloan = statusAutoloan;
    },
    branchAutoloan(state, branchAutoloan) {
      state.branchAutoloan = branchAutoloan;
    },
    employeeAutoloan(state, employeeAutoloan) {
      state.employeeAutoloan = employeeAutoloan;
    },
  },
  actions: {
    getLanguageList({state, commit}){
      return new Promise((resolve, reject) => {
        this._vm.$http.get(`${state.prodApiUrl}/loan-type/lang`)
          .then(response => {
            commit('setField',{languageList: response.body.data})
            resolve()
          })
          .catch(err => reject(err));
      })
    }
  }
});
