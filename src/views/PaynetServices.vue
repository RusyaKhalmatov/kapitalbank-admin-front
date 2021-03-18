<template>
  <v-flex xs12>
    <v-card min-height="600">
      <v-card-title>
        <h1>Paynet Services</h1>
        <v-spacer/>
        <v-btn small icon @click="redirect('PaynetServicesForm')">
          <v-icon small>mdi-plus</v-icon>
        </v-btn>
        <v-btn small icon @click.stop="dialog = true">
          <v-icon small>mdi-flattr</v-icon>
        </v-btn>
        <v-dialog
          v-model="dialog"
          width="400">
          <v-card>
            <v-card-title>
              <h3>Paynet Services</h3>
            </v-card-title>
            <v-card-text>
              Вы действительно хотите обновить сервисы?
            </v-card-text>
            <v-card-actions>
              <v-spacer/>
              <v-btn @click.stop="dialog = false" color="primary">Нет</v-btn>
              <v-btn @click.stop="updateServices()" color="primary">Да</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-btn small icon @click="redirect('ServiceCategory')">
          <v-icon small>mdi-view-module</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs12>
            <!-- <v-text-field
                    v-model="search"
                    prepend-icon="mdi-magnify"
                    label="Поиск">
            </v-text-field> -->
            <div class="search-box">
                            <span class="input-text">
                                <v-checkbox class="search-box-child" v-model="isServiceId"
                                            label="По ID сервиса"></v-checkbox>
                                <v-text-field
                                  v-if="isServiceId"
                                  class="search-box-child"
                                  v-model="serviceId"
                                  @keyup.enter="getServices(1)"
                                  label="Введите ID">
                                </v-text-field> 
                            </span>
              <span class="input-text">
                                <v-checkbox class="search-box-child" v-model="isNameRu"
                                            label="По наименованию"></v-checkbox>
                                <v-text-field
                                  v-if="isNameRu"
                                  class="search-box-child"
                                  v-model="nameRu"
                                  @keyup.enter="getServices(1)"
                                  label="">
                                </v-text-field> 
                            </span>
              <span class="input-text">
                                <v-checkbox class="search-box-child" v-model="isActive"
                                            label="По активности"></v-checkbox>
                                <v-radio-group style="margin:0; padding: 0" class="radio" v-model="active"
                                               v-if="isActive">
                                    <v-radio
                                      :key="0"
                                      label="Включен"
                                      :value="true"
                                    ></v-radio>
                                    <v-radio
                                      :key="1"
                                      label="Выключен"
                                      :value="false"
                                    ></v-radio>
                                </v-radio-group>                         
                            </span>
              <v-btn small depressed @click="searchData">Поиск</v-btn>
            </div>
            <v-data-table
              :headers="serviceHeaders"
              :items="serviceItems"
              :loading="loader"
              :search="search"
              :pagination.sync="pagination"
              :item-key="serviceItems.categoryId"
              hide-actions
            >
              <template slot="items" slot-scope="props">
                <tr @click="props.expanded = !props.expanded">
                  <td v-if="props.item.logoUrl">
                    <img v-bind:src="props.item.logoUrl" height="32px" width="32px" contain/>
                  </td>
                  <td v-else></td>
                  <td>{{ props.item.serviceId }}</td>
                  <td>{{ props.item.categoryId }}</td>
                  <td>{{ props.item.gatewayName }}</td>
                  <td>{{ props.item.serviceNameRu }}</td>
                  <!-- <td>{{ props.item.eposType }}</td> -->
                  <td>{{ props.item.minAmount }}</td>
                  <td>{{ props.item.maxAmount }}</td>
                  <td>
                    <v-checkbox disabled
                                v-model="props.item.active">
                    </v-checkbox>
                  </td>
                  <td>
                    <!-- <v-btn :to="{name: 'PaynetServicesForm', params: {paynetServices: props.item}}" -->
                    <v-btn @click="editService(props.item)" icon small>
                      <v-icon small>mdi-pencil</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </template>
            </v-data-table>
            <v-pagination
              v-if="serviceItems.length!=0"
              :disabled="loader"
              class="center"
              v-model="page"
              :length="totalPages"
              :total-visible="10"
            ></v-pagination>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "PaynetServices",
  data() {
    return {
      serviceHeaders: [
        {text: "Логотип", value: "logoUrl", sortable: false},
        {text: "ID сервиса", value: "serviceId", sortable: false},
        {text: "ID категории", value: "categoryId", sortable: false},
        {text: "Имя Щлюза", value: "gatewayName", sortable: false},
        {text: "Наименование", value: "serviceNameRu", sortable: false},
        {text: "Мин. сумма", value: "minAmount", sortable: false},
        {text: "Макс. сумма", value: "maxAmount", sortable: false},
        {text: "Включен", value: "active", sortable: false},
        {text: "Действия", sortable: false}
      ],
      serviceItems: [],
      pagination: {
        rowsPerPage: 10
      },
      search: "",
      dialog: false,
      totalPages: '',
      page: 1,
      serviceId: '',
      nameRu: '',
      active: '',
      isServiceId: false,
      isNameRu: false,
      isActive: false,

    }
  },
  computed: {
    ...mapState(['prodApiUrl2'])
  },
  watch: {
    page(val) {
      this.getServices(val);
    },
    search(val) {
      // this.serviceId = val;
      // if(this.page===1)
      //     this.getServices(1);
      // else{
      //     this.page = 1;
      // }
    },
    isServiceId(val) {
      if (!val) {
        this.serviceId = '';
        if (!this.isNameRu && !this.isActive) {
          this.searchData();
        }
      }
    },
    isNameRu(val) {
      if (!val) {
        this.nameRu = '';
        if (!this.isServiceId && !this.isActive) {
          this.searchData();
        }
      }
    },
    isActive(val) {
      if (val) {
        this.active = true;
        if (!this.isNameRu && !this.isServiceId) {
          this.searchData();
        }
      }
    }
  },
  methods: {
    searchData() {
      if (this.page === 1) {
        this.getServices(1);
      } else {
        this.page = 1;
      }
    },
    getServices(page) {
      let self = this;
      // self.$http.get(self.$store.getters.newApiUrl + "/payment-services")
      //     .then(response => {
      //         self.loader = false;
      //         self.serviceItems = response.data.data;
      //     }, self.handleError);
      this.loader = true;
      if (!this.isActive)
        this.active = '';
      this.$http.get(`${this.prodApiUrl2}/payment-service?page=${page - 1}&size=10&serviceId=${this.serviceId.trim()}&nameRu=${this.nameRu.trim()}&active=${this.active}`)
        .then(response => {
          this.loader = false;
          this.serviceItems = response.data.data.content;
          this.totalPages = response.data.data.totalPages;
          // if(page===1){
          //     this.page = 1;
          // }
          this.loader = false;
        }, this.handleError)
    },
    editService(val) {
      this.$http.get(`${this.prodApiUrl2}/payment-service/${val.serviceId}`)
        .then(response => {
          console.log(response.data.data);
          this.$router.push({name: 'PaynetServicesForm', params: {paynetServices: response.data.data}});

        })
    },
    updateServices() {
      let self = this;
      self.$http.get(`${this.prodApiUrl2}/service/update`)
        .then(() => {
          location.reload();
        }, self.handleError);
    }
  },
  mounted() {
    this.getServices(1);
  }
}
</script>

<style scoped>
.center {
  display: flex;
  justify-content: center;
  margin: 15px;
}

.input-text {
  display: flex;
}

.search-box {
  display: flex;
  flex-wrap: wrap;
  /* align-items: center; */
}

.search-box-child {
  margin: 0 5px;
  align-items: center;
  padding: 0;
}

/* .v-input__slot{
    margin: 0 !important;
} */
</style>
