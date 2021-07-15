<template>
  <div class="statistics">
    <div class="filter">
            <span class="filter-child">
                <v-checkbox v-model="isBranch" label="Филиалы"></v-checkbox>
                <span v-if="isBranch">
                    <v-select :items="branchData" label="Филиал" item-text="name" item-value="branchId"
                              v-model="branchId"></v-select>
                </span>
            </span>
      <span class="filter-child">
                <v-checkbox v-model="isClient" label="Клиент/Не клиент"></v-checkbox>
                <v-radio-group style="margin:0; padding: 0" class="radio" v-model="clientRadio" v-if="isClient">
                    <v-radio
                      :key="0"
                      label="Клиент"
                      :value="true"
                    ></v-radio>
                    <v-radio
                      :key="1"
                      label="Не клиент"
                      :value="false"
                    ></v-radio>
                </v-radio-group>
            </span>
      <span class="filter-child">
                <v-checkbox v-model="isStatus" label="Статус"></v-checkbox>
                <v-select multiple v-if="isStatus" v-model="status" label="Статус" :items="statusData">
                </v-select>
            </span>
      <span class="filter-child">
                <v-checkbox v-model="isOwner" label="Оформляет на себя"></v-checkbox>
                <v-radio-group style="margin:0; padding: 0" class="radio" v-model="ownerRadio" v-if="isOwner">
                    <v-radio
                      :key="0"
                      label="Да"
                      :value="true"
                    ></v-radio>
                    <v-radio
                      :key="1"
                      label="Нет"
                      :value="false"
                    ></v-radio>
                </v-radio-group>
            </span>
      <span class="filter-child">
                <v-checkbox v-model="isDelivery" label="Доставка"></v-checkbox>
                <v-radio-group style="margin:0; padding: 0" class="radio" v-model="deliveryRadio" v-if="isDelivery">
                    <v-radio
                      :key="0"
                      label="Да"
                      :value="true"
                    ></v-radio>
                    <v-radio
                      :key="1"
                      label="Нет"
                      :value="false"
                    ></v-radio>
                </v-radio-group>
            </span>
      <span class="filter-child">
                <v-checkbox v-model="isCardProduct" label="Продукт"></v-checkbox>
                <v-select v-if="isCardProduct" :items="cardProductData" v-model="cardProductId" item-text="name"
                          item-value="id" label="Продукт"></v-select>
            </span>
      <v-btn class="search-btn" @click="getSummeryDetails(1)" depressed small>Поиск</v-btn>
      <v-btn class="search-btn" :loading="loader" @click="getExcelData" depressed small>Скачать Excel</v-btn>
      <download-excel
        v-show="false"
        id="excel"
        stringify-long-num
        name="details.xls"
        :fields="excelHeader"
        :data="excelData">
        <v-btn icon dark color="secondary">
          <v-icon>mdi-file-excel</v-icon>
        </v-btn>
      </download-excel>
    </div>
    <v-data-table
      :headers="headers"
      :items="summeryData"
      hide-actions
    >
      <template slot="items" slot-scope="props">
        <tr>
          <td>{{ props.item.status.message }} ({{ props.item.status.key }})</td>
          <td>{{ props.item.updateTime | timestamp-to-date }}</td>
          <td v-if="props.item.cardProduct">{{ props.item.cardProduct.name }}</td>
          <td v-else></td>
          <td v-if="props.item.id">{{ props.item.id }}</td>
          <td v-else></td>
          <td v-if="props.item.branch">{{ props.item.branch.name }}</td>
          <td v-else></td>
          <td>{{ props.item.user.phone }}</td>
          <td>{{ props.item.user.lastName }} {{ props.item.user.firstName }}</td>
          <td v-if="props.item.user.customerId">{{ props.item.user.customerId }}</td>
          <td v-else>Не клиент</td>
          <td>{{ props.item.owner | checkStatus }}</td>
          <td>{{ props.item.delivery | checkStatus }}</td>
          <td>{{ props.item.passportId }}</td>
        </tr>
      </template>
      <template slot="no-data">
        <vue-content-loading :width="300" :height="98">
          <rect x="0" y="3" rx="3" ry="10" width="8%" height="5"/>
          <rect x="30" y="3" rx="3" ry="10" width="10%" height="5"/>
          <rect x="67" y="3" rx="3" ry="10" width="5%" height="5"/>
          <rect x="90" y="3" rx="3" ry="10" width="13%" height="5"/>
          <rect x="135" y="3" rx="3" ry="10" width="12%" height="5"/>
          <rect x="180" y="3" rx="3" ry="10" width="8%" height="5"/>
          <rect x="215" y="3" rx="3" ry="10" width="7%" height="5"/>
          <rect x="245" y="3" rx="3" ry="10" width="7%" height="5"/>
          <rect x="275" y="3" rx="3" ry="10" width="7%" height="5"/>

          <rect x="0" y="12" rx="3" ry="10" width="8%" height="5"/>
          <rect x="30" y="12" rx="3" ry="10" width="10%" height="5"/>
          <rect x="67" y="12" rx="3" ry="10" width="5%" height="5"/>
          <rect x="90" y="12" rx="3" ry="10" width="13%" height="5"/>
          <rect x="135" y="12" rx="3" ry="10" width="12%" height="5"/>
          <rect x="180" y="12" rx="3" ry="10" width="8%" height="5"/>
          <rect x="215" y="12" rx="3" ry="10" width="7%" height="5"/>
          <rect x="245" y="12" rx="3" ry="10" width="7%" height="5"/>
          <rect x="275" y="12" rx="3" ry="10" width="7%" height="5"/>

          <rect x="0" y="22" rx="3" ry="10" width="8%" height="5"/>
          <rect x="30" y="22" rx="3" ry="10" width="10%" height="5"/>
          <rect x="67" y="22" rx="3" ry="10" width="5%" height="5"/>
          <rect x="90" y="22" rx="3" ry="10" width="13%" height="5"/>
          <rect x="135" y="22" rx="3" ry="10" width="12%" height="5"/>
          <rect x="180" y="22" rx="3" ry="10" width="8%" height="5"/>
          <rect x="215" y="22" rx="3" ry="10" width="7%" height="5"/>
          <rect x="245" y="22" rx="3" ry="10" width="7%" height="5"/>
          <rect x="275" y="22" rx="3" ry="10" width="7%" height="5"/>

          <rect x="0" y="32" rx="3" ry="10" width="8%" height="5"/>
          <rect x="30" y="32" rx="3" ry="10" width="10%" height="5"/>
          <rect x="67" y="32" rx="3" ry="10" width="5%" height="5"/>
          <rect x="90" y="32" rx="3" ry="10" width="13%" height="5"/>
          <rect x="135" y="32" rx="3" ry="10" width="12%" height="5"/>
          <rect x="180" y="32" rx="3" ry="10" width="8%" height="5"/>
          <rect x="215" y="32" rx="3" ry="10" width="7%" height="5"/>
          <rect x="245" y="32" rx="3" ry="10" width="7%" height="5"/>
          <rect x="275" y="32" rx="3" ry="10" width="7%" height="5"/>

          <rect x="0" y="42" rx="3" ry="10" width="8%" height="5"/>
          <rect x="30" y="42" rx="3" ry="10" width="10%" height="5"/>
          <rect x="67" y="42" rx="3" ry="10" width="5%" height="5"/>
          <rect x="90" y="42" rx="3" ry="10" width="13%" height="5"/>
          <rect x="135" y="42" rx="3" ry="10" width="12%" height="5"/>
          <rect x="180" y="42" rx="3" ry="10" width="8%" height="5"/>
          <rect x="215" y="42" rx="3" ry="10" width="7%" height="5"/>
          <rect x="245" y="42" rx="3" ry="10" width="7%" height="5"/>
          <rect x="275" y="42" rx="3" ry="10" width="7%" height="5"/>

          <rect x="0" y="52" rx="3" ry="10" width="8%" height="5"/>
          <rect x="30" y="52" rx="3" ry="10" width="10%" height="5"/>
          <rect x="67" y="52" rx="3" ry="10" width="5%" height="5"/>
          <rect x="90" y="52" rx="3" ry="10" width="13%" height="5"/>
          <rect x="135" y="52" rx="3" ry="10" width="12%" height="5"/>
          <rect x="180" y="52" rx="3" ry="10" width="8%" height="5"/>
          <rect x="215" y="52" rx="3" ry="10" width="7%" height="5"/>
          <rect x="245" y="52" rx="3" ry="10" width="7%" height="5"/>
          <rect x="275" y="52" rx="3" ry="10" width="7%" height="5"/>

          <rect x="0" y="62" rx="3" ry="10" width="8%" height="5"/>
          <rect x="30" y="62" rx="3" ry="10" width="10%" height="5"/>
          <rect x="67" y="62" rx="3" ry="10" width="5%" height="5"/>
          <rect x="90" y="62" rx="3" ry="10" width="13%" height="5"/>
          <rect x="135" y="62" rx="3" ry="10" width="12%" height="5"/>
          <rect x="180" y="62" rx="3" ry="10" width="8%" height="5"/>
          <rect x="215" y="62" rx="3" ry="10" width="7%" height="5"/>
          <rect x="245" y="62" rx="3" ry="10" width="7%" height="5"/>
          <rect x="275" y="62" rx="3" ry="10" width="7%" height="5"/>

          <rect x="0" y="72" rx="3" ry="10" width="8%" height="5"/>
          <rect x="30" y="72" rx="3" ry="10" width="10%" height="5"/>
          <rect x="67" y="72" rx="3" ry="10" width="5%" height="5"/>
          <rect x="90" y="72" rx="3" ry="10" width="13%" height="5"/>
          <rect x="135" y="72" rx="3" ry="10" width="12%" height="5"/>
          <rect x="180" y="72" rx="3" ry="10" width="8%" height="5"/>
          <rect x="215" y="72" rx="3" ry="10" width="7%" height="5"/>
          <rect x="245" y="72" rx="3" ry="10" width="7%" height="5"/>
          <rect x="275" y="72" rx="3" ry="10" width="7%" height="5"/>

          <rect x="0" y="82" rx="3" ry="10" width="8%" height="5"/>
          <rect x="30" y="82" rx="3" ry="10" width="10%" height="5"/>
          <rect x="67" y="82" rx="3" ry="10" width="5%" height="5"/>
          <rect x="90" y="82" rx="3" ry="10" width="13%" height="5"/>
          <rect x="135" y="82" rx="3" ry="10" width="12%" height="5"/>
          <rect x="180" y="82" rx="3" ry="10" width="8%" height="5"/>
          <rect x="215" y="82" rx="3" ry="10" width="7%" height="5"/>
          <rect x="245" y="82" rx="3" ry="10" width="7%" height="5"/>
          <rect x="275" y="82" rx="3" ry="10" width="7%" height="5"/>

          <rect x="0" y="92" rx="3" ry="10" width="8%" height="5"/>
          <rect x="30" y="92" rx="3" ry="10" width="10%" height="5"/>
          <rect x="67" y="92" rx="3" ry="10" width="5%" height="5"/>
          <rect x="90" y="92" rx="3" ry="10" width="13%" height="5"/>
          <rect x="135" y="92" rx="3" ry="10" width="12%" height="5"/>
          <rect x="180" y="92" rx="3" ry="10" width="8%" height="5"/>
          <rect x="215" y="92" rx="3" ry="10" width="7%" height="5"/>
          <rect x="245" y="92" rx="3" ry="10" width="7%" height="5"/>
          <rect x="275" y="92" rx="3" ry="10" width="7%" height="5"/>
        </vue-content-loading>
      </template>
    </v-data-table>

    <v-pagination
      v-if="totalPages"
      :disabled="loader"
      class="center"
      v-model="page"
      :length="totalPages"
      :total-visible="10"
    ></v-pagination>

  </div>
