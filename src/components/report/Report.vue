<template>
  <v-layout column wrap>
    <v-card min-height="600" v-if="$store.getters.userId!=144785">
      <v-card-title>
        <h1 class="mb_0">Отчеты</h1>
      </v-card-title>
      <v-card-text>
        <v-layout row wrap>
          <v-list>
            <div v-for="(item,index) in reportList" :key="index">
              <v-list-tile @click="redirect(item.value)">
                <v-list-tile-title>
                  <h3>{{ item.text }}</h3>
                </v-list-tile-title>
              </v-list-tile>
            </div>
            <template v-if="userId==='210'||userId==='3'">
              <div>
                <v-list-tile @click="redirect('creditAsia')">
                  <v-list-tile-title>
                    <h3>CREDIT ASIA</h3>
                  </v-list-tile-title>
                </v-list-tile>
              </div>
            </template>
          </v-list>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
export default {
  name: "Report",
  data() {
    return {
      reportList: [
        // {text: "Сводная таблица", value: "pivotTable"},
        {text: "Сводная таблица v.2", value: "newPivotTable"},
        {text: "Все банки", value: "reportAllBanks"},
        {text: "По Транзакциям", value: "reportTransactions"},
        {text: "По VISA DIRECT", value: "reportVisaDirect"},
        {text: "По Вкладам", value: "reportDeposit"},
        {text: "По вкладам v2", value: "reportOfDeposit"},
        // {text: "По Кредитам", value: "reportCredit"},
        {text: "По кредитам v2", value: "reportOfCredit"},
        {text: "Конвертация Валют", value: "reportConversion"},
        // {text: "Кросс-конвертация Валют", value: "reportCrossConversion"},
        {text: "Отчеты Paynet", value: "reportService"},
        {text: "Отчеты по зарегистрированным клиентам", value: "reportRegisteredUsers"},
        {text: "Отчеты по активности клиентов", value: "ReportByActiveClients"},
        {text: "Отчеты по клиентам и картам", value: "reportClientAndCards"},
        {text: "Неудачная Регистрация", value: "failedRegistration"},
        {text: "Антифрод", value: "Antifraud"},
        // {text: "Отчет о количестве апельсинов", value: "LoyaltyFilterAccount"},
        {text: "Мониторинг тарифов программы лояльности", value: "LoyaltyFilterTariffs"},
        {text: "Отчет по транзакциям программы лояльности", value: "LoyaltyFilterTransactions"},
        {text: "Отчет сотрудников колл-центра", value: "ChatStaffMonitoring"},
        {text: "Отчет по заказу карт", value: "ReportBySummery"},
        {text: "Отчет по виртуальной карте", value: "VirtualCards"},
        {text: "Отчет по реквизитам", value: "ReportRequisite"},
        /*{text: "Beeline отчет", value: "ReportBeeline"},
        {text: "Ucell отчет", value: "ReportUcellComponent"},
        {text: "Количество запросов по скорингу", value: "ExternalHistoryStatistic"},*/


      ]
    }
  },
  computed: {
    userId() {
      return window.localStorage.getItem('userId')
    }
  }
}
</script>

<style scoped>
.mb_0{
  margin-top: 10px;
  margin-bottom: -20px;
  padding-left: 15px;
}
</style>
