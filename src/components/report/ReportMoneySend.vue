<template>
    <div class="main">
        <h1 class="headline">По MONEY SEND</h1>
        <date-component @date="getDate"></date-component>
        <div class="d-flex flex-wrap checkbox">
            <v-checkbox v-for="(item,index) in statusData" :key="index" v-model="status" :label="item.value" :value="item.key"></v-checkbox>
        </div>
        <div class="button-box">
            <v-btn dark color="primary" class="get-btn" @click="load" :loading="loader">Получить</v-btn>
            <v-btn class="mt-3 excel-btn" :loading="loader" @click="getExcel">Скачать Excel</v-btn>
                <download-excel
                        v-show="false"
                        id="excel"
                        name="visaDirect.xls"
                        :fields="operationExport"
                        :data="excelData">
                    <v-btn icon dark color="secondary">
                        <v-icon>mdi-file-excel</v-icon>
                    </v-btn>
                </download-excel> 
        </div>    
        <template v-if="operationAmount">
            <span v-if="operationAmount.amount" class="amount-box">
                <span class="amount-box-child">
                    <p class="amount-box-child-text">Сумма: </p> 
                    <h2 class="mb-0">{{operationAmount.amount / 100|number-format}} {{operationAmount.currency}}</h2>
                </span>
                <span  class="amount-box-child">
                    <p class="amount-box-child-text">Комиссия: </p>
                    <h2 class="mb-0">{{operationAmount.fee / 100|number-format}} {{operationAmount.feeCurrency}}</h2>
                </span>
            </span>
        </template>                    
        <span style="display:flex; align-items: center" v-if="isClick">
            <span style="width:500px">
                <v-text-field
                        v-model="search"
                        prepend-icon="mdi-magnify"
                        @keyup.enter="load"
                        label="Поиск">
                </v-text-field>
            </span>
            <v-btn style="width: 100px" :loading="loader" @click="load" depressed>Найти</v-btn>
            <span style="display:flex; align-items:center">
                <p class="mb-0">Money Send: </p>
                <v-checkbox class="mx-3" v-model="types" v-for="(item,index) in typesData" :key="index" :label="item" :value="item"></v-checkbox>
            </span>
        </span>

        <v-data-table
                :headers="headers"
                :items="content"
                v-if="content.length!=0"
                :loading="loader"
                :pagination.sync="pagination"
                item-key="id"
                hide-actions
                >
            <template slot="items" slot-scope="props">
                <tr>
                    <td>{{ props.item.id }}</td>
                    <td>{{ props.item.userId }}</td>
                    <td>{{props.item.login.split(":")[0]}}
                        {{phoneFormat(props.item.login.split(":")[1]) | timestamp-to-date}}
                    </td>
                    <td>{{ props.item.username }}</td>
                    <td>{{ props.item.userType }}</td>

                    <td>{{ props.item.sender }}</td>
                    <td  v-if="props.item.senderBank">{{ props.item.senderBank }}</td>
                    <td v-else></td>

                    <td v-if="props.item.receiver">{{ props.item.receiver }}</td>
                    <td v-else></td>

                    <td v-if="props.item.receiverBank">{{ props.item.receiverBank }}</td>
                    <td v-else></td>

                    <td>{{ props.item.rusername }}</td>
                    <td style="min-width:155px">{{ props.item.amount / 100 | number-format }} {{props.item.currency}}</td>
                    <td>{{ props.item.fee / 100 | number-format }} {{props.item.feeCurrency}}</td>
                    <td>{{ props.item.status }}</td> 
                    <td>{{ props.item.oversion }}</td> 
                    <td>{{ props.item.platform }}</td> 
                    <td>{{ props.item.version }}</td> 

                    <td>{{ props.item.startTime | timestamp-to-date}}</td>
                    <td>{{ props.item.endTime | timestamp-to-date}}</td>                              
                </tr>
            </template>
        </v-data-table>
        <v-pagination
        v-if="content.length"
        :disabled="loader"
        class="center"
        v-model="page"
        :length="totalPages"
        :total-visible="10"
        ></v-pagination>   
    </div>
</template>
<script>
import DateComponent from '@/components/date/DateComponent'