</template>
<script>
import {VclTable, VueContentLoading} from 'vue-content-loading';

export default {
  name: 'ReportBySummeryCard',
  props: {
    date: Object
  },
  components: {
    VclTable, VueContentLoading
  },
  filters: {
    checkStatus(val) {
      if (val) {
        return "Да"
      } else {
        return "Нет"
      }
    }
  },
  data() {
    return {
      summeryData: [],
      date1: '',
      date2: '',
      fromDate: '',
      toDate: '',
      branchData: [],
      branchId: '',
      headers: [
        {text: "Статус", value: "status.message", sortable: false},
        {text: "Дата", value: "updateTime", sortable: false},
        {text: "Продукт", value: "cardProduct.name", sortable: false},
        {text: "Номер заявки", value: "id", sortable: false},
        {text: "Филиал", value: "branch.name", sortable: false},
        {text: "Логин", value: "user.phone", sortable: false},
        {text: "ФИО", value: "user", sortable: false},
        {text: "ABS ID", value: "user.customerId", sortable: false},
        {text: "Оформляет на себя", value: "owner", sortable: false},
        {text: "Доставка", value: "delivery", sortable: false},
        {text: "№ паспорта", value: "passportId", sortable: false},
      ],
      totalPages: '',
      page: 1,
      isBranch: false,
      isClient: false,
      isOwner: false,
      isDelivery: false,
      loader: false,
      clientRadio: false,
      ownerRadio: true,
      deliveryRadio: true,
      branchData: [],
      branchId: '',
      excelPage: 2,
      excelData: [],
      isShow: false,
      excelTotalPages: '',
      // excelHeader: {
      //     "Статус": "status.message",
      //     "Дата": "updateTime",
      //     "Продукт": "cardProduct.name",
      //     "Номер заявки": "id",
      //     "Филиал": "branch.name",
      //     "ФИО": "user.fullName",
      //     "ABS ID": "user.customerId",
      //     "Оформляет на себя": "owner",
      //     "Доставка": "delivery",
      //     "№ паспорта": "passportId",
      // },
      cardProductId: '',
      isCardProduct: false,
      cardProductData: [],
      statusData: [],
      status: '',
      isStatus: false,
    }
  },
  computed: {
    excelHeader() {
      let self = this, result = {};
      for (let i = 0; i < self.headers.length; i++) {
        let currentHeader = self.headers[i];
        result[currentHeader.text] = currentHeader.value;
      }
      result['ФИО'] = {
        field: "user",
        callback: value => {
          return value.lastName + ' ' + value.firstName;
        }
      };
      result['Дата'] = {
        field: "updateTime",
        callback: value => {
          let date = new Date(parseInt(value));
          return date.toLocaleString();
        }
      };
      return result;
    }
  },
  watch: {
    toggle() {
      this.$nextTick(() => {
        if (this.likesAllFruit) {
          this.selectedFruits = []
        } else {
          this.statusData = this.fruits.slice()
        }
      })
    },
    date(val) {
      this.fromDate = val.fromDate;
      this.toDate = val.toDate;
      if (this.page === 1) {
        this.getSummeryDetails(1);
      } else {
        this.page = 1;
      }
    },
    page(newVal) {
      this.getSummeryDetails(newVal);
    },
    isBranch(val) {
      if (!val && !this.isClient && !this.isOwner && !this.isDelivery && !this.isStatus) {
        this.getSummeryDetails(1);
      }
    },
    isClient(val) {
      if (!val && !this.isBranch && !this.isOwner && !this.isDelivery && !this.isStatus) {
        this.getSummeryDetails(1);
      }
    },
    isOwner(val) {
      if (!val && !this.isBranch && !this.isClient && !this.isDelivery && !this.isStatus) {
        this.getSummeryDetails(1);
      }
    },
    isDelivery(val) {
      if (!val && !this.isBranch && !this.isOwner && !this.isClient && !this.isStatus) {
        this.getSummeryDetails(1);
      }
    },
    isStatus(val) {
      if (!val && !this.isBranch && !this.isOwner && !this.isClient && !this.isDelivery) {
        this.getSummeryDetails(1);
      }
    }
  },
  methods: {
    getStatus() {
      this.statusData = [];
      this.$http.get(this.$store.getters.newApiUrl2 + `/card-product-order/status`)
        .then(response => {
          // console.log(response.data.data);
          this.statusData = response.data.data;
        }, this.handleError);
    },
    isEmpty(obj) {
      for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
          return false;
        }
      }
      return true;
    },
    getExcelData(page) {
      let self = this;

      this.loader = true;
      var data = {
        "dateFrom": this.fromDate,
        "dateTo": this.toDate,
      };

      this.excelData = [];

      if (this.isBranch) {
        Object.assign(data, {branchId: this.branchId})
      }
      if (this.isClient) {
        Object.assign(data, {client: this.clientRadio})
      }
      if (this.isOwner) {
        Object.assign(data, {owner: this.ownerRadio})
      }
      if (this.isDelivery) {
        Object.assign(data, {delivery: this.deliveryRadio})
      }
      if (this.isCardProduct) {
        Object.assign(data, {cardProductId: this.cardProductId})
      }
      if (this.isStatus) {
        Object.assign(data, {status: this.status})
      }
      self.$http.post(self.$store.getters.newApiUrl2 + `/card-product-order/summery/excel`, data)
        .then((response) => {
          console.log(response.data.data);
          self.excelData = response.data.data
          this.loader = false;
          let elem = document.getElementById('excel');
          setTimeout(() => {
            elem.click();
          }, 500)
          // response.data.data.content.forEach(x=>{
          //     x.updateTime = self.$options.filters.timestampToDate(x.updateTime)
          //     Object.assign(x.user, {fullName: x.user.lastName+ ' '+ x.user.firstName})
          //     self.excelData.push(x);
          // })
          // console.log(self.excelData)
          // if(page===1)
          //     self.excelTotalPages = response.data.data.totalPages

          // if(self.excelPage<=self.excelTotalPages){
          //     self.getExcelData(self.excelPage);
          //     self.excelPage++;
          // }
          // else{
          //     self.isShow = true;
          // }

        }, self.handleError);
    },
    getSummeryDetails(page) {
      let self = this;
      this.summeryData = [];
      this.loader = true;
      if (page === 1) {
        this.page = 1;
      }
      var data = {
        "dateFrom": this.fromDate,
        "dateTo": this.toDate,
      };
      if (this.isBranch) {
        Object.assign(data, {branchId: this.branchId})
      }
      if (this.isClient) {
        Object.assign(data, {client: this.clientRadio})
      }
      if (this.isOwner) {
        Object.assign(data, {owner: this.ownerRadio})
      }
      if (this.isDelivery) {
        Object.assign(data, {delivery: this.deliveryRadio})
      }
      if (this.isCardProduct) {
        Object.assign(data, {cardProductId: this.cardProductId})
      }
      if (this.isStatus) {
        Object.assign(data, {status: this.status})
      }
      self.$http.post(self.$store.getters.newApiUrl2 + `/card-product-order/summery?page=${page - 1}&size=10`, data)
        .then((response) => {
          //console.log(response.data.data);

          self.summeryData = response.data.data.content;
          console.log(self.summeryData)
          self.loader = false;
          self.totalPages = response.data.data.totalPages;
          // if(page===1)
          //     self.getExcelData(1);

          // for (var i in response.data.data){
          // self.summeryData.push(response.data.data[i]);
          // }
          // console.log(self.summeryData)
        }, self.handleError);
    },
    getBranchList() {
      let self = this;
      self.$http.get(self.$store.getters.prodApiUrl + "/branch/list")
        .then((response) => {
          //console.log(response.data.data);
          self.branchData = response.data.data;
        }, self.handleError);
    },
    getCardProduct() {
      this.cardProductData = []
      this.$http.get(this.$store.getters.newApiUrl2 + `/card-product-order/card-product`)
        .then(response => {
          console.log(response.data.data);
          this.cardProductData = response.data.data;
        })
    }
  },
  mounted() {
    this.getBranchList();
    this.getCardProduct();
    this.getStatus();
    this.fromDate = this.date.fromDate;
    this.toDate = this.date.toDate;
    this.getSummeryDetails(1);
  }
}
</script>
<style scoped>
.top {
  display: flex;
  align-items: center;
}

.select {
  width: 300px;
  margin: 0px 10px;
}

.statistics {
  padding: 15px;
  background: #FFFF;
  margin: 15px 10px;
  border-radius: 10px;
}

.center {
  margin: 10px;
  display: flex;
  justify-content: center;
}

.filter {
  display: flex;
}

.filter-child {
  margin: 0 5px;
}

.search-btn {
  margin: 17px;
}
</style>
