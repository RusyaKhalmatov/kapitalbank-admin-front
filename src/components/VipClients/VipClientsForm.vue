<template>
  <v-flex xs12>
    <v-card min-height="600">
      <v-card-title>
        <h1>VIP-пользователей</h1>
        <v-spacer></v-spacer>
        <v-btn icon small @click="redirect('vipClients')">
          <v-icon small>mdi-arrow-left</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs12>
            <v-layout row wrap>
              <v-btn dark color="primary" @click="redirect('clients')">Пользователи</v-btn>
              <v-text-field
                v-model="user.fullName"
                disabled
                label="Пользователь">
              </v-text-field>
            </v-layout>
          </v-flex>
          <v-flex xs12>
            <v-select
              label="Код операции"
              :items="operationCode"
              v-model="limitUser.operation_code"
              multiple>
              <template v-slot:prepend-item>
                <v-list-tile ripple @click="toggle">
                  <v-list-tile-action>
                    <v-icon :color="limitUser.operation_code.length > 0 ? 'primary' : ''">{{ icon }}</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>Select All</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-divider class="mt-2"></v-divider>
              </template>

            </v-select>

          </v-flex>
          <v-btn dark color="success" large @click="save()">Сохранить</v-btn>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
export default {
  name: "VipClientsForm",
  data() {
    return {
      user: {},
      limitUser: {user_id: '', operation_code: []},
      operationCode: []
    }
  },
  computed: {
    likesAllFruit() {
      return this.limitUser.operation_code.length === this.operationCode.length
    },
    likesSomeFruit() {
      return this.limitUser.operation_code.length > 0 && !this.likesAllFruit
    },
    icon() {
      if (this.likesAllFruit) return 'mdi-close-box'
      if (this.likesSomeFruit) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    }
  },
  methods: {
    toggle() {
      this.$nextTick(() => {
        if (this.likesAllFruit) {
          this.limitUser.operation_code = [];
        } else {
          this.limitUser.operation_code = this.operationCode;
        }
      })
    },
    getOperationCode() {
      let self = this;
      self.$http.get(self.$store.getters.newApiUrl + '/operationCode')
        .then(response => {
          self.filterOperationCode(response.data.data);

        }, self.handleError);
    },
    filterOperationCode(operationCodes) {
      let self = this;
      for (let i = 0; i < operationCodes.length; i++) {
        self.operationCode.push(operationCodes[i].operationCode);
      }
      // console.log(self.operationCode)
      this.limitUser.operation_code = ['UNK2VFK', 'UNU2VFK', 'HNK2VFK', 'HNU2VFK', 'WNK2VFK', 'ANK2VFK']
    },
    save() {
      let self = this;
      self.$http.put(self.$store.getters.newApiUrl + '/limit/vipUser', self.limitUser)
        .then(() => {
          self.redirect('vipClients');
        }, self.handleError);
    }
  },
  mounted() {
    this.getOperationCode();
    if (this.$route.params.userLimit) {
      this.user = this.$route.params.userLimit;
      this.limitUser.user_id = this.user.id;
    }
  }
}
</script>

<style scoped>

</style>
