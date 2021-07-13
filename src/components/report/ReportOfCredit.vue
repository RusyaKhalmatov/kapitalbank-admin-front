<template>
  <div class="main">
    <h1 class="headline">По кредитам</h1>
    <date-component @date="getDate"></date-component>
    <v-select
      label="Операции"
      :items="operationTypes"
      v-model="operationType"
      placeholder="Выберите опериции"
      item-text="value"
      item-value="key"
      attach outline
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
    <div class="d-flex flex-wrap checkbox">
      <v-checkbox v-for="(item,index) in statusData" :key="index" v-model="status" :label="item.value"
                  :value="item.key"></v-checkbox>
    </div>
    <div class="button-box">
      <v-btn dark color="primary" class="get-btn" @click="load" :loading="loader">Получить</v-btn>
      <v-btn class="mt-3 excel-btn" :loading="loader" @click="getExcel">Скачать Excel</v-btn>
      <download-excel
        v-show="false"
        id="excel"
        name="credit.xls"
        :fields="operationExport"
        :data="excelData">
        <v-btn icon dark color="secondary">
          <v-icon>mdi-file-excel</v-icon>
        </v-btn>
      </download-excel>
    </div>
    <div class="amount-box" v-if="operationAmount.our">
            <span class="amount-box-child">
                <h2>Общая сумма c карт нашего банка</h2>
                <div v-for="(item, index) in operationAmount.our" :key="index">
                    <span class="column">
                        <p class="amount-text">{{ item.cardType }}:</p>
                        <p class="amount-value">{{ item.amount / 100|number-format }} {{ item.currency }}</p>
                    </span>
                    <span class="column">
                        <p class="amount-text">Количество:</p>
                        <p class="amount-value">{{ item.operations | number-format }}</p>
                    </span>
                    <v-divider v-if="index===0" class="my-2"></v-divider>
                </div>
                <v-divider class="my-2"></v-divider>
                <span class="column">
                    <p class="amount-value">Итого:</p>
                    <p
                      class="amount-value">{{
                        (operationAmount.our[0].amount + operationAmount.our[1].amount) / 100 | number-format
                      }} {{ operationAmount.our[0].currency }}</p>
                </span>
            </span>
      <span class="amount-box-child">
                <h2>Общая сумма с карт других банков</h2>
                <div v-for="(item, index) in operationAmount.other" :key="index">
                    <span class="column">
                        <p class="amount-text">{{ item.cardType }}:</p>
                        <p class="amount-value">{{ item.amount / 100|number-format }} {{ item.currency }}</p>
                    </span>
                    <span class="column">
                        <p class="amount-text">Количество:</p>
                        <p class="amount-value">{{ item.operations | number-format }}</p>
                    </span>
                    <v-divider v-if="index===0" class="my-2"></v-divider>
                </div>
                <v-divider class="my-2"></v-divider>
                <span class="column">
                    <p class="amount-value">Итого:</p>
                    <p
                      class="amount-value">{{
                        (operationAmount.other[0].amount + operationAmount.other[1].amount) / 100 | number-format
                      }} {{ operationAmount.other[0].currency }}</p>
                </span>

            </span>
      <span class="amount-box-child">
                <h2>Общая сумма с кошельков</h2>
                <div v-for="(item, index) in operationAmount.wallet" :key="index">
                    <span class="column">
                        <p class="amount-text">{{ item.cardType }}:</p>
                        <p class="amount-value">{{ item.amount / 100|number-format }} {{ item.currency }}</p>
                    </span>
                    <span class="column">
                        <p class="amount-text">Количество:</p>
                        <p class="amount-value">{{ item.operations | number-format }}</p>
                    </span>
                </div>
                <v-divider class="my-2"></v-divider>
                <span class="column">
                    <p class="amount-value">Итого:</p>
                    <p
                      class="amount-value">{{
                        (operationAmount.wallet[0].amount) / 100 | number-format
                      }} {{ operationAmount.wallet[0].currency }}</p>
                </span>
            </span>
      <span class="amount-box-child">
                <h2>Общая сумма со счетов</h2>
                <div v-for="(item, index) in operationAmount.account" :key="index">
                    <span class="column">
                        <p class="amount-text">{{ item.cardType }}:</p>
                        <p class="amount-value">{{ item.amount / 100|number-format }} {{ item.currency }}</p>
                    </span>
                    <span class="column">
                        <p class="amount-text">Количество:</p>
                        <p class="amount-value">{{ item.operations | number-format }}</p>
                    </span>
                </div>
                <v-divider class="my-2"></v-divider>
                <span class="column">
                    <p class="amount-value">Итого:</p>
                    <p
                      class="amount-value">{{
                        (operationAmount.account[0].amount) / 100 | number-format
                      }} {{ operationAmount.account[0].currency }}</p>
                </span>
            </span>
      <span class="amount-box-child">
                <h2>Общая сумма</h2>
                    <span class="column">
                        <p class="mx-0 amount-value">Итого:</p>
                        <p class="amount-value">{{ totalAmount.amount / 100|number-format }} UZS</p>
                    </span>  
                    <span class="column">
                        <p class="amount-text">Количество:</p>
                        <p class="amount-value">{{ totalAmount.operations }}</p>
                    </span>                
            </span>

    </div>
    <span style="display:flex; align-items: center" v-if="isClick">
            <span style="width:500px">
                <v-text-field
                  v-model="search"
                  prepend-icon="mdi-magnify"
                  @keyup.enter="load"
                  label="Поиск">
                </v-text-field>
            </span>
            <v-btn style="width: 100px" :loading="loader" @click="load" depressed>Найти</v-btn>
        </span>
    <v-data-table
      :headers="headers"
      :items="content"
      v-if="content.length!=0"
      :loading="loader"
      :pagination.sync="pagination"
      item-key="id"
      hide-actions
    >
      <template slot="items" slot-scope="props">
        <tr>
          <td>{{ props.item.id }}</td>
          <td>{{ props.item.login.split(":")[0] }}
            {{ phoneFormat(props.item.login.split(":")[1]) | timestamp-to-date }}
          </td>
          <td>{{ props.item.sender }}</td>
          <td>{{ props.item.receiver }}</td>
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.absId }}</td>
          <td>{{ props.item.operationType }}</td>
          <td>{{ props.item.amount / 100 | number-format }}</td>
          <td>{{ props.item.createdDate | timestamp-to-date }}</td>
          <td>{{ props.item.status }}</td>
        </tr>
      </template>
    </v-data-table>
    <v-pagination
      v-if="content.length"
      :disabled="loader"
      class="center"
      v-model="page"
      :length="totalPages"
      :total-visible="10"
    ></v-pagination>
  </div>
