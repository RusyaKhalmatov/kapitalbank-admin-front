<template>
  <div>
    <h1 class="text-xs-center mb-3 mt-3">Информация по провайдерам</h1>

    <date-component @date="getDate"></date-component>

    <div class="button-box">
      <v-btn dark color="primary" class="get-btn" @click="loadAmount" :loading="loader">Получить</v-btn>
    </div>

    <v-data-table
      v-if="desserts.length"
      :headers="headers"
      :items="desserts"
      class="elevation-1"
    >
      <template v-slot:items="props">
        <td>{{ props.item.providerName }}</td>
        <td>{{ props.item.numberOfPayments }}</td>
        <td>{{ props.item.commonSum }}</td>
      </template>
    </v-data-table>

  </div>
</template>

<script>
import ReportDateTimePicker from './ReportDateTimePicker.vue';
import DateComponent from '../date/DateComponent.vue';
import axios from 'axios';

export default {
  components: { ReportDateTimePicker, DateComponent },
  name: "ReportServiceProviderPayment",
  data() {
    return {
      data: {
        dateFrom: null,
        dateTo: null,
      },
      headers: [
        {text: "Имя провайдера", value: "providerName"},
        {text: "Колличество платежей", value: "numberOfPayments"},
        {text: "Общая сумма", value: "commonSum"}
      ],
      desserts: []
    }
  },
  methods: {
    loadAmount() {
      console.log('amount = ');

      const baseUrl = process.env.VUE_APP_API_URL;

      console.log('baseUrl = ', baseUrl);

      // axios.post(
      //   baseUrl + '/api/report/amount?userId=4'/*  + this.$store.getters.userId */,
      //   this.data,
      // //   {
      // //   proxy: agent
      // // }
      //   )
      //   .then(response => {
      //     this.desserts = response.data.data;
      //   }, this.handleError);
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
