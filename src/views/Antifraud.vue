<template>
  <div class="main">
    <h1 class="header">Антифрод</h1>
    <div class="btns-box">
      <v-btn @click="connect" :class="[{'active-btn': active === 'btn1'}]">Пользователи, которые часто добавляют и
        удаляют карты
      </v-btn>
      <v-btn @click="addMany" :class="[{'active-btn': active === 'btn2'}]">Пользователи, которые добавили много карт
      </v-btn>
      <v-btn @click="operations" :class="[{'active-btn': active === 'btn4'}]">Отчет о пользовательских операциях</v-btn>

      <!--            <v-btn v-if="isClickDisBalance" @click="getDisBalance" :class="[{'active-btn': active === 'btn3'}]">Расхождение по  кошелькам</v-btn>

                  <v-btn style="width:251px" v-else>
                      <v-progress-circular style="height:23px; width: 23px;"
                      indeterminate
                      color="amber"
                      ></v-progress-circular>
                  </v-btn>-->

    </div>
    <div class="param-box" v-if="active!='btn3'">
      <v-text-field v-if="showLimit" v-model="limit" label="Количество (от)" @keyup.enter="start"></v-text-field>
      <span v-if="showOperations" class="operations-box">
                <v-text-field class="operations-box-child" v-model="p2p" label="Переводы"></v-text-field>
                <v-text-field class="operations-box-child" v-model="conversion" label="Конверсия"></v-text-field>                
                <v-text-field class="operations-box-child" v-model="payment" label="Транзакции"></v-text-field>                            
            </span>
      <span v-if="showDateBox" class="row">
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
      <v-btn v-if="isClick" class="get-button" @click="start">Получить</v-btn>
      <v-btn class="get-button" v-else>
        <v-progress-circular style="height:23px; width: 23px;"
                             indeterminate
                             color="amber"
        ></v-progress-circular>
      </v-btn>
      <!-- <div v-else>Загрузка</div> -->

    </div>
    <div v-if="isShow" class="content-box">
      <v-text-field
        class="search-box"
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
      <v-data-table
        :headers="headers"
        :items="data"
        class="elevation-1"
        :search="search"
        :pagination.sync=pagination
      >
        <div class="empty" type="warning" slot="no-data">Пусто</div>
        <template slot="items" slot-scope="props">
          <tr>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.phone }}</td>
            <td v-if="props.item.customerId">{{ props.item.customerId }}</td>
            <td v-else>Не клиент</td>
            <td>{{ props.item.connectCount }}</td>
          </tr>
        </template>
        <template slot="actions-append">
          <download-excel
            :fields="excelHeaders"
            stringify-long-num
            :name="new Date().toLocaleString()+'.xls'"
            :data="data">
            <v-btn icon dark color="secondary">
              <v-icon>mdi-file-excel</v-icon>
            </v-btn>
          </download-excel>
        </template>
      </v-data-table>
    </div>
    <div v-if="isShowOperations" class="content-box">
      <v-text-field
        class="search-box"
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
      <v-data-table
        :headers="operationsHeaders"
        :items="dataOperations"
        class="elevation-1"
        :search="search"
        :pagination.sync=pagination
      >
        <div class="empty" type="warning" slot="no-data">Пусто</div>
        <template slot="items" slot-scope="props">
          <tr>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.phone }}</td>
            <td v-if="props.item.customerId">{{ props.item.customerId }}</td>
            <td v-else>Не клиент</td>
            <td>{{ props.item.p2p }}</td>
            <td>{{ props.item.conversion }}</td>
            <td>{{ props.item.payment }}</td>
          </tr>
        </template>
        <template slot="actions-append">
          <download-excel
            :fields="excelOperationsHeaders"
            name="Отчет о пользовательских операциях.xls"
            stringify-long-num
            :data="dataOperations">
            <v-btn icon dark color="secondary">
              <v-icon>mdi-file-excel</v-icon>
            </v-btn>
          </download-excel>
        </template>
      </v-data-table>
    </div>
    <div v-if="isDisBalanceShow" style="margin: 50px 0;" class="content-box">
      <v-text-field
        class="search-box"
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
      <v-data-table
        :headers="disBalanceHeaders"
        :items="disBalanceData"
        class="elevation-1"
        :search="search"
        :pagination.sync=pagination
      >
        <div class="empty" type="warning" slot="no-data">Пусто</div>
        <template slot="items" slot-scope="props">
          <tr>
            <td>{{ props.item.name }}</td>
            <td v-if="props.item.status!='DELETED'">
              {{ props.item.phone }}
            </td>
            <td v-else>
              {{ props.item.phone.split(':')[1] | timestamp-to-date }}
            </td>
            <td v-if="props.item.customerId">{{ props.item.customerId }}</td>
            <td v-else>Не клиент</td>
            <td>{{ props.item.walletId }}</td>
            <td>{{
                (props.item.absBalance / 100).toLocaleString('us', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })
              }}
            </td>
            <td>{{
                (props.item.walletBalance / 100).toLocaleString('us', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })
              }}
            </td>
            <td>{{
                (props.item.difference / 100).toLocaleString('us', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })
              }}
            </td>
            <td>{{
                (props.item.hangAmount / 100).toLocaleString('us', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })
              }}
            </td>
            <td>{{ props.item.nibbdId }}</td>

          </tr>
        </template>
        <template slot="actions-append">
          <download-excel
            :fields="excelDisBalanceHeaders"
            stringify-long-num
            name="Расхождение по кошелькам.xls"
            :data="disBalanceData">
            <v-btn icon dark color="secondary">
              <v-icon>mdi-file-excel</v-icon>
            </v-btn>
          </download-excel>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Antifraud',
  data() {
    return {
      picker: '',
      date1: new Date().toISOString().substr(0, 10),
      date2: new Date().toISOString().substr(0, 10),
      isClickDisBalance: true,
      active: '',
      menu1: false,
      menu2: false,
      isShowOperations: false,
      limit: 10,
      isClick: true,
      data: [],
      disBalanceData: [],
      p2p: 5,
      conversion: 5,
      payment: 5,
      search: '',
      isShow: false,
      isDisBalanceShow: false,
      pagination: {
        rowsPerPage: 10
      },
      dataOperations: [],
      headers: [
        {
          text: "Полное имя", value: "name"
        },
        {
          text: "Номер телефона", value: "phone"
        },
        {
          text: 'ID клиента', value: 'customerId'
        },
        {
          text: 'Количество', value: "connectCount"
        },
      ],
      operationsHeaders: [
        {
          text: "Полное имя", value: "name"
        },
        {
          text: "Номер телефона", value: "phone"
        },
        {
          text: 'ID клиента', value: 'customerId'
        },
        {
          text: 'Переводы', value: "p2p"
        },
        {
          text: 'Конверсия', value: "conversion"
        },
        {
          text: 'Транзакции', value: "payment"
        },
      ],
      disBalanceHeaders: [
        {
          text: "Полное имя", value: "name"
        },
        {
          text: "Номер телефона", value: "phone"
        },
        {
          text: "ID клиента", value: "customerId"
        },
        {
          text: "ID кошелька", value: "walletId"
        },
        {
          text: "АБС баланс", value: "absBalance"
        },
        {
          text: 'Баланс кошелька', value: 'walletBalance'
        },
        {
          text: 'Разница', value: "difference"
        },
        {
          text: 'Висящая сумма', value: "hangAmount"
        },
        {
          text: 'ID NIBBD', value: "nibbdId"
        },
      ]
    }
  },
  computed: {
    showDateBox() {
      if (this.active === 'btn1' || this.active === 'btn4') {
        return true;
      } else {
        return false;
      }
    },
    showLimit() {
      if (this.active === 'btn1' || this.active === 'btn2') {
        return true;
      } else {
        return false;
      }
    },
    showOperations() {
      if (this.active === 'btn4') {
        return true;
      } else {
        return false;
      }
    },
    excelDisBalanceHeaders() {
      let result = {};
      for (let i = 0; i < this.disBalanceHeaders.length; i++) {
        let currentHeader = this.disBalanceHeaders[i];
        result[currentHeader.text] = currentHeader.value;
      }
      result['ID клиента'] = {
        field: "customerId",
        callback: value => {
          if (value)
            return value;
          else
            return 'Не клиент';
        }
      };
      result['АБС баланс'] = {
        field: "absBalance",
        callback: value => {
          return (value / 100).replace('.', ',');

        }
      };
      result['Баланс кошелька'] = {
        field: "walletBalance",
        callback: value => {
          return (value / 100).replace('.', ',');

        }
      };
      result['Разница'] = {
        field: "difference",
        callback: value => {
          return (value / 100).replace('.', ',');

        }
      };
      result['Висящая сумма'] = {
        field: "hangAmount",
        callback: value => {
          return (value / 100).replace('.', ',');

        }
      };
      return result
    },
    excelHeaders() {
      let result = {};
      for (let i = 0; i < this.headers.length; i++) {
        let currentHeader = this.headers[i];
        result[currentHeader.text] = currentHeader.value;
      }
      result['ID клиента'] = {
        field: "customerId",
        callback: value => {
          if (value)
            return value;
          else
            return 'Не клиент';
        }
      };
      return result
    },
    excelOperationsHeaders() {
      let result = {};
      for (let i = 0; i < this.operationsHeaders.length; i++) {
        let currentHeader = this.operationsHeaders[i];
        result[currentHeader.text] = currentHeader.value;
      }
      result['ID клиента'] = {
        field: "customerId",
        callback: value => {
          if (value)
            return value;
          else
            return 'Не клиент';
        }
      };
      return result
    },
  },
  methods: {
    start() {
      if (this.active === 'btn1') {
        this.addManyCards();
      } else if (this.active === 'btn2') {
        this.connectCards();
      } else if (this.active === 'btn3') {
        this.getDisBalance();
      } else if (this.active === 'btn4') {
        this.getOperations();
      }

    },
    getDisBalance() {
      let self = this;
      this.active = 'btn3';
      this.isShow = false;
      this.isShowOperations = false;
      this.isDisBalanceShow = false;
      this.isClickDisBalance = false;
      self.$http.get(self.$store.getters.apiUrl + '/report/fraud/disBalance')
        .then(response => {
          // console.log(response);
          if (response.status === 200) {
            self.disBalanceData = response.data.data;
            self.isDisBalanceShow = true;
            self.isClickDisBalance = true;
          }
        })

        .catch(() => {
          self.isClickDisBalance = true;
        })

    },
    addManyCards() {
      let self = this;
      this.isShow = false;
      this.isClick = false;
      // alert(this.date2.split('-'), ' - ', this.date1)
      // console.log('addManyCards - date')
      var tmpTime = this.date2.split('-');
      var endTime = new Date(tmpTime[0], tmpTime[1] - 1, tmpTime[2], 23, 59, 59);
      tmpTime = this.date1.split('-');
      var begTime = new Date(tmpTime[0], tmpTime[1] - 1, tmpTime[2], 0, 0, 0);
      // console.log(begTime)
      // console.log(endTime)

      self.$http.post(self.$store.getters.apiUrl + '/report/fraud/addManyCards', {
        cardLimits: this.limit,
        dateFrom: begTime.getTime(),
        dateTo: endTime.getTime()
      })
        .then(response => {
          // console.log(response.data)
          if (response.status === 200) {
            self.data = response.data.data;
            self.isShow = true;
            self.isClick = true;
          }
        })
        .catch(() => {
          self.isClick = true;
        })
    },
    connectCards() {
      this.isShow = false;
      this.isClick = false;
      // console.log('connectCards - limit')
      let self = this;
      self.$http.post(self.$store.getters.apiUrl + '/report/fraud/connectCards', {
        cardLimits: this.limit,
      })
        .then(response => {
          // console.log(response.data)
          if (response.status === 200) {
            self.data = response.data.data;
            self.isShow = true;
            self.isClick = true;

          }
        })
        .catch(() => {
          self.isClick = true;
        })
    },
    getOperations() {
      let self = this;
      this.isShowOperations = false;
      this.isClick = false;
      // alert(this.date2.split('-'), ' - ', this.date1)
      // console.log('addManyCards - date')
      var tmpTime = this.date2.split('-');
      var endTime = new Date(tmpTime[0], tmpTime[1] - 1, tmpTime[2], 23, 59, 59);
      tmpTime = this.date1.split('-');
      var begTime = new Date(tmpTime[0], tmpTime[1] - 1, tmpTime[2], 0, 0, 0);
      // console.log(begTime)
      // console.log(endTime)

      self.$http.post(self.$store.getters.apiUrl + '/report/fraud/operations', {
        p2p: this.p2p,
        conversion: this.conversion,
        payment: this.payment,
        dateFrom: begTime.getTime(),
        dateTo: endTime.getTime()
      })
        .then(response => {
          // console.log(response.data)
          if (response.status === 200) {
            self.dataOperations = response.data.data;
            self.isShowOperations = true;
            self.isClick = true;
          }
        })
        .catch(() => {
          self.isClick = true;
        })
    },
    operations() {
      this.active = 'btn4';
      this.isShow = false;
      this.isShowOperations = false;
      this.isDisBalanceShow = false;
      this.isClickDisBalance = true;
    },
    connect() {
      this.active = 'btn1';
      this.isShow = false;
      this.isShowOperations = false;
      this.isDisBalanceShow = false;
      this.isClickDisBalance = true;
    },
    addMany() {
      this.active = 'btn2';
      this.isShow = false;
      this.isShowOperations = false;
      this.isDisBalanceShow = false;
      this.isClickDisBalance = true;
    },

  },
  mounted() {
    this.connect();
  }
}
</script>

<style scoped>
.header {
  text-align: center;
}

.main {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.btns-box {
  margin: auto;
}

.param-box {
  width: 500px;
  margin: 25px auto;
  background: #FFFF;
  padding: 19px;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
}

.row {
  display: flex;
}

.get-button {
  margin: auto;
  width: 240px;
}

.active-btn {
  background: #fbc100 !important;
  /* color: #FFFF !important; */
}

.search-box {
  background: #FFFF;
  padding: 15px 20px 21px;
  border: 1px solid #e0e0e0;
  box-shadow: 0px 0px 7px 1px rgba(216, 216, 216, 0.52);
  margin: 0 -1px -1px -1px;
}

.empty {
  text-align: center;
  font-size: 15px;
}

.operations-box {
  display: flex;
}

.operations-box-child {
  margin: 0 10px;
}
</style>
