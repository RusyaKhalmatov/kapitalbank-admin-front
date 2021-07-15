<template>
  <div class="main">
    <h1 class="header">Отчет по заказу карт</h1>
    <date-select description="Количество заявок" @date="getDate"></date-select>
    <template v-if="isCard">
      <summery-card :date="date"></summery-card>
      <summery-card-branch :date="date"></summery-card-branch>
      <summery-card-details :date="date"></summery-card-details>
    </template>
  </div>
</template>
<script>
import SummeryCard from './ReportBySummeryCard'
import SummeryCardBranch from './ReportBySummeryBranch'
import SummeryCardDetails from './ReportBySummeryDetails'
import DateSelect from '@/components/date/DateSelect'

export default {
  name: 'ReportBySummery',
  components: {
    SummeryCard, DateSelect, SummeryCardBranch, SummeryCardDetails
  },
  data() {
    return {
      fromDate: '',
      toDate: '',
      date: {},
      isCard: false,
    }
  },
  methods: {
    getDate(val) {
      this.date = val;
      this.isCard = true;
    }
  },
}
</script>

<style scoped>
.main {
  width: 100%;
}

.header {
  text-align: center;
}
</style>
