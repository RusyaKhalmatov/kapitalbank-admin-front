<template>
  <div class="main">
    <h1 class="headline">Информация об оплате сервиса</h1>
    <div class="operation-id">
      <v-text-field
        label="OperationId"
        v-model="operationId"
        single-line
        solo
        @keyup.enter="checkService"
      ></v-text-field>
      <v-btn @click="checkService" :loading="loader" class="check-btn">Получить</v-btn>
    </div>

    <div class="content" v-if="!isEmpty">
      <h2>Чек операции</h2>
      <v-data-table
        :items="historyDto"
        :headers="historyDtoHeaders"
        hide-actions
      >
        <template slot="items" slot-scope="props">
          <tr>
            <td v-if="props.item.logoUrl"><img class="logo" :src="props.item.logoUrl" alt=""></td>
            <td v-else></td>
            <td>{{props.item.operationType}}</td>
            <td>{{props.item.senderFullName}} {{props.item.sender}}</td>
            <td>{{props.item.senderAmount / Math.pow(10, props.item.senderCurrency.scale) | number-format}}
              {{props.item.senderCurrency.name}}
            </td>
            <td>{{props.item.senderFeeAmount / 100 | number-format}} UZS</td>
            <td>{{props.item.receiver }}</td>
            <td>{{props.item.receiverFullName}}</td>
            <td>{{props.item.receiverAmount / Math.pow(10, props.item.receiverCurrency.scale) | number-format}}
              {{props.item.receiverCurrency.name}}
            </td>
            <td>{{props.item.receiverFeeAmount / 100 | number-format}} UZS</td>
            <td>{{props.item.status}}</td>
            <td>{{props.item.dateTime | timestamp-to-date}}</td>

          </tr>
        </template>
      </v-data-table>

      <h3 class="mt-3">Состояние в Paynet: №: {{responseIdentity.identity}} - {{responseIdentity.status}} -
        {{responseIdentity.statusMessage}}</h3>
      <h2>Чек текущей транзакции</h2>
      <div class="debit-transaction">
                    <span class="d-flex">
                        <p class="debit-text">Сумма: </p>
                        <p>{{debitTransaction.amount / 100 | number-format}} {{debitTransaction.currency}}</p>
                    </span>
        <span class="d-flex">
                        <p class="debit-text">Статус транзакции: </p>
                        <p>{{debitTransaction.transactionStatus }}</p>
                    </span>
        <span class="d-flex">
                        <p class="debit-text">Тип транзакции: </p>
                        <p>{{debitTransaction.transactionType}}</p>
                    </span>
      </div>
      <v-btn small @click="dialog=true">Подробнее</v-btn>
    </div>
    <v-dialog v-model="dialog" persistent max-width="600">
      <v-card>
        <code class="code">
          {{debitTransaction }}
        </code>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-grey" style="color: #FFFF;" text @click="dialog = false">Закрыть</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>
<script>
  import {mapState} from "vuex";

  export default {
    name: 'CheckService',
    data() {
      return {
        operationId: '',
        isEmpty: true,
        historyDtoHeaders: [
          {text: "Лого", value: "logoUrl", sortable: false},
          {text: "Тип операции", value: "operationType", sortable: false},
          {text: "Отправитель", value: "sender", sortable: false},
          {text: "Сумма отпр-я", value: "senderAmount", sortable: false},
          {text: "Комиссия отпр-я", value: "senderFeeCurrency", sortable: false},
          {text: "Получатель", value: "receiver", sortable: false},
          {text: "Название получ-я", value: "receiverFullName", sortable: false},
          {text: "Сумма получ-я", value: "receiverAmount", sortable: false},
          {text: "Комиссия получ-я", value: "receiverFeeAmount", sortable: false},
          {text: "Статус", value: "status", sortable: false},
          {text: "Время", value: "dateTime", sortable: false},

        ],
        dialog: false,
        historyDto: [],
        responseIdentity: [],
        debitTransaction: [],
        loader: false,

      }
    },
    computed: {
      ...mapState(['prodApiUrl'])
    },
    methods: {
      checkService() {
        this.loader = true;
        this.historyDto = [];
        this.responseIdentity = [];
        this.debitTransaction = [];
        this.isEmpty = true;
        this.$http.post(this.prodApiUrl + `/transaction/manual/check-service/${this.operationId}`)
          .then(response => {
            this.loader = false;
            this.isEmpty = false;
            this.historyDto.push(response.data.data.historyDto);
            this.responseIdentity = response.data.data.responseIdentity.statusResult.result
            this.debitTransaction = response.data.data.debitTransaction;
          }, this.handleError);
      }
    }
  }
</script>
<style scoped>
  .code {
    width: 100%;
    background: white;
    padding: 0 10px;
  }

  .main {
    width: 100%;
  }

  .headline {
    text-align: center;
  }

  .operation-id {
    width: 500px;
    margin: 20px auto;
    display: flex;
  }

  .check-btn {
    margin: 0;
    height: 48px;
  }

  .logo {
    width: 50px;
  }

  .paynet {
    display: flex;
    align-items: center;
  }

  p {
    margin: 5px 0;
  }

  .debit-transaction {
    width: 275px;
  }

  .debit-text {
    width: 200px;
    font-style: italic;
  }
</style>
