<template>
  <v-flex xs12>
    <v-card min-height="700" style="padding-bottom: 3px;">
      <v-card-title row wrap justify-center class="align-center">
        <h1 class="text-center">Уведомление</h1>
        <p class="text-center">
          Телефонные номера: 998998573216, 998909877778, 998935449116,
          998909180169, 998991013968, 998931093968
        </p>
        <v-btn icon small @click="redirect('notification')">
          <v-icon small>mdi-arrow-left</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-layout row wrap justify-center>
          <v-flex xs8 md8 sm12>
            <v-flex xs12>
              <img :src="data.imageUrl" height="50px" />

              <v-file-picker
                v-model="newImage"
                accept="image/*"
                label="Изображение"
              >
              </v-file-picker>
            </v-flex>
            <v-flex xs12>
              <v-layout row wrap>
                <v-flex>
                  <v-radio-group v-model="selected" row class="text-center">
                    <v-radio label="Получатель" value="recipient_phone" />
                    <v-radio
                      label="Получатели из файла"
                      value="recipient_phones"
                    />
                  </v-radio-group>

                  <template v-if="selected === 'recipient_phone'">
                    <v-layout row wrap>
                      <v-flex xs10>
                        <v-text-field
                          v-model="data.phone"
                          autofocus
                          :disabled="all"
                          label="Получатель(телефон)"
                          placeholder="998(90) 999-99-99"
                          mask="###(##) ###-##-##"
                        >
                        </v-text-field>
                      </v-flex>
                      <v-flex xs2>
                        <v-checkbox v-model="all" label="Отправить всем">
                        </v-checkbox>
                      </v-flex>
                    </v-layout>
                  </template>
                  <template v-if="selected === 'recipient_phones'">
                    <div class="text-center file">
                      <input
                        type="file"
                        autofocus
                        accept=".xlsx"
                        @change="onFileContentChange($event)"
                        ref="fileupload"
                      />
                      <div class="file-content" v-if="fileContentRowsLength">
                        Загружено строк:
                        <strong>{{ fileContentRowsLength }}</strong>
                      </div>
                    </div>
                  </template>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <v-text-field v-model="data.title" label="Заголовок">
              </v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                v-model="data.shortDescription"
                label="Краткое описание"
              >
              </v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-select
                :items="notificationTypes"
                v-model="data.notificationType"
                label="Тип уведомления"
              >
              </v-select>
            </v-flex>
            <v-flex xs12>
              <v-radio-group v-model="data.lang" row>
                <v-radio key="RU" label="Русский" value="RU" />
                <v-radio key="EN" label="Английский" value="EN" />
                <v-radio key="UZ" label="Узбекский" value="UZ" />
              </v-radio-group>
            </v-flex>
            <v-flex xs12 class="quill-container pb-3">
              <quill-editor v-model="data.body" />
            </v-flex>
            <v-flex xs12>
              <v-btn color="primary" dark @click="save">Сохранить</v-btn>
            </v-flex>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-divider></v-divider>
      <div class="notifications">
        <span
          class="notification-child"
          v-for="(item, index) in lastData"
          :key="index"
        >
          <span class="notification-header">
            <h3>№ {{ item.id }}</h3>
            <p class="notification-header-child">Язык: {{ item.lang }}</p>
          </span>
          <img class="image-url" :src="item.imageUrl" alt="image" />
          <h2>{{ item.title }}</h2>
          <p class="notification-body">{{ item.body }}</p>
        </span>
      </div>
    </v-card>
  </v-flex>
</template>

<script>
import XLSX from 'xlsx';

