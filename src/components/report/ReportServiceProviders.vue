<template>
  <div>
    <h1 class="text-xs-center mb-3 mt-3">Информация по провайдерам</h1>

    <date-component @date="getDate"></date-component>

    <div class="flex text-xs-center xs12 mb-3">
      <v-btn dark round large color="primary" class="get-btn" @click="loadAmount" :loading="loader">Получить</v-btn>
    </div>

    <v-data-table
      v-if="desserts.length"
      :headers="headers"
      :items="desserts"
      class="elevation-1 mb-1"
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

export default {
  components: { ReportDateTimePicker, DateComponent, ReportTotal },
  name: "ReportServiceProviders",
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
      desserts: []
    }
  },
  methods: {
    loadAmount() {
      this.$http.post( '/psb/api/report/check-service/amount?userId=4', this.data )
        .then(response => {
          this.desserts = response.data.data;
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
