<template>
  <div class="main">
    <h1 class="headline">Пользователи по добавленным картам</h1>
    <div class="search">
      <v-text-field
        label="Поиск по номеру карты"
        solo
        maxlength="19"
        v-mask="'#### #### #### ####'"
        v-model="pan"
        @keyup.enter="getCards"
      ></v-text-field>
      <v-btn :loading="loader" @click="getCards" class="search-btn">Найти</v-btn>
    </div>
    <template v-if="identifiedClient.length!=0">
      <h2>Пользователь который прошел идентификацию по карте:</h2>
      <v-data-table
        :items="identifiedClient"
        :headers="identifiedClientHeaders"
        :pagination.sync="pagination"
      >
        <template slot="items" slot-scope="props">
          <tr>
            <td>{{props.item.id}}</td>
            <td>{{props.item.fullName}}</td>
            <td>{{props.item.phone}}</td>
            <td>{{props.item.lastActiveTime | timestamp-to-date}}</td>
            <td>{{props.item.registeredDate | timestamp-to-date}}</td>
            <td>{{props.item.userRole }}</td>
            <td>{{props.item.userState}}</td>
            <td>{{props.item.client}}</td>
          </tr>
        </template>
      </v-data-table>
    </template>
    <template v-if="cardList.length!=0">
      <h2 class="mt-2">Пользователи которые добавили себе данную карту</h2>
      <v-data-table
        :headers="cardListHeaders"
        :items="cardList"
        :pagination.sync="pagination"
      >
        <template slot="items" slot-scope="props">
          <tr>
            <td>{{props.item.userId}}</td>
            <td>{{props.item.customerId}}</td>
            <td>{{props.item.ownerName}}</td>
            <td>{{props.item.masked_pan}}</td>
            <td>{{props.item.cardType}}</td>
            <td>{{props.item.registeredDate | timestamp-to-date}}</td>
            <td>{{props.item.userCardState}}</td>
            <td>{{props.item.deleteDate}}</td>
          </tr>
        </template>
      </v-data-table>
    </template>
  </div>
</template>

<script>
  import {mapState} from "vuex";

  export default {
    name: 'usersByAddedCards',
    data() {
      return {
        loader: false,
        pan: '',
        pagination: {
          rowsPerPage: 10
        },
        identifiedClient: [],
        cardList: [],
        cardListHeaders: [
          {text: "ID пользователя", value: "userId"},
          {text: "ID клиента", value: "customerId"},
          {text: "Имя владельца", value: "ownerName"},
          {text: "Номер карты", value: "masked_pan"},
          {text: "Тип карты", value: "cardType"},
          {text: "Дата регистрации", value: "registeredDate"},
          {text: "Статус карты", value: "userCardState"},
          {text: "Дата удаления", value: "deleteDate"},

        ],
        identifiedClientHeaders: [
          {text: "ID пользователя", value: "id"},
          {text: "Полное имя", value: "fullName"},
          {text: "Номер телефона", value: "phone"},
          {text: "Последнее посещение", value: "lastActiveTime"},
          {text: "Дата регистрации", value: "registeredDate"},
          {text: "Роль", value: "userRole"},
          {text: "Статус пользователя", value: "userState"},
          {text: "Клиент", value: "client"},
        ]
      }
    },
    computed: {
      ...mapState(['prodApiUrl2'])
    },
    methods: {
      getCards() {
        this.loader = true;
        this.cardList = [];
        this.identifiedClient = [];
        if (this.pan.length != 19) {
          this.$store.commit('errorMessage', 'Неверный номер карты')
          this.loader = false;
        } else {
          this.$http.get(this.prodApiUrl2 + `/user-info/customer/${this.pan.replace(/\s/g, '')}`)
            .then(response => {
              this.identifiedClient.push(response.data.data.identifiedClient);
              this.cardList = response.data.data.cardList;
              // console.log(this.cardList);
              // console.log(this.identifiedClient);
              this.loader = false;
            }, this.handleError)
        }
      }
    },
    mounted() {

    }
  }
</script>
<style scoped>
  .main {
    width: 100%;

  }

  .headline {
    text-align: center;
  }

  .search {
    display: flex;
    width: 540px;
    margin: 15px auto;
  }

  .search-btn {
    height: 47px;
    margin: 0 15px;
  }
</style>