export default {
  name: 'NotificationForm',
  data() {
    return {
      newImage: '',
      data: {},
      phone: '',
      all: false,
      notificationTypes: [],
      lastData: [],
      id: '',
      file: '',
      selected: 'recipient_phone',
      fileContentRowsLength: null
    };
  },
  methods: {
    onFileContentChange(e) {
      const files = e.target.files || e.dataTransfer.files;

      if (!files.length) {
        this.$refs.fileupload.value = null;
        this.file = '';
      } else this.file = files[0];

      let self = this;
      const reader = new FileReader();

      reader.onload = function(e) {
        const contents = e.target.result;

        var workbook = XLSX.read(contents, {
          type: 'binary'
        });

        var sheet = workbook.Sheets[workbook.SheetNames[0]];

        Object.keys(sheet).forEach(function(s) {
          if (sheet[s].w) {
            delete sheet[s].w;
            sheet[s].z = '0';
          }
        });

        workbook.SheetNames.forEach(function(sheetName) {
          var XL_row_object = XLSX.utils.sheet_to_json(
            workbook.Sheets[sheetName],
            {header: 'A'}
          );
          const result = XL_row_object.map((el) => el['A'].toString());

          if (result && result.length) {
            self.fileContentRowsLength = result.length;
          }

          self.data['phoneNumbers'] = result;
        });
      };
      reader.readAsBinaryString(this.file);
    },

    sendDataWithRecepiens() {
      if (!this.data['phoneNumbers']) {
        return;
      }

      let self = this;

      const formData = {
        body: this.data.body,
        imageUrl: this.data.imageUrl,
        lang: this.data.lang,
        notificationType: this.data.notificationType,
        phoneNumbers: this.data.phoneNumbers,
        shortDescription: this.data.shortDescription,
        title: this.data.title
      };

      this.$http
        .post(
          this.$store.getters.apiUrl + `/notification/directPushFromFile`,
          JSON.stringify(formData),
          {headers: {'Content-Type': 'application/json'}}
        )
        .then(() => {
          this.successMessage('Успешно');
          setTimeout(self.redirect('notification'), 1000);
        }, this.handleError);
    },

    loadNotificationTypes() {
      let self = this;
      self.$http
        .get(self.$store.getters.apiUrl + '/notification/notificationTypes')
        .then((response) => {
          self.notificationTypes = response.data.data;
        }, self.handleError);
    },

    save() {
      let self = this;

      if (self.selected === 'recipient_phones') {
        self.sendDataWithRecepiens();
        return;
      }

      if (self.all === true) {
        self.$http
          .post(
            self.$store.getters.apiUrl + '/notification/push/common/byParam',
            self.data
          )
          .then(() => {
            self.redirect('notification');
          }, self.handleError);
      } else {
        self.$http
          .post(
            self.$store.getters.apiUrl +
              `/notification/push/direct/${self.data.phone}`,
            self.data
          )
          .then(() => {
            self.redirect('notification');
          }, self.handleError);
      }
    },

    getLast() {
      this.$http
        .get(this.$store.getters.apiUrl + `/notification/last?size=5`)
        .then((response) => {
          // console.log(response.data.data)
          this.lastData = response.data.data;
        }, this.handleError);
    },

    isNumber: function(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    }
  },

  mounted() {
    if (this.$route.params.notification) {
      this.data = this.$route.params.notification;
    }
    this.loadNotificationTypes();
    this.getLast();
  },

  watch: {
    newImage(image) {
      let self = this;
      if (image.length > 0) {
        let reader = new FileReader();
        reader.onload = (e) => {
          self.$set(self.data, 'imageUrl', e.target.result);
        };

        reader.readAsDataURL(image[0]);
      }
      self.$set(self.data, 'imageUrl', '');
    },
    selected(selectedText) {
      if (selectedText === 'recipient_phone') {
        this.fileContentRowsLength = null;
        this.fileData = null;
      }
    }
  }
};
</script>

<style scoped>
.quill-container {
  height: 400px;
}

.quill-container > .quill-editor {
  height: 320px;
}
.image-url {
  width: 70px;
  height: 70px;
}
.notification-body {
  max-height: 80px;
  overflow: auto;
}
.notification-child {
  border: 1px solid silver;
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 10px;
  margin: 10px;
}
.notification-header {
  display: flex;
}
.notification-header-child {
  margin: 0 10px;
}
.send-notification {
  margin: 5px 17px 0;
  padding: 5px;
}
.notification-id {
  width: 385px;
}

.text-center {
  width: 100%;
  text-align: center;
  align-items: center;
  justify-content: center;
}

.align-center {
  display: flex;
  align-items: center;
}

.file {
  color: rgba(0, 0, 0, 0.54);
  font: 16px 'Roboto', sans-serif;
}

.file input[type='file']:focus {
  color: red;
}

.file-content {
  margin: 20px 0;
}
</style>
