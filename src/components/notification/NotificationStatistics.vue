<template>
  <div class="main">
    <h1>Статистика</h1>
    <div class="header">
      <v-btn
        @click="Yesterday()"
        :class="[{'active-btn': active === 'btn1' },'header-button']"
        rounded
        color="primary"
        dark
      >За вчера
      </v-btn>
      <v-btn
        @click="Today()"
        :class="[{'active-btn': active === 'btn2' },'header-button']"
        rounded
        color="primary"
        dark
      >За сегодня
      </v-btn>
      <v-btn
        @click="LastMonth()"
        :class="[{'active-btn': active === 'btn3' },'header-button']"
        rounded
        color="primary"
        dark
      >За прошлый месяц
      </v-btn>
      <v-btn
        @click="Month()"
        :class="['header-button', {'active-btn': active === 'btn4' }]"
        rounded
        color="primary"
        dark
      >За текущий месяц
      </v-btn>
      <v-btn
        @click="All()"
        :class="['header-button', {'active-btn': active === 'btn7' }]"
        rounded
        color="primary"
        dark
      >За весь период
      </v-btn>
      <v-btn
        @click="getSettings"
        :class="['header-button', {'active-btn': active === 'btn6' }]"
        rounded
        color="primary"
        dark
      >Настройка
      </v-btn>
    </div>
    <div class="date-box" v-if="isDate">
      <p class="date-text">С {{ fromDate | timestamp-to-date}}</p>
      <p class="date-text">До {{ toDate | timestamp-to-date}}</p>
    </div>
    <div class="select-date-box" v-if="isSelect">
      <p class="period-text">Выберите период:</p>
      <span class="select-date-box-child">
                <v-menu
                  v-model="menu1"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                    <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="date1"
                          label="С"
                          prepend-icon="event"
                          readonly
                          v-on="on"
                        ></v-text-field>
                    </template>
                    <v-date-picker v-model="date1" @input="menu1 = false"></v-date-picker>
                </v-menu>
                <v-menu
                  v-model="menu2"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                    <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="date2"
                      label="До"
                      prepend-icon="event"
                      readonly
                      v-on="on"
                    ></v-text-field>
                    </template>
                    <v-date-picker v-model="date2" @input="menu2 = false"></v-date-picker>
                </v-menu>
            </span>
    </div>
    <v-select
      class="select-types"
      v-model="selectedTypes"
      :items="types"
      label="Тип уведомления"
    ></v-select>
    <v-btn class="set-date" @click="getData">Получить</v-btn>

    <div class="content">
      <v-data-table
        :headers="headers"
        :items="data"
        hide-actions
        :pagination.sync="pagination"
      >
        <template slot="no-data">
          <v-alert :value="true" color="blue-grey lighten-1" icon="warning">
            Пусто
          </v-alert>
        </template>
        <template slot="items" slot-scope="props">
          <tr @click="props.expanded = !props.expanded">
            <td @click="searchUsers(1, props.item.title, props.item.shortDescription, 'TITLEDESC')">{{props.item.id}}
            </td>
            <td @click="searchUsers(1, props.item.title, props.item.shortDescription, 'TITLEDESC')">
              {{props.item.title}}
            </td>
            <td @click="searchUsers(1, props.item.title, props.item.shortDescription, 'TITLEDESC')">
              {{props.item.shortDescription}}
            </td>
            <td @click="searchUsers(1, props.item.title, props.item.shortDescription, 'TITLEDESC')">
              {{props.item.notificationType}}
            </td>
            <td @click="searchUsers(1, props.item.title, props.item.shortDescription, 'TITLEDESC')"
                v-if="props.item.imageUrl"><img class="notifications-image" :src="props.item.imageUrl" alt="image"></td>
            <td @click="searchUsers(1, props.item.title, props.item.shortDescription, 'TITLEDESC')" v-else></td>
            <td @click="searchUsers(1, props.item.title, props.item.shortDescription, 'TITLEDESC')">
              {{props.item.sentDate | timestamp-to-date}}
            </td>
          </tr>
        </template>
        <template slot="expand" slot-scope="props">
          <v-card flat>
            <!-- <live-preview :code="props.item.body"/> -->
            <v-card-text>
              {{props.item.body}}
            </v-card-text>
            <p class="receivers-header">Получатели уведомления:</p>
            <p class="receivers-count">Количество получателей: {{userTotalElements}}</p>

            <v-text-field
              v-model="search"
              class="search-input"
              label="Поиск"
            ></v-text-field>
            <div @scroll="scrollFunc" class="user-content-box">
                            <span class="user-content" v-for="(item, i) in userData" :key="i">
                                <p class="userinfo">{{setFullName(item.firstName, item.lastName)}}</p>
                                <p class="userinfo" v-if="item.phone.split(':').length===2">{{item.phone.split(':')[0]}} - Удален</p>
                                <p class="userinfo" v-else>{{item.phone}}</p>
                            </span>
            </div>
          </v-card>
        </template>
      </v-data-table>
      <v-pagination
        v-if="data.length!=0"
        class="center"
        v-model="page"
        :length="totalPages"
        :total-visible="6"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
  import {mapState} from "vuex";

  export default {
    name: 'notificationStatistics',
    data() {
      return {
        types: [],
        active: '',
        fromDate: '',
        toDate: '',
        date1: new Date().toISOString().substr(0, 10),
        date2: new Date().toISOString().substr(0, 10),
        menu1: false,
        menu2: false,
        isSelect: false,
        isDate: false,
        isActive: '',
        isShow: false,
        selectedTypes: 'Все типы',
        data: [],
        totalPages: '',
        search: '',
        headers: [
          {text: 'ID', value: 'id', sortable: false},
          {text: 'Название', value: 'title', sortable: false},
          {text: 'Короткое описание', value: ' shortDescription', sortable: false},
          {text: 'Тип уведомления', value: 'notificationType', sortable: false},
          {text: 'Ссылка картинки', value: 'imageUrl', sortable: false},
          {text: 'Дата отправки', value: 'sentDate', sortable: true},
        ],
        searchType: '',
        pagination: {
          sortBy: "sentDate",
          descending: true,
          rowsPerPage: 10,
        },
        page: '',
        userData: [],
        userTotalPages: '',
        curUserPage: 1,
        userTitle: '',
        userDescription: '',
        userSearchType: '',
        userTotalElements: '',

      }
    },
    watch: {
      page(val) {
        console.log(val)
        this.getNotifications(val);
      },
      search(val) {
        console.log(val)
        if (val.length > 3) {
          this.serchFullName(1, val, this.userTitle, this.userDescription, 'TITLEDESCFULLNAME');
        } else if (!val) {
          this.searchUsers(1, this.userTitle, this.userDescription, 'TITLEDESC')
        }
      }
    },
    computed: {
      ...mapState(['prodApiUrl'])
    },
    methods: {
      serchFullName(page, fullName, title, description, searchType) {
        let self = this;
        var putData = '';
        this.userTitle = title;
        this.userDescription = description;
        this.userSearchType = searchType;
        console.log(putData)
        if (page === 1) {
          this.userData = [];
          this.userTotalPages = '';
          this.curUserPage = 1;
        }
        putData = {
          "description": description,
          "title": title,
          "fullName": fullName
        }
        self.$http.put(self.$store.getters.apiUrl + '/notification/search/users?page=' + (page - 1) + '&size=30&search_type=' + searchType, putData)
          .then(response => {
            console.log(response.data.data);

            response.data.data.content.forEach((x) => {
              self.userData.push(x);
            })

            if (page === 1) {
              self.userTotalPages = response.data.data.totalPages
              self.curUserPage = 1;
            }
            self.curUserPage++;
          }, self.handleError)
      },
      setFullName(firstName, lastName) {
        return firstName + ' ' + lastName;
      },
      getData() {
        this.data = [];
        this.getNotifications(1);
      },
      getNotifications(page) {
        var putData = '';
        if (this.fromDate === '' && this.selectedTypes === 'Все типы') {
          putData = {}
          this.searchType = 'ALL'
        } else if (this.fromDate && this.selectedTypes === 'Все типы') {
          this.searchType = 'INTERVAL';
          putData = {
            startDate: this.fromDate,
            endDate: this.toDate,
          }
        } else if (this.fromDate && this.selectedTypes != 'Все типы') {
          this.searchType = 'INTERVALTYPE';
          putData = {
            startDate: this.fromDate,
            endDate: this.toDate,
            category: this.selectedTypes,
          }
        } else if (this.fromDate === '' && this.selectedTypes != 'Все типы') {
          this.searchType = 'CATEGORY'
          putData = {
            category: this.selectedTypes,
          }
        }
        let self = this;
        console.log(putData)
        self.$http.put(self.prodApiUrl + '/notification/search/notifications?page=' + (page - 1) + '&size=10&search_type=' + this.searchType, putData)
          .then(response => {
            console.log(response.data.data);
            self.data = response.data.data.content;
            if (page === 1) {
              self.totalPages = response.data.data.totalPages
              self.page = 1;
            }

          }, self.handleError)

      },
      searchUsers(page, title, description, searchType) {
        let self = this;
        var putData = '';
        this.userTitle = title;
        this.userDescription = description;
        this.userSearchType = searchType;
        console.log(putData)
        if (page === 1) {
          this.userData = [];
          this.userTotalPages = '';
          this.curUserPage = 1;
          this.userTotalElements = '';
        }
        putData = {
          "description": description,
          "title": title,
        }
        self.$http.put(self.$store.getters.apiUrl + '/notification/search/users?page=' + (page - 1) + '&size=30&search_type=' + searchType, putData)
          .then(response => {
            console.log(response.data.data);

            response.data.data.content.forEach((x) => {
              self.userData.push(x);
            })

            if (page === 1) {
              self.userTotalPages = response.data.data.totalPages
              self.curUserPage = 1;
              self.userTotalElements = response.data.data.totalElements;
            }
            self.curUserPage++;
          }, self.handleError)
      },
      getTypes() {
        let self = this;
        self.$http.get(self.$store.getters.apiUrl + '/notification/notificationTypes')
          .then(response => {
            self.types = response.data.data;
            self.types.unshift('Все типы')
            console.log(self.types)
          }, self.handleError)
      },
      getSettings() {
        this.active = 'btn6';
        this.data = [];

        this.isDate = false;
        this.isSelect = true;

        var tmpTime1 = this.date2.split('-');
        var endTime = new Date(tmpTime1[0], tmpTime1[1] - 1, tmpTime1[2], 23, 59, 59);
        var tmpTime2 = this.date1.split('-');
        var begTime = new Date(tmpTime2[0], tmpTime2[1] - 1, tmpTime2[2], 0, 0, 0);
        this.fromDate = begTime.getTime();
        this.toDate = endTime.getTime();
      },
      scrollFunc() {
        if (document.querySelector(".user-content-box")) {
          const elem = document.querySelector(".user-content-box"); // overflow-qoygan class
          // elem.scrollTop = elem.scrollHeight;
          if (elem) {
            this.chatContentPos = elem.scrollHeight - elem.scrollTop;
            this.chatContentHeight = elem.clientHeight;
            console.log('\n\n*****************************************')
            console.log(this.chatContentPos, ' - ', this.chatContentHeight)
            console.log(elem.scrollHeight - elem.scrollTop, ' - ', elem.clientHeight)
            console.log('*****************************************\n\n')
            if (this.chatContentPos === this.chatContentHeight) {
              // this.scrollToBottom(100);
              // console.log('READ1: ',this.selectedUser.topicChatId);
              // this.readMessages(this.selectedUser.topicChatId)
              console.log(this.curUserPage, ' - ', this.userTotalPages)
              if (this.curUserPage <= this.userTotalPages + 1)
                if (this.search) {
                  this.serchFullName(this.curUserPage, this.search, this.userTitle, this.userDescription, 'TITLEDESCFULLNAME')
                } else {
                  this.searchUsers(this.curUserPage, this.userTitle, this.userDescription, this.userSearchType);
                }
            }
          }
        }
      },
      Yesterday() {
        this.active = 'btn1';
        this.isDate = true;
        this.data = [];
        this.isSelect = false;
        var date = new Date();
        var begDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
        var endDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1, 23, 59, 59);
        this.fromDate = begDay.getTime();
        this.toDate = endDay.getTime();
        console.log(this.fromDate, ' - ', this.toDate);
        // this.getNotifications();
      },
      Today() {
        this.isDate = true;
        this.isSelect = false;
        this.data = [];
        this.active = 'btn2';
        var date = new Date();
        var begDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        this.fromDate = begDay.getTime();
        this.toDate = date.getTime();
        // this.getNotifications();
      },
      LastMonth() {
        this.active = 'btn3';
        this.isDate = true;
        this.data = [];

        this.isSelect = false;
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        this.fromDate = firstDay.getTime();
        var endDay = new Date(date.getFullYear(), date.getMonth(), 0, 23, 59, 59);
        this.toDate = endDay.getTime();
        // this.getNotifications();
      },
      Month() {
        this.active = 'btn4';
        this.isDate = true;
        this.data = [];

        this.isSelect = false;
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        this.fromDate = firstDay.getTime();
        this.toDate = date.getTime();
        // this.getNotifications();
      },
      All() {
        this.active = 'btn7';
        this.isDate = false;
        this.data = [];

        this.isSelect = false;
        this.fromDate = '';
        this.toDate = '';
      }

    },
    mounted() {
      // this.getNotifications();
      this.getTypes();
      this.Today();
    },
  }
