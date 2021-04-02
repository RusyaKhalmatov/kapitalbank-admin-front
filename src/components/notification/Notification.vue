<template>
  <v-flex xs12>
    <v-card min-height="600">
      <v-card-title>
        <h1>Уведомление</h1>
        <v-spacer></v-spacer>
        Добавить уведомление
        <v-btn icon @click="redirect('notificationForm')" class="primary">
          <v-icon small>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs12>
            <v-data-table
              :headers="notificationHeaders"
              :items="result"
              :loading="loader"
              :search="search"
              :pagination.sync="pagination"
              :item-key="result.subjectId"
            >
              <template slot="items" slot-scope="props">
                <tr @click="props.expanded = !props.expanded">
                  <td v-if="props.item.phone !== ''">{{ props.item.phone }}</td>
                  <td v-else>Все</td>
                  <td>{{ props.item.title }}</td>
                  <td>{{ props.item.shortDescription }}</td>
                  <td>{{ props.item.notificationType }}</td>
                  <td>
                    <!-- {{ props.item.dateTime | (timestamp - to - date) }} -->
                    <span class="one_line">{{
                      converTimestampToDate(props.item.dateTime)
                    }}</span>
                  </td>
                  <!-- <td>
                    <v-btn
                      icon
                      small
                      :to="{
                        name: 'notificationForm',
                        params: {notification: props.item}
                      }"
                    >
                      <v-icon small>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      small
                      @click="deleteNotification(props.item.id)"
                    >
                      <v-icon small>mdi-delete</v-icon>
                    </v-btn>
                  </td> -->
                </tr>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
export default {
  name: 'Notification',
  data() {
    return {
      newImage: '',
      search: '',
      result: [],
      pagination: {
        sortBy: 'dateTime',
        descending: true
      },
      notificationHeaders: [
        {text: 'Получатель', value: 'phone'},
        {text: 'Заголовок', value: 'title'},
        {text: 'Краткое описание', value: 'shortDescription'},
        {text: 'Тип уведомления', value: 'notificationType'},
        {text: 'Дата и время', value: 'dateTime'}
        // {text: 'Действия', sortable: false}
      ]
    };
  },
  methods: {
    converTimestampToDate(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleString();
    },
    getAllNotifications() {
      let self = this;
      self.$http
        .get(self.$store.getters.apiUrl + '/notification/push/all')
        .then((response) => {
          self.loader = false;
          self.result = response.data.data;
        }, self.handleError);
    },
    deleteNotification(id) {
      let self = this;
      self.$http
        .delete(self.$store.getters.apiUrl + `/notification/${id}`)
        .then(() => {
          self.redirect('notification');
          location.reload();
        }, self.handleError);
    }
  },
  mounted() {
    this.getAllNotifications();
  }
};
</script>

<style scoped>
.one_line {
  white-space: nowrap;
}
</style>
