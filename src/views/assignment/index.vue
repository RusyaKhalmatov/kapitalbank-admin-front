<template>
  <v-flex xs12>
    <v-card min-height="600">
      <v-card-title>
        <h1>Поручения</h1>
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs12 sm12 md12 lg12 xl12>
            <v-text-field
              v-model="search"
              v-on:input="filterAssignments"
              prepend-icon="mdi-magnify"
              label="Поиск">
            </v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-data-table
              :headers="headers"
              :items="assignments"
              :pagination.sync="pagination"
              :loading="loader"
              item-key="id">
              <template v-slot:items="props">
                <tr >
                  <td>{{ props.item.user.id }}</td>
                  <td>{{ props.item.user.customerId }}</td>
                  <td>{{ props.item.user.fullName}}</td>
                  <td>{{ props.item.user.phone}}</td>
                  <td>{{ props.item.assignmentId }}</td>
                  <td>{{ props.item.created | timestampToDate }}</td>
                  <td>
                    <v-chip :color="getStatusColor(props.item.assignmentStatus)" >
                      {{ getStatusText(props.item.assignmentStatus) }}
                    </v-chip>
                    </td>
                  <td>
                    <v-btn :to="{name: 'assignmentUpdate', params: {id: props.item.assignmentId}}" icon>
                      <v-icon small>mdi-pencil</v-icon>
                    </v-btn>
                  </td>
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
import statuses, { statusesText } from "@/views/assignment/statuses";

export default {
  name: "assignment",
  data() {
    return {
      headers: [
        {text: "ID", value: "id"},
        {text: "Уникальный код", value: "customerId"},
        {text: "ФИО", value: "fullName"},
        {text: "Телефон", value: "phone"},
        {text: "ID заявки", value: "assignmentId"},
        {text: "Дата создания", value: "created"},
        {text: "Статус заявки", value: "assignmentStatus"},
      ],
      assignments: [],
      pagination: {},
      search: ""
    }
  },
  methods: {
    setAssignments() {
      this.loader = true;
      this.$store.dispatch("getAssignments")
        .then(() => this.assignments = this.$store.getters.getAssignments)
        .finally(() => this.loader = false);

    },
    filterAssignments(search) {
      const query = search.toLowerCase();
      const minLength = 3;
      if (query.length >= minLength) {
        this.assignments = this.$store.getters.getAssignments.filter(assignment => {
          const {assignmentId, user} = assignment;
          const {id, fullName, customerId, phone} = user;
          return (assignmentId.toLowerCase().includes(query))
            || (`${id}`.toLowerCase().includes(query))
            || (fullName.toLowerCase().includes(query))
            || (customerId.toLowerCase().includes(query))
            || (phone.toLowerCase().includes(query))
        });
      } else {
        this.assignments = this.$store.getters.getAssignments;
      }
    }
    ,
    getStatusColor(status) {
      return statuses.find(e => e.value === status).color;
    },
    getStatusText(status) {
      return statusesText[status];
    }
  },
  mounted() {
    this.setAssignments();
  }
}
</script>

<style scoped>
  .v-chip {
    width: 140px;
    justify-content: center;
  }
</style>
