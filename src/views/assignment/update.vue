<template>
  <v-flex xs12>
    <v-card min-height="600" :loading="true" v-if="assignment">

      <v-card-title>

        <h1>Поручениe</h1>

        <v-spacer></v-spacer>

        <v-btn icon large @click="redirect('assignment')">
          <v-icon large>mdi-arrow-left</v-icon>
        </v-btn>

      </v-card-title>

      <v-card-text >

        <v-text-field :value="assignment.assignmentId" label="ID заявки" readonly />
        <v-text-field :value="convertDate(assignment.created)" label="Дата создания" readonly />
        <v-text-field :value="assignment.user.id" label="ID Пользователя" readonly />
        <v-text-field :value="assignment.user.customerId" label="Уникальный код пользователя" readonly />
        <v-text-field :value="assignment.user.fullName" label="Ф.И.О" readonly />
        <v-text-field :value="assignment.user.phone" label="Телефон пользователя" readonly />

        <v-select
          v-model="status"
          :value="status"
          :items="getStatuses(assignment.assignmentStatus)"
          :background-color="getStatusColor(status)"
          item-text="text"
          item-value="value"
          label="Статус заявки"
          single-line
        />

        <v-textarea
          class="failedMessage"
          v-if="status === 'FAILED'"
          v-model="failedMessage"
          outlined
          name="failedMessage"
          label="Причина отказа"
          :disabled="assignment.assignmentStatus === 'FAILED'"
          rows="3"
        />

        <v-btn @click="download(assignment.pdf)">
          <v-icon >mdi-download</v-icon> Поручение {{assignment.pdf.split('/').pop()}}
        </v-btn>

        <v-card v-if="assignment.assignmentCommentList.length" class="comments">

          <h2>Комментарии заявителя:</h2>

          <template v-for="(item, index) in assignment.assignmentCommentList">

            <v-card v-bind:key="index" class="comment">

              <v-toolbar color="grey" dark dense flat>
                <v-toolbar-title class="text-body-2">
                  {{ item.created | timestampToDate }}
                </v-toolbar-title>
              </v-toolbar>
              <v-card-text>{{ item.message }}</v-card-text>

            </v-card>

          </template>

        </v-card>

        <v-card v-if="assignment.assignmentDocumentList.length" class="documents">

          <h2>Прикрепленные документы:</h2>
          <v-item-group class="document">
            <template v-for="(item) in assignment.assignmentDocumentList">

              <v-item :key="item.url">
                <v-btn @click="download(item.url)" >
                  <v-icon name="document-icon">mdi-download</v-icon>{{item.url.split('/').pop()}}
                </v-btn>
              </v-item>

            </template>
          </v-item-group>


        </v-card>

        <v-textarea
          class="finalDetail"
          rows="8"
          v-model="finalDetail"
          outlined
          name="finalDetail"
          label="Финальный комментарий"
          :disabled="disableDetails(status)"
        />
      </v-card-text>

      <v-card-actions>
        <v-btn
          color="yellow lighten-2"
          text
          @click="updateAssignment()"
          :disabled="disableButton()"
        >
          Обновить
        </v-btn>
      </v-card-actions>

    </v-card>
  </v-flex>
</template>

<script>

import moment from "moment";
import statuses, {statusesValue} from "@/views/assignment/statuses";

export default {
  name: "update",
  data() {
    return {
      status: "",
      finalDetail: "",
      failedMessage: "",
      assignment: {
        assignmentId: "",
        assignmentStatus: "",
        pdf: "",
        finalDetail: "",
        assignmentDocumentList: [ { url: "" } ],
        assignmentCommentList: [ { message: "", created: 0 } ],
        created: "",
        user: {
          id: "",
          fullName: "",
          customerId: "",
          phone: "",
        }
      }
    }
  },
  methods: {
    setAssignmentData() {
      const { id } = this.$route.params;
      this.$store.dispatch("getAssignment", {id})
        .then(() => {
          this.assignment = this.findAssignmentById(id);
          this.status = this.assignment.assignmentStatus;
          this.finalDetail = this.assignment.finalDetail;
        })
    },
    findAssignmentById(id) {
      return this.$store.getters.getAssignments.find((assignment) => assignment.assignmentId === id);
    },
    getStatuses(status) {
      const {ACCEPTED, FAILED, SUCCESS} = statusesValue
      if (status === ACCEPTED) {
        const values = [ACCEPTED, SUCCESS, FAILED];
        const enabled = [SUCCESS, FAILED];
        return statuses
          .filter(e => values.includes(e.value))
          .map(e => enabled.includes(e.value) ? {...e, disabled: false} : e);
      }
      return statuses.filter(e => e.value === status);
    },
    getStatusColor(status) {
      return status ? statuses.find(e => e.value === status).color : "";
    },
    download(url) {
      window.open(url, '_blank');
    },
    updateAssignment() {
      const {PENDING, WAITING, SUCCESS, FAILED} = statusesValue;
      const data = {assignmentId: this.assignment.assignmentId};
      if ([PENDING, WAITING].includes(this.status)) {
        data.finalDetail = this.finalDetail;
        this.updateData("/assignment/update", data);
      }
      if([SUCCESS, FAILED].includes(this.status)) {
        data.assignmentStatus = this.status;
        if(this.status === statusesValue.FAILED) {
          data.errorMessage = this.failedMessage;
        }
        this.updateData("/assignment/updateStatus", data)
      }
    },
    updateData(url, data) {
      this.$http.post(`${this.$store.getters.apiUrl}${url}`, data)
        .then(response => this.successMessage(response.data.data.message), this.handleError)
        .then(() => this.redirect('assignment'));
    },
    disableButton() {
      return [statusesValue.SUCCESS, statusesValue.FAILED].includes(this.assignment.assignmentStatus)
        || (this.status === statusesValue.ACCEPTED && this.assignment.assignmentStatus === statusesValue.ACCEPTED)
        || (this.status === statusesValue.FAILED && !this.failedMessage.length);
    },
    disableDetails(status) {
      return [statusesValue.FAILED, statusesValue.SUCCESS, statusesValue.ACCEPTED].includes(status);
    }
  },
  beforeMount() {
    this.setAssignmentData();

  }
}
</script>

<style scoped>

.failedMessage, .finalDetail, .comments, .documents {
  margin-top: 15px;
}

.comments {
  padding-bottom: 20px;
}

.comments h2, .documents h2 {
  margin-left: 20px;
}

.comment {
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 10px;
}

.document:first-of-type {
  margin-left: 20px;
}

</style>
