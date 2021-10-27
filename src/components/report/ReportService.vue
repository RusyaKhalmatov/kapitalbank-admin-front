<template>
  <v-layout column wrap>
    <v-flex xs12>
      <div class="main">
        <v-card-text>
          <h1 class="mb-4 headline">Детализированные отчеты Paynet</h1>

          <v-tabs color="#f9ca03" slider-color="black" grow fixed-tabs show-arrows>
            <v-tab> Проверки провайдеров </v-tab>
            <v-tab> Общее колличество проверок </v-tab>
            <v-tab> Оплата провайдера </v-tab>
            <v-tab> Общая сумма оплат </v-tab>

            <v-tab> Операции </v-tab>

            <v-tab-item :transition="false" :reverseTransition="false">
              <v-card flat>
                <v-card-text>
                  <ReportServiceProviders />
                </v-card-text>
              </v-card>
            </v-tab-item>

            <v-tab-item :transition="false" :reverseTransition="false">
              <v-card flat>
                <v-card-text>
                  <report-service-providers-total />
                </v-card-text>
              </v-card>
            </v-tab-item>

            <v-tab-item :transition="false" :reverseTransition="false">
              <v-card flat>
                <v-card-text>
                  <p>
                    Оплата провайдера
                  </p>
                </v-card-text>
              </v-card>
            </v-tab-item>

            <v-tab-item :transition="false" :reverseTransition="false">
              <v-card flat>
                <v-card-text>
                  Общая сумма оплат
                </v-card-text>
              </v-card>
            </v-tab-item>

            <v-tab-item :transition="false" :reverseTransition="false">
              <v-card flat>
                <v-card-text>
                  <report-service-pay />
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs>

        </v-card-text>
      </div>
    </v-flex>
    <v-dialog v-model="errorDialog" persistent max-width="950">
      <v-card>
        <v-card-title class="headline">Устройства</v-card-title>
        <v-card-text>
          <v-data-table :pagination.sync="pagination" :items="errorInfo" :headers="dialogHeaders">
            <template slot="items" slot-scope="props">
              <tr>
                <td>{{ props.item.response }}</td>
                <td>{{ props.item.transactionStatus }}</td>
                <td>{{ props.item.transactionType }}</td>
                <td>{{ props.item.dateTime | timestamp-to-date }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn depressed text @click="errorDialog = false">Закрыть</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import ReportDateTimePicker from "./ReportDateTimePicker";
import ShowChart from "../chart/ShowChart";
import TransactionChart from "../chart/TransactionChart";
import DateComponent from '@/components/date/DateComponent'
import ReportServicePay from "@/components/report/ReportServicePay";
import ReportServiceProviders from './ReportServiceProviders.vue';
import ReportServiceProvidersTotal from './ReportServiceProvidersTotal.vue';

export default {
  name: "ReportService",
  components: {ReportDateTimePicker, ShowChart, TransactionChart, DateComponent, ReportServicePay,  ReportServiceProviders, ReportServiceProvidersTotal},
  data() {
    return {
      search: '',
      filterStatus: 'success',
      status: 'SUCCESS',
      showCharts: false,
      operationsList: {},
      operationAmount: {},
      transactions: [],
      operationTypes: [],
      selectedFilters: [],
      filterToggle: [],
      availableFilters: [],
      amountData: {},
      pagination: {
        descending: true,
        rowsPerPage: 10
      },
      status: [],
      show: false,
      maskedFilters: [
        'UZCARD',
        'HUMO',
        'VISA',
        'Кошелек',
        'Вклад'
      ],
      dialogHeaders: [
        {text: "Ответ", value: "response"},
        {text: "Статус транзакции", value: "transactionStatus"},
        {text: "Тип транзакции", value: "transactionType"},
        {text: "Дата и время", value: "dateTime"},
      ],
      filters: [
        {text: 'UZCARD2UZCARD', value: 'uzcard2uzcard'},
        {text: 'UZCARD2HUMO', value: 'uzcard2humo'},
        {text: 'HUMO2UZCARD', value: 'humo2uzcard'},
        {text: 'HUMO2HUMO', value: 'humo2humo'},
        {text: 'VISA2VISA', value: 'visa2visa'},
        {text: 'UZCARD2WALLET', value: 'uzcard2wallet'},
        {text: 'WALLET2UZCARD', value: 'wallet2uzcard'},
        {text: 'HUMO2WALLET', value: 'humo2wallet'},
        {text: 'WALLET2HUMO', value: 'wallet2humo'},
        {text: 'VISA2WALLET', value: 'visa2wallet'},
        {text: 'WALLET2VISA', value: 'wallet2visa'},
        {text: 'WALLET2ACCOUNT', value: 'wallet2account'},
        {text: 'WALLET2LOAN', value: 'wallet2loanRepayment'}
      ],
      operation: {
        dateStart: null,
        dateEnd: (new Date).toLocaleString(),
        operationType: [],
        phoneNumber: '',
        operationStatus: 'SUCCESS'
      },
      operationsHeaders: [
        {text: "ID  сервиса", value: "serviceId"},
        {text: "Название сервиса", value: "serviceName"},
        {text: "Название шлюза", value: "gatewayName"},
        {text: "Логин", value: "login"},
        {text: "Отправитель", value: "sender"},
        {text: "Сумма", value: "amount"},
        {text: "Верхняя комиссия", value: "feeAmount"},
        {text: "Общая комиссия", value: "allFee"},
        {text: "Чистая комиссия", value: "fee"},

        {text: "Статус", value: "status"},
        {text: "Детали", value: "details"},
        {text: "Платформа", value: "platform"},
        {text: "Версия", value: "appVersion"},
        {text: "Дата и время оплаты", value: "endTime"},
        {text: "Ошибки", value: "errorInfo"},


      ],
      excelHeaders: [
        {text: "ID  сервиса", value: "serviceId"},
        {text: "Название сервиса", value: "serviceName"},
        {text: "Название шлюза", value: "gatewayName"},
        {text: "Логин", value: "login"},
        {text: "Отправитель", value: "sender"},
        {text: "Сумма", value: "amount"},
        {text: "Валюта", value: "currency"},
        {text: "Верхняя комиссия", value: "feeAmount"},
        {text: "Общая комиссия", value: "allFee"},
        {text: "Чистая комиссия", value: "fee"},
        {text: "Валюта комиссия", value: "feeCurrency"},
        {text: "Статус", value: "status"},
        {text: "Детали", value: "details"},
        {text: "Платформа", value: "platform"},
        {text: "Версия", value: "appVersion"},
        {text: "Дата и время оплаты", value: "endTime"},
        {text: "Ошибки", value: "errorInfo"},
      ],
      filtersTypeTemp: [],
      statusData: [],
      operationType: [],
      data: {
        status: [],
        operationType: [],
        dateFrom: '',
        dateTo: '',
      },
      totalPages: '',
      page: 1,
      excelData: [],
      summeryLeftDialog: false,
      summeryRightDialog: false,
      errorInfo: [],
      errorDialog: false,
    }
  },
  methods: {
    showErrorInfo(item) {
      this.errorInfo = item;
      this.errorDialog = true;
    },
    getDate(val) {
      this.date = val;
      this.transactions = [];
      this.totalPages = '';
      this.amountData = [];
      this.show = false;
      this.operationAmount = {}
      // console.log(this.date)
      // if(this.page===1)
      //     this.getRequisite(this.page);
      // else
      //     this.page = 1;
    },
    toggle() {
      this.$nextTick(() => {
        if (this.likesAllFruit) {
          this.operationType = [];
        } else {
          this.operationType = this.operationTypes;
        }
      })
    },
    getStatus() {
      this.$http.get(this.$store.getters.newApiUrl2 + `/report/paynet/status`)
        .then(response => {
          // console.log(response.data.data);
          this.statusData = response.data.data;
          response.data.data.forEach(x => {
            this.status.push(x.key);
          })
        }, this.handleError)

    },
    getTypeOperations() {
      let self = this;
      self.$http.get(self.$store.getters.newApiUrl2 + '/report/paynet/operation_type')
        .then(response => {
          self.operationTypes = response.data.data;
          this.operationType = self.operationTypes
          this.selectFilters('all')


        }, self.handleError);
    },
    selectFilters(template) {
      let self = this, isEnabled = false;
      self.$nextTick(() => {
        self.filters.forEach(item => self.filtersTypeTemp.push(item.value));
        isEnabled = self.filterToggle.indexOf(self.filtersTypeTemp.indexOf(template) + 1) !== -1;
        if (template === "all") {
          if (self.filterToggle.indexOf(0) !== -1) {
            self.filters.forEach(item => self.selectedFilters.push(item.value));
            self.operation.operationType = self.selectedFilters;
          } else {
            self.selectedFilters = [];
          }
          return;
        }

        for (let i = 0; i < self.operationTypes.length; i++) {
          let currentItem = self.operationTypes[i];
          if (currentItem.indexOf(template) !== -1) {
            let index = self.selectedFilters.indexOf(currentItem);
            if (isEnabled) {
              if (index === -1) {
                self.selectedFilters.push(currentItem);
                self.operation.operationType = self.selectedFilters;
              }
            } else {
              if (index !== -1) {
                self.selectedFilters.splice(index, 1);
                self.operation.operationType = self.selectedFilters;
              }
            }
          }
        }
      })
    },
    loadAmount() {
      let self = this;
      const postData = {
        dateFrom: this.data.dateFrom,
        dateTo: this.data.dateTo,
        status: "SUCCESS",
        types: this.data.operationType
      }
      self.$http.post(self.$store.getters.newApiUrl2 + '/report/paynet/amount', postData)
        .then(response => {
          self.operationAmount = response.data.data;
          console.log(response.data.data);
          this.show = true;
        }, self.handleError);
    },
    load() {
      let self = this;
      this.data.dateFrom = this.date.fromDate;
      this.data.dateTo = this.date.toDate;
      this.data.status = this.status;
      this.data.operationType = this.operationType;
      if (this.date.fromDate === "")
        delete this.data.dateFrom
      if (this.date.toDate === "")
        delete this.data.dateTo
      // this.data.operationType = this.operation.operationType;
      self.loadAmount();
      if (this.page === 1) {
        self.loadReports(1);
      } else {
        this.page = 1
      }

    },
    getExcel() {
      let self = this;
      self.loader = true;
      self.excelData = [];
      this.data.dateFrom = this.date.fromDate;
      this.data.dateTo = this.date.toDate;
      this.data.status = this.status;
      this.data.operationType = this.operationType;
      if (this.date.fromDate === "")
        delete this.data.dateFrom
      if (this.date.toDate === "")
        delete this.data.dateTo
      self.$http.post(self.$store.getters.newApiUrl2 + `/report/paynet/excel?search=${this.search}`, self.data)
        .then(response => {
          self.loader = false;
          self.excelData = response.data.data;
          if (this.excelData.length != 0) {
            let elem = document.getElementById('excel');
            setTimeout(() => {
              elem.click();
            }, 500)

          }
        }, self.handleError);
    },
    loadReports(page) {
      let self = this;
      self.loader = true;
      // self.transactions = [];
      // console.log(this.operation)
      self.$http.post(self.$store.getters.newApiUrl2 + `/report/paynet/v2?search=${this.search}&page=${page - 1}&size=10`, self.data)
        .then(response => {
          self.loader = false;
          self.operationsList = response.data.data;
          self.transactions = self.operationsList.content;
          self.totalPages = self.operationsList.totalPages;
          self.show = true;

        }, self.handleError);

    },
    phoneFormat(phone) {
      if (phone === '' || phone === null) {
        return '';
      }
      return phone;
    }
  },
  computed: {
    sortedAvailableFilter() {
      let self = this;
      // return self.operationTypes.sort();
      return self.filterGroups;
    },
    likesAllFruit() {
      return this.operationType.length === this.operationTypes.length
    },
    likesSomeFruit() {
      return this.operationType.length > 0 && !this.likesAllFruit
    },
    icon() {
      if (this.likesAllFruit) return 'mdi-close-box'
      if (this.likesSomeFruit) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    },
    operationExport() {
      let self = this, result = {};
      for (let i = 0; i < self.excelHeaders.length; i++) {
        let currentHeader = self.excelHeaders[i];
        result[currentHeader.text] = currentHeader.value;
      }

      result['Сумма'] = {
        field: "amount",
        callback: value => {
          return (value / 100).toString().replace('.', ',');
        }
      };

      result['Верхняя комиссия'] = {
        field: "feeAmount",
        callback: value => {
          return (value / 100).toString().replace('.', ',');
        }
      };
      result['Общая комиссия'] = {
        field: "allFee",
        callback: value => {
          return (value / 100).toString().replace('.', ',');
        }
      };
      result['Чистая комиссия'] = {
        field: "fee",
        callback: value => {
          return (value / 100).toString().replace('.', ',');
        }
      };
      result['Дата и время оплаты'] = {
        field: "endTime",
        callback: value => {
          let date = new Date(parseInt(value)).toLocaleString();
          return date;
        }
      };
      result['Ошибки'] = {
        field: "errorInfo",
        callback: value => {
          let str = value
          let result = '';
          if (str)
            str.forEach((x, i) => {
              result += str[i].response + ' - ' + str[i].transactionStatus + ' - ' + str[i].transactionType + ' - ' + new Date(parseInt(str[i].dateTime)).toLocaleString() + '; '
            })
          else
            result = '';
          return result;
        }
      };
      return result;
    }
  },
  watch: {
    page(val) {
      this.loadReports(val);
    },
    filterStatus(value) {
      let self = this;
      if (value === 'success') {
        self.operation.operationStatus = 'SUCCESS';
        self.loadReports();
      }
      if (value === 'failed') {
        self.operation.operationStatus = 'FAILED';
        self.loadReports();
      }
    },
    status(val) {

      this.transactions = [];
      this.totalPages = '';
      this.show = false;
      this.operationAmount = {}

    },
    search() {
      if (!val) {
        this.load()
      }
    },
    operationType(val) {
      this.transactions = [];
      this.totalPages = '';
      this.show = false;
      this.operationAmount = {}

    }

  },
  mounted() {
    this.getTypeOperations();
    this.getStatus();
  }
}
</script>

<style>
.center {
  display: flex;
  justify-content: center;
  margin: 15px;
}

.main {
  width: 100%;
}

.headline {
  text-align: center;
}

.selectedFilter {
  display: flex;
  flex-wrap: wrap;
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

.v-item-group {
  flex-wrap: wrap !important;
  -webkit-box-shadow: none;
  box-shadow: none;
}

.epos-box {
  margin: auto;
}

/* hr{
    display: none;
    height: 1px;
    border: none;
    background: #c4c4c4;
} */
.new {
  display: block;
  margin: 20px 0;
  background: white;
}

.center {
  display: flex;
  justify-content: center;
  margin: 15px;
  flex-wrap: wrap;
}

.excel-btn {
  border-radius: 29px;
  background: #3d9c3d !important;
  color: #FFFF !important;
  margin: 20px 0;
}

.success-text {
  position: absolute;
  margin: -15px;
  font-style: italic;
  color: #7b7b7b;
}

.amount-text {
  margin: 0;
  font-style: italic;
  font-size: 16px;
}

.dflex {
  display: flex;
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

.epos-content {
  height: 500px;
  overflow: auto;
}

.button-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  align-items: center;
  margin: 10px;
}

.v-btn {
  margin: 5px 10px 5px 0px !important;

}

@media only screen and (max-width: 820px) {
  .v-btn {
    margin: 5px 10px 5px 0px !important;

  }
}

@media only screen and (max-width: 600px) {
  /* hr{
      display: block;
      height: 1px;
      border: none;
      background: #c4c4c4;
  } */
}

.right {
  margin-right: 50px;
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

.dialog-text {
  width: 200px;
  margin: 10px;
}

.dialog {
  text-align: center;
  padding: 0;
}

.dialog-header {
  background: #eadaa0;
  padding: 16px;
  flex-wrap: nowrap;
}

.bg-color {
  background: #efefef !important;
}

a{
  color: #000 !important;
}

.v-pagination{
  width: 100%;
  padding-top: 20px !important;
}
</style>
