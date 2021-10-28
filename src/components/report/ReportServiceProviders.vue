<template>
  <div>
    <h1 class="text-xs-center mb-3 mt-3">Информация по провайдерам</h1>
    <date-component @date="getDate"></date-component>
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
    }
  }
};
</script>

<style lang="sass" scoped></style>
