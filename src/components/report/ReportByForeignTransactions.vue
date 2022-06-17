<template>
  <v-layout column wrap>
    <v-flex xs12>
      <div class="main">
        <v-card-text>

          <h1 class="headline">По Внешним Транзакциям</h1>

          <v-layout row wrap>

            <date-component @date="getDate"/>

            <v-flex xs12>
              <v-select
                label="Операции"
                :items="operationTypes"
                v-model="selectedOperationType"
                placeholder="Выберите опериции"
                attach
                chips outline
                multiple
              >
                <template v-slot:prepend-item>
                  <v-list-tile ripple @click="toggle">
                    <v-list-tile-action>
                      <v-icon :color="selectedOperationType.length > 0 ? 'primary' : ''">{{ icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title>Выбрать все</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider class="mt-2"></v-divider>
                </template>
              </v-select>
            </v-flex>

            <v-flex xs12>
              <div class="d-flex flex-wrap checkbox">
                <v-checkbox
                  v-for="(item,index) in statusData"
                  :key="index"
                  v-model="status"
                  :label="item.value"
                  :value="item.key"
                />
              </div>
            </v-flex>

            <div class="button-box">
              <v-btn dark color="primary" class="get-btn" @click="load" :loading="loader">Получить</v-btn>
              <v-btn class="excel-btn" :loading="loader" @click="getExcel">Скачать Excel</v-btn>
              <download-excel
                v-show="false"
                id="excel"
                name="p2pForeign.xls"
                :stringify-long-num="true"
                :stringifyLongNum="true"
                :fields="operationExcelFields"
                :data="excelData"
              />
            </div>

            <div class="amount-box">
              <span v-for="(item,key,index) in operationAmount" :key="index" class="amount-box-child">
                <p>{{ key }}:</p>
                <span class="d-flex align-center column">
                  <p class="amount-text">Общая сумма:</p>
                  <p class="amount-value">{{ item.amount / 100 | numberFormat }}</p>
                </span>
                <span class="d-flex align-center column">
                  <p class="amount-text">Комиссия:</p>
                  <p class="amount-value">{{ item.fee / 100 | numberFormat }}</p>
                </span>
              </span>
            </div>

            <v-flex xs12 v-if="show">

              <v-data-table
                :headers="operationsHeaders"
                :items="transactions"
                :loading="loader"
                :pagination.sync="pagination"
                item-key="id"
                hide-actions
              >
                <template v-slot:items="props">
                  <tr @click="props.expanded = !props.expanded">
                    <td>{{ props.item.id }}</td>
                    <td>{{ props.item.login }}</td>
                    <td>{{ props.item.userType }}</td>
                    <td>{{ props.item.dateTime | timestampToDate }}</td>
                    <td>{{ props.item.sender }}</td>
                    <td>{{ props.item.receiver }}</td>
                    <td>{{ props.item.bank }}</td>
                    <td>{{ props.item.operationType }}</td>
                    <td>{{ props.item.senderCurrency }}</td>
                    <td style="min-width:145px">{{ props.item.senderAmount / 100 | numberFormat }}</td>
                    <td>{{ props.item.receiverCurrency }}</td>
                    <td style="min-width:145px">{{ props.item.receiverAmount / 100 | numberFormat }}</td>
                    <td>{{ props.item.feeCurrency }}</td>
                    <td>{{ props.item.feeAmount / 100 | numberFormat }}</td>
                    <td>{{ props.item.status }}</td>
                    <td>{{ props.item.platform }}</td>
                    <td>{{ props.item.appVersion }}</td>
                  </tr>
                </template>
              </v-data-table>

              <v-pagination
                v-if="transactions.length"
                :disabled="loader"
                class="center"
                v-model="page"
                :length="totalPages"
                :total-visible="10"
              />

            </v-flex>

          </v-layout>
        </v-card-text>

      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import DateComponent from '@/components/date/DateComponent';

export default {
  name: "ReportByTransactions",
  components: { DateComponent },
  data() {
    return {
      operationAmount: {},
      transactions: [],
      operationTypes: [],
      pagination: {
        sortBy: "createdDate",
        descending: true,
        rowsPerPage: 10
      },
      status: [],
      show: false,
      operationsHeaders: [
        {text: "ID", value: "id"},
        {text: "Login", value: "login"},
        {text: "Дата и время", value: "dateTime"},
        {text: "Статус", value: "status"},
        {text: "Отправитель", value: "sender"},
        {text: "Получатель", value: "receiver"},
        {text: "Банк получателя", value: "bank"},
        {text: "Тип операции", value: "operationType"},
        {text: "Валюта отправителя", value: "senderCurrency"},
        {text: "Сумма отправителя", value: "senderAmount"},
        {text: "Валюта получателя", value: "receiverCurrency"},
        {text: "Сумма получателя", value: "receiverAmount"},
        {text: "Валюта комиссии", value: "feeCurrency"},
        {text: "Сумма комиссии", value: "feeAmount"},
        {text: "Тип клиента", value: "userType"},
        {text: "Платформа", value: "platform"},
        {text: "Версия", value: "appVersion"},
      ],
      statusData: [],
      selectedOperationType: [],
      data: {
        status: [],
        operationType: [],
        dateFrom: '',
        dateTo: '',
      },
      totalPages: '',
      page: 1,
      excelData: [],
      date: {}
    }
  },
  methods: {
    getDate(val) {
      this.date = val;
      this.transactions = [];
      this.totalPages = '';
      this.show = false;
      this.operationAmount = {}
    },
    toggle() {
      this.$nextTick(() => {
        if (this.likesAllFruit) {
          this.selectedOperationType = [];
        } else {
          this.selectedOperationType = this.operationTypes;
        }
      })
    },
    getStatus() {
      this.$http.get(this.$store.state.prodApiUrl2 + `/report/foreign-transaction/status`)
        .then(response => {
          this.statusData = response.data.data;
          response.data.data.forEach(x => {
            this.status.push(x.key);
          })
        }, this.handleError)

    },
    getTypeOperations() {
      this.$http.get(this.$store.state.prodApiUrl2 + '/report/foreign-transaction/operation-type')
        .then(response => {
          this.operationTypes = response.data.data;
          this.selectedOperationType = this.operationTypes
        }, this.handleError);
    },
    load() {
      this.data.dateFrom = this.date.fromDate;
      this.data.dateTo = this.date.toDate;
      this.data.status = this.status;
      this.data.operationType = this.selectedOperationType;
      if (this.date.fromDate === "")
        delete this.data.dateFrom
      if (this.date.toDate === "")
        delete this.data.dateTo;
      this.loadAmount();
      if (this.page === 1) {
        this.loadReports(1);
      } else {
        this.page = 1
      }
    },
    loadAmount() {
      this.$http.post(this.$store.state.prodApiUrl2 + '/report/foreign-transaction/amount', this.data)
        .then(response => {
          this.operationAmount = response.data.data;
          this.show = true;
        }, this.handleError);
    },
    loadReports(page) {
      this.loader = true;
      this.$http.post(this.$store.getters.newApiUrl2 + `/report/foreign-transaction?page=${page - 1}&size=10`, this.data)
        .then(response => {
          this.loader = false;
          const operationsList = response.data.data;
          this.transactions = operationsList.content;
          this.totalPages = operationsList.totalPages;
          this.show = true;

        }, this.handleError);
    },
    getExcel() {
      this.loader = true;
      this.excelData = [];
      this.data.dateFrom = this.date.fromDate;
      this.data.dateTo = this.date.toDate;
      this.data.status = this.status;
      this.data.operationType = this.selectedOperationType;
      if (this.date.fromDate === "")
        delete this.data.dateFrom
      if (this.date.toDate === "")
        delete this.data.dateTo
      this.$http.post(this.$store.state.prodApiUrl2 + `/report/foreign-transaction/excel`, this.data)
        .then(response => {
          this.loader = false;
          this.excelData = response.data.data;
          if (this.excelData.length !== 0) {
            let elem = document.getElementById('excel');
            setTimeout(() => {
              elem.click();
            }, 500)

          }
        }, this.handleError);
    },
  },
  computed: {
    likesAllFruit() {
      return this.selectedOperationType.length === this.operationTypes.length
    },
    likesSomeFruit() {
      return this.selectedOperationType.length > 0 && !this.likesAllFruit
    },
    icon() {
      if (this.likesAllFruit) return 'mdi-close-box'
      if (this.likesSomeFruit) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    },
    operationExcelFields() {
      const result = this.operationsHeaders.reduce((res, header) => ({...res, [header.text]: header.value}), {});
      result['Дата и время'] = { field: "dateTime", callback: v => new Date(parseInt(v)).toLocaleString() };
      result['Сумма отправителя'] = { field: "senderAmount", callback: v => (v / 100).toString().replace('.', ',') };
      result['Сумма получателя'] = { field: "receiverAmount", callback: v => (v / 100).toString().replace('.', ',') };
      result['Сумма комиссии'] = { field: "feeAmount", callback: v => (v / 100).toString().replace('.', ',') };
      result['Отправитель'] = { field: "sender", callback: v => ("'" + v) };
      result['Получатель'] = { field: "receiver", callback: v => ("'" + v) };

      return result;
    }
  },
  mounted() {
    this.getTypeOperations();
    this.getStatus();
  }
}
</script>

<style scoped>
.main {
  width: 100%;
}

.headline {
  text-align: center;
}

.get-btn {
  border-radius: 20px;
}

.checkbox {
  background: #fff;
  padding: 0 10px;
  border-radius: 15px;
  margin: 15px 0;
  flex-wrap: wrap;
}

small {
  color: #9c9c9c;
  font-weight: 400;
  font-size: 14px;
}

.center {
  display: flex;
  justify-content: center;
  margin: 15px;
  flex-wrap: wrap;
}

.excel-btn {
  border-radius: 20px;
  background: #3d9c3d !important;
  color: #FFFF !important;
}

.amount-text {
  margin: 0;
  font-style: italic;
  font-size: 16px;
}

.amount-value {
  font-size: 18px;
  font-weight: 600;
  margin: 0 7px;
}

.amount-box {
  display: flex;
  justify-content: center;
  width: 100%;
  flex-wrap: wrap;
  margin: 10px 0 25px 0;
}

.amount-box-child {
  padding: 10px 20px;
  border: 1px solid silver;
  border-radius: 17px;
  margin: 10px 20px;
}

@media only screen and (max-width: 820px) {

}

@media only screen and (max-width: 600px) {

}

.column {
  flex-direction: column;
}

.amount-box-child {
  width: 310px;
}

h1 {
  margin-bottom: 5px;
}

</style>
