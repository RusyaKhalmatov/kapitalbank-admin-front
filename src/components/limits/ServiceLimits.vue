<template>
  <div class="main">
    <h1>Лимиты по сервисам</h1>
    <v-btn
        class="add-button"
        color="primary"
        dark
        @click.stop="addDialog = true"
    >
      Добавить лимит
    </v-btn>
    <v-dialog
        v-model="addDialog"
        max-width="415"
    >
      <v-card>
        <v-card-title class="headline">Выберите сервис</v-card-title>

        <div class="service-box">
                    <span :class="['service-item', {'active-class': active===item.serviceId}]"
                          v-for="(item, i) in serviceData" :key="i" @click="setActiveService(item)">
                        <p class="service-item-text">{{ item.serviceId }}</p>
                        <p class="service-item-text">{{ item.serviceNameRu }}</p>
                    </span>
        </div>
        <div class="add-content">
                    <span class="amount-box">
                        <v-text-field
                            v-model="minAmount"
                            type="number"
                            label="Минимальная сумма"
                            :rules="rules"
                        ></v-text-field>
                        <v-text-field
                            v-model="maxAmount"
                            type="number"
                            label="Максимальная сумма"
                            :rules="rules"
                        ></v-text-field>
                    </span>
          <v-text-field
              v-model="currency"
              label="Валюта"
              disabled
          ></v-text-field>
          <v-select
              :items="['DAILY', 'MONTHLY', 'YEARLY', 'ATOMIC']"
              filled
              v-model="period"
              label="Период"
          ></v-select>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              class="add-button"
              text
              @click="addLimits"
          >
            Сохранить
          </v-btn>

          <v-btn
              class="add-button"
              text
              @click="addDialog = false"
          >
            Отмена
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
        v-model="editDialog"
        max-width="415"
    >
      <v-card>
        <v-card-title class="headline">Выберите сервис</v-card-title>

        <div class="service-box">
                    <span :class="['service-item', {'active-class': active===item.serviceId}]"
                          v-for="(item, i) in serviceData" :key="i" @click="setActiveService(item)">
                        <p class="service-item-text">{{ item.serviceId }}</p>
                        <p class="service-item-text">{{ item.serviceNameRu }}</p>
                    </span>
        </div>
        <div class="add-content">
                    <span class="amount-box">
                        <v-text-field
                            v-model="minAmount"
                            type="number"
                            label="Минимальная сумма"
                            :rules="rules"
                        ></v-text-field>
                        <v-text-field
                            v-model="maxAmount"
                            type="number"
                            label="Максимальная сумма"
                            :rules="rules"
                        ></v-text-field>
                    </span>
          <v-text-field
              v-model="currency"
              label="Валюта"
              disabled
          ></v-text-field>
          <v-select
              :items="['DAILY', 'MONTHLY', 'YEARLY', 'ATOMIC']"
              filled
              v-model="period"
              label="Период"
          ></v-select>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              class="add-button"
              text
              @click="editLimits"
          >
            Сохранить
          </v-btn>

          <v-btn
              class="add-button"
              text
              @click="editDialog = false"
          >
            Отмена
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
        v-model="deleteDialog"
        max-width="415"
    >
      <v-card>
        <v-card-title class="headline">Вы действительно хотите удалить</v-card-title>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              class="add-button"
              text
              @click="deleteServiceLimit(tmp)"
          >
            Да
          </v-btn>

          <v-btn
              class="add-button"
              text
              @click="deleteDialog = false"
          >
            Нет
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-data-table
        :headers="limitHeaders"
        :items="limitData"
        :search="search"
    >
      <template slot="no-data">
        <v-alert :value="true" color="blue-grey lighten-1" icon="warning">
          Пусто
        </v-alert>
      </template>
      <template slot="items" slot-scope="props">
        <tr>
          <td>{{ props.item.serviceId }}</td>
          <td>{{ props.item.serviceName }}</td>
          <td>{{ props.item.minAmount / 100 | number-format }}</td>
          <td>{{ props.item.maxAmount / 100 | number-format }}</td>
          <td>{{ props.item.currency }}</td>
          <td>{{ props.item.period }}</td>
          <td>
            <v-btn icon small @click="editServiceLimit(props.item)">
              <v-icon small>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon small @click="openDeleteBox(props.item.id)">
              <v-icon small>mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "serviceLimits",
  data() {
    return {
      limitData: [],
      limitHeaders: [
        {text: 'ID сервиса', value: 'serviceId'},
        {text: 'Название сервиса', value: 'serviceName'},
        {text: 'Минимальная cумма', value: ' minAmount'},
        {text: 'Максимальная cумма', value: 'maxAmount'},
        {text: 'Валюта', value: 'currency'},
        {text: 'Период', value: 'period'},
      ],
      search: '',
      pagination: {},
      serviceData: [],
      addDialog: false,
      active: '',
      minAmount: '',
      maxAmount: '',
      period: '',
      currency: 'UZS',
      editDialog: false,
      id: '',
      rules: [v => v != '' || ''],
      tmp: {},
      deleteDialog: false,
    }
  },
  computed: {
    ...mapState(['prodApiUrl'])
  },
  watch: {
    addDialog(val) {
      if (!val) {
        this.active = '';
        this.minAmount = '';
        this.maxAmount = '';
        this.period = '';
        this.serviceId = '';
        this.serviceName = '';
      }
    },
    editDialog(val) {
      if (!val) {
        this.active = '';
        this.minAmount = '';
        this.maxAmount = '';
        this.period = '';
        this.serviceId = '';
        this.serviceName = '';
        this.id = '';
      }
    },
    deleteDialog(val) {
      if (!val) {
        this.tmp = '';
      }
    }
  },
  methods: {
    openDeleteBox(val) {
      this.tmp = val;
      this.deleteDialog = true;
    },
    editServiceLimit(val) {
      this.editDialog = true;
      this.active = val.serviceId;
      this.minAmount = val.minAmount / 100;
      this.maxAmount = val.maxAmount / 100;
      this.period = val.period;
      this.serviceId = val.serviceId;
      this.serviceName = val.serviceName;
      this.id = val.id
      // elem = document.getElementByClass(".active-class")
      setTimeout(() => {
        var elem = document.querySelector(".service-box");
        var activeElem = document.querySelector(".active-class");
        elem.scrollTop = activeElem.offsetTop - 200;
      }, 500)

    },
    editLimits() {
      let self = this;
      let postData = {
        "currency": this.currency,
        "maxAmount": this.maxAmount * 100,
        "minAmount": this.minAmount * 100,
        "period": this.period,
        "serviceId": this.serviceId,
        "serviceName": this.serviceName,
        "id": this.id
      }
      self.$http.put(`${this.prodApiUrl}/service-limit`, postData)
          .then(response => {
            self.getAllLimits();
          }, self.handleError);
      this.editDialog = false;

    },
    addLimits() {
      if (this.maxAmount && this.minAmount && this.serviceId && this.period) {
        this.addDialog = false;
        let self = this;
        let postData = {
          "currency": this.currency,
          "maxAmount": this.maxAmount * 100,
          "minAmount": this.minAmount * 100,
          "period": this.period,
          "serviceId": this.serviceId,
          "serviceName": this.serviceName
        }
        self.$http.post(`${this.prodApiUrl}/service-limit`, postData)
            .then(response => {
              //console.log(response.data);
              self.getAllLimits();
            }, self.handleError);
      }
    },
    setActiveService(item) {
      this.active = item.serviceId;
      this.serviceId = item.serviceId;
      this.serviceName = item.serviceNameRu;
    },
    getAllLimits() {
      let self = this;
      self.$http.get(`${this.prodApiUrl}/service-limit`)
          .then(response => {
            self.limitData = response.data.data;
          }, self.handleError);
    },
    deleteServiceLimit(id) {
      //console.log(id)
      let self = this;
      self.$http.delete(`${this.prodApiUrl}/service-limit`, {
        params: {
          'id': id,
        }
      })
          .then(response => {
            //console.log(response.data);
            self.getAllLimits();
          }, self.handleError);
      self.deleteDialog = false;
    },
    getPaymentServices() {
      let self = this;
      self.$http.get(self.$store.getters.apiUrl + '/payment-services')
          .then(response => {
            self.serviceData = response.data.data;
            //console.log(self.serviceData)
          }, self.handleError);
    }
  },
  mounted() {
    this.getPaymentServices();
    this.getAllLimits();
  }
}
</script>

<style scoped>
.add-button {
  border-radius: 25px;
  background: #717171 !important;
  color: #FFFF !important;
}

.service-box {
  height: 260px;
  overflow: auto;
  padding: 20px;
}

.service-item {
  display: flex;
  cursor: pointer;
}

.service-item:hover {
  background: #eaeaea;
  border-radius: 10px;
  padding: 5px 10px;
}

.service-item-text {
  margin: 5px;
}

::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 5px;
  background: #eaeaea;
}

::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
}

.active-class {
  background: #7aa1ca !important;
  border-radius: 10px;
  padding: 5px 10px;
}

.add-content {
  padding: 10px;
  background: rgba(239, 239, 239, 0.35);
  margin: 15px 0 0;
}

.amount-box {
  /* display: flex; */

}
</style>
