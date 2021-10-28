<template>
  <div class="reportTotal__wrap">
    <div class="reportTotal">
      <span class="reportTotal__label"> {{label}} :</span>
      <span class="reportTotal__total"> {{amount}} </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReportTotal',
  props: ['label', 'amount']
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
