import Vue from 'vue';
import Vuex from 'vuex';
import menu from './menu';
import api from './api';

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

    ...api,

    message: '',
    color: '',
    excelMeta: [
      [
        {
          key: 'charset',
          value: 'utf-8'
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
    cardId: '',
    statusAutoloan: '',
    branchAutoloan: '',
    employeeAutoloan: '',
    userId: '',
    socketUrl: {},
    assignments: [],
  },
  getters: {
    socketUrl: (state) => {
      return `http://192.168.120.14:8081/support?token=${state.token}&device-id=${state.deviceId}&lang=RU&app-version=${state.appVersion}`;
    },
    newChatApiUrl: (state) => state.newChatApiUrl,
    ucellApiUrl: (state) => state.ucellApiUrl,
    prodApiUrl: (state) => state.prodApiUrl,
    prodApiUrl2: (state) => state.prodApiUrl2,
    uname: (state) => state.uname,
    pass: (state) => state.pass,
    socketApi: (state) => state.apiStomp,
    token: (state) => state.token,
    cacheToken: (state) => {
      return atob(state.cacheToken);
    },
    deviceId: (state) => state.deviceId,
    roles: (state) => {
      if (state.roles.length === 0) {
        state.roles = JSON.parse(window.localStorage.getItem('roles'));
      }
      return state.roles;
    },
    navigation: (state) => state.navigation,
    toolbar: (state) => state.toolbar,
    apiUrl: (state) => state.apiUrl,
    beelineUrl: (state) => state.beelineUrl,
    ucellUrl: (state) => state.ucellUrl,
    newApiUrl: (state) => state.prodApiUrl,
    newApiUrl2: (state) => state.prodApiUrl2,
    reportApiUrl: (state) => state.api5Url,
    chatApiUrl: (state) => state.chatApiUrl,
    avtoApiUrl: (state) => state.avtoApiUrl,
    loyaltyUrl: (state) => state.loyaltyUrl,
    message: (state) => state.message,
    color: (state) => state.color,
    userName: (state) => {
      state.userName = window.localStorage.getItem('userName');
      return state.userName;
    },
    menu: (state) => {
      if (state.roles.length === 0) {
        state.roles = JSON.parse(window.localStorage.getItem('roles'));
      }
      return state.roles && menu[state.roles] ? menu[state.roles] : [];
    },
    pagination: (state) => {
      return state.pagination;
    },
    excelMeta: (state) => state.excelMeta,
    chatBotName: (state) => {
      return state.chatBotName;
    },
    appVersion: (state) => state.appVersion,
    statusAutoloan: (state) => state.statusAutoloan,
    branchAutoloan: (state) => state.branchAutoloan,
    employeeAutoloan: (state) => state.employeeAutoloan,
    userId: (state) => {
      state.userId = window.localStorage.getItem('userId');
      return state.userId;
    },
    getAssignments: (state) => state.assignments,
  },
  mutations: {
    setField(state, data) {
      for (let i in data) {
        if (typeof state[i] !== 'undefined') {
          state[i] = data[i];
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
    setAssignments(state, assignments) {
      state.assignments = assignments;
    },
    setAssignment(state, assignment) {
      const assignmentsWithoutOldAssignment = state.assignments.filter(e => e.assignmentId !== assignment.assignmentId)
      state.assignments = assignmentsWithoutOldAssignment.concat(assignment);
    },
  },
  actions: {
    getLanguageList({state, commit}) {
      return new Promise((resolve, reject) => {
        this._vm.$http
          .get(`${state.prodApiUrl}/loan-type/lang`)
          .then((response) => {
            commit('setField', {languageList: response.body.data});
            resolve();
          })
          .catch((err) => reject(err));
      });
    },
    getAssignments({ commit }) {
      return Vue.http.get(this.getters.apiUrl + "/assignment/all")
        .then(response => {
          const assignments = response.data.data;
          commit("setAssignments", assignments);
        }, this.handleError);
    },
    getAssignment({ commit }, { id }) {
      return Vue.http.get(this.getters.apiUrl + "/assignment/byAssignmentId?assignmentId=" + id)
        .then(response => {
          const assignment = response.data.data;
          commit("setAssignment", assignment);
        }, this.handleError);
    },
  }
});
