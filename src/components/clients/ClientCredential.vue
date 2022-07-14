<template>
  <v-layout column wrap>
    <v-card min-height="600">
      <v-card-title>
        <h1>Учетные данные пользователя</h1>
        <v-spacer/>
        <template v-if="userInfo.id">
          <client-rating :userId="userInfo.id"></client-rating>
          <v-btn v-scroll-to="'#monitoring'" @click="isMonitoring=true">Мониторинг</v-btn>
        </template>
        <v-btn icon small @click="redirect('clients')">
          <v-icon small>mdi-arrow-left</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs6>
            <v-text-field disabled v-model="userInfo.fullName" label="Полное имя"/>
          </v-flex>
          <v-flex xs6>
            <v-text-field disabled v-model="userInfo.customerId" label="ID клиента"/>
          </v-flex>
          <v-flex xs6>
            <v-text-field disabled v-model="userInfo.phone" label="Номер телефона"/>
          </v-flex>
          <v-flex xs6>
            <v-text-field disabled v-model="userInfo.email" label="Электронная почта"/>
          </v-flex>
          <v-flex xs6>
            <v-text-field disabled v-model="userInfo.userRole" label="Роли"/>
          </v-flex>
          <v-flex xs6>
            <v-text-field disabled v-model="userInfo.userState" label="Статус"/>
          </v-flex>
          <v-flex xs6>
            <v-text-field disabled :value="userInfo.lastActiveTime | timestampToDate"
                          @input="value => userInfo.lastActiveTime = value" label="Последный вход"/>
          </v-flex>
          <v-flex xs6>
            <v-text-field disabled :value="userInfo.registeredDate | timestampToDate"
                          @input="value => userInfo.registeredDate = value" label="Дата регистрация"/>
          </v-flex>
          <v-flex xs6>
            <v-text-field disabled v-model="userInfo.platform" label="Платформ"/>
          </v-flex>
          <v-flex xs6>
            <v-text-field disabled v-model="userInfo.version" label="Версия"/>
          </v-flex>
          <v-btn @click="byPhoneVisib = false"><span>Карты пользователя</span></v-btn>
          <v-btn @click="byPhoneVisib = true"><span>Карты пользователя по телефону</span></v-btn>
          <v-flex xs12 v-if="!byPhoneVisib">
            <v-data-table
              :headers="cardHeaders"
              :items="userCards"
              :search="search"
              :loading="loader"
              :pagination.sync="pagination"
              item-key="userCards.id">
              <template slot="items" slot-scope="props">
                <tr @click="props.expanded = !props.expanded">
                  <!-- <td>{{props.item.id}}</td> -->
                  <td>{{ props.item.ownerName }}</td>
                  <td style="display:flex; align-items: center">
                    <p class="card-pan-text">{{ props.item.pan }}</p>
                    <v-btn
                      v-if="props.item.virtual && (['ADMIN', 'HEAD_CALL_CENTER', 'CALL_CENTER'].includes($store.getters.roles))"
                      @click="sendQueue(props.item.id)" style="border-radius: 16px;" depressed small color="primary">
                      смс-инфо
                    </v-btn>
                    <!-- <img class="card-history" draggable="false" src="@/assets/settings.png" alt="card-history"> -->
                  </td>
                  <td>{{ props.item.cardStatus }}</td>
                  <td>{{ props.item.phone }}</td>
                  <td>{{ props.item.smsInfo }}</td>
                  <td>{{ props.item.registeredDate | timestampToDate }}</td>
                </tr>
              </template>
            </v-data-table>
          </v-flex>

          <v-flex xs12 v-if="byPhoneVisib">
            <v-data-table
              :headers="byPhoneCardHeaders"
              :items="cardsByPhone"
              :loading="loader"
              :pagination.sync="pagination"
              item-key="cardsByPhone.pan">
              <template slot="items" slot-scope="props">
                <tr @click="props.expanded = !props.expanded">
                  <td>{{ props.item.pan }}</td>
                  <td>{{ props.item.type }}</td>
                </tr>
              </template>
            </v-data-table>
          </v-flex>
          <v-flex xs12>
            <v-btn color="danger" @click.stop="dialog = true">Удалить аккаунт</v-btn>
            <v-btn color="primary" :to="{name: 'vipClientsForm',params: {userLimit: userInfo}}">
              добавить в VIP-пользователя
            </v-btn>
            <v-btn color="primary" :to="{name: 'partialVipClientsForm',params: {userLimit: userInfo}}">
              добавить в частичные VIP-пользователи
            </v-btn>
            <v-btn v-if="userInfo.id" @click="addEmployeeDialog = true" color="primary">Добавить в список сотрудников</v-btn>
            <v-btn v-if="userInfo.id" @click="openWhiteListBox" color="primary">Добавить в белый список</v-btn>
            <v-btn
              v-if="userInfo.id && userInfo.phone.split(':').length < 2"
              @click="changePhoneNumberDialog = true"
              color="primary"
            >
              Сменить номер телефона
            </v-btn>
            <v-btn color="danger" @click="openPasswordResetDialog">Разрешить устройство</v-btn>
            <!-- <v-btn v-if="userInfo.id&&isAdmin" @click="externalHistoryDialog = true" color="primary">Количество запросов по скорингу</v-btn> -->
            <div class="sms-box" v-if="userInfo.id">
              <v-btn @click="sendSMS" color="primary">Отправить СМС</v-btn>
              <v-text-field disabled v-model="code" label="SMS CODE" style="width: 50px;"/>
            </div>
            <v-dialog
              v-model="externalHistoryDialog"
              max-width="900">
              <v-card>
                <v-card-text>
                  <external-history-statistic v-if="externalHistoryDialog"
                                              :userId="userInfo.id"></external-history-statistic>
                </v-card-text>
                <v-card-actions>
                  <v-spacer/>
                  <v-btn @click.stop="externalHistoryDialog=false" color="primary">Закрыть</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog
              v-model="whiteListDialog"
              width="400">
              <v-card>
                <v-card-title>
                  <h3>Добавление</h3>
                </v-card-title>
                <v-card-text>
                  <p>UserId: {{ userInfo.id }}</p>
                  <p>Полное имя: {{ userInfo.fullName }}</p>
                  <v-checkbox v-model="whiteListAllowed"
                              :label="`Разрешить (${$options.filters.checkStatus(whiteListAllowed)})`"></v-checkbox>
                </v-card-text>
                <v-card-actions>
                  <v-spacer/>
                  <v-btn @click.stop="whiteListDialog = false" color="primary">Нет</v-btn>
                  <v-btn @click.stop="addWhiteList" color="primary">Да</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog
              v-model="dialog"
              width="400">
              <v-card>
                <v-card-title>
                  <h3>Удалить Аккаунт</h3>
                </v-card-title>
                <v-card-text>
                  Вы действительно хотите удалить этот аккаунт?
                </v-card-text>
                <v-card-actions>
                  <v-spacer/>
                  <v-btn @click.stop="dialog = false" color="primary">Нет</v-btn>
                  <v-btn @click.stop="deleteAccount(userInfo.id)" color="primary">Да</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog
              v-model="passwordResetDialog"
              width="400">
              <v-card>
                <v-card-title>
                  <h3 style="margin-bottom: -10px">Разрешить устройство</h3>
                </v-card-title>
                <v-card-text>
                  Вы действительно хотите разрешить устройство?
                </v-card-text>
                <v-card-actions>
                  <v-spacer/>
                  <v-btn @click.stop="passwordResetDialog = false" color="primary">Нет</v-btn>
                  <v-btn @click.stop="resetPassword(userInfo.id)" dark color="danger">Да</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog
              v-model="addEmployeeDialog"
              width="400"
              persistent
            >
              <v-card>
                <v-card-title>
                  <h3>Add employe</h3>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm6 md6>
                        <v-text-field label="UserId" v-model="this.userInfo.id" disabled></v-text-field>
                      </v-flex>
                      <!-- <v-flex xs12 sm6 md6>
                        <v-text-field label="BranchId" v-model="employeeBrach"></v-text-field>
                      </v-flex> -->
                      <v-flex xs12 sm6 d-flex>
                        <v-select
                          :items="barches"
                          item-text="name"
                          item-value="id"
                          label="Филиал"
                          v-model="employeeBrach"
                        ></v-select>
                      </v-flex>
                      <v-flex xs12>
                        <v-text-field label="E-mail" v-model="employeeMail"></v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-text-field label="Phone" v-model="employeePhone"></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer/>
                  <v-btn @click="addSome(0)" color="primary">Нет</v-btn>
                  <v-btn @click="addSome(1)" color="primary">Да</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog
              v-model="changePhoneNumberDialog"
              persistent
              max-width="600px"
            >
              <v-card>
                <v-card-title>
                  <h3>Сменить номер телефона</h3>
                </v-card-title>
                <v-card-text>
                    <v-text-field label="Введите номер телефона (11-12 цифр)" v-model="newPhoneNumber" v-bind:value="newPhoneNumber"/>
                </v-card-text>
                <v-card-actions>
                  <v-spacer/>
                  <v-btn @click="changePhoneNumberDialog = false" color="primary">Отмена</v-btn>
                  <v-btn
                    @click="updatePhoneNumber"
                    color="primary"
                    :disabled="newPhoneNumber.length < 11 || newPhoneNumber.length > 12"
                  >
                    Сохранить
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
    <ClientOperations
      v-if="isMonitoring"
      isMonitoring="isMonitoring"
      :userId="userInfo.id"
      :fullName="userInfo.fullName"
      :phone="userInfo.phone"
      @updateMonitoring="closeOperations"
    />
  </v-layout>
