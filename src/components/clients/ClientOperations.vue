<template>
  <!-- <v-dialog v-model="isMonitoring" persistent max-width="1000"> -->
  <div class="monitoring" id="monitoring">
    <div class="close-box">
      <img @click="close" class="close-btn" src="@/assets/cancel.png" alt="">
    </div>
    <h2 class="header-text">Мониторинг</h2>
    <div class="select-date-box">
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
      <v-btn :loading="loader" class="set-date" @click="getOperations(0)">Получить</v-btn>
    </div>
    <download-excel
      v-if="isShowExcell"
      name="Monitoring.xls"
      :fields="excelHeader"
      :data="monitoringData">
      <v-btn icon dark color="secondary">
        <v-icon>mdi-file-excel</v-icon>
      </v-btn>
    </download-excel>
    <span v-if="monitoringData.length!=0" class="operation header-table">
            <p class="operation-child">Клиент</p>
            <p class="operation-child">Номер клиента</p>
            <p class="operation-child">Сумма</p>
            <p class="operation-child">Тип операции</p>
            <p class="operation-child">Отправитель</p>
            <p class="operation-child">Имя отправителя</p>
            <p class="operation-child">Получатель</p>
            <p class="operation-child">Имя получателя</p>
            <p class="operation-child">Комиссия</p>
            <p class="operation-child">Дата транзакции</p>
            <p class="operation-child">Статус</p>
            <p class="operation-child">Токен</p>
            <p class="operation-child">№ транзакции</p>
        </span>
    <div class="content" @scroll="scrollFunc">
      <div v-for="(item, index) in monitoringData" :key="index">
                <span :class="['operation', { 'bg-panel': index % 2 != 0, 'active-class': active===index}]">
                    <p @click="getTransactions(item.operationId, index)" class="operation-child">{{ fullName }}</p>
                    <p @click="getTransactions(item.operationId, index)" class="operation-child">{{ phone }}</p>
                    <p @click="getTransactions(item.operationId, index)"
                       class="operation-child">{{ item.amount  | number-format }} {{ item.currency }}</p>
                    <p @click="getTransactions(item.operationId, index)"
                       class="operation-child">{{ item.operationType }}</p>

                    <p @click="getTransactions(item.operationId, index)"
                       class="operation-child">{{ item.senderPan }}</p>
                    <p @click="getTransactions(item.operationId, index)"
                       class="operation-child">{{ item.senderName }}</p>
                    <p @click="getTransactions(item.operationId, index)"
                       class="operation-child">{{ item.receiverPan }}</p>
                    <p @click="getTransactions(item.operationId, index)"
                       class="operation-child">{{ item.receiverName }}</p>
                    <p @click="getTransactions(item.operationId, index)"
                       class="operation-child">{{ item.feeAmount | number-format }} {{ item.feeCurrency }}</p>
                    <p @click="getTransactions(item.operationId, index)" class="operation-child">{{ item.endTime }}</p>
                    <p @click="getTransactions(item.operationId, index)" class="operation-child">{{ item.status }}</p>
                    <span @click="getTransactions(item.operationId, index)" class="operation-child"
                          style="display: flex; flex-direction: column; align-items: center;">
                        <p
                          style="font-size:10px; padding: 8px; width: 130px; text-overflow: ellipsis; overflow: hidden;"
                          class="mb-0">{{ item.cardToken }}</p>
                        <v-btn v-if="item.cardToken!=' '" small depressed v-clipboard:copy="item.cardToken"
                               v-clipboard:success="textOnCopy" v-clipboard:error="textOnError">Скопировать </v-btn>
                    </span>
                    <span class="operation-child" style="display: flex; flex-direction: column; align-items: center;">
                        <p class="mb-0" style="font-size:10px">{{ item.operationId }}</p>
                        <v-btn small depressed v-clipboard:copy="item.operationId" v-clipboard:success="textOnCopy"
                               v-clipboard:error="textOnError">Скопировать </v-btn>
                    </span>

                </span>
        <span v-if="active===index">
                    <span class="transaction-row" v-for="(item, index) in transactionData" :key="index">
                        <p class="transaction-item">{{ item.amount / 100 | number-format }} {{ item.currency }}</p>
                        <p class="transaction-item">{{ item.transactionType }}</p>
                        <p class="transaction-item">{{ item.subject }}</p>
                        <p class="transaction-item">{{ item.dateTime | timestamp-to-date }}</p>
                        <p class="transaction-item">{{ item.operationId }}</p>
                        <p class="transaction-item">{{ item.transactionId }}</p>
                    </span>
                </span>
      </div>
    </div>

  </div>
  <!-- </v-dialog> -->
