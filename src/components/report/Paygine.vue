<template>
  <v-layout column wrap>
    <v-flex xs12>
      <div class="main">
        <v-card-text>

          <h1 class="headline">Paygine</h1>

          <v-layout row wrap>

            <date-component @date="getDate"/>

            <v-flex xs12>
              <v-select
                label="Операции"
                :items="operationTypes"
                v-model="selectedOperationType"
                placeholder="Выберите опериции"
                attach
                chips
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
                <v-card class="d-flex flex-wrap">
                    <v-card-title style="font-size: large">Статус конвертации:</v-card-title>
                    <v-checkbox
                        v-for="(item, index) in statusData"
                        :key="index"
                        v-model="statuses"
                        :label="item.value"
                        :value="item.key"
                    />
                </v-card>
            </v-flex>

            <div class="button-box">
              <v-btn
                color="primary"
                outlined
                @click="load"
                :loading="loader"
              >
                Получить
              </v-btn>
              <v-btn
                color="success"
                :loading="loader"
                @click="getExcel"
              >
                Скачать Excel
              </v-btn>
              <download-excel
                v-show="false"
                id="excel"
                :name="reportFileName"
                :stringify-long-num="true"
                :stringifyLongNum="true"
                :fields="operationExcelFields"
                :data="excelData"
              />
            </div>

            <div v-if="show">
              <v-card
                v-for="(item, key, index) in operationsAmount"
                :key="index"
                class="amount"
                elevation="0"
              >
                <v-card-title style="font-size: x-large">
                  {{key + ": " + item.senderAmount / 100 | numberFormat}}
                </v-card-title>

                <v-divider/>

                <v-card-text style="display: flex; flex-direction: column">

                  <div  style="font-size: large">{{ "Комиссия: " + item.senderFeeAmount / 100 | numberFormat}}</div>

                  <v-container style="display: flex; flex-direction: column">
                    <v-chip label outline color="black"
                            style="font-size: medium"
                    >
                      UZS: {{ item.receiverUZSAmount / 100 | numberFormat}}
                    </v-chip>
                    <v-chip label outline color="black"
                            style="font-size: medium"
                    >
                      USD: {{ item.receiverUSDAmount / 100 | numberFormat }}
                    </v-chip>
                    <v-chip label outline color="black"
                            style="font-size: medium"
                    >
                      EUR: {{ item.receiverEURAmount / 100 | numberFormat }}
                    </v-chip>
                  </v-container>
                  <p class="amount-status">Успешно</p>
                </v-card-text>
              </v-card>
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
                    <td>{{ props.item.customerId }}</td>
                    <td>{{ props.item.dateTime | timestampToDate }}</td>
                    <td>{{ props.item.status }}</td>
                    <td>{{ props.item.sender }}</td>
                    <td>{{ props.item.receiver }}</td>
                    <td>{{ props.item.operationType }}</td>
                    <td style="min-width:145px">{{ props.item.senderAmount / 100 | numberFormat }}</td>
                    <td>{{ props.item.senderCurrency }}</td>
                    <td style="min-width:145px">{{ props.item.receiverAmount / 100 | numberFormat }}</td>
                    <td>{{ props.item.receiverCurrency }}</td>
                    <td>{{ props.item.feeAmount / 100 | numberFormat }}</td>
                    <td>{{ props.item.feeCurrency }}</td>
                    <td>{{ props.item.userType }}</td>
                    <td>{{ props.item.platform }}</td>
                    <td>{{ props.item.appVersion }}</td>
                  </tr>
                </template>
              </v-data-table>

              <v-pagination
                class="pagination"
                v-if="transactions.length"
                :disabled="loader"
                v-model="page"
                :length="totalPages"
                :total-visible="10"
                v-on:input="this.loadReports"
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
      operationsAmount: {
        RUB: {
          countId: 0,
          senderFeeAmount: 0,
          senderAmount: 0,
          receiverEURAmount: 0,
          receiverUZSAmount: 0,
          receiverUSDAmount: 0
        }
      },
      transactions: [],
      operationTypes: [],
      pagination: {
        sortBy: "createdDate",
        descending: true,
        rowsPerPage: 10
      },
      show: false,
      operationsHeaders: [
        {text: "ID", value: "id"},
        {text: "Login", value: "login"},
        {text: "Customer ID", value: "customerId"},
        {text: "Дата и время", value: "dateTime"},
        {text: "Статус", value: "status"},
        {text: "Отправитель", value: "sender"},
        {text: "Получатель", value: "receiver"},
        {text: "Тип операции", value: "operationType"},
        {text: "Сумма отправителя", value: "senderAmount"},
        {text: "Валюта отправителя", value: "senderCurrency"},
        {text: "Сумма получателя", value: "receiverAmount"},
        {text: "Валюта получателя", value: "receiverCurrency"},
        {text: "Сумма комиссии", value: "feeAmount"},
        {text: "Валюта комиссии", value: "feeCurrency"},
        {text: "Тип клиента", value: "userType"},
        {text: "Платформа", value: "platform"},
        {text: "Версия", value: "appVersion"},
      ],
      statusData: [],
      statuses: [],
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
  watch: {
      statuses(statuses) {
          this.transactions = [];
          if (statuses.length === 0) {
              this.statuses = this.statusData.map(status => status.key);
          }
      },
      operationType() {
          this.transactions = [];
      },
  },
  methods: {
    resetValues() {
      this.transactions = [];
      this.totalPages = '';
      this.show = false;
      this.operationsAmount = {}
    },
    getDate(val) {
      this.date = val;
      this.resetValues();
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
          this.statuses = this.statusData.map(status => status.key);
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
      this.preparePostData();
      this.loadAmount();
      this.loadReports(this.page);
    },
    preparePostData() {
        this.data = {
            dateFrom :  this.date.fromDate === '' ? Date.now() : this.date.fromDate,
            dateTo : this.date.toDate === '' ? Date.now() : this.date.toDate,
            status: this.statuses,
            operationType: this.selectedOperationType,
        };
    },
    loadAmount() {
      this.$http.post(this.$store.state.prodApiUrl2 + '/report/foreign-transaction/amount',
        {
          ...this.data, ...{ status:['SUCCESS'] }
        }
      ).then(response => {
          this.operationsAmount = response.data.data;
          this.show = true;
        }, this.handleError);
    },
    loadReports(page) {
      this.loader = true;
      this.$http.post(this.$store.getters.newApiUrl2 + `/report/foreign-transaction?page=${page - 1}&size=${this.pagination.rowsPerPage}`, this.data)
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
      this.preparePostData();
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
    reportFileName() {
      return "p2pPaygine_" + (new Date()).toLocaleDateString() + ".xls"
    },
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

h1 {
  margin-bottom: 5px;
}

.headline {
  text-align: center;
}

.checkbox {
  background: #fff;
  padding: 0 10px;
  border-radius: 15px;
  margin: 15px 0;
  flex-wrap: wrap;
}

.pagination {
  display: flex;
  justify-content: center;
  margin: 15px;
  flex-wrap: wrap;
}

.amount {
  min-width: 300px;
  min-height: 300px;
  margin-left: 20px;
  margin-bottom: 20px;
  border: 1px solid #4caf50;
}

.amount-status {
  text-align: center;
  font-size: large;
  color: #4caf50;
}

@media only screen and (max-width: 820px) {

}

@media only screen and (max-width: 600px) {

}
</style>
