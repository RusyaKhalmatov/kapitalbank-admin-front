<template>
    <v-layout column wrap>
        <v-card min-height="500">
            <v-card-title>
                <h1>Мой профиль</h1>
            </v-card-title>
            <v-layout row wrap>
                <v-card-text>
                    <v-flex xs12>
                        <v-text-field
                                v-model="phoneNumber"
                                label="Логин"
                                disabled>
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field
                                disabled
                                v-model="firstname"
                                label="Имя">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field
                                disabled
                                v-model="lastname"
                                label="Фамилия">
                        </v-text-field>
                    </v-flex>
                </v-card-text>
            </v-layout>
            <div class="change-password">
                <h3 style="text-align: center;">Изменить пароль</h3>
                <v-text-field
                    class="password-child"
                    v-model="oldPassword"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show1 ? 'text' : 'password'"
                    name="input-10-1"
                    label="Старый пароль"
                    @click:append="show1 = !show1"
                ></v-text-field>
                <div class="new-password-box">
                    <v-text-field
                        class="password-child"
                        v-model="newPassword"
                        :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show2 ? 'text' : 'password'"
                        name="input-10-1"
                        label="Новый пароль"
                        @click:append="show2 = !show2"
                    ></v-text-field>
                    <v-text-field
                        class="password-child"
                        v-model="confirmPassword"
                        :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show3 ? 'text' : 'password'"
                        name="input-10-1"
                        label="Подтверждение пароля"
                        @click:append="show3 = !show3"
                    ></v-text-field>                  
                </div>
                <v-btn class="save-button" @click="changePassword">Сохранить</v-btn>
            </div>                 
        </v-card>
    </v-layout>
</template>

<script>
    export default {
        name: "profile",
        data() {
            return {
                phoneNumber: null,
                firstname: null,
                lastname: null,
                password: "",
                userInfo: [],
                newPassword: '',
                oldPassword: '',
                confirmPassword: '',
                show1: false,
                show2: false,
                show3: false,
            }
        },
        methods: {
            getUserInfo() {
                let self = this;
                self.$http.get(self.$store.getters.newApiUrl + "/user")
                    .then(response => {
                        console.log(response.data)

                        self.userInfo = response.data.data;
                        self.phoneNumber = self.userInfo.phoneNumber;
                        self.firstname = self.userInfo.firstName;
                        self.lastname = self.userInfo.lastName;
                        this.$store.commit('userName', self.userInfo.firstName + " " + self.userInfo.lastName);
                        this.$store.commit('userId', self.userInfo.userId);
                    }, self.handleError);
            },
            changePassword(){
                let self = this;

                if(this.newPassword===this.confirmPassword&&this.oldPassword&&this.newPassword){
                    let formData = {
                        "newPassword": this.newPassword,
                        "oldPassword": this.oldPassword,
                        "userId": self.userInfo.userId,
                    }
                    self.$http.put(self.$store.getters.newApiUrl + "/user/change-password", formData)
                    .then(response => {
                        if(response.status===200){
                            self.oldPassword = '';
                            self.newPassword = '';
                            self.confirmPassword = '';
                            self.logout();
                        }
                    }, self.handleError)
                
                }
                
            },
            logout() {
                let self = this;
                self.$http.post(self.$store.getters.newApiUrl + "/logout")
                    .then(response => {
                        if(response){
                            self.$store.commit('token', '');
                            self.$store.commit('deviceId','');
                            self.redirect('login')
                        }
                    }, self.handleError);
            }
        },
        mounted() {
            this.getUserInfo();
        }
    }
</script>

<style scoped>
    .save-button{
        margin: 15px auto;
    }
    .change-password{
        width: 500px;
        padding: 0 15px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
            -ms-flex-direction: column;
                flex-direction: column;
    }
    .new-password-box{
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
    }
    .password-child{
        margin: 0 10px;
    }
</style>