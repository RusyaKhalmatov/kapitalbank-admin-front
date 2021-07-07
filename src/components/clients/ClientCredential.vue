<template>
  <v-layout column wrap>
    <v-card min-height="600">
      <v-card-title>
        <h1>Учетные данные пользователя</h1>
        <v-spacer/>
        <template v-if="userInfo.id" >
          <client-rating :userId="userInfo.id"></client-rating>
          <v-btn v-scroll-to="'#monitoring'" @click="isMonitoring=true"><img class="apelsin-logo" src="@/assets/apelsin.png" alt="apelsin">Мониторинг</v-btn>
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
            <v-text-field disabled :value="userInfo.lastActiveTime | timestamp-to-date" @input="value => userInfo.lastActiveTime = value" label="Последный вход"/>
          </v-flex>
          <v-flex xs6>
            <v-text-field disabled :value="userInfo.registeredDate | timestamp-to-date" @input="value => userInfo.registeredDate = value" label="Дата регистрация"/>
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
                  <td>{{props.item.ownerName}}</td>                                    
                  <td style="display:flex; align-items: center">
                    <p class="card-pan-text">{{props.item.pan}}</p>
                    <v-btn v-if="props.item.virtual&&($store.getters.roles==='ADMIN'||$store.getters.roles=='HEAD_CALL_CENTER'||$store.getters.roles=='CALL_CENTER')" @click="sendQueue(props.item.id)" style="border-radius: 16px;" depressed small color="primary">смс-инфо</v-btn>
                    <!-- <img class="card-history" draggable="false" src="@/assets/settings.png" alt="card-history"> -->
                  </td>
                  <td>{{props.item.cardStatus}}</td>
                  <td>{{props.item.phone}}</td>
                  <td>{{props.item.smsInfo}}</td>
                  <td>{{props.item.registeredDate | timestamp-to-date}}</td>
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
                  <td>{{props.item.pan}}</td>                                    
                  <td>{{props.item.type}}</td>
                </tr>
              </template>
            </v-data-table>
          </v-flex>
          <v-flex xs12>
            <v-btn dark color="danger" @click.stop="dialog = true">Удалить аккаунт</v-btn>
            <v-btn dark color="primary" :to="{name: 'vipClientsForm',params: {userLimit: userInfo}}">
                добавить в VIP-пользователя
            </v-btn>
            <v-btn dark color="primary" :to="{name: 'partialVipClientsForm',params: {userLimit: userInfo}}">
                добавить в частичные VIP-пользователи
            </v-btn>
            <v-btn v-if="userInfo.id" @click="preAdd" color="primary">Добавить в список сотрудников</v-btn>
            <v-btn v-if="userInfo.id" @click="openWhiteListBox" color="primary">Добавить в белый список</v-btn>
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
                  <external-history-statistic v-if="externalHistoryDialog" :userId="userInfo.id"></external-history-statistic>
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
                  <p>UserId: {{userInfo.id}}</p>
                  <p>Полное имя: {{userInfo.fullName}}</p>
                  <v-checkbox v-model="whiteListAllowed" :label="`Разрешить (${$options.filters.checkStatus(whiteListAllowed)})`"></v-checkbox>
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
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
    <ClientOperations  v-if="isMonitoring" isMonitoring="isMonitoring" :userId="userInfo.id" :fullName="userInfo.fullName" :phone="userInfo.phone" @updateMonitoring="closeOperations" />
  </v-layout>
</template>