</script>

<style scoped>
  .search-input {
    width: 285px;
    margin: 16px 16px 0
  }

  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 5px;
    background: #eaeaea;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.5);
    -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }

  .user-content-box {
    margin: 0 16px 16px;
    max-height: 280px;
    overflow: auto;
  }

  .user-content {
    display: flex;
    align-items: center;
  }

  .userinfo {
    margin: 10px 0px 5px;
    width: 200px;
  }

  .receivers-header {
    margin: 0 16px 15px;
    font-weight: 500;
    font-size: 15px;
  }

  .receivers-count {
    margin: 0 16px 15px;

  }

  .content {
    width: 100%;
    margin: 10px;
  }

  .main {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .center {
    display: flex;
    justify-content: center;
    margin: 10px;
  }

  .notifications-image {
    width: 50px;
    height: 50px;
    margin: 7px;
    border-radius: 7px;
  }

  .select-types {
    width: 270px;
    margin: 20px 0 0;
  }

  .period-text {
    color: #757575;
  }

  .header-button {
    background: #4e4e4e !important;
    border-radius: 28px;
  }

  .active-btn {
    background: #fbc100 !important;
  }

  .active-select-btn {
    background: #f3d559 !important;
    color: #000 !important;
  }

  .date-text {
    margin: 0;
  }

  .date-box {
    display: flex;
    width: 380px;
    justify-content: space-between;
    font-size: 17px;
    margin: 18px 0 8px;
  }

  .select-date-box {
    background: #ffffff;
    padding: 10px;
    width: 415px;
    border-radius: 10px;
    margin: 25px 0px;
    display: flex;
    flex-direction: column;
  }

  .set-date {
    background-color: #fbc100 !important;
    color: #FFFF !important;
    border-radius: 8px;
  }

  .select-date-box-child {
    display: flex;
  }
</style>