</template>
<script>
export default {
  name: 'ClientOperations',
  props: ['userId', 'isMonitoring', 'fullName', 'phone'],
  data() {
    return {
      tmp: this.isMonitoring,
      date1: new Date().toISOString().substr(0, 10),
      date2: new Date().toISOString().substr(0, 10),
      menu1: false,
      menu2: false,
      fromDate: '',
      toDate: '',
      id: this.userId,
      monitoringData: [],
      totalPages: '',
      curPage: 0,
      excelHeader: {
        "Клиент": "fullName",
        "Номер клиента": "phone",
        "Сумма": "amount",
        "Тип операции": "operationType",
        "Отправитель": "senderPan",
        "Имя отправителя": "senderName",
        "Получатель": "receiverPan",
        "Имя получателя": "receiverName",
        "Комиссия": "feeAmount",
        "Валюта": "feeCurrency",
        "Время": "endTime",
        "Token": "cardToken",
        "Статус": "status",
        "№ транзакции": "operationId"
      },
      isShowExcell: false,
      active: '',
      transactionData: [],
      loader: false,
    }
  },
  methods: {
    textOnCopy(e) {
      this.successMessage(e.text + ' - успешно скопирован')
    },
    textOnError(e) {
      this.errorMessage('Ошибка при копировании')
    },
    getOperations(page) {
      let self = this;
      console.log(this.id)
      if (page === 0) {
        self.monitoringData = [];
        this.curPage = 0;
        this.isShowExcell = false;
        this.loader = true;
      }
      var tmpTime1 = this.date2.split('-');
      var endTime = new Date(tmpTime1[0], tmpTime1[1] - 1, tmpTime1[2], 23, 59, 59);
      var tmpTime2 = this.date1.split('-');
      var begTime = new Date(tmpTime2[0], tmpTime2[1] - 1, tmpTime2[2], 0, 0, 0);
      this.fromDate = begTime.getTime();
      this.toDate = endTime.getTime();
      let postData = {
        "dateFrom": this.fromDate,
        "dateTo": this.toDate,
      }
      self.$http.post(self.$store.getters.apiUrl + '/user/operations/' + this.id + '?sort=endTime,desc&page=' + page, postData)
        .then((response) => {
          console.log(response.data);
          this.loader = false;
          response.data.data.content.forEach((x) => {
            Object.assign(x, {fullName: self.fullName});
            Object.assign(x, {phone: self.phone});
            x.amount = x.amount / 100;
            x.feeAmount = x.feeAmount / 100;
            x.phone = "'" + x.phone
            if (x.receiver)
              x.receiver = "'" + x.receiver
            if (x.sender)
              x.sender = "'" + x.sender
            x.endTime = self.$options.filters.timestampToDate(x.endTime);
            self.monitoringData.push(x);
          })
          // self.monitoringData = self.monitoringData.reverse();

          self.curPage++;
          // console.log(self.monitoringData)
          if (page === 0)
            self.totalPages = response.data.data.totalPages;
          console.log(self.curPage, ' - ', self.totalPages)

          if (this.curPage <= this.totalPages) {
            this.getOperations(this.curPage);
          } else {
            self.isShowExcell = true;
          }

        }, self.Error);
    },
    close() {
      this.tmp = false;
      console.log(this.tmp)
      this.$emit('updateMonitoring', this.tmp);
    },
    Error(response) {
      if (response.status === 401) {
        this.loader = false;
        this.redirect('login');
      }
      if (response.status === 423) {
        this.loader = false;
        this.registerDevice();
      }
      this.loader = false;
      if (this.monitoringData.length)
        this.isShowExcell = true;
      // this.$store.commit('errorMessage', response.data.errorMessage);
    },
    scrollFunc() {
      if (document.querySelector(".content")) {
        const elem = document.querySelector(".content"); // overflow-qoygan class
        // elem.scrollTop = elem.scrollHeight;
        if (elem) {
          this.chatContentPos = elem.scrollHeight - elem.scrollTop;
          this.chatContentHeight = elem.clientHeight;
          console.log('\n\n*****************************************')
          console.log(this.chatContentPos, ' - ', this.chatContentHeight)
          console.log(elem.scrollHeight - elem.scrollTop)
          console.log('*****************************************\n\n')
          if (this.chatContentPos === this.chatContentHeight && this.curPage > 0) {
            console.log('test: ', this.curPage)
            if (this.curPage <= this.totalPages) {
              this.getOperations(this.curPage);
            }
          }

        }
      }
    },
    getTransactions(operationId, index) {
      if (this.active === index) {
        this.active = ''
      } else {
        let self = this;
        self.$http.get(self.$store.getters.apiUrl + '/transaction/' + operationId)
          .then((response) => {
            console.log(response.data);
            self.transactionData = response.data.data;
            self.active = index;
          })
      }
    }

  }
}
</script>
<style scoped>
.active-class {
  background: #f9ca03 !important;
}

.transaction-row {
  display: flex;
  background: #d0d0d0a1;
  border-bottom: 1px solid silver;
}

.transaction-item {
  flex: 1;
  padding: 10px;
  margin: 0;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.monitoring {
  /* width: 1085px;
  height: 612px;
  background: #ffffff;
  position: absolute;
  -webkit-transform: translateX(-50%);
  -ms-transform: translateX(-50%);
      transform: translateX(-50%);
  left: 50%;
  top: 111px;
  border-radius: 9px;
  -webkit-box-shadow: 0px 0px 6px 3px rgba(218, 218, 218, 0.75);
          box-shadow: 0px 0px 6px 3px rgba(218, 218, 218, 0.75);
  z-index: 1;
  width: 95%; */

  background: #ffffff;
  width: 100%;
  margin: 8px 0 35px;
}

.close-btn {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.select-date-box {
  background: #ffffff;
  padding: 10px;
  width: 415px;
  border-radius: 10px;
  margin: 15px auto;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
}

.bg-panel {
  background: whitesmoke;
}

.select-date-box-child {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}

.close-box {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: end;
  -ms-flex-pack: end;
  justify-content: flex-end;
}

.header-text {
  text-align: center;
}

.operation {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  cursor: pointer;
  font-size: 12px;
}

.operation-child {
  overflow: hidden;
  margin: 0;
  padding: 10px;
  /* flex: 1; */
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
  /* overflow: hidden;
  white-space: nowrap; */
  width: 140px;
  text-align: center;
}

.content {
  overflow: auto;
  height: 285px;
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

.header-table {
  background: #676767;
  color: #FFFF;
}
</style>