</template>
<script>
import DateComponent from '@/components/date/DateComponent'

export default {
  name: 'ReportOfLoan',
  components: {
    DateComponent
  },
  data() {
    return {
      date: {},
      content: [],
      totalPages: '',
      amountData: '',
      operationType: [],
      operationTypes: [],
      filtersTypeTemp: [],
      selectedFilters: [],
      filterToggle: [],
      statusData: [],
      status: [],
      data: {
        status: [],
        operationType: [],
        dateFrom: '',
        dateTo: '',
      },
      headers: [
        {text: "ID", value: "id", sortable: false},
        {text: "Login", value: "login", sortable: false},
        {text: "Отправитель", value: "sender", sortable: false},
        {text: "Получатель", value: "receiver", sortable: false},
        {text: "Имя", value: "receiverName", sortable: false},
        {text: "ABS ID", value: "absId", sortable: false},
        {text: "Тип", value: "operationType", sortable: false},
        {text: "Сумма", value: "amount", sortable: false},
        {text: "Дата и время", value: "createdDate", sortable: false},
        {text: "Статус", value: "status", sortable: false}
      ],
      excelData: [],
      page: '',
      pagination: {
        rowsPerPage: 10
      },
      show: false,
      operationAmount: {},
      isClick: false,
      search: '',
    }
  },
  computed: {
    totalAmount() {
      return {
        amount: this.operationAmount.our[0].amount + this.operationAmount.our[1].amount + this.operationAmount.other[0].amount + this.operationAmount.other[1].amount + this.operationAmount.wallet[0].amount + this.operationAmount.account[0].amount,
        operations: this.operationAmount.our[0].operations + this.operationAmount.our[1].operations + this.operationAmount.other[0].operations + this.operationAmount.other[1].operations + this.operationAmount.wallet[0].operations + this.operationAmount.account[0].operations
      }
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
      for (let i = 0; i < self.headers.length; i++) {
        let currentHeader = self.headers[i];
        result[currentHeader.text] = currentHeader.value;
      }

      result['Сумма'] = {
        field: "amount",
        callback: value => {
          return (value / 100).toString().replace('.', ',');
        }
      };
      result['Дата и время'] = {
        field: "createdDate",
        callback: value => {
          let date = new Date(parseInt(value)).toLocaleString();
          return date;
        }
      };
      return result;
    }
  },
  watch: {
    page(val) {
      this.getList(val);
    },
    status(val) {
      this.content = [];
      this.totalPages = '';
      this.show = false;
      this.operationAmount = {};
      this.isClick = false;

    },
    operationType(val) {
      this.content = [];
      this.totalPages = '';
      this.show = false;
      this.operationAmount = {}
      this.isClick = false;
    },
    search(val) {
      if (val.length === 0) {
        this.load();
      }
    }
  },
  methods: {
    phoneFormat(phone) {
      if (phone === '' || phone === null) {
        return '';
      }
      return phone;
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
    selectFilters(template) {
      let self = this, isEnabled = false;
      self.$nextTick(() => {
        self.operationTypes.forEach(item => self.filtersTypeTemp.push(item.value));
        isEnabled = self.filterToggle.indexOf(self.filtersTypeTemp.indexOf(template) + 1) !== -1;
        if (template === "all") {
          if (self.filterToggle.indexOf(0) !== -1) {
            self.operationTypes.forEach(item => self.selectedFilters.push(item.value));
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
    getExcel() {
      this.data.dateFrom = this.date.fromDate;
      this.data.dateTo = this.date.toDate;
      this.data.search = this.search;
      this.data.status = this.status;
      this.data.operationType = this.operationType;
      if (this.date.fromDate === "")
        delete this.data.dateFrom
      if (this.date.toDate === "")
        delete this.data.dateTo
      this.loader = true;
      this.$http.post(this.$store.getters.newApiUrl2 + '/report/loan/v2/excel', this.data)
        .then(response => {
          this.loader = false;
          this.excelData = response.data.data;
          if (this.excelData.length != 0) {
            let elem = document.getElementById('excel');
            setTimeout(() => {
              elem.click();
            }, 500)

          }
        }, this.handleError);
    },
    getDate(val) {
      this.date = val;
      this.content = [];
      this.isClick = false;
      this.totalPages = '';
      this.amountData = [];
      this.operationAmount = {};
      // console.log(this.date)
    },
    load() {
      this.isClick = true;
      this.data.dateFrom = this.date.fromDate;
      this.data.dateTo = this.date.toDate;
      this.data.search = this.search;
      this.data.status = this.status;
      this.data.operationType = this.operationType;
      if (this.date.fromDate === "")
        delete this.data.dateFrom
      if (this.date.toDate === "")
        delete this.data.dateTo
      // this.data.operationType = this.operation.operationType;
      this.loadAmount();
      if (this.page === 1) {
        this.getList(1);
      } else {
        this.page = 1
      }
    },
    loadAmount() {
      this.$http.post(this.$store.getters.newApiUrl2 + '/report/loan/v2/amount', this.data)
        .then(response => {
          this.operationAmount = response.data.data;
          console.log(response.data.data);
          this.show = true;
        }, this.handleError);
    },
    getList(page) {
      this.loader = true;
      this.$http.post(this.$store.getters.newApiUrl2 + `/report/loan/v2?page=${page - 1}&size=10`, this.data)
        .then(response => {
          this.loader = false;
          this.content = response.data.data.content;
          this.totalPages = response.data.data.totalPages;
        }, this.handleError);
    },
    getOperationsTypes() {
      this.$http.get(this.$store.getters.newApiUrl2 + '/report/loan/v2/type')
        .then(response => {
          this.operationTypes = response.data.data;
          // this.operationType = this.operationTypes
          response.data.data.forEach(x => {
            this.operationType.push(x.key);
          })
          this.selectFilters('all')
        }, this.handleError);
    },
    getStatus() {
      this.$http.get(this.$store.getters.newApiUrl2 + `/report/loan/v2/status`)
        .then(response => {
          this.statusData = response.data.data;
          response.data.data.forEach(x => {
            this.status.push(x.key);
          })
        }, this.handleError)

    },

  },
  mounted() {
    this.getOperationsTypes();
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

.checkbox {
  background: #fff;
  padding: 0 10px;
  border-radius: 15px;
  margin: 15px 0;
  flex-wrap: wrap;
}

.button-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  align-items: center;
}

.get-btn {
  border-radius: 20px;
}

.excel-btn {
  border-radius: 29px;
  background: #3d9c3d !important;
  color: #FFFF !important;
  margin: 20px 0;
}

.center {
  display: flex;
  justify-content: center;
  margin: 15px;
  flex-wrap: wrap;
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
  /* width: 100%; */
  flex-wrap: wrap;
  margin: 10px 0 25px 0;
  max-width: 925px;
  margin: auto
}

.amount-box-child {
  padding: 10px 20px;
  border: 1px solid silver;
  border-radius: 17px;
  margin: 10px 20px;
  min-width: 345px;
  width: 420px;
}

.column {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