export default {
    name: 'ReportMoneySend',
    components:{
        DateComponent
    },
    data(){
        return{
            date: {},
            content: [],
            totalPages: '',
            amountData: '',
            statusData: [],
            status: [],
            data: {
                status: [],
                dateFrom: '',
                dateTo: '',
            },
            headers: [
                {text: "ID", value: "id", sortable: false},
                {text: "userId", value: "userId", sortable: false},
                {text: "Login", value: "login",sortable: false},
                {text: "Имя", value: "username",sortable: false},
                {text: "Тип", value: "userType",sortable: false},

                {text: "Отправитель", value: "sender",sortable: false},
                {text: "Банк отправителя", value: "senderBank",sortable: false},

                {text: "Получатель", value: "receiver",sortable: false},
                {text: "Банк получателя", value: "receiverBank",sortable: false},

                {text: "Имя получателя", value: "rusername",sortable: false},
                {text: "Сумма", value: "amount",sortable: false},
                {text: "Комиссия", value: "fee",sortable: false},
                {text: "Статус", value: "status",sortable: false},
                {text: "Money Send", value: "oversion",sortable: false},
                {text: "Платформа", value: "platform",sortable: false},
                {text: "Версия", value: "version",sortable: false},

                {text: "Начальное время", value: "startTime",sortable: false},
                {text: "Время окончания", value: "endTime",sortable: false},
            ],
            excelHeaders: [
                {text: "ID", value: "id", sortable: false},
                {text: "ID пользователя", value: "userId", sortable: false},
                {text: "Login", value: "login",sortable: false},
                {text: "Имя", value: "username",sortable: false},
                {text: "Тип", value: "userType",sortable: false},

                {text: "Отправитель", value: "sender",sortable: false},
                {text: "Банк отправителя", value: "senderBank",sortable: false},

                {text: "Получатель", value: "receiver",sortable: false},
                {text: "Банк получателя", value: "receiverBank",sortable: false},

                {text: "Имя получателя", value: "rusername",sortable: false},
                {text: "Сумма", value: "amount",sortable: false},
                {text: "Валюта", value: "currency",sortable: false},
                {text: "Комиссия", value: "fee",sortable: false},
                {text: "Валюта комиссии", value: "feeCurrency",sortable: false},
                {text: "Статус", value: "status",sortable: false},
                {text: "Money Send", value: "oversion",sortable: false},
                {text: "Платформа", value: "platform",sortable: false},
                {text: "Версия", value: "version",sortable: false},
                {text: "Начальное время", value: "startTime",sortable: false},
                {text: "Время окончания", value: "endTime",sortable: false},
            ],
            excelData: [],
            page: '',
            pagination: {
                rowsPerPage: 10
            },
            show: false,
            operationAmount: {},
            search: '',
            isClick: false,
            typesData: [],
            types: [],
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
            result['Начальное время'] = {
                field: "startTime",
                callback: value => {
                    let date = new Date(parseInt(value)).toLocaleString();
                    return date;
                }
            };
            result['Время окончания'] = {
                field: "endTime",
                callback: value => {
                    let date = new Date(parseInt(value)).toLocaleString();
                    return date;
                }
            };
            return result;
        }
    },
    watch:{
        page(val){
            this.getList(val);
        },
        status(val){
            this.content = [];
            this.totalPages = '';
            this.show = false;
            this.operationAmount = {}   
            this.isClick = false;

        },
        search(val){
            if(val.length===0){
                this.load();
            }
        },
        types(val){
            this.data.operationType = val;
            if(this.isClick)
                this.load();            
        }

    },
    methods:{
        phoneFormat(phone) {
            if (phone === '' || phone === null) {
                return '';
            }
            return phone;
        },

        getExcel(){
            this.data.dateFrom = this.date.fromDate;
            this.data.dateTo = this.date.toDate;
            this.data.status = this.status;
            if(this.date.fromDate==="")
                delete this.data.dateFrom
            if(this.date.toDate==="")
                delete this.data.dateTo
            this.loader = true;
            this.$http.post(this.$store.getters.newApiUrl2 + `/report/money-send/excel?search=${this.search}`, this.data)
            .then(response => {
                this.loader = false;
                this.excelData = response.data.data;  
                if(this.excelData.length!=0){
                    let elem = document.getElementById('excel');
                    setTimeout(()=>{
                        elem.click();
                    }, 500)
                } 
            }, this.handleError);
        },
        getDate(val){
            this.date = val;
            this.content = [];
            this.totalPages = '';
            this.operationAmount = {};
            this.isClick = false;

            // console.log(this.date)
        },
        load(){
                this.isClick = true;
                this.data.dateFrom = this.date.fromDate;
                this.data.dateTo = this.date.toDate;
                this.data.status = this.status;
                if(this.date.fromDate==="")
                    delete this.data.dateFrom
                if(this.date.toDate==="")
                    delete this.data.dateTo
                // this.data.operationType = this.operation.operationType;
                this.loadAmount();
                if(this.page===1){
                    this.getList(1);
                }
                else{
                    this.page=1
                }            
        },
        loadAmount(){
            this.$http.post(this.$store.getters.newApiUrl2 + `/report/money-send/amount?search=${this.search}`, this.data)
                .then(response => {
                    this.operationAmount = response.data.data;
                    // console.log(response.data.data);
                    this.show = true;
                }, this.handleError);
        },
        getList(page){
            this.loader = true;
            this.$http.post(this.$store.getters.newApiUrl2 + `/report/money-send?page=${page-1}&size=10&search=${this.search}`, this.data)
                .then(response => {
                    this.loader = false;
                    this.content = response.data.data.content;
                    this.totalPages = response.data.data.totalPages;
                }, this.handleError);
        },

        getStatus(){
            this.$http.get(this.$store.getters.newApiUrl2+`/report/money-send/status`)
            .then(response=>{
                this.statusData = response.data.data;
                response.data.data.forEach(x=>{
                    this.status.push(x.key);                        
                })
            }, this.handleError)

        },
        getTypes(){
            this.$http.get(this.$store.getters.newApiUrl2+`/report/money-send/operationTypes`)
            .then(response=>{
                this.typesData = response.data.data;
                this.types = this.typesData;            
                // console.log(this.types)
            }, this.handleError)

        },

    },
    mounted(){
        this.getStatus();
        this.getTypes();
    }
}
</script>
<style scoped>
    .main{
        width: 100%;
    }
    .headline{
        text-align: center;
    }
    .checkbox{
        background: #fff;
        padding: 0 10px;
        border-radius: 15px;
        margin: 15px 0;
        flex-wrap: wrap;
    }  
    .button-box{
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        align-items: center;
    }
    .get-btn{
        border-radius: 20px;
    }    
    .excel-btn{
        border-radius: 29px;
        background: #3d9c3d !important;
        color: #FFFF !important;
        margin: 20px 0;
    }
    .center{
        display: flex;
        justify-content: center;
        margin: 15px;
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
        flex-wrap: wrap;
    }
</style>
