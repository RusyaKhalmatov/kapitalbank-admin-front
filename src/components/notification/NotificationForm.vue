<template>
    <v-flex xs12>
        <v-card min-height="700" style="padding-bottom: 3px;">
            <v-card-title>
                <h1>Уведомление</h1>
                <v-spacer></v-spacer>
                <v-btn icon small @click="redirect('notification')">
                    <v-icon small>mdi-arrow-left</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <p>Телефонные номера: 998998573216, 998909877778, 998935449116, 998909180169, 998991013968, 998931093968</p>
                <v-layout row wrap justify-center>
                    <v-flex xs8 md8 sm12>
                        <v-flex xs12>
                            <img :src="data.imageUrl" height="50px"/>
                            <v-file-picker
                                    :disabled="loader"
                                    v-model="newImage"
                                    accept="image/*"
                                    label="Изображение">
                            </v-file-picker>
                        </v-flex>
                        <v-flex xs12>
                            <v-layout row wrap>
                                <v-flex xs10>
                                    <v-text-field
                                            v-model="phone"
                                            :disabled="all"
                                            label="Логин">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs2>
                                    <v-checkbox v-model="all"
                                                label="Отправить всем">
                                    </v-checkbox>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field
                                    v-model="data.title"
                                    label="Заголовок">
                            </v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field
                                    v-model="data.shortDescription"
                                    label="Краткое описание">
                            </v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-select :items="notificationTypes"
                                      v-model="data.notificationType"
                                      label="Тип уведомления">
                            </v-select>
                        </v-flex>
                        <v-flex xs12>
                            <v-radio-group v-model="data.lang" row>
                                <v-radio key="RU" label="Русский" value="RU"/>
                                <v-radio key="EN" label="Английский" value="EN"/>
                                <v-radio key="UZ" label="Узбекский" value="UZ"/>
                            </v-radio-group>
                        </v-flex>
                        <v-flex xs12 class="quill-container pb-3">
                            <quill-editor v-model="data.body"/>
                        </v-flex>
                        <v-flex xs12>
                            <v-btn color="primary" dark @click="save">Сохранить</v-btn>
                        </v-flex>
                    </v-flex>
                </v-layout>
            </v-card-text>
            <v-divider></v-divider>
            <div class="send-notification">
                <h3>Отправка пуш-уведомления по списку файла</h3>
                <v-text-field @keypress="isNumber($event)" class="notification-id" v-model="id" label="Номер пуш-уведомления"></v-text-field>
                <input class="file" type="file"  accept="text/plain" @change="onFileChange($event)" ref="fileupload">
                <v-btn @click="sendFile"> Отправить</v-btn>
            </div>
            <div class="notifications">
                <span class="notification-child" v-for="(item,index) in lastData" :key="index">
                    <span class="notification-header">
                        <h3>№ {{item.id}}</h3>
                        <p class="notification-header-child">Язык: {{item.lang}}</p>
                    </span>
                    <img class="image-url" :src="item.imageUrl" alt="image">
                    <h2>{{item.title}}</h2>
                    <p class="notification-body">{{item.body}}</p>

                </span>
            </div>
        </v-card>
    </v-flex>
</template>

<script>
    export default {
        name: "NotificationForm",
        data() {
            return {
                newImage: "",
                data: {},
                phone: "",
                all: false,
                notificationTypes: [],
                lastData: [],
                id:'',
                file: '',
            }
        },
        methods: {
            loadNotificationTypes() {
                let self = this;
                self.$http.get(self.$store.getters.apiUrl + '/notification/notificationTypes')
                    .then(response => {
                        self.notificationTypes = response.data.data;
                    }, self.handleError);
            },
            save() {
                let self = this;
                if (self.all === true) {
                    self.$http.post(self.$store.getters.apiUrl + '/notification/push/common/byParam', self.data)
                        .then(() => {
                            self.redirect('notification');
                        }, self.handleError);
                } else {
                    self.$http.post(self.$store.getters.apiUrl + `/notification/push/direct/${self.phone}`, self.data)
                        .then(() => {
                            self.redirect('notification');
                        }, self.handleError);
                }
            },
            getLast(){
                this.$http.get(this.$store.getters.apiUrl+`/notification/last?size=5`)
                .then(response=>{
                    // console.log(response.data.data)
                    this.lastData = response.data.data;
                    
                }, this.handleError)
            },
            onFileChange(e) {

                const files = e.target.files || e.dataTransfer.files
                if (!files.length){
                    this.$refs.fileupload.value = null;
                    this.file = '';
                }
                else
                    this.file = files[0];
                // this.sendFile(files[0]);
            },
            sendFile(){
                if(this.id){
                    console.log(this.file);
                    let data = new FormData();
                    data.append("file", this.file);
                    this.$http.post(this.$store.getters.apiUrl + `/notification/fromFile/${this.id}`, data,  {headers: {'Content-Type': 'multipart/form-data'}})
                    .then((response) => {
                        //console.log(response.data.data);
                        this.successMessage("Успешно");                        
                        setTimeout(() => {
                            this.$refs.fileupload.value = null;
                            this.file = '';
                            this.id = '';
                            this.getLast();
                        }, 500);
                    }, this.handleError);
                }
                else{
                    this.$store.commit('errorMessage', 'Номер уведомления не выбран')
                }
            },
            isNumber: function(evt) {
                evt = (evt) ? evt : window.event;
                var charCode = (evt.which) ? evt.which : evt.keyCode;
                if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                    evt.preventDefault();
                } else {
                    return true;
                }
            },
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
                    reader.onload = e => {
                        self.$set(self.data, 'imageUrl', e.target.result);
                    };

                    reader.readAsDataURL(image[0]);
                }
                self.$set(self.data, 'imageUrl', '');
            }
        }
    }
</script>

<style scoped>
    .quill-container {
        height: 400px;
    }

    .quill-container > .quill-editor {
        height: 320px;
    }
    .image-url{
        width: 70px;
        height: 70px;
    }
    .notification-body{
        max-height: 80px;
        overflow: auto;
    }
    .notification-child{
        border: 1px solid silver;
        display: flex;
        flex-direction: column;
        padding: 10px;
        border-radius: 10px;
        margin: 10px;
    }
    .notification-header{
        display: flex;
    }
    .notification-header-child{
        margin: 0 10px;
    }
    .send-notification{
        margin: 5px 17px 0;
        padding: 5px;
    }
    .notification-id{
        width: 385px;
    }
</style>
