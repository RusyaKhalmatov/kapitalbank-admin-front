<template>
  <div class="main">
    <h1 class="headline">Отчет по зарегистрированным клиентам</h1>
    <date-component @date="getDate"></date-component>
    <div class="button-box">
      <v-btn v-if="typesData.length!=0" dark color="primary" class="get-btn" @click="load" :loading="loader">Получить
      </v-btn>
      <v-progress-circular style="height:30px; width: 30px;"
                           v-else
                           class="center ml-2"
                           indeterminate
                           color="amber"
      ></v-progress-circular>
      <template v-if="isTmp">
        <v-progress-circular style="height:30px; width: 30px;"
                             v-if="!isShow&&isClick&&isnotAllPeriod"
                             class="center ml-2"
                             indeterminate
                             color="amber"
        ></v-progress-circular>
      </template>
      <v-btn v-if="typesData.length!=0" class="mt-3 excel-btn" :loading="loader" @click="getExcel">Скачать Excel</v-btn>
      <download-excel
        v-show="false"
        id="excel"
        name="registeredUsers.xls"
        :fields="operationExport"
        stringify-long-num
        :data="excelData">
        <v-btn icon dark color="secondary">
          <v-icon>mdi-file-excel</v-icon>
        </v-btn>
      </download-excel>
    </div>
    <template v-if="isShow">
      <div class="mb-3" style="display: flex; align-items:center">
        <h3 class="mb-0">Количество зарегистрированных клиентов</h3>
        <v-btn depressed small @click="isChartShow=!isChartShow">{{ chartBtnShow }}</v-btn>
      </div>
      <div v-if="isChartShow" style="width:100%">
        <!-- <line-chart :chartdata="chartdata" :options="chartOptions"/> -->
        <line-chart :chartdata="newchartdata" :options="chartOptions"/>

      </div>
    </template>
    <span v-if="content.length!=0" class="amount-box justify-center">
            <span class="amount-box-child">
                <p class="amount-box-child-text">Общее количество: </p> 
                <h2 class="mb-0">{{ amountData.totalAmount | number-format }}</h2>
            </span>
        </span>
    <span v-if="amountData.length!=0" class="amount-box justify-center">
            <span class="amount-box-child" v-for="(item, index) in amountData.amountByUserType" :key="index">
                <p v-if="item.value==='CLIENT'" class="amount-box-child-text">Клиент: </p> 
                <p v-else-if="item.value==='NON_CLIENT'" class="amount-box-child-text">Не клиент: </p> 
                <p v-else class="amount-box-child-text">{{ item.value }}</p>
                <h2 class="mb-0">{{ item.amount | number-format }}</h2>
            </span>
        </span>
    <span class="amount-box justify-center">
            <span class="mr-2 amount-box-child-text" v-for="(item, index) in amountData.amountByUserState"
                  :key="'state-'+index">
                <p class="mb-0" v-if="item.value==='ACTIVE'">Активный: <strong>{{ item.amount }}</strong></p>
                <p class="mb-0" v-else-if="item.value==='DELETED'">Удаленный: <strong>{{ item.amount }}</strong></p>
                <p class="mb-0" v-else>{{ item.value }}: <strong>{{ item.amount }}</strong></p>
            </span>
        </span>

    <!-- {{amountData}} -->
    <div style="display: flex; justify-content: center">
            <span class="platform-box">
                <v-btn flat :class="['platform-btn']" v-for="(item,index) in amountData.amountByPlatform" :key="index">
                    <img class="platform-logo" v-if="item.value==='Android'" src="@/assets/android_icon.png" alt="">
                    <img class="platform-logo" v-if="item.value==='iOs'" src="@/assets/apple_icon.png" alt="">
                    <img class="platform-logo" v-if="item.value==='Web'" src="@/assets/web_icon.png" alt="">
                    <img class="platform-logo" v-if="item.value==='Ussd'" src="@/assets/ussd_icon.png" alt="">
                    <img class="platform-logo" v-if="item.value===null" src="@/assets/before_icon.png" alt="">
                    <p v-if="item.value!=null">{{ item.value }}: {{ item.amount | number-format }}</p>
                    <p v-else>До: {{ item.amount | number-format }}</p>

                </v-btn>
            </span>
    </div>

    <template v-if="isClick">
            <span class="search-box">
                <span class="search-input">
                    <v-text-field @keyup.enter="load" v-model="search" label="Поиск"></v-text-field>
                </span>
                <v-btn @click="load" class="search-btn" depressed>Поиск</v-btn>
                <span style="display:flex">
                    <v-checkbox class="mx-3" v-model="types" v-for="(item,index) in typesData" :key="index"
                                :label="item.value" :value="item.key"></v-checkbox>
                </span>
            </span>
      <v-data-table
        no-data-text="Нет данных"
        :headers="headers"
        :items="content"
        :loading="loader"
        :pagination.sync="pagination"
        item-key="id"
        hide-actions
      >
        <template slot="items" slot-scope="props">
          <tr>
            <td>{{ props.item.fullName }}</td>
            <td>{{ props.item.phone.split(":")[0] }}
              {{ phoneFormat(props.item.phone.split(":")[1]) | timestamp-to-date }}
            </td>
            <td v-if="props.item.customerId">
              <template v-if="props.item.customerId.split(':')[0]!='null'">
                <p class="mb-0" v-if="props.item.customerId!=''">{{ props.item.customerId }}</p>
                <p class="mb-0" v-else>Не клиент</p>
              </template>
            </td>
            <td v-else>Не клиент</td>
            <td>{{ props.item.userState }}</td>
            <td>{{ props.item.userType }}</td>
            <td>{{ props.item.activeDate | timestamp-to-date }}</td>
            <td>{{ props.item.registeredDate | timestamp-to-date }}</td>
            <td>{{ props.item.deletedDate | timestamp-to-date }}</td>
            <td>{{ props.item.platform }}</td>
            <td>{{ props.item.version }}</td>
            <td>
              <v-btn @click="openDevicesBox(props.item.devices)" depressed small>показать</v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </template>
    <v-pagination
      v-if="content.length"
      :disabled="loader"
      class="center"
      v-model="page"
      :length="totalPages"
      :total-visible="10"
    ></v-pagination>
    <v-dialog v-model="dialog" persistent max-width="950">
      <v-card>
        <v-card-title class="headline">Устройства</v-card-title>
        <v-card-text>
          <v-data-table :pagination.sync="pagination" :items="dialogData" :headers="dialogHeaders">
            <template slot="items" slot-scope="props">
              <tr>
                <td>{{ props.item.name }}</td>
                <td>{{ props.item.type }}</td>
                <td>{{ props.item.version }}</td>
                <td>{{ props.item.ipAddress }}</td>
                <td>{{ props.item.deviceId }}</td>
                <td>{{ props.item.createdDate | timestamp-to-date }}</td>
                <td>{{ props.item.lastUse | timestamp-to-date }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn depressed text @click="dialog = false">Закрыть</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import DateComponent from '@/components/date/DateComponent'
import lineChart from '@/components/chart/LineChart'

export default {
  name: 'ReportRegisteredUsers',
  components: {
    DateComponent, lineChart
  },
  data() {
    return {
      loader: false,
      excelData: [],
      page: 1,
      pagination: {
        rowsPerPage: 10
      },
      data: {
        dateFrom: '',
        dateTo: '',
        types: []
      },
      date: {},
      headers: [
        {text: "Ф.И.О.", value: "fullName", sortable: false},
        {text: "Номер телефона", value: "phone", sortable: false},
        {text: "ID клиента", value: "customerId", sortable: false},
        {text: "Статус", value: "userState", sortable: false},
        {text: "Тип", value: "userType", sortable: false},
        {text: "Последнее использование", value: "activeDate", sortable: false},
        {text: "Дата регистрации", value: "registeredDate", sortable: false},
        {text: "Дата удаления", value: "deletedDate", sortable: false},
        {text: "Платформа", value: "platform", sortable: false},
        {text: "Версия приложения", value: "version", sortable: false},
        {text: "Устройства", value: "devices", sortable: false}

      ],
      dialogHeaders: [
        {text: "Название", value: "name"},
        {text: "Тип устройства", value: "type"},
        {text: "Версия", value: "version"},
        {text: "IP адрес", value: "ipAddress"},
        {text: "Device ID", value: "deviceId"},
        {text: "Дата создания", value: "createdDate"},
        {text: "Последнее использование", value: "lastUse"},
      ],
      totalPages: '',
      search: '',
      content: [],
      totalElements: '',
      isClick: false,
      graphicData: [],
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false
      },
      chartdata: {
        labels: [],
        datasets: [
          {
            label: 'Количество зарегистрированных клиентов',
            backgroundColor: '#FFB446',
            data: []
          }
        ]
      },
      newchartdata: {
        labels: [],
        datasets: [
          {
            label: 'Всего',
            backgroundColor: '#FFB446',
            borderColor: '#FFB446',
            fill: false,
            data: []
          },
          {
            label: 'Андроид',
            backgroundColor: '#93bf1d',
            borderColor: '#93bf1d',
            fill: false,
            data: []
          },
          {
            label: 'IOS',
            backgroundColor: '#989898',
            borderColor: '#989898',
            fill: false,
            data: []
          },
          {
            label: 'WEB',
            backgroundColor: '#ec631b',
            borderColor: '#ec631b',
            fill: false,
            data: []
          },
          {
            label: 'USSD',
            backgroundColor: '#5593b7',
            borderColor: '#5593b7',
            fill: false,
            data: []
          },
          {
            label: 'До',
            backgroundColor: '#585858',
            borderColor: '#585858',
            fill: false,
            data: []
          }
        ]
      },
      isShow: false,
      isChartShow: true,
      isnotAllPeriod: true,
      typesData: [],
      types: [],
      dialog: false,
      dialogData: [],
      isTmp: true,
      amountData: {},

    }
  },
  computed: {
    operationExport() {
      let self = this,
        result = {};
      for (let i = 0; i < self.headers.length; i++) {
        let currentHeader = self.headers[i];
        result[currentHeader.text] = currentHeader.value;
      }
      result['Дата регистрации'] = {
        field: "registeredDate",
        callback: value => {
          let date = new Date(parseInt(value));
          if (value)
            return date.toLocaleString();
          else
            return '';
        }
      };
      result['Последнее использование'] = {
        field: "activeDate",
        callback: value => {
          let date = new Date(parseInt(value));
          if (value)
            return date.toLocaleString();
          else
            return '';
        }
      };
      result['Номер телефона'] = {
        field: "phone",
        callback: value => {
          if (value.split(':').length > 1) {
            return value.split(':')[0] + ' - ' + new Date(parseInt(value.split(':')[1])).toLocaleString();
          } else
            return value;
        }
      };
      result['Дата удаления'] = {
        field: "deletedDate",
        callback: value => {
          let date = new Date(parseInt(value));
          if (value)
            return date.toLocaleString();
          else
            return ''
        }
      };
      result['Устройства'] = {
        field: "devices",
        callback: value => {
          let str = JSON.parse(value)
          let result = '';
          str.forEach((x, i) => {
            result += str[i].name + ' - ' + str[i].type + ' - ' + str[i].version + ' - ' + str[i].ipAddress + ' - ' + str[i].deviceId + ' - д.р:' + new Date(parseInt(str[i].createdDate)).toLocaleString() + ' - п.и:' + new Date(parseInt(str[i].lastUse)).toLocaleString() + '; '
          })
          return result;
        }
      };

      return result;
    },
    chartBtnShow() {
      return this.isChartShow ? 'Скрыть' : 'Показать'
    },
  },
  watch: {
    page(val) {
      this.getList(val);
    },
    search(val) {
      if (!val) {
        this.load();
      }
    },
    types(val) {
      this.data.types = val;
      if (this.isClick)
        this.load()

    },
    dialog(val) {
      if (!val) {
        this.dialogData = [];
      }
    }
  },
  methods: {
    openDevicesBox(item) {
      this.dialogData = item
      this.dialog = true;
    },
    diffDates(date1, date2) {
      // return Math.abs((date1-date2)/(60*60*24*1000))
      return Math.ceil(Math.abs(date2 - date1) / (1000 * 3600 * 24));
    },
    // getChartsDataByDate(){
    //     this.data.dateFrom = this.date.fromDate;
    //     this.data.dateTo = this.date.toDate;
    //     if(this.date.fromDate==="")
    //         delete this.data.dateFrom
    //     if(this.date.toDate==="")
    //         delete this.data.dateTo
    //     if(this.search)
    //         this.data.search = this.search;
    //     else if(this.data.search)
    //         delete this.data.search

    //     this.$http.post(this.$store.getters.newApiUrl + `/report/a/v3/excel`, this.data)
    //         .then(response => {
    //             this.loader = false;
    //             console.log(response.data)
    //             this.excelData = response.data.data.users;
    //             if(this.excelData.length!=0){
    //                 let elem = document.getElementById('excel');
    //                 setTimeout(()=>{
    //                     elem.click();
    //                 }, 500)

    //             }
    //         }, this.handleError);

    // },

    getCharts() {
      this.isShow = false;
      this.data.dateFrom = this.date.fromDate;
      this.data.dateTo = this.date.toDate;
      if (this.date.fromDate === "")
        delete this.data.dateFrom
      if (this.date.toDate === "")
        delete this.data.dateTo
      if (this.search)
        this.data.search = this.search;
      else if (this.data.search)
        delete this.data.search
      this.newchartdata.labels = [];
      this.newchartdata.datasets[0].data = []
      this.newchartdata.datasets[1].data = []
      this.newchartdata.datasets[2].data = []
      this.newchartdata.datasets[3].data = []
      this.newchartdata.datasets[4].data = []
      this.newchartdata.datasets[5].data = []
      this.$http.post(this.$store.getters.newApiUrl2 + `/report/registeredUsers/v3/date`, this.data)
        .then(response => {
          // this.isShow = true
          console.log(response.data.data)
          this.isShow = false
          let promise = new Promise((resolve) => {
            response.data.data.forEach(x => {
              this.newchartdata.labels.push(x.odate);
              this.newchartdata.datasets[0].data.push(x.total);
              this.newchartdata.datasets[1].data.push(x.android);
              this.newchartdata.datasets[2].data.push(x.ios);
              this.newchartdata.datasets[3].data.push(x.web);
              this.newchartdata.datasets[4].data.push(x.ussd);
              this.newchartdata.datasets[5].data.push(x.before);
            })
            resolve('success')
          })
          promise.then(() => {
            // setTimeout(()=>{
            this.isShow = true;
            console.log(this.isShow)
            // },2000)
            this.isTmp = true;
            console.log(this.newchartdata)

          })

        })
    },
    getChartsData() {
      this.isShow = false;
      this.data.dateFrom = this.date.fromDate;
      this.data.dateTo = this.date.toDate;
      if (this.date.fromDate === "")
        delete this.data.dateFrom
      if (this.date.toDate === "")
        delete this.data.dateTo
      if (this.search)
        this.data.search = this.search;
      else if (this.data.search)
        delete this.data.search
      if (this.date.fromDate != "") {
        this.isnotAllPeriod = true;
        this.$http.post(this.$store.getters.newApiUrl2 + `/report/registeredUsers/v3/excel`, this.data)
          .then(response => {
            this.graphicData = response.data.data.users;
            // console.log('FF: ', this.diffDates(new Date(this.dateStart.split('+')[0]), new Date(this.dateEnd.split('+')[0])))
            // console.log(new Date(this.dateStart.split('+')[0]), ' - ', new Date(this.dateEnd.split('+')[0]))
            let diffDate = this.diffDates(new Date(this.data.dateFrom), new Date(this.data.dateTo))
            if (diffDate === 1) {
              let date = new Date()
              let dayInMonth = 23;
              // console.log(dayInMonth)
              // console.log('start')
              let selectedDay;
              let array = [];
              let arrayDate = [];
              let i;

              for (i = 0; i <= dayInMonth; i++) {
                // console.log(i, ' - ', dayInMonth)
                let curDate = new Date(this.data.dateFrom);
                selectedDay = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), i, 0, 0).getTime();
                let endDay = new Date(date.getFullYear(), curDate.getMonth(), curDate.getDate(), i, 59, 59).getTime();
                arrayDate.push(new Date(selectedDay).toLocaleDateString() + ' (' + new Date(selectedDay).toLocaleTimeString() + ' - ' + new Date(endDay).toLocaleTimeString() + ')')
                array.push(this.graphicData.filter(x => (selectedDay <= parseInt(x.registeredDate)) && (endDay >= parseInt(x.registeredDate))).length)
                // console.log('result: ', array)
              }
              this.chartdata.labels = arrayDate;
              this.chartdata.datasets[0].data = array;
              this.isShow = true;
              this.isTmp = true;
              // console.log(array)
              // console.log(arrayDate);
            } else if (diffDate <= 30 || diffDate <= 31) {
              let date = new Date()
              let dayInMonth = 33 - new Date(date.getFullYear(), date.getMonth(), 33).getDate();
              // console.log(dayInMonth)
              // console.log('start')
              let selectedDay;
              let array = [];
              let arrayDate = [];
              let i;

              for (i = 1; i <= dayInMonth; i++) {
                // console.log(i, ' - ', dayInMonth)
                let curDate = new Date(this.data.dateFrom);
                let endCurDate = new Date(this.data.dateTo);
                selectedDay = new Date(curDate.getFullYear(), curDate.getMonth(), i).getTime();
                let endDay = new Date(endCurDate.getFullYear(), endCurDate.getMonth(), i, 23, 59, 59).getTime();
                arrayDate.push(new Date(selectedDay).toLocaleDateString())
                array.push(this.graphicData.filter(x => (selectedDay <= parseInt(x.registeredDate)) && (endDay >= parseInt(x.registeredDate))).length)
                // console.log('result: ', array)
              }
              this.chartdata.labels = arrayDate;
              this.chartdata.datasets[0].data = array;
              this.isShow = true;
              this.isTmp = true;
              // console.log(array)
              // console.log(arrayDate);
            } else {
              this.isShow = false
              this.isTmp = false;
            }
            // console.log(this.chartdata.labels)
            // console.log(this.chartdata.datasets[0].data )

          }, this.handleError);
      } else {
        this.isnotAllPeriod = false;

      }
    },
    phoneFormat(phone) {
      if (phone === '' || phone === null) {
        return '';
      }
      return phone;
    },
    getDate(val) {
      this.date = val;
      this.isClick = false;
      this.content = [];
      this.totalPages = '';
      this.amountData = {};
      this.isShow = false;
      // this.operationAmount = {}
    },
    loadAmount() {
      this.$http.post(this.$store.getters.newApiUrl2 + `/report/registeredUsers/v3/amount`, this.data)
        .then(response => {
          this.amountData = response.data.data;
        }, this.handleError);
    },
    getList(page) {
      this.loader = true;
      this.$http.post(this.$store.getters.newApiUrl2 + `/report/registeredUsers/v3?page=${page - 1}&size=10`, this.data)
        .then(response => {
          this.loader = false;
          // console.log(response.data.users.content)
          this.content = response.data.users.content;
          this.content.forEach(x => {
            x.devices = JSON.parse(x.devices)
          })
          this.totalPages = response.data.users.totalPages;
          this.totalElements = response.data.users.totalElements;

        }, this.handleError);
    },
    load() {
      this.isClick = true;
      this.data.dateFrom = this.date.fromDate;
      this.data.dateTo = this.date.toDate;
      if (this.search)
        this.data.search = this.search;
      else if (this.data.search)
        delete this.data.search

      // this.data.status = this.status;
      // this.data.operationType = this.operationType;
      if (this.date.fromDate === "")
        delete this.data.dateFrom
      if (this.date.toDate === "")
        delete this.data.dateTo
      // this.data.operationType = this.operation.operationType;
      this.loadAmount();
      // this.getChartsData();
      this.getCharts();
      if (this.page === 1) {
        this.getList(1);
      } else {
        this.page = 1
      }

    },
    getExcel() {
      this.excelData = [];
      this.data.dateFrom = this.date.fromDate;
      this.data.dateTo = this.date.toDate;
      if (this.date.fromDate === "")
        delete this.data.dateFrom
      if (this.date.toDate === "")
        delete this.data.dateTo
      if (this.search)
        this.data.search = this.search;
      else if (this.data.search)
        delete this.data.search
      this.loader = true
      this.$http.post(this.$store.getters.newApiUrl2 + `/report/registeredUsers/v3/excel`, this.data)
        .then(response => {
          this.loader = false;
          console.log(response.data)
          this.excelData = response.data.data.users;
          if (this.excelData.length != 0) {
            let elem = document.getElementById('excel');
            setTimeout(() => {
              elem.click();
            }, 500)

          }
        }, this.handleError);
    },
    getTypes() {
      this.$http.get(this.$store.getters.newApiUrl2 + `/report/registeredUsers/v2/userType`)
        .then(response => {
          // console.log(response.data.data);
          this.typesData = response.data.data;
          this.typesData.forEach(x => {
            this.types.push(x.key)
          })
        }, this.handleError)
    }

  },
  mounted() {
    this.getTypes();
  }
}
</script>

<style scoped>
p {
  margin: 0;
}

.platform-logo {
  width: 30px;
  height: 30px;
  margin: 0 5px;
}

.main {
  width: 100%;
}

.headline {
  text-align: center;
}

.button-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-items: center;
  margin: 10px;
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

.amount-box-child-text {
  margin: 0 10px;
  font-size: 18px;
}

.amount-box-child {
  display: flex;
  align-items: center;
}

.amount-box {
  display: flex;
  margin: 20px 0;
}

.search-box {
  display: flex;
  align-items: center;
}

.search-input {
  width: 500px;
}

.search-btn {

}
</style>
