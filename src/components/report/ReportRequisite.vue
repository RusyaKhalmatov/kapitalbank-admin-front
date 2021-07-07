<template>
    <div class="main">
        <h1 class="headline">Отчет по реквизитам</h1>
        <date-component @date="getDate"></date-component>
        <!-- <date-select description="" @date="getDate"></date-select> -->
        <!-- <v-tabs fixed-tabs>
            <v-tab
            v-for="(type, index) in accountTypeData"
            :key="index"
            @click="setType(type.key)"
            >
            {{ type.value }}
            </v-tab>
        </v-tabs> -->        
        <v-select
            v-model="accountType"
            :items="accountTypeData"
            item-text="value" 
            item-value="key"
            attach
            chips
            label="Тип"
            multiple
        ></v-select>
        <!-- <v-select v-model="status" multiple label="Статус" item-text="value" item-value="key" :items="statusData"></v-select> -->
        <div class="d-flex flex-wrap checkbox">
            <v-checkbox v-for="(item,index) in statusData" :key="index" v-model="status" :label="item.value" :value="item.key"></v-checkbox>
        </div>
        <div class="button-box">
            <v-btn @click="start" color="primary" class="get-btn" :loading="loader">Получить</v-btn>
            <v-btn class="mt-3 excel-btn" :loading="loader" @click="getExcel">Скачать Excel</v-btn>
            <download-excel
                    v-show="false"
                    id="excel"
                    name="requisite.xls"
                    :fields="operationExport"
                    :data="excelData">
                <v-btn icon dark color="secondary">
                    <v-icon>mdi-file-excel</v-icon>
                </v-btn>
            </download-excel> 
        </div>
        <span class="amount-box" v-for="(item, index) in amountData" :key="index">
            <span class="amount-box-child">
                <p class="amount-box-child-text">Сумма: </p> 
                <h2>{{item.amount/100|number-format}} UZS</h2>
            </span>
            <span  class="amount-box-child">
                <p class="amount-box-child-text">Комиссия: </p>
                <h2>{{item.fee/100|number-format}} UZS</h2>
            </span>
        </span>
        <!-- <v-checkbox v-if="content.length!=0" v-model="templateType" label="Оплата по шаблону"></v-checkbox> -->
        <div class="dflex" v-if="isClick">
            <p class="mb-0 mr-2">Оплата по шаблону: </p>
            <v-radio-group v-model="templateType" row>
                <v-radio label="Да" :value="1"></v-radio>
                <v-radio label="Нет" :value="2"></v-radio>
                <v-radio label="Показать все" :value="3"></v-radio>
            </v-radio-group>
        </div>
        
        <v-data-table
            v-if="isClick"
            :headers="headers"
            :items="content"          
            :loading="loader"                                            
            hide-actions
            >
            <template slot="items" slot-scope="props">
                <tr>
                    <td>{{ props.item.id}}</td>
                    <td style="min-width: 125px;">{{ props.item.amount / 100 | number-format }}</td>
                    <td>{{ props.item.fee / 100 | number-format }}</td>
                    <!-- <td>{{ props.item.user_id}}</td> -->
                    <td>{{ props.item.customer}}</td>
                    <!-- <td>{{ props.item.login}}</td> -->
                    <td>{{ props.item.mfo }}</td>
                    <td>{{ props.item.sender }}</td>         
                    <td>{{ props.item.senderName }}</td>   
                    <td>{{ props.item.receiver }}</td>   
                    <td>{{ props.item.receiverName }}</td>   
                    <!-- <td>{{ props.item.details}}</td>-->
                    <td>{{ props.item.status }}</td>         
                    <td>{{ props.item.startTime | timestamp-to-date }}</td> 
                    <td>{{ props.item.endTime | timestamp-to-date }}</td>   
                    <td>{{ props.item.template ? "Да" : "Нет" }}</td>    
                    <td>{{ props.item.platform}}</td>    
                    <td>{{ props.item.appVersion }}</td>    


                    <td><v-btn @click="details(props.item)" depressed  small rounded>Подробнее</v-btn></td>
                </tr>
            </template>
            <template slot="no-data">
                <!-- <vue-content-loading :width="300" :height="98">
                    <rect x="0" y="3" rx="3" ry="10" width="8%" height="5" />
                    <rect x="30" y="3" rx="3" ry="10" width="10%" height="5" />
                    <rect x="67" y="3" rx="3" ry="10" width="5%" height="5" />
                    <rect x="90" y="3" rx="3" ry="10" width="13%" height="5" />
                    <rect x="135" y="3" rx="3" ry="10" width="12%" height="5" />
                    <rect x="180" y="3" rx="3" ry="10" width="8%" height="5" />
                    <rect x="215" y="3" rx="3" ry="10" width="7%" height="5" />
                    <rect x="245" y="3" rx="3" ry="10" width="7%" height="5" />
                    <rect x="275" y="3" rx="3" ry="10" width="7%" height="5" />

                    <rect x="0" y="12" rx="3" ry="10" width="8%" height="5" />
                    <rect x="30" y="12" rx="3" ry="10" width="10%" height="5" />
                    <rect x="67" y="12" rx="3" ry="10" width="5%" height="5" />
                    <rect x="90" y="12" rx="3" ry="10" width="13%" height="5" />
                    <rect x="135" y="12" rx="3" ry="10" width="12%" height="5" />
                    <rect x="180" y="12" rx="3" ry="10" width="8%" height="5" />
                    <rect x="215" y="12" rx="3" ry="10" width="7%" height="5" />
                    <rect x="245" y="12" rx="3" ry="10" width="7%" height="5" />
                    <rect x="275" y="12" rx="3" ry="10" width="7%" height="5" />
                    
                    <rect x="0" y="22" rx="3" ry="10" width="8%" height="5" />
                    <rect x="30" y="22" rx="3" ry="10" width="10%" height="5" />
                    <rect x="67" y="22" rx="3" ry="10" width="5%" height="5" />
                    <rect x="90" y="22" rx="3" ry="10" width="13%" height="5" />
                    <rect x="135" y="22" rx="3" ry="10" width="12%" height="5" />
                    <rect x="180" y="22" rx="3" ry="10" width="8%" height="5" />
                    <rect x="215" y="22" rx="3" ry="10" width="7%" height="5" />
                    <rect x="245" y="22" rx="3" ry="10" width="7%" height="5" />
                    <rect x="275" y="22" rx="3" ry="10" width="7%" height="5" />                   

                    <rect x="0" y="32" rx="3" ry="10" width="8%" height="5" />
                    <rect x="30" y="32" rx="3" ry="10" width="10%" height="5" />
                    <rect x="67" y="32" rx="3" ry="10" width="5%" height="5" />
                    <rect x="90" y="32" rx="3" ry="10" width="13%" height="5" />
                    <rect x="135" y="32" rx="3" ry="10" width="12%" height="5" />
                    <rect x="180" y="32" rx="3" ry="10" width="8%" height="5" />
                    <rect x="215" y="32" rx="3" ry="10" width="7%" height="5" />
                    <rect x="245" y="32" rx="3" ry="10" width="7%" height="5" />
                    <rect x="275" y="32" rx="3" ry="10" width="7%" height="5" />                   

                    <rect x="0" y="42" rx="3" ry="10" width="8%" height="5" />
                    <rect x="30" y="42" rx="3" ry="10" width="10%" height="5" />
                    <rect x="67" y="42" rx="3" ry="10" width="5%" height="5" />
                    <rect x="90" y="42" rx="3" ry="10" width="13%" height="5" />
                    <rect x="135" y="42" rx="3" ry="10" width="12%" height="5" />
                    <rect x="180" y="42" rx="3" ry="10" width="8%" height="5" />
                    <rect x="215" y="42" rx="3" ry="10" width="7%" height="5" />
                    <rect x="245" y="42" rx="3" ry="10" width="7%" height="5" />
                    <rect x="275" y="42" rx="3" ry="10" width="7%" height="5" /> 

                    <rect x="0" y="52" rx="3" ry="10" width="8%" height="5" />
                    <rect x="30" y="52" rx="3" ry="10" width="10%" height="5" />
                    <rect x="67" y="52" rx="3" ry="10" width="5%" height="5" />
                    <rect x="90" y="52" rx="3" ry="10" width="13%" height="5" />
                    <rect x="135" y="52" rx="3" ry="10" width="12%" height="5" />
                    <rect x="180" y="52" rx="3" ry="10" width="8%" height="5" />
                    <rect x="215" y="52" rx="3" ry="10" width="7%" height="5" />
                    <rect x="245" y="52" rx="3" ry="10" width="7%" height="5" />
                    <rect x="275" y="52" rx="3" ry="10" width="7%" height="5" /> 

                    <rect x="0" y="62" rx="3" ry="10" width="8%" height="5" />
                    <rect x="30" y="62" rx="3" ry="10" width="10%" height="5" />
                    <rect x="67" y="62" rx="3" ry="10" width="5%" height="5" />
                    <rect x="90" y="62" rx="3" ry="10" width="13%" height="5" />
                    <rect x="135" y="62" rx="3" ry="10" width="12%" height="5" />
                    <rect x="180" y="62" rx="3" ry="10" width="8%" height="5" />
                    <rect x="215" y="62" rx="3" ry="10" width="7%" height="5" />
                    <rect x="245" y="62" rx="3" ry="10" width="7%" height="5" />
                    <rect x="275" y="62" rx="3" ry="10" width="7%" height="5" /> 

                    <rect x="0" y="72" rx="3" ry="10" width="8%" height="5" />
                    <rect x="30" y="72" rx="3" ry="10" width="10%" height="5" />
                    <rect x="67" y="72" rx="3" ry="10" width="5%" height="5" />
                    <rect x="90" y="72" rx="3" ry="10" width="13%" height="5" />
                    <rect x="135" y="72" rx="3" ry="10" width="12%" height="5" />
                    <rect x="180" y="72" rx="3" ry="10" width="8%" height="5" />
                    <rect x="215" y="72" rx="3" ry="10" width="7%" height="5" />
                    <rect x="245" y="72" rx="3" ry="10" width="7%" height="5" />
                    <rect x="275" y="72" rx="3" ry="10" width="7%" height="5" /> 

                    <rect x="0" y="82" rx="3" ry="10" width="8%" height="5" />
                    <rect x="30" y="82" rx="3" ry="10" width="10%" height="5" />
                    <rect x="67" y="82" rx="3" ry="10" width="5%" height="5" />
                    <rect x="90" y="82" rx="3" ry="10" width="13%" height="5" />
                    <rect x="135" y="82" rx="3" ry="10" width="12%" height="5" />
                    <rect x="180" y="82" rx="3" ry="10" width="8%" height="5" />
                    <rect x="215" y="82" rx="3" ry="10" width="7%" height="5" />
                    <rect x="245" y="82" rx="3" ry="10" width="7%" height="5" />
                    <rect x="275" y="82" rx="3" ry="10" width="7%" height="5" /> 

                    <rect x="0" y="92" rx="3" ry="10" width="8%" height="5" />
                    <rect x="30" y="92" rx="3" ry="10" width="10%" height="5" />
                    <rect x="67" y="92" rx="3" ry="10" width="5%" height="5" />
                    <rect x="90" y="92" rx="3" ry="10" width="13%" height="5" />
                    <rect x="135" y="92" rx="3" ry="10" width="12%" height="5" />
                    <rect x="180" y="92" rx="3" ry="10" width="8%" height="5" />
                    <rect x="215" y="92" rx="3" ry="10" width="7%" height="5" />
                    <rect x="245" y="92" rx="3" ry="10" width="7%" height="5" />
                    <rect x="275" y="92" rx="3" ry="10" width="7%" height="5" />                     
                </vue-content-loading>                    -->
                <p style="text-align:center">Нет данных</p>
            </template>
        </v-data-table>
        <v-pagination
        v-if="totalPages"
        :disabled="loader"
        class="center"
        v-model="page"
        :length="totalPages"
        :total-visible="10"
        ></v-pagination>  
        <v-dialog v-model="dialog" persistent max-width="650px">
                <v-card>
                    <v-card-title><h2>Подробнее</h2></v-card-title>  
                    <v-card-text>
                        <v-text-field label="Сумма" :value="dialogData.amount/100 | number-format" readonly=""></v-text-field>
                        <v-text-field label="Комиссия" :value="dialogData.fee/100 | number-format" readonly=""></v-text-field>
                        <v-text-field label="ID пользователя" :value="dialogData.userId" readonly=""></v-text-field>
                        <v-text-field label="Клиент" :value="dialogData.customer" readonly=""></v-text-field>
                        <v-text-field label="Логин" :value="dialogData.login" readonly=""></v-text-field>
                        <v-text-field label="МФО" :value="dialogData.mfo" readonly=""></v-text-field>
                        <v-text-field label="Отправитель" :value="dialogData.sender" readonly=""></v-text-field>
                        <v-text-field label="Имя отправителя" :value="dialogData.senderName" readonly=""></v-text-field>
                        <v-text-field label="Получатель" :value="dialogData.receiver" readonly=""></v-text-field>
                        <v-text-field label="Имя получателя" :value="dialogData.receiverName" readonly=""></v-text-field>
                        <v-text-field label="Детали" :value="dialogData.details" readonly=""></v-text-field>
                        <v-text-field label="Статус" :value="dialogData.status" readonly=""></v-text-field>
                        <v-text-field label="Время создания" :value="dialogData.startTime|timestamp-to-date" readonly=""></v-text-field>
                        <v-text-field label="Время окончания" :value="dialogData.endTime|timestamp-to-date" readonly=""></v-text-field>
                        <v-text-field label="Время окончания" :value="dialogData.endTime|timestamp-to-date" readonly=""></v-text-field>
                        <v-text-field label="Платформа" :value="dialogData.platform" readonly=""></v-text-field>
                        <v-text-field label="Версия" :value="dialogData.appVersion" readonly=""></v-text-field>
                        <p>Оплата по шаблону: {{dialogData.template? 'Да':'Нет'}}</p>                    

                    </v-card-text>
                
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="dialog = false">Отмена</v-btn>
                    </v-card-actions>
                </v-card>
        </v-dialog>
    </div>    