<script>
    import ClientOperations from './ClientOperations.vue'
    import ClientRating from './ClientRating'
    import ExternalHistoryStatistic from '@/views/ExternalHistoryStatistic.vue'
    export default {
        name: "UserCredential",
        components:{
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
                employeeMail:'',
                employeePhone:'', 
                barches: [],
                name: '',
                code: '',
                cardsByPhone: [],
                byPhoneVisib: false,
                whiteListDialog: false,
                whiteListAllowed: false,
                externalHistoryDialog: false,
                whiteListData: [],
                isAdmin: false,
            }
        },
        filters:{
          checkStatus(val){
            if(val){
              return 'Да'
            }
            else{
              return 'Нет'
            }
          }
        },
        methods: {
            addWhiteList(){
              const postData = {
                "userId": this.userInfo.id,
                "allowed": this.whiteListAllowed
              }
              this.$http.post(this.$store.getters.newApiUrl+`/admin/external-history/white-list`, postData)
              .then(response=>{
                this.$router.push('whiteList');
              }, this.handleError)
            },
            openWhiteListBox(){
              this.whiteListDialog = true;
            },
            sendSMS(){
                let self = this;
                self.$http.post(self.$store.getters.prodApiUrl + "/send-code/"+self.userInfo.id)
                .then(response => {
                    self.code = response.data.data.message;
                }, self.handleError);
            },
            getBranches(){
                //alert("Hello");
                let self = this;
                self.$http.get(self.$store.getters.prodApiUrl + `/branch/list`)
                    .then(response => {
                        self.barches = response.data.data;
                        //console.log(response.data.data);
                    }, self.handleError);
            },
            preAdd(){
                //alert(this.userInfo.id);
                this.addEmployeeDialog = true;
            },
            addSome(val){
                if(val == 0){
                  this.employeeBrach = '';
                  this.employeeMail = '';
                  this.employeePhone = '';
                  this.addEmployeeDialog = false; 
                }
                if(val == 1){
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
                          //console.log(response.data.data);
                      }, self.handleError);
                }
            },
            sendQueue(cardId){
              this.loader = true;
                this.$http.post(this.$store.getters.apiUrl + `/cards/virtual/send-queue?cardId=${cardId}`)
                    .then(response => {
                        this.loader = false;
                        this.successMessage('Успешно')
                    }, this.handleError);
            },
            getUserCardWithPhone(){
              let self = this;
                this.loader = true;
                self.$http.get(self.$store.getters.prodApiUrl + `/general/cards/getByPhone?phone=${self.userInfo.phone}`)
                    .then(response => {
                        self.cardsByPhone = response.data.data;
                        //this.loader = false;
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
                self.$http.delete(self.$store.getters.apiUrl + `/general/admin/delete-account/${userId}`)
                    .then(() => {
                        self.redirect('clients');
                    }, self.handleError);
            },
            getCardHistory(id){
                let self = this;
                self.$http.get(self.$store.getters.apiUrl + '/general/admin/card-history', {
                    // params:{
                    //     'id' : id,

                    // }
                })
                .then(() => {

                }, self.handleError);
            }, 
            closeOperations(id){
                this.isMonitoring = this.id; 
                //console.log(id)
            },
            getWhiteList(){
                this.whiteListData = [];
                this.isAdmin = false;
                this.$http.get(this.$store.getters.newApiUrl+`/admin/external-history/white-list`)
                .then(response=>{
                    console.log(response.data.data);
                    this.whiteListData = response.data.data;
                    this.isAdmin = this.whiteListData.find( x => x.adminId  === this.$store.getters.userId);
                    // console.log(this.isAdmin, ' - ', this.$store.getters.userId)
                }, this.handleError)
            }

        },
        mounted() {
            if (this.$route.params.user) {
                this.userInfo = this.$route.params.user;
                //console.log(this.userInfo)
                this.getUserCards();
                this.getUserCardWithPhone()
            }
            this.getBranches();
            this.getWhiteList();
        },
        watch:{
            whiteListDialog(val){
              if(!val){
                this.whiteListAllowed = false;
              }
            }
        }
    }
</script>

<style scoped>
    .card-history{
        width: 20px;
        height: 20px;
        margin: 5px;
        cursor: pointer;
    }
    .card-pan-text{
        margin: 0;
    }
    .apelsin-logo{
        width: 23px;
        height: 23px;
        margin: 5px;
    }
    .sms-box{
        display: flex;
        align-items: center;
    }

</style>
