<template>
  <div class="reportTotal__wrap">
    <div class="reportTotal">
      <div class="reportTotal__label"> {{label}} :</div>
      <div class="reportTotal__total"> {{amount}} </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReportTotal',
  props: {
    label: {
      type: String,
      required: true
    },
    amount: {
      type: String,
      required: true
    },
  }
}
</script>

<style scoped>
.reportTotal{
  display: inline-block;
  background: rgb(233, 233, 233);
  margin: 30px auto;
  max-width: 500px;
  padding: 10px 20px;
  border-radius: 18px;
  text-align: center;
}

.reportTotal__wrap{
  text-align: center;
}

.reportTotal__label{
  font-size: 16px;
}

.reportTotal__total{
  font-size: 20px;
  font-weight: bold;
}
</style>
