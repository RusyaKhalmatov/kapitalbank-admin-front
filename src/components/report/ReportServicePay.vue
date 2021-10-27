<template>
    <v-layout row wrap>
        <date-component @date="getDate"></date-component>
            <v-flex xs12>
                <v-select
                label="Операции"
                :items="operationTypes"
                v-model="operationType"
                placeholder="Выберите опериции"
                attach
                chips
                multiple>
                <template v-slot:prepend-item>
                    <v-list-tile ripple @click="toggle">
                    <v-list-tile-action>
                        <v-icon :color="operationType.length > 0 ? 'primary' : ''">{{ icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Выбрать все</v-list-tile-title>
                    </v-list-tile-content>
                    </v-list-tile>
                    <v-divider class="mt-2"></v-divider>
                </template>

                </v-select>
            </v-flex>
            <!-- <v-flex xs12>
                <v-btn-toggle multiple v-model="filterToggle" key="all" class="selectedFilter">
                    <v-btn dark color="primary" @click="selectFilters('all')">Все</v-btn>
                    <v-btn dark color="accent" v-for="(filterItem,k) in operationTypes" :key="k"
                        @click="selectFilters(filterItem)">
                        {{filterItem}}
                    </v-btn>
                </v-btn-toggle>
            </v-flex> -->
            <!-- <v-flex xs12 class="mt-3">
                <report-date-time-picker :date-time-start.sync="operation.dateFrom"
                                        :date-time-end.sync="operation.dateTo">
                    <v-btn :to="{name: 'clients'}" dark color="primary">Клиенты</v-btn>
                    <v-btn dark color="primary" @click="load" :loading="loader">Получить</v-btn>
                </report-date-time-picker>
            </v-flex> -->
            <v-flex xs12>
                <!-- <v-radio-group v-model="operation.operationStatus" row>
                    <v-radio key="success" label="Success" value="SUCCESS"/>
                    <v-radio key="failed" label="Failed" value="FAILED"/>
                </v-radio-group> -->
                <div class="d-flex flex-wrap checkbox">
                <v-checkbox v-for="(item,index) in statusData" :key="index" v-model="status" :label="item.value"
                            :value="item.key"></v-checkbox>
                </div>
            </v-flex>
            <div class="button-box">
                <v-btn dark color="primary" class="get-btn" @click="load" :loading="loader">Получить</v-btn>
                <v-btn class="mt-3 excel-btn" :loading="loader" @click="getExcel">Скачать Excel</v-btn>
                <download-excel
                v-show="false"
                id="excel"
                name="paynet.xls"
                stringify-long-num
                :fields="operationExport"
                :data="excelData">
                <v-btn icon dark color="secondary">
                    <v-icon>mdi-file-excel</v-icon>
                </v-btn>
                </download-excel>
            </div>

            <div v-if="operationAmount.length" class="amount-box">
                <span v-for="(item,key,index) in operationAmount" :key="index" class="amount-box-child">
                    <h2>{{ item.title }}:</h2>
                    <span class="d-flex align-center">
                        <p class="amount-text">UZS:</p>
                        <p class="amount-value">{{ item.uzs / 100|number-format }}</p>
                    </span>
                    <span class="d-flex align-center">
                        <p class="amount-text">USD:</p>
                        <p class="amount-value">{{ item.usd / 100|number-format }}</p>
                    </span>
                </span>
                <p class="success-text" v-if="operationAmount.paynetTotal">*Сумма успешных платежей</p>
            </div>
            <template v-if="transactions.length !== 0">
                <div class="dflex">
                <v-text-field
                    style="width:500px"
                    v-model="search"
                    prepend-icon="mdi-magnify"
                    label="Поиск">
                </v-text-field>
                <v-btn @click="load">Поиск</v-btn>
                </div>
            </template>
            <v-flex xs12 v-if="show">
                <v-data-table
                :headers="operationsHeaders"
            :items="transactions"
            :loading="loader"
            :pagination.sync="pagination"
            item-key="id"
            hide-actions
            >
            <template slot="items" slot-scope="props">
                <tr @click="props.expanded = !props.expanded">
                <td>{{ props.item.serviceId }}</td>
                <td>{{ props.item.serviceName }}</td>
                <td>{{ props.item.gatewayName }}</td>
                <td>{{ props.item.login.split(":")[0] }}
                    {{ phoneFormat(props.item.login.split(":")[1]) | timestamp-to-date }}
                </td>
                <td>{{ props.item.sender }}</td>
                <td style="min-width:150px">{{ props.item.amount / 100 | number-format }}
                    {{ props.item.currency }}
                </td>
                <td>{{ props.item.feeAmount / 100 | number-format }} {{ props.item.feeCurrency }}</td>
                <td>{{ props.item.allFee / 100 | number-format }} {{ props.item.feeCurrency }}</td>
                <td>{{ props.item.fee / 100 | number-format }} {{ props.item.feeCurrency }}</td>

                <td>{{ props.item.status }}</td>
                <td>{{ props.item.details }}</td>
                <td>{{ props.item.platform }}</td>
                <td>{{ props.item.appVersion }}</td>
                <td>{{ props.item.endTime | timestamp-to-date }}</td>
                <td>
                    <v-btn depressed small v-if="props.item.errorInfo" @click="showErrorInfo(props.item.errorInfo)">
                    Подробнее
                    </v-btn>
                </td>

                </tr>

            </template>
            <template slot="actions-append">
                <download-excel
                :fields="operationExport"
                name="ReportByTransactions"
                :data="operationsList.operations">
                <v-btn icon dark color="secondary">
                    <v-icon>mdi-file-excel</v-icon>
                </v-btn>
                </download-excel>
            </template>
            <template slot="actions-prepend">
                <show-chart v-model="showCharts"/>
            </template>
            </v-data-table>
            <v-pagination
            v-if="transactions.length"
            :disabled="loader"
            class="center"
            v-model="page"
            :length="totalPages"
            :total-visible="10"
            ></v-pagination>
        </v-flex>
    </v-layout>
</template>

<script>
import ReportDateTimePicker from "./ReportDateTimePicker";
import ShowChart from "../chart/ShowChart";
import TransactionChart from "../chart/TransactionChart";
import DateComponent from '@/components/date/DateComponent';

export default {
  name: "ReportServicePay",
  components: { ReportDateTimePicker, ShowChart, TransactionChart, DateComponent},
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
    // this.loadReports(1);
  }
}
</script>
