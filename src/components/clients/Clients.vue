<template>
  <v-flex xs12>
    <v-card min-height="600">
      <v-card-title>
        <h1>Список пользователей</h1>
        <v-spacer/>
        <template v-if="$store.getters.userId!=144785">
          <v-btn v-if="$store.getters.roles === 'ADMIN'" icon small @click="redirect('clientForm')">
            <v-icon small>mdi-plus</v-icon>
          </v-btn>
        </template>
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="search"
          prepend-icon="mdi-magnify"
          label="Поиск"
          @keydown.enter="searchWord(search)">
        </v-text-field>
        <v-data-table
          :headers="clientHeaders"
          :items="userList"
          :loading="loader"
          :pagination.sync="pagination"
          :search="search"
          hide-actions>
          <template slot="items" slot-scope="props">
            <tr @click="props.expanded = !props.expanded">
              <td>{{props.item.id}}</td>
              <td>{{props.item.firstName}}</td>
              <td>{{props.item.lastName}}</td>
              <td>{{props.item.phone.split(":")[0]}}
                {{phoneFormat(props.item.phone.split(":")[1]) | timestamp-to-date}}
              </td>
              <td>{{props.item.customerId}}</td>
              <td>{{props.item.userState}}</td>
              <td>{{props.item.email}}</td>
              <td>{{props.item.userType}}</td>
              <td>
                <v-btn small icon :to="{name: 'clientCredential',params: {user: props.item}}">
                  <v-icon small>note</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
        <div class="text-xs-center pt-2">
          <!-- <v-btn icon @click="arrowLeft()">
              <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          {{this.currentPage + 1}} - {{this.totalUsers}}
          <v-btn icon @click="arrowRight()">
              <v-icon>mdi-arrow-right</v-icon>
          </v-btn> -->
          <v-pagination
            v-if="totalUsers"
            class="center"
            :disabled="loader"
            v-model="currentPage"
            :length="totalUsers"
            :total-visible="10"
          ></v-pagination>
        </div>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
  export default {
    name: "Clients",
    data() {
      return {
        clientHeaders: [
          {text: "ID", value: "id"},
          {text: "Имя", value: "firstName"},
          {text: "Фамилия", value: "lastName"},
          {text: "Номер телефона", value: "phone"},
          {text: "ID клиента", value: "customerId"},

          {text: "Статус", value: "userState"},
          {text: "Электронная почта", value: "email"},
          {text: "Тип пользователя", value: "userType"},
          {text: "Действия", sortable: false}
        ],
        search: "",
        userList: [],
        totalUsers: null,
        pagination: {
          rowsPerPage: 10,
        },
        currentPage: 1,
        pageCount: 0,
        loading: true,
        isSearch: false,
        searchValue: '',
      }
    },
    methods: {
      getTotalUsers() {
        let self = this;
        self.$http.get(self.$store.getters.apiUrl + '/total-users')
          .then(response => {
            self.loader = false;
            self.totalUsers = response.data.data;
          }, self.handleError);
      },
      getUserList() {
        let self = this;
        self.$http.get(self.$store.getters.apiUrl + `/user-list?page=${self.currentPage - 1}&size=${self.pagination.rowsPerPage}`)
          .then(response => {
            self.loader = false;
            self.userList = response.data.data;
          }, self.handleError);
      },
      arrowRight() {
        let self = this;
        if (self.currentPage >= self.totalUsers) {
          // this.getUserList();
          this.searchWord(1, '')

        } else {
          self.currentPage++;
          // this.getUserList();
          this.searchWord(1, '')

        }
      },
      arrowLeft() {
        let self = this;
        if (self.currentPage <= 0) {
          // this.getUserList();
          this.searchWord(1, '')

        } else {
          self.currentPage--;
          // this.getUserList();
          this.searchWord(1, '')

        }
      },
      searchWord(page, search) {
        let self = this;
        this.searchValue = search;
        this.loader = true;
        self.$http.get(self.$store.getters.newApiUrl + `/user-search?page=${page - 1}&size=10&word=${search}`)
          .then(response => {
            self.loader = false;
            if (page === 1)
              self.currentPage = 1;
            self.userList = response.data.data.dtoList;
            self.totalUsers = response.data.data.totalPages
            this.loader = false;

            // console.log(self.userList)
          }, self.handleError);
      },
      phoneFormat(phone) {
        if (phone === '' || phone === null) {
          return '';
        }
        return phone;
      }
    },
    watch: {
      search(value) {
        if (value) {
          this.isSearch = true;
          this.searchWord(1, value);
        } else {
          this.isSearch = false;
          // this.getTotalUsers();
          // this.getUserList();
          this.searchWord(1, '')

        }
      },
      currentPage(val) {
        if (this.isSearch)
          this.searchWord(val, this.searchValue);
        else {
          // this.getTotalUsers();
          // this.getUserList();
          this.searchWord(val, '')

        }
      }
    },
    mounted() {
      // this.getTotalUsers();
      // this.getUserList();
      this.searchWord(1, '')
    }
  }
</script>

<style scoped>

</style>
