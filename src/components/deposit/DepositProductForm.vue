<template>
  <v-flex xs12>
    <v-card min-height="600">
      <v-card-title>
        <h1>Депозиты</h1>
        <v-spacer></v-spacer>
        <v-btn icon small @click="redirect('deposit')">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs12>
            <img :src="currentItem.imageUrl" height="50px"/>
            <v-file-picker
              :disabled="loader"
              v-model="newImage"
              accept="image/*"
              label="Изображение">
            </v-file-picker>
          </v-flex>
          <v-flex xs12 sm12 md4 lg2 xl2>
            <v-text-field
              v-model="currentItem.productCode"
              label="Код депозита">
            </v-text-field>
          </v-flex>
          <v-flex xs12 sm12 md8 lg10 xl10>
            <v-text-field
              v-model="currentItem.productName"
              label="Название">
            </v-text-field>
          </v-flex>
          <v-flex xs12 sm12 md10 lg12 xl12>
            <v-text-field
              v-model="currentItem.comment"
              label="Comment">
            </v-text-field>
          </v-flex>
          <v-flex xs12 sm12 md12 lg12 xl12>
            <v-select
              :disabled="loader"
              v-model="currentItem.currency"
              :items="currency"
              label="Валюта">
            </v-select>
          </v-flex>
          <v-flex xs12 sm12 md8 lg10 xl10>
            <v-text-field
              v-model="currentItem.interest"
              label="Процентная ставка (%)">
            </v-text-field>
          </v-flex>
          <v-flex xs12 sm12 md4 lg2 xl2>
            <v-select
              v-model="currentItem.interestCurrency"
              :items="currency"
              label="Валюта процентной ставки">
            </v-select>
          </v-flex>
          <v-flex xs12 sm12 md6 lg6 xl6>
            <v-text-field
              :disabled="loader"
              v-model="currentItem.term"
              label="Период"
              type="number"/>
          </v-flex>
          <v-flex xs12 sm12 md6 lg6 xl6>
            <v-select
              :disaled="loader"
              v-model="currentItem.termUnit"
              :items="termUnitList"
              label="Период в"/>
          </v-flex>
          <v-flex xs12 sm12 md6 lg6 xl6>
            <v-text-field
              :disabled="loader"
              v-model="currentItem.minAmount"
              label="Минимальная сумма"/>
          </v-flex>
          <v-flex xs12 sm12 md6 lg6 xl6>
            <v-text-field
              :disabled="loader"
              v-model="currentItem.maxAmount"
              label="Максимальная сумма"/>
          </v-flex>
          <v-flex xs12 sm12 md12 lg12 xl12>
            <v-select
              :disabled="false"
              v-model="currentItem.status"
              :items="status"
              label="Статус"/>
          </v-flex>
          <v-flex xs12 sm12 md12 lg12 xl12>
            <v-select
              :disabled="loader"
              label="Доступные транзацкии"
              :items="allowedTransactionsList"
              multiple
              v-model="currentItem.allowedTransactionList">
            </v-select>
          </v-flex>
          <v-flex xs12 sm12 md4 lg4 xl4>
            <v-checkbox
              v-model="currentItem.incAllowed"
              label="Возможность пополнять">
            </v-checkbox>
          </v-flex>
          <v-flex xs12 sm12 md4 lg4 xl4>
            <v-checkbox
              v-model="currentItem.earlyClosure"
              label="Возможность досрочного закрытия">
            </v-checkbox>
          </v-flex>
          <v-flex xs12 sm12 md4 lg4 xl4>
            <v-checkbox
              v-model="currentItem.isPartialEnabled"
              label="Возможность частичного списания">
            </v-checkbox>
          </v-flex>
          <v-flex xs12 sm12 md4 lg4 xl4>
            <v-checkbox
              v-model="currentItem.monthly"
              label="Ежемесячно на кошелек">
            </v-checkbox>
          </v-flex>
          <v-flex xs12 sm12 md4 lg4 xl4>
            <v-checkbox
              v-model="currentItem.oneTimeAvans"
              label="Авансом за весь период">
            </v-checkbox>
          </v-flex>
          <v-flex xs12 sm12 md4 lg4 xl4>
            <v-checkbox
              v-model="currentItem.capitalization"
              label="Капитализация">
            </v-checkbox>
          </v-flex>
          <v-flex xs12 sm12 md6 lg6 xl6>
            <v-checkbox
              v-model="currentItem.depositRegisterType"
              label="В мобильном приложении / В офисе банка">
            </v-checkbox>
          </v-flex>
          <v-flex xs12>
            <v-select
              :disabled="loader"
              v-model="currentItem.lang"
              :items="languages"
              label="Язык">
            </v-select>
          </v-flex>
          <v-flex xs12>
            <v-btn dark color="primary" :loading="loader" @click="save">Сохранить</v-btn>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
  import MoneyFormat from "../money-format/MoneyFormat";

  export default {
    name: "DepositProductForm",
    components: {MoneyFormat},
    data() {
      return {
        currentItem: {},
        isNew: true,
        newImage: null,
        currency: [
          {value: "UZS", text: "Уз Сум"},
          {value: "USD", text: "Доллар США"},
          {value: "EUR", text: "Евро"},
        ],
        languages: [
          {value: "EN", text: "English"},
          {value: "RU", text: "Русский"},
          {value: "UZ", text: "Uzbek"}
        ],
        allowedTransactionsList: [
          {value: "ALL", text: "Все"},
          {value: "UZCARD", text: "UzCard"},
          {value: "ACCOUNT", text: "Счета"},
          {value: "WALLET", text: "Кошельки"},
          {value: "TIETO", text: "Visa/CUP"},
          {value: "NONE", text: "Ничего"},
        ],
        status: [
          {value: "ACTIVE", text: "Активный"},
          {value: "PASSIVE", text: "Пассивный"},
          // {value: "TOLERANT", text: "Толерантный"},
        ],
        termUnitList: [
          {value: "DAY", text: "День"},
          {value: "MONTH", text: "Месяц"},
          {value: "YEAR", text: "Год"},
        ]
      };
    },
    methods: {
      save() {
        let self = this;
        self.convertSumToCoinOnAdd(self.currentItem);
        let data = this.currentItem
        data.depositRegisterType = !!data.depositRegisterType ? 1 : 0
        if (self.isNew) {
          self.loader = false;
          self.$http.post(self.$store.getters.apiUrl + "/deposit-product", {...data})
            .then(() => {
              self.redirect("deposit");
            }, self.handleError);
        } else {
          self.$http.put(self.$store.getters.apiUrl + "/deposit-product", {...data})
            .then(() => {
              self.redirect("deposit");
            }, self.handleError);
        }
      },
      convertSumToCoinOnAdd(data) {
        this.currentItem.minAmount = data.minAmount * 100;
        this.currentItem.maxAmount = data.maxAmount * 100;
      },
      convertSumToCoinOnEdit(data) {
        this.currentItem.minAmount = data.minAmount / 100;
        this.currentItem.maxAmount = data.maxAmount / 100;
      }
    },
    mounted() {
      if (this.$route.params.depositProduct) {
        this.currentItem = this.$route.params.depositProduct;
        this.convertSumToCoinOnEdit(this.currentItem);
        this.isNew = false;
      }
    },
    watch: {
      newImage(image) {
        let self = this;
        if (image.length > 0) {
          let reader = new FileReader();
          reader.onload = e => {
            self.$set(self.currentItem, 'imageUrl', e.target.result);
          };

          reader.readAsDataURL(image[0]);
        }
        self.$set(self.currentItem, 'imageUrl', '');
      }
    }
  }
</script>

<style scoped>

</style>