</template>

<script>
import ClientOperations from './ClientOperations.vue'
import ClientRating from './ClientRating'
import ExternalHistoryStatistic from '@/views/ExternalHistoryStatistic.vue'

export default {
  name: "UserCredential",
  components: {
    ClientOperations, ExternalHistoryStatistic, ClientRating
  },
  data() {
    return {
      cardHeaders: [
        {text: "Имя владельца", value: "ownerName"},
        {text: "Номер карты", value: "pan"},
        {text: "Статус карты", value: "cardStatus"},
        {text: "Номер телефона", value: "phone"},
        {text: "SMS-информирование", value: "smsInfo"},
        {text: "Дата регистрации", value: "registeredDate"}
      ],
      byPhoneCardHeaders: [
        {text: "Номер карты", value: "pan"},
        {text: "Тип", value: "type"},
      ],
      excelHeader: {
        "Сумма": "amount",
        "Получатель": "receiver",
        "Отправитель": "sender",
        "Комиссия": "fee",
        "ID": "id",
        "Логин": "login",
        "Название сервиса": "serviceName",
        "Статус": "status",
        "Время": "endTime"
      },
      userInfo: [],
      userCards: [],
      pagination: {},
      search: '',
      dialog: false,
      isMonitoring: false,
      addEmployeeDialog: false,
      employeeBrach: '',
      employeeMail: '',
      employeePhone: '',
      barches: [],
      name: '',
      code: '',
      cardsByPhone: [],
      byPhoneVisib: false,
      whiteListDialog: false,
      passwordResetDialog: false,
      whiteListAllowed: false,
      externalHistoryDialog: false,
      whiteListData: [],
      isAdmin: false,
      newPhoneNumber: '',
      changePhoneNumberDialog: false,
    }
  },
  filters: {
    checkStatus(val) {
      if (val) {
        return 'Да'
      } else {
        return 'Нет'
      }
    }
  },
  methods: {
    addWhiteList() {
      const postData = {
        "userId": this.userInfo.id,
        "allowed": this.whiteListAllowed
      }
      this.$http.post(this.$store.getters.newApiUrl + `/admin/external-history/white-list`, postData)
        .then(() => {
          this.$router.push('whiteList');
        }, this.handleError)
    },
    openWhiteListBox() {
      this.whiteListDialog = true;
    },
    openPasswordResetDialog() {
      this.passwordResetDialog = true;
    },
    sendSMS() {
      let self = this;
      self.$http.post(self.$store.getters.prodApiUrl + "/send-code/" + self.userInfo.id)
        .then(response => {
          self.code = response.data.data.message;
        }, self.handleError);
    },
    getBranches() {
      let self = this;
      self.$http.get(self.$store.getters.prodApiUrl + `/branch/list`)
        .then(response => {
          self.barches = response.data.data;
        }, self.handleError);
    },
    addSome(val) {
      if (val === 0) {
        this.employeeBrach = '';
        this.employeeMail = '';
        this.employeePhone = '';
        this.addEmployeeDialog = false;
      }
      if (val === 1) {
        this.addEmployeeDialog = false;
        const postData = {
          userId: this.userInfo.id,
          branchId: this.employeeBrach,
          email: this.employeeMail,
          phone: this.employeePhone,
        };
        let self = this;
        self.$http
          .post(self.$store.getters.newApiUrl + "/card-employee/v2/add", postData)
          .then(() => {
          }, self.handleError);
      }
    },
    sendQueue(cardId) {
      this.loader = true;
      this.$http.post(this.$store.getters.apiUrl + `/cards/virtual/send-queue?cardId=${cardId}`)
        .then(() => {
          this.loader = false;
          this.successMessage('Успешно')
        }, this.handleError);
    },
    getUserCardWithPhone() {
      let self = this;
      this.loader = true;
      self.$http.get(self.$store.getters.prodApiUrl + `/general/cards/getByPhone?phone=${self.userInfo.phone}`)
        .then(response => {
          self.cardsByPhone = response.data.data;
        }, self.handleError);
    },
    getUserCards() {
      let self = this;
      this.loader = true;
      self.$http.get(self.$store.getters.apiUrl + `/info/user-card/${self.userInfo.id}`)
        .then(response => {
          self.userCards = response.data.data;
          this.loader = false;
        }, self.handleError);
    },
    deleteAccount(userId) {
      let self = this;
      self.$http.delete(self.$store.getters.newApiUrl + `/general/admin/delete-account/${userId}`)
        .then(() => {
          self.redirect('clients');
        }, self.handleError);
    },
    async resetPassword(userId) {
      let self = this;

      try{
        const resp = await self.$http.get( `http://192.168.132.12:8091/api/reset-password/allow?userId=${userId}`);
        if (resp && resp.data) {
          this.passwordResetDialog = false;
          this.$store.commit('successMessage', 'Устройство успешно зарегистрировано ');
        }
      } catch(err) {
        if(err && err.status === 400){
          this.$store.commit('errorMessage', 'У пользователя нет устройств для регистрации ');
        }
      }
    },
    closeOperations() {
      this.isMonitoring = this.id;
    },
    getWhiteList() {
      this.whiteListData = [];
      this.isAdmin = false;
      this.$http.get(this.$store.getters.newApiUrl + `/admin/external-history/white-list`)
        .then(response => {
          this.whiteListData = response.data.data;
          this.isAdmin = this.whiteListData.find(x => x.adminId === this.$store.getters.userId);
        }, this.handleError)
    },
    updatePhoneNumber() {
      this.$http.post(
          this.$store.getters.prodApiUrl2 + `/user/updatePhoneNumber`,
          { userId: this.userInfo.id, phoneNumber: this.newPhoneNumber }
        ).then(() => {
            this.successMessage("Номер успешно обновлен!");
            this.userInfo.phone = this.newPhoneNumber;
            this.changePhoneNumberDialog = false;
            this.newPhoneNumber = '';
        }, this.handleError);
    }
  },
  mounted() {
    if (this.$route.params.user) {
      this.userInfo = this.$route.params.user;
      this.getUserCards();
      this.getUserCardWithPhone()
    }
    this.getBranches();
    this.getWhiteList();
  },
  watch: {
    whiteListDialog(val) {
      if (!val) {
        this.whiteListAllowed = false;
      }
    },
    newPhoneNumber(val) {
      this.newPhoneNumber = val.replace(/[^0-9]+/g, '').trim();
    },
    changePhoneNumberDialog(val) {
        console.log("changePhoneNumberDialog" + val);
    }
  }
}
</script>

<style scoped>
.card-history {
  width: 20px;
  height: 20px;
  margin: 5px;
  cursor: pointer;
}

.card-pan-text {
  margin: 0;
}

.sms-box {
  display: flex;
  align-items: center;
}

</style>
