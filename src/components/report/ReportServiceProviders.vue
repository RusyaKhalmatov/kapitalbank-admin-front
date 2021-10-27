<template>
  <div>
    <v-layout row wrap>
        <date-component @date="getDate"></date-component>
        <!-- <report-date-time-picker :date-time-start.sync="operation.dateFrom"
                                :date-time-end.sync="operation.dateTo">
          <v-btn dark color="primary"  :loading="loader">Получить</v-btn>
        </report-date-time-picker> -->
    </v-layout>
  </div>
</template>

<script>
import moment from 'moment';
import ReportDateTimePicker from './ReportDateTimePicker.vue';
import { DATE_FORMAT, MONTH_AGO_DATE } from './ReportAllBanks.vue';
import DateComponent from '../date/DateComponent.vue';

export default {
  components: { ReportDateTimePicker, DateComponent },
  name: "ReportServiceProviders",
  data() {
    return {
      operation: {
        dateEnd: moment().format(DATE_FORMAT),
        dateStart: moment(MONTH_AGO_DATE).format(DATE_FORMAT),
        operationType: 'uzcard2uzcard'
      }
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
    }
  }
};
</script>

<style lang="sass" scoped></style>
