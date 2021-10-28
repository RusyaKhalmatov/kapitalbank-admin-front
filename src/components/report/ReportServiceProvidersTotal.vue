<template>
  <div>
    <h1 class="text-xs-center mb-3 mt-3">Общее колличество проверок провайдеров</h1>
    <date-component @date="getDate"></date-component>
    <div class="button-box">
      <v-btn dark color="primary" class="get-btn" @click="loadAmount" :loading="loader">Получить</v-btn>
    </div>

    <v-data-table
      :headers="headers"
      :items="desserts"
      class="elevation-1"
    >
      <template v-slot:items="props">
        <td>{{ props.item.providerName }}</td>
        <td>{{ props.item.numberOfChecks }}</td>
      </template>
    </v-data-table>

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
      data: {
        dateFrom: null,
        dateTo: null,
      },
       headers: [
          {text: "Имя провайдера", value: "providerName"},
          {text: "Колличество проверок", value: "numberOfChecks"}
        ],
        desserts: [
          {
            providerName: 'Frozen Yogurt',
            numberOfChecks: 159
          },
          {
            providerName: 'Ice cream sandwich',
            numberOfChecks: 237
          }
        ]
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
        const baseUrl = '/psb'
        this.$http.post(
          baseUrl + '/api/report/check-service/amount?userId=4'/*  + this.$store.getters.userId */,
          this.data/* ,  {headers} */
        )
          .then(response => {
            this.desserts = response.data.data;
            console.log('amount', response.data.data);
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
