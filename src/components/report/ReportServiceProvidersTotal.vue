<template>
  <div>
    <h1 class="text-xs-center mb-3 mt-3">Общее колличество проверок провайдеров</h1>

    <date-component @date="getDate"></date-component>

    <div class="button-box">
      <v-btn dark color="primary" class="get-btn" @click="loadAmount" :loading="loader">Получить</v-btn>
    </div>

    <report-total v-if=amount :amount="amount" label="Amount" />
  </div>
</template>

<script>
import ReportDateTimePicker from './ReportDateTimePicker.vue';
import DateComponent from '../date/DateComponent.vue';
import ReportTotal from '../../views/ReportTotal.vue';

export default {
  components: { ReportDateTimePicker, DateComponent, ReportTotal },
  name: "ReportServiceProvidersTolal",
  data() {
    return {
      data: {
        dateFrom: null,
        dateTo: null,
      },
      amount: 0
    }
  },
  methods: {
    loadAmount() {
      const baseUrl = '/psb'
        this.$http.post(
          baseUrl + '/api/report/check-service/total?userId=4'/*  + this.$store.getters.userId */,
          this.data /* ,  {headers} */
        )
        .then(response => {
          this.amount = response.data.data.totalAmount;
        }, this.handleError);
    },
    getDate(val) {
      this.data = {
        dateFrom: val.fromDate,
        dateTo: val.toDate
      }
    }
  }
};
</script>

<style lang="sass" scoped></style>
