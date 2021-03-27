<template>
  <div class="main">
    <h1 class="headline">Управление кэшем</h1>
    <div>
            <span v-for="(item, i) in data" :key="i">
                <v-card class="box">
                    <p>{{item}}</p>
                    <v-btn @click="openDeleteBox(item)" small>Очистить</v-btn>
                </v-card>    
            </span>

    </div>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Вы действительно хотите удалить?</v-card-title>
        <v-card-actions style="text-align: center">
          <v-spacer></v-spacer>
          <v-btn @click="clearCache" :loading="loader">Да</v-btn>
          <v-btn text @click="dialog = false">Нет</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'Cache',
    data() {
      return {
        data: [],
        loader: false,
        cache: '',
        dialog: false,
      }
    },
    watch: {
      dialog(val) {
        if (!val) {
          this.cache = '';
        }
      }
    },
    computed: {
      ...mapState(['prodApiUrl'])
    },
    methods: {
      openDeleteBox(val) {
        this.cache = val;
        this.dialog = true;
      },
      getCache() {
        this.loader = true;
        this.$http.get(`${this.prodApiUrl}/cache`)
          .then(response => {
            console.log(response.data.data);
            this.data = response.data.data;
            this.loader = false;
          }, this.handleError)
      },
      clearCache() {
        this.loader = true;
        console.log(this.$store.getters.cacheToken);
        this.$http.post(`${this.prodApiUrl}/cacheClear/${this.cache}`, {'token': this.$store.getters.cacheToken})
          .then(response => {
            this.getCache();
            this.loader = false;
            this.dialog = false;
            this.$store.commit('successMessage', 'Успешно')
          }, this.handleError)
      }
    },
    mounted() {
      this.getCache();
    },
  }
</script>

<style scoped>
  .main {
    width: 100%;
  }

  .headline {
    text-align: center;
  }

  p {
    margin: 0;
    width: 200px;
    font-weight: 600;
  }

  .box {
    display: flex;
    align-items: center;
    max-width: 345px;
    margin: 15px;
    padding: 15px;
    border-radius: 10px;
  }

  .box:hover {
    box-shadow: 0px 0px 25px 0px rgb(171, 171, 171);
    cursor: pointer;
    color: #FFB446;
  }
</style>
