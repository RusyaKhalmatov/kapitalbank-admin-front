<template>
  <div class="main">
    <h1 class="headline">CREDIT ASIA</h1>
    <div class="param-box">
      <span class="row">
        <v-menu
          v-model="menu1"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field v-model="date1" label="С" prepend-icon="event" readonly v-on="on"></v-text-field>
          </template>
          <v-date-picker v-model="date1" @input="menu1 = false"></v-date-picker>
        </v-menu>
        <v-menu
          v-model="menu2"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field v-model="date2" label="До" prepend-icon="event" readonly v-on="on"></v-text-field>
          </template>
          <v-date-picker v-model="date2" @input="menu2 = false"></v-date-picker>
        </v-menu>
      </span>
      <!-- <v-btn @click="start">Показать</v-btn> -->
      <!-- <v-btn class="get-button" :loading="loader" @click="getTransactions">Показать</v-btn> -->
      <v-text-field v-model="pan" label="Номер карты"></v-text-field>
      <v-switch v-model="reverseSms" :label="reverseSms?'Основной смс-шлюз':'Резервный смс-шлюз'"></v-switch>
      <v-btn v-if="!isNext" :loading="loader" depressed @click="sendSms">Далее</v-btn>
      <div class="d-flex" style="flex-direction:column" v-if="isNext">
        <p>Смс-код отправлен на номер: {{phone}}</p>
        <v-text-field v-model="smsCode" label="Смс код"></v-text-field>
        <v-btn depressed :loading="loader" @click="verify">Получить</v-btn>
      </div>
    </div>

    <div v-if="data.length!=0" class="content mt-3">                                    
          <v-data-table :items="data" :headers="headers" :pagination.sync="pagination">
               <template slot="items" slot-scope="props">
                    <tr>
                        <td>{{props.item.totalCredit / 100 | number-format}}</td>                        
                        <td>{{props.item.totalDebit / 100 | number-format}}</td>
                        <td>{{props.item.startTime | timestamp-to-date}}</td>
                        <td>{{props.item.endTime | timestamp-to-date}}</td>                       
                    </tr>
                </template>
          </v-data-table>
      </div>
  </div>
</template>
<script>
export default {
  name: "creditAsia",
  data() {
    return {
      pan: "",
      reverseSms: true,
      loader: false,
      date1: "",
      date2: "",
      menu1: false,
      menu2: false,
      fromDate: "",
      toDate: "",
      phone: "",
      isNext: false,
      smsCode: '',
      data: [],
      newToken: '',
      headers: [
            {text: "Сумма общей прибыли", value: "totalCredit"},
            {text: "Cумма общего расхода", value: "totalDebit"},
            {text: "Начальное время", value: "startTime"},
            {text: "Время окончания", value: "endTime"},
        ],
        pagination: {
            rowsPerPage: 10
        },
    };
  },
  watch: {
    date1(val) {
      var tmpTime2 = this.date1.split("-");
      var begTime = new Date(
        tmpTime2[0],
        tmpTime2[1] - 1,
        tmpTime2[2],
        0,
        0,
        0
      );
      this.fromDate = begTime.getTime();
      // this.getSummery();
    },
    date2(val) {
      //console.log(this.date2)
      var tmpTime1 = this.date2.split("-");
      var endTime = new Date(
        tmpTime1[0],
        tmpTime1[1] - 1,
        tmpTime1[2],
        23,
        59,
        59
      );
      this.toDate = endTime.getTime();
    },
  },
  methods: {
    sendSms() {
      const postData = {
        pan: this.pan,
        reverseSms: this.reverseSms,
      };
      console.log(this.fromDate, ' - ', this.toDate)
      this.loader = true;
      this.$http
        .put(
          "https://mobile.kapitalbank.uz/api/general/card/history/send-sms",
          postData,
          {
            headers: {
              token: "fe00d546-369a-42a8-afc8-1ac48a757728-dcnb4",
              accept: "*/*",
              "device-id": "credit_asia_device",

              lang: "RU",
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          this.loader = false;
          this.phone = response.data.data.message.phone;
          this.newToken = response.data.data.message.token;
          this.isNext = true;
        })
        .catch(error=>{
            // console.log(error.data.errorMessage)
            this.$store.commit('errorMessage', error.data.errorMessage)
            this.loader = false
        })
    },
    verify() {
      const postData = {
        dateFrom: this.fromDate,
        dateTo: this.toDate,
        pan: this.pan,
        smsCode: this.smsCode,
        token: this.newToken,
      };

      this.data = [];
      this.loader = true;
      this.$http
        .post(
          "https://mobile.kapitalbank.uz/api/general/card/history/verify",
          postData,
          {
            headers: {
              token: "fe00d546-369a-42a8-afc8-1ac48a757728-dcnb4",
              accept: "*/*",
              "device-id": "credit_asia_device",
              lang: "RU",
              "Content-Type": "application/json",
            },
          }
        )
        .then(response => {
            console.log(response)
            this.data = response.data.data;
            if(this.data.length===0){
                this.infoMessage('Пусто')
            }
            console.log(this.data)
            this.isNext = false;
            this.loader = false;
            this.smsCode = '';
        })
        .catch(error=>{
            console.log(error.data.errorMessage)
            this.$store.commit('errorMessage', error.data.errorMessage)
            this.loader = false;
            this.smsCode = '';
        })
    },
  },
  created() {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    this.date1 =
      firstDay.getFullYear() +
      "-" +
      ("0" + (firstDay.getMonth() + 1)).substr(-2) +
      "-" +
      ("0" + 1).substr(-2);
    var endDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    this.date2 =
      date.getFullYear() +
      "-" +
      ("0" + (date.getMonth() + 1)).substr(-2) +
      "-" +
      ("0" + date.getDate()).substr(-2);
    console.log(this.date2);
    var tmpTime1 = this.date2.split("-");
    var endTime = new Date(
      tmpTime1[0],
      tmpTime1[1] - 1,
      tmpTime1[2],
      23,
      59,
      59
    );
    this.toDate = endTime.getTime();

    var tmpTime2 = this.date1.split("-");
    var begTime = new Date(tmpTime2[0], tmpTime2[1] - 1, tmpTime2[2], 0, 0, 0);
    this.fromDate = begTime.getTime();
  },
};
</script>
<style scoped>
.main {
  width: 100%;
}
.headline {
  text-align: center;
}
.param-box {
  width: 500px;
  margin: 25px auto;
  background: #ffff;
  padding: 19px;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
}
.row {
  display: flex;
}
.stat-header {
  text-align: center;
}
</style>