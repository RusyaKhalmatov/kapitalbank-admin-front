<template>
    <v-flex xs12>
        <v-card min-height="600">
            <v-card-title>
                <h1>Неудачная Регистрация</h1>
                <v-spacer/>
                <v-btn icon small @click="redirect('report')">
                    <v-icon small>mdi-arrow-left</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <v-layout column wrap>

                    <v-flex xs12>
                    <v-progress-circular style="height:30px; width: 30px;"
                        v-if="excelLoader"
                        indeterminate
                        color="amber"
                    ></v-progress-circular>
                    <download-excel
                            v-else
                            name="failedRegistration"
                            :fields="excelHeader"
                            :data="excelData">
                        <v-btn icon dark color="secondary">
                            <v-icon>mdi-file-excel</v-icon>
                        </v-btn>
                    </download-excel>
                        <v-data-table
                                :headers="failedRegisterHeader"
                                :items="failedData"
                                :loading="loader"
                                hide-actions
                        >
                            <template slot="items" slot-scope="props">
                                <tr>
                                    <td>{{props.item.id}}</td>
                                    <td>{{props.item.phone}}</td>
                                    <td>{{props.item.details}}</td>
                                    <td>{{props.item.dateTime | timestamp-to-date}}</td>
                                    <td><v-btn @click="getUserInfo(props.item.userInfo)">Подробнее</v-btn></td>

                                </tr>
                            </template>
                        </v-data-table>
                        <v-pagination
                        class="center"
                        v-model="page"
                        :length="totalPages"
                        :total-visible="10"
                        ></v-pagination>
                    </v-flex>
                </v-layout>
            </v-card-text>
        </v-card>
        <div v-if="isShow" class="user-info">
            <img draggable="false" @click="reload" src="@/assets/cancel.png" class="exit-icon" alt="">
            <h3 class="text-header">Пользовательские данные</h3>
            <span class="user-info-content" v-if="userData">
                <span class="user-info-box">
                    <p class="user-info-child">Имя</p>
                    <p class="user-info-child">{{userData.firstName}}</p>
                </span>
                <span class="user-info-box">
                    <p class="user-info-child">Фамилия</p>
                    <p class="user-info-child">{{userData.lastName}}</p>
                </span>
                <span class="user-info-box">
                    <p class="user-info-child">Пароль</p>
                    <p class="user-info-child">{{userData.password}}</p>
                </span>
                <span class="user-info-box">
                    <p class="user-info-child">Номер телефона</p>
                    <p class="user-info-child">{{userData.phone}}</p>
                </span>
                <span class="user-info-box">
                    <p class="user-info-child">email</p>
                    <p class="user-info-child">{{userData.email}}</p>
                </span>
                <span class="user-info-box">
                    <p class="user-info-child">Секретное слово</p>
                    <p class="user-info-child">{{userData.secretWord}}</p>
                </span>
            </span>
            <p v-if="!userData" style="text-align:center;">Пусто</p>
        </div>
    </v-flex>
</template>

<script>
    export default {
        name: "FailedRegistration",
        data() {
            return {
                failedRegisterHeader: [
                    {text: "ID", value: "id"},
                    {text: "Телефон", value: "phone"},
                    {text: "Детали", value: "details"},
                    {text: "дата и время", value: "dateTime"},
                    {text: "Пользовательские данные", value: "userInfo"}
                ],
                excelHeader: {
                    "ID": "id",
                    "Телефон": "phone",
                    "Детали": "details",
                    "Дата и время": "dateTime",
                    "Пользовательские данные": "userInfo",
                },
                failedData: [],
                pagination: {
                    rowsPerPage: 20
                },
                search: '',
                userData: {},
                isUser: false,
                isShow: false,
                totalPages: 0,
                page: 1,
                excelData: [],
                excelTotalPage: 0,
                excelPage: 1,
                excelLoader: true,
            }
        },
        watch:{
            page(val){
                this.getFailedRegistration(val);
            }
        },
        methods: {
            reload(){
                this.isShow = false;
                this.userData = {};
            },
            getFailedRegistration(page) {
                let self = this;
                self.$http.get(self.$store.getters.newApiUrl + `/failedRegistration/v2?page=${page-1}&size=10`, {})
                    .then(response => {
                        self.loader = false;
                        self.failedData = response.data.data.content;
                        // self.failedData = response.data.data.content;
                        self.totalPages = response.data.data.totalPages;
                    }, self.handleError);
            },
            getExcelData(){
                let self = this;
                self.$http.get(self.$store.getters.newApiUrl + `/failedRegistration`)
                .then(response => {
                    response.data.data.forEach(item=>{
                        self.excelData.push({id: item.id, phone: item.phone, details: item.details,dateTime: item.dateTime, userInfo: JSON.stringify(item.userInfo)})
                    })
                    // self.excelData = response.data.data;
                    // for(var i = 0; i<=25000;i++){
                    //     self.excelData.push({id: i})
                    // }
                    console.log(self.excelData)
                    // response.data.data.content.forEach(item => {
                    //     let date = new Date(item.dateTime);
                    //     item.dateTime = date.toLocaleString();

                    //     self.excelData.push(item);
                    // });
                    // self.excelData.sort(self.compare);

                    self.excelLoader = false;




                }, self.handleError);
            },
            compare(a, b) {
                if (a.dateTime > b.dateTime) {
                    return -1;
                }
                if (a.dateTime < b.dateTime) {
                    return 1;
                }
                return 0;
            },
            getUserInfo(userInfo){
                this.isShow = true;
                if(userInfo===null){
                    this.userData = null;
                }
                else{
                    this.userData = JSON.parse(userInfo);
                }

            }
        },
        mounted() {
            let userId = this.$store.getters.userId
            // console.log(this.$store.getters.roles)
            if(userId==='630'||userId==='631'||userId==='632'||this.$store.getters.roles==='ADMIN'){
                this.getFailedRegistration(1);
                this.getExcelData();
            }

        }
    }
</script>

<style scoped>
    .center{
        display: flex;
        justify-content: center;
        margin: 15px;
    }
    .text-header{
        text-align: center;
        font-weight: 700;
        margin: 20px 0 20px;
    }
    .exit-icon{
        width: 17px;
        height: 17px;
        margin: 5px;
        cursor: pointer;
        float: right;
    }
    .user-info{
        width: 415px;
        background: white;
        position: fixed;
        left: 50%;
        top: 150px;
        -webkit-transform: translateX(-50%);
        transform: translateX(-50%);
        box-shadow: 0px 0px 18px 0px rgba(158, 158, 158, 0.75);
        border-radius: 5px;
    }
    .user-info-child{
        margin: 10px;
    }
    .user-info-box{
        display: flex;
        margin: 0px 15px;
        justify-content: space-between
    }
    .user-info-content{
        display: flex;
        flex-direction: column;
        padding: 0 0 15px;
    }
</style>
