<template>
  <div class="main">
    <!-- <h1 class="headline"></h1> -->
    <v-flex xs12>
      <v-card min-height="600">
        <v-card-title>
          <h1>Отображение баланса для сохраненных платежей</h1>
          <v-spacer/>
          <v-btn @click="addDialog=true">
            Добавить
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-layout column wrap>
            <v-text-field
              v-model="search"
              label="Поиск">
            </v-text-field>
            <v-data-table
              :headers="headers"
              :items="data"
              :loading="loader"
              :search="search"
              :pagination.sync="pagination"
            >
              <template slot="items" slot-scope="props">
                <tr>
                  <td>{{props.item.serviceId}}</td>
                  <td><span v-if="props.item.categoryName">{{props.item.categoryName}}: </span>{{props.item.serviceName}}
                  </td>
                  <td>{{props.item.showBalance | showBoolean}}</td>
                  <td>
                    <v-btn icon small @click="openEditBox(props.item)">
                      <v-icon small>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon small @click="openDeleteBox(props.item)">
                      <v-icon small>mdi-delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-dialog
      v-model="addDialog"
      persistent
      max-width="415"
    >
      <v-card>
        <v-card-title class="headline">Добавить сервис</v-card-title>
        <v-text-field class="mx-3" v-model="searchService" label="Поиск"></v-text-field>
        <v-divider></v-divider>
        <v-card-title>
          <div class="service-box">
            <p @click="changeService(item)" :class="{'active': serviceId===item.serviceId}"
               v-for="(item, i) in tmpServiceData" :key="i">{{item.categoryName}}: {{item.serviceName}}</p>
          </div>
          <v-checkbox v-model="showBalance" label="Показать баланс"></v-checkbox>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="add-button"
            text
            @click="addShowBalance"
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
      persistent
      max-width="415"
    >
      <v-card>
        <v-card-title class="headline">Изменение</v-card-title>

        <v-card-title>
          <v-checkbox v-model="showBalance" label="Показать баланс"></v-checkbox>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="add-button"
            text
            @click="editShowBalance"
          >
            Изменить
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
      persistent
      v-model="deleteDialog"
      max-width="415"
    >
      <v-card>
        <v-card-title class="headline">Вы действительно хотите удалить?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="add-button"
            text
            @click="deleteShowBalance"
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
  </div>
</template>

<script>
  import {mapState} from "vuex";

  export default {
    name: 'ShowBalance',
    data() {
      return {
        data: [],
        loader: false,
        headers: [
          {text: "ID сервиса", value: "serviceId", sortable: false},
          {text: "Название сервиса", value: "serviceName", sortable: false},
          {text: "Показать баланс", value: "showBalance", sortable: false},
          {text: "Действия", value: "", sortable: false},

        ],
        search: '',
        pagination: {
          rowsPerPage: 10
        },
        deleteDialog: false,
        id: '',
        addDialog: false,
        editDialog: false,
        serviceId: '',
        showBalance: false,
        servicesData: [],
        tmpServiceData: [],
        searchService: '',
        serviceId: '',

      }
    },
    filters: {
      showBoolean(val) {
        if (val) {
          return 'Да'
        } else {
          return 'Нет'
        }
      }
    },
    watch: {
      addDialog(val) {
        if (!val) {
          this.serviceId = '';
          this.showBalance = false;
        }
      },
      deleteDialog(val) {
        if (!val) {
          this.id = '';
        }
      },
      editDialog(val) {
        if (!val) {
          this.id = '';
          this.showBalance = false;
        }
      },
      searchService(val) {

        if (val.length > 2) {
          // //console.log(val);
          this.tmpServiceData = this.servicesData.filter((x) => {
            var re = new RegExp(val.toLowerCase() + '.*')
            if (x.serviceName.toLowerCase().match(re)) {
              return x;
            }
            // //console.log(x.sender.toLowerCase().match(re))
          })
        } else if (val.length === 0) {
          this.getServices();
        }
      }
    },
    computed: {
      ...mapState(['prodApiUrl','prodApiUrl2'])
    },
    methods: {
      openEditBox(item) {
        this.showBalance = item.showBalance;
        this.id = item.id;
        this.editDialog = true;
      },
      editShowBalance() {
        const data = {
          "id": this.id,
          "showBalance": this.showBalance
        }
        console.log(data)
        this.$http.post(this.prodApiUrl + `/service/show-balance`, data)
          .then(response => {
            this.getShowBalance();
            this.editDialog = false;
          }, this.handleError)
      },
      changeService(item) {
        this.serviceId = item.serviceId;
        this.showBalance = false;
      },
      addShowBalance() {
        const data = {
          "serviceId": this.serviceId,
          "showBalance": this.showBalance
        }
        console.log(data)
        this.$http.put(this.prodApiUrl + `/service/show-balance`, data)
          .then(response => {
            console.log(response.data.data);
            this.getShowBalance();
            this.addDialog = false;
          }, this.handleError)

      },
      deleteShowBalance() {
        let self = this;
        self.$http.delete(self.prodApiUrl + "/service/show-balance/" + this.id)
          .then(response => {
            self.deleteDialog = false;
            self.getShowBalance()
          }, self.handleError);
      },
      openDeleteBox(item) {
        this.deleteDialog = true;
        this.id = item.id;
      },
      getShowBalance() {
        let self = this;
        self.data = [];
        self.$http.get(self.prodApiUrl + "/service/show-balance")
          .then(response => {
            console.log(response.data.data)
            self.data = response.data.data;
          }, self.handleError);
      },
      getServices() {
        this.$http.get(this.prodApiUrl2 + `/payment-services/short`)
          .then(response => {
            // console.log(response.data.data)
            this.servicesData = response.data.data;
            this.tmpServiceData = this.servicesData;
          })
      }
    },
    mounted() {
      this.getShowBalance();
      this.getServices();
    }
  }
</script>

<style scoped>
  p {
    margin-bottom: 5px;
    padding: 3px;
  }

  .main {
    width: 100%;
  }

  .headline {
    text-align: center;
  }

  .service-box {
    height: 215px;
    overflow: auto;
    cursor: pointer;
  }

  .active {
    background: #eac338;
    padding: 5px;
    border-radius: 6px;
  }
</style>    
