<template>
  <div>
    <h1 class="text-xs-center mb-3 mt-3">Общее колличество проверок провайдеров</h1>
    <date-component @date="getDate"></date-component>
    {{operationAmount}}
    <div class="button-box">
        <v-btn dark color="primary" class="get-btn" @click="loadAmount" :loading="loader">Получить</v-btn>
        <!-- <v-btn class="mt-3 excel-btn" :loading="loader" @click="getExcel">Скачать Excel</v-btn>
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
        </download-excel> -->
    </div>
    <report-total amount="2000" label="Количество"/>
  </div>
</template>

<script>
import moment from 'moment';
import ReportDateTimePicker from './ReportDateTimePicker.vue';
import { DATE_FORMAT, MONTH_AGO_DATE } from './ReportAllBanks.vue';
import DateComponent from '../date/DateComponent.vue';
import ReportTotal from '../../views/ReportTotal.vue';
import json from './reportDemoData/reportServiceProvider.json';

export default {
  components: { ReportDateTimePicker, DateComponent, ReportTotal },
  name: "ReportServiceProvidersTolal",
  data() {
    return {
      apiUrl: '',
      operationAmount: null,
      operation: {
        dateEnd: moment().format(DATE_FORMAT),
        dateStart: moment(MONTH_AGO_DATE).format(DATE_FORMAT),
        operationType: 'uzcard2uzcard'
      },
      data: {
        status: [],
        operationType: [],
        dateFrom: '',
        dateTo: '',
      },
    }
  },
  methods: {
    showEnvVariable() {
      console.log('env = ', process.env.NODE_ENV);
      console.log('process.env = ', process.env);
    },
    showErrorInfo(item) {
      this.errorInfo = item;
      this.errorDialog = true;
    },
    loadAmount() {
      if(process.env.NODE_ENV === 'development'){
        this.operationAmount = json.totalAmount;
      } else {
        this.$http.get(this.apiUrl)
          .then(response => {
            this.operationAmount = response.data.data.totalAmount;
            console.log('amount', response.data.data);
          }, this.handleError);
      }
    },
    getDate(val) {
      this.date = val;
      this.transactions = [];
      this.totalPages = '';
      this.amountData = [];
      this.show = false;
      this.operationAmount = {}
      console.log('this.date = ', this.date);
    }
  },
  mounted: function() {
    this.showEnvVariable();


  }
};
</script>

<style lang="sass" scoped></style>
