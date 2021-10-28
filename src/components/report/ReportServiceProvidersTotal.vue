<template>
  <div>
    <h1 class="text-xs-center mb-3 mt-3">Общее колличество проверок провайдеров</h1>
    <date-component @date="getDate"></date-component>
    <div class="button-box">
      <v-btn dark color="primary" class="get-btn" @click="loadAmount" :loading="loader">Получить</v-btn>
    </div>
     <report-total v-if="operationAmount" :amount="operationAmount" label="Количество"/>
  </div>
</template>

<script>
import ReportDateTimePicker from './ReportDateTimePicker.vue';
import DateComponent from '../date/DateComponent.vue';
import ReportTotal from '../../views/ReportTotal.vue';
import json from './reportMockData/reportServiceProvider.json';
import store from '../../store';


export default {
  components: { ReportDateTimePicker, DateComponent, ReportTotal },
  name: "ReportServiceProvidersTolal",
  data() {
    return {
      operationAmount: "",
      data: {
        dateFrom: null,
        dateTo: null,
      },
    }
  },
  methods: {
    loadAmount() {
      // if(process.env.NODE_ENV === 'development'){ this.operationAmount = json.totalAmount;
      // } else {
        // const headers = {
        //   'Content-Type': 'application/json',
        //   'token': '______' + this.$store.getters.token
        // };
        this.$http.post(
          this.$store.getters.reportApiUrl + '/report/check-service/amount?userId=' + this.$store.getters.userId,
          this.data/* ,  {headers} */
        )
          .then(response => {
            this.operationAmount = response.data.data.totalAmount;
            console.log('amount', response.data.data.totalAmount);
          }, this.handleError);
      // }
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