</template>
<script>
import DateSelect from '@/components/date/DateSelect'
import {VclTable, VueContentLoading}  from 'vue-content-loading';
import DateComponent from '@/components/date/DateComponent'
export default {
    name: 'ReportRequisite',
    components: {
        DateSelect, VclTable, VueContentLoading, DateComponent
    },
    data(){
        return {
            headers: [
                {text: "ID", value: "id",sortable: false},
                {text: "Сумма", value: "amount",sortable: false},
                {text: "Комиссия", value: "fee",sortable: false},
                // {text: "ID пользователя", value: "user_id",sortable: false},                
                {text: "Клиент", value: "customer", sortable: false},
                // {text: "Логин", value: "login",sortable: false},
                {text: "МФО", value: "mfo",sortable: false},
                {text: "Отправитель", value: "sender",sortable: false},
                {text: "Имя отправителя", value: "senderName",sortable: false},
                {text: "Получатель", value: "receiver",sortable: false},
                {text: "Имя получателя", value: "receiverName",sortable: false},
                // {text: "Детали", value: "details",sortable: false},
                {text: "Статус", value: "status",sortable: false},
                {text: "Время создания", value: "startTime",sortable: false},
                {text: "Время окончания", value: "endTime",sortable: false},
                {text: "Оплата по шаблону", value: "template",sortable: false},
                {text: "Платформа", value: "platform",sortable: false},
                {text: "Версия", value: "appVersion",sortable: false},


                {text: "", value: "",sortable: false},
            ],
            excelHeaders: [
                {text: "Сумма", value: "amount",sortable: false},
                {text: "Комиссия", value: "fee",sortable: false},
                {text: "ID пользователя", value: "userId",sortable: false},                
                {text: "Клиент", value: "customer", sortable: false},
                {text: "Логин", value: "login",sortable: false},
                {text: "МФО", value: "mfo",sortable: false},
                {text: "Отправитель", value: "sender",sortable: false},
                {text: "Имя отправителя", value: "senderName",sortable: false},
                {text: "Получатель", value: "receiver",sortable: false},
                {text: "Имя получателя", value: "receiverName",sortable: false},
                {text: "Детали", value: "details",sortable: false},
                {text: "Статус", value: "status",sortable: false},
                {text: "Оплата по шаблону", value: "template",sortable: false},
                {text: "Платформа", value: "platform",sortable: false},
                {text: "Версия", value: "appVersion",sortable: false},
                {text: "Время создания", value: "startTime",sortable: false},
                {text: "Время окончания", value: "endTime",sortable: false},
            ],
            status: [],
            accountType: [],
            page: 1,
            totalPages: '',
            accountTypeData: [],
            statusData: [],
            fromDate: '',
            toDate: '',
            date: {},
            content: [],
            dialog: false,
            dialogData: {},
            excelData: [],
            amountData: [],
            templateType: 3,
            isClick: false,
        }
    },
    computed:{
        operationExport() {
                let self = this, result = {};
                for (let i = 0; i < self.excelHeaders.length; i++) {
                    let currentHeader = self.excelHeaders[i];                  
                    result[currentHeader.text] = currentHeader.value;
                }
                result['Сумма'] = {
                    field: "amount",
                    callback: value => {
                        return (value / 100).toString().replace('.',',');
                    }
                }; 
                result['Комиссия'] = {
                    field: "fee",
                    callback: value => {
                        return (value / 100).toString().replace('.',',');
                    }
                };    
                result['Получатель'] = {
                    field: "receiver",
                    callback: value => {
                        return "'"+value;
                    }
                }; 
                result['Время создания'] = {
                    field: "startTime",
                    callback: value => {
                        let date = new Date(parseInt(value));
                        if(value)
                            return date.toLocaleString();
                        else
                            return '';
                        }
                };    
                result['Время окончания'] = {
                    field: "endTime",
                    callback: value => {
                        let date = new Date(parseInt(value));
                        if(value)
                            return date.toLocaleString();
                        else
                            return '';
                        }
                };  
                result['Оплата по шаблону'] = {
                    field: "template",
                    callback: value => {
                        if(value){
                            return 'Да'
                        }
                        else
                            return 'Нет'
                    }
                };                           
                return result;
            }
    },
    watch:{
        date(val){
            // this.getHistory();
        },
        page(newVal){
            this.getRequisite(newVal);
            // this.getRequisiteAmount();
        },
        status(val){
            this.content = [];
            this.totalPages = '';
            this.amountData = [];
        },
        accountType(val){
            this.content = [];
            this.totalPages = '';
            this.amountData = [];
        },
        templateType(val){
            this.start();
        }
    },
    methods:{
        getExcel() {
            let self = this;
            self.loader = true;
            self.excelData = [];
            const postData = {
                status: this.status,
                accountType: this.accountType,
                dateFrom: this.date.fromDate,
                dateTo: this.date.toDate,
            }
            let template;
            if(this.templateType===1){
                template = true;
                Object.assign(postData, {templateType: template})
            }
            else if(this.templateType===2){
                template = false
                Object.assign(postData, {templateType: template})
            }
            self.$http.post(self.$store.getters.newApiUrl2 + `/report/v2/requisite/excel`, postData)
                .then(response => {
                    self.loader = false;
                    self.excelData = response.data.data;  
                    if(this.excelData.length!=0){
                        let elem = document.getElementById('excel');
                        setTimeout(()=>{
                            elem.click();
                        }, 500)
                    
                    }                                          
                }, self.handleError);
        },
        details(item){
            this.dialogData = item;
            this.dialog = true;
        },
        start(){
            this.isClick=true;
            if(this.page===1){
                this.getRequisite(this.page);
                this.getRequisiteAmount();
            }
            else
                this.page = 1;
        },
        getDate(val){
            this.date = val;
            this.content = [];
            this.totalPages = '';
            this.amountData = [];
            this.loader = false;
            console.log(this.date)
            // if(this.page===1)
            //     this.getRequisite(this.page);
            // else
            //     this.page = 1;
        },
        setType(type){
            this.accountType = type;
            if(this.page===1){
                this.getRequisite(this.page);
                this.getRequisiteAmount();
            }
            else
                this.page = 1;
        },
        getRequisiteAmount(){
            const postData = {
                status: this.status,
                accountType: this.accountType,
                dateFrom: this.date.fromDate,
                dateTo: this.date.toDate,
            }
            let template;
            if(this.templateType===1){
                template = true;
                Object.assign(postData, {templateType: template})
            }
            else if(this.templateType===2){
                template = false
                Object.assign(postData, {templateType: template})
            }
            if(this.date.fromDate==="")
                delete postData.dateFrom
            if(this.date.toDate==="")
                delete postData.dateTo
            this.amountData = [];
            this.$http.post(this.$store.getters.newApiUrl2+`/report/v2/requisite/amount`, postData)
            .then(response=>{
                console.log(response.data.data);
                this.amountData = response.data.data

            }, this.handleError);            
        },
        getRequisite(page){
            const postData = {
                status: this.status,
                accountType: this.accountType,
                dateFrom: this.date.fromDate,
                dateTo: this.date.toDate,
            }
            let template;
            if(this.templateType===1){
                template = true;
                Object.assign(postData, {templateType: template})
            }
            else if(this.templateType===2){
                template = false
                Object.assign(postData, {templateType: template})
            }
            if(this.date.fromDate==="")
                delete postData.dateFrom
            if(this.date.toDate==="")
                delete postData.dateTo
            // this.content = []
            this.loader = true;
            this.$http.post(this.$store.getters.newApiUrl2+`/report/v2/requisite?page=${page-1}&size=10`, postData)
            .then(response=>{
                console.log(response.data.data);
                this.content = response.data.data.content;
                this.totalPages = response.data.data.totalPages;
                this.loader = false;
            }, this.handleError);
        },
        getAccountType(){
            this.$http.get(this.$store.getters.newApiUrl2+`/report/requisite/account-type`)
            .then(response=>{
                console.log(response.data.data);
                this.accountTypeData = response.data.data;
                this.accountTypeData.forEach(x=>{
                    this.accountType.push(x.key);
                })

            }, this.handleError);
        },
        getStatus(){
            this.$http.get(this.$store.getters.newApiUrl2+`/report/requisite/status`)
            .then(response=>{
                console.log(response.data.data);
                this.statusData = response.data.data;
                response.data.data.forEach(x=>{
                    this.status.push(x.key);                        
                })
            }, this.handleError);
        }
    },
    mounted(){
        this.getStatus();
        this.getAccountType();
    }
}
</script>
<style scoped>
    .dflex{
        display: flex;
        align-items: center;
    }
    .main{
        width: 100%;
    }
    .headline{
        text-align: center;
    } 
    .center{
        margin: 10px;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;

    }    
    .checkbox{
        background: #fff;
        padding: 0 10px;
        border-radius: 15px;
        margin: 15px 0;
        flex-wrap: wrap;
    }
    .amount-box-child-text{
        margin: 0 10px;
        font-size: 18px;
    }
    .amount-box-child{
        display: flex;
        align-items: center;
    }
    .amount-box{
        display: flex;
        justify-content: space-around;
        margin: 20px;
    }
    h2{
        margin: 0;
    }
    .excel-btn{
        border-radius: 29px;
        background: #3d9c3d !important;
        color: #FFFF !important;
        margin: 20px 0;
    }
    .button-box{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .get-btn{
        border-radius: 20px;
    }
    @media all and (max-width: 500px){
        .amount-box{
            flex-direction: column;
            align-items: center;
        }
    }
</style>
