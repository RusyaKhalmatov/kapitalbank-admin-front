<template>
    <v-card class="main">
        <h1 class="headline">История по епосам</h1>
        <!-- <date-component></date-component> -->
        <div class="select-date-box">
            <span class="select-date-box-child">
                <v-datetime-picker
                    prepend-icon="mdi-clock"
                    v-model="date1"
                    label="Дата от"
                />
                <v-datetime-picker
                    prepend-icon="mdi-clock"
                    v-model="date2"
                    label="Дата от"
                />
            </span>
            <v-text-field
                v-model="merchant"
                label="Merchant"
                :rules="[v => !!v || 'Введите merchant']"
            ></v-text-field>
            <v-text-field
                v-model="terminal"
                label="Terminal"
                :rules="[v => !!v || 'Введите terminal']"
            ></v-text-field>
            <v-btn class="set-date" :loading="loader" @click="getData">Получить</v-btn>
        </div>
        <span class="buttons-box">
            <v-btn @click="getHistoryAmount()" flat>Получить по всем епосам (по дням)</v-btn>
            <v-btn @click="getHistoryTimeAmount()" flat>Получить по всем епосам (по времени)</v-btn>
        </span>
        <div class="buttons-box">
            <v-spacer></v-spacer>
            <v-btn v-if="content.length!=0" :loading="loader" @click="getExcel" class="excel-btn">Скачать Excel</v-btn>
            <download-excel
                    v-show="false"
                    id="excel"
                    name="epos-history.xls"
                    :fields="operationExport"
                    :data="excelData">
                <v-btn icon dark color="secondary">
                    <v-icon>mdi-file-excel</v-icon>
                </v-btn>
            </download-excel> 
        </div>
        <v-data-table
                v-if="amountData.length!=0"
                :headers="amountHeaders"
                :items="amountData"
                :loading="loader"
                :pagination.sync="pagination"
                >
            <template slot="items" slot-scope="props">
                <tr>
                    <td>{{ props.item.bankName }}</td>
                    <td>{{ props.item.shortName }}</td>
                    <td>{{ props.item.merchant }}</td>
                    <td>{{props.item.terminal}}</td>
                    <td>{{ props.item.totalCredit/100|number-format }}</td>
                    <td>{{ props.item.totalDebit/100|number-format}}</td>        
                </tr>
            </template>
            <template slot="actions-append">
                <download-excel
                        :fields="amountExcelHeaders"
                        name="epos-history.xls"
                        :data="amountData">
                    <v-btn icon dark color="secondary">
                        <v-icon>mdi-file-excel</v-icon>
                    </v-btn>
                </download-excel>
            </template>
        </v-data-table>
        <v-data-table
                v-if="amountTimeData.length!=0"
                :headers="amountHeaders"
                :items="amountTimeData"
                :loading="loader"
                :pagination.sync="pagination"
                >
            <template slot="items" slot-scope="props">
                <tr>
                    <td>{{ props.item.bankName }}</td>
                    <td>{{ props.item.shortName }}</td>
                    <td>{{ props.item.merchant }}</td>
                    <td>{{props.item.terminal}}</td>
                    <td>{{ props.item.totalCredit/100|number-format }}</td>
                    <td>{{ props.item.totalDebit/100|number-format}}</td>        
                </tr>
            </template>
            <template slot="actions-append">
                <download-excel
                        :fields="amountExcelHeaders"
                        name="epos-history.xls"
                        :data="amountTimeData">
                    <v-btn icon dark color="secondary">
                        <v-icon>mdi-file-excel</v-icon>
                    </v-btn>
                </download-excel>
            </template>
        </v-data-table>        
        <span v-if="content.length!=0" class="total-amount">
            <h2>Total credit: {{totalCredit/100|number-format}}</h2>
            <h2>Total debit: {{totalDebit/100|number-format}}</h2>
        </span>
        <v-data-table
                v-if="content.length!=0"
                :headers="headers"
                :items="content"
                :loading="loader"
                :pagination.sync="pagination"
                
                >
            <template slot="items" slot-scope="props">
                <tr>
                    <td>{{ props.item.merchant }}</td>
                    <td>{{ props.item.merchantName }}</td>
                    <td>{{ props.item.terminal }}</td>
                    <td>{{ props.item.hpan }}</td>
                    <td>{{props.item.credit?'+':'-'}}{{ parseInt(props.item.reqamt)/100 | number-format }}</td>
                    <td>{{ props.item.resp==='-1'?'Успешно':'Не успешно' }}</td>
                    <td>{{ props.item.reversal | checkStatus}}</td>
                    <td>{{ props.item.utime | timestamp-to-date}}</td>           
                </tr>
            </template>
        </v-data-table>
        <!-- <v-pagination
        v-if="content.length!=0"
        :disabled="loader"
        class="center"
        v-model="page"
        :length="totalPages"
        :total-visible="10"
        ></v-pagination> -->
    </v-card>
</template>
<script>
import DateComponent from "@/components/date/DateComponent"
export default {
    name: 'EposHistory',
    components:{
        DateComponent
    },
    data(){
        return{
            fromDate: '',
            toDate: '',
            date1: new Date().toISOString().substr(0, 10),
            date2: new Date().toISOString().substr(0, 10),
            menu1: false,
            menu2: false,
            merchant: '',
            terminal: '',
            loader: false,
            pagination: {
                rowsPerPage: 10
            },           
            content: [],
            totalPages: '', 
            headers: [
                {text: "Merchant", value: "merchant"},
                {text: "Merchant name", value: "merchantName"},
                {text: "Terminal", value: "terminal"},
                {text: "Номер карты", value: "hpan"},
                {text: "Сумма", value: "reqamt"},
                {text: "Статус", value: "resp"},
                {text: "Возврат средств", value: "reversal"},
                {text: "Дата и время", value: "udate"},
            ],
            excelHeaders: [
                {text: "Merchant", value: "merchant", sortable: false},
                {text: "Merchant name", value: "merchantName", sortable: false},
                {text: "Terminal", value: "terminal", sortable: false},
                {text: "Номер карты", value: "hpan", sortable: false},
                {text: "Пополнение/списание", value: "credit", sortable: false},
                {text: "Сумма", value: "reqamt", sortable: false},
                {text: "Статус", value: "resp", sortable: false},
                {text: "Возврат средств", value: "reversal", sortable: false},
                {text: "Дата и время", value: "udate", sortable: false},
            ],
            amountHeaders: [
                {text: "Название банка", value: "bankName", sortable: false},
                {text: "Короткое имя", value: "shortName", sortable: false},
                {text: "Мерчант", value: "merchant", sortable: false},
                {text: "Терминал", value: "terminal", sortable: false},
                {text: "Общий кредит", value: "totalCredit", sortable: false},
                {text: "Общий дебет", value: "totalDebit", sortable: false},
            ],
            page: 1,
            totalCredit: '',
            totalDebit: '',
            excelData: [],
            amountData: [],
            pagination: {
                rowsPerPage: 10
            },
            active: '',
            isAll: false,
            amountTimeData: [],
        }
    },
    watch:{
        page(val){
            if(this.isAll){
                // this.getHistoryAmount();
            }
            else{
                this.getHistory(val);
            }
            
        },
    },
    computed:{
        amountExcelHeaders(){
                let self = this, result = {};
                for (let i = 0; i < self.amountHeaders.length; i++) {
                    let currentHeader = self.amountHeaders[i];          
                    result[currentHeader.text] = currentHeader.value;                    
                    
                }
                result['Общий кредит'] = {
                    field: "totalCredit",
                    callback: value => {
                        return (parseInt(value) / 100).toString().replace('.',',');
                    }
                };  
                result['Общий дебет'] = {
                    field: "totalDebit",
                    callback: value => {
                        return  (parseInt(value) / 100).toString().replace('.',',');
                    }
                };          
                return result;            
        },
        operationExport() {
                let self = this, result = {};
                for (let i = 0; i < self.excelHeaders.length; i++) {
                    let currentHeader = self.excelHeaders[i];          
                    result[currentHeader.text] = currentHeader.value;                    
                    
                }
                result['Сумма'] = {
                    field: "reqamt",
                    callback: value => {
                        return (parseInt(value) / 100).toString().replace('.',',');
                    }
                };  
                result['Пополнение/списание'] = {
                    field: "credit",
                    callback: value => {
                        return value?'+':'-';
                    }
                }; 
                result['Статус'] = {
                    field: "resp",
                    callback: value => {
                        return value==='-1'?'Успешно':'Не успешно';
                    }
                };      
                result['Возврат средств'] = {
                    field: "reversal",
                    callback: value => {
                        if(value){
                            return 'Да'     
                        }
                        else{
                            return 'Нет';
                        }
                    }
                };   
                result['Дата и время'] = {
                    field: "udate",
                    callback: value => {
                        let date = new Date(parseInt(value)).toLocaleString();
                        return date;
                    }
                };           
                
                return result;
            }
    },    
    filters:{
        checkStatus(val){
            if(val){
                return 'Да'
            }
            else{
                return 'Нет'
            }
        }
    },
    methods: {
        getData(){
            // if(this.page!=1){
            //     this.page = 1;
            // }
            // else{
            //     this.getHistory(1);
            //     // this.getHistoryAmount();
            // }
            this.getExcelData();
        },
        getExcelData(){
            this.loader = true;            
            var begDay = new Date(this.date1);
            var endDay = new Date(this.date2);
            this.fromDate = begDay.getTime();
            this.toDate = endDay.getTime();
            this.excelData = [];
            this.content = [];
            this.$http.get(this.$store.getters.apiUrl+`/uzcard/epos-history?pageNumber=-1&dateFrom=${this.fromDate}&dateTo=${this.toDate}&merchant=${this.merchant}&terminal=${this.terminal}`)
            .then(response=>{
                console.log(response.data.data);
                this.loader = false;
                this.content = response.data.data.data;   
                this.totalCredit = response.data.data.totalCredit;
                this.totalDebit = response.data.data.totalDebit;                 
                this.loader = false;
            }, this.handleError)
        },
        getExcel(){
            this.loader = true;            
            var begDay = new Date(this.date1);
            var endDay = new Date(this.date2);
            this.fromDate = begDay.getTime();
            this.toDate = endDay.getTime();
            this.excelData = [];
            this.$http.get(this.$store.getters.apiUrl+`/uzcard/epos-history?pageNumber=-1&dateFrom=${this.fromDate}&dateTo=${this.toDate}&merchant=${this.merchant}&terminal=${this.terminal}`)
            .then(response=>{
                console.log(response.data.data);
                this.loader = false;
                this.excelData = response.data.data.data;  
                if(this.excelData.length!=0){
                    let elem = document.getElementById('excel');
                    setTimeout(()=>{
                        elem.click();
                    }, 500)
                }                    
                this.loader = false;
            }, this.handleError)
        },
        getHistoryAmount(){
            var begDay = new Date(this.date1);
            var endDay = new Date(this.date2);
            this.loader = true;
            this.fromDate = begDay.getTime();
            this.toDate = endDay.getTime();
            this.amountData = [];
            this.content = [];
            this.amountTimeData = [];
            this.isAll = true;
            this.$http.get(this.$store.getters.apiUrl+`/uzcard/epos-history/all?dateFrom=${this.fromDate}&dateTo=${this.toDate}`)
            .then(response=>{
                console.log(response.data.data);
                this.amountData = response.data.data;
                this.loader = false;
            }, this.handleError)
        },
        getHistoryTimeAmount(){
            var begDay = new Date(this.date1);
            var endDay = new Date(this.date2);
            this.loader = true;
            this.fromDate = begDay.getTime();
            this.toDate = endDay.getTime();
            this.amountData = [];
            this.amountTimeData = [];
            this.content = [];
            this.isAll = true;
            this.$http.get(this.$store.getters.apiUrl+`/uzcard/epos-history/all/filtered?dateFrom=${this.fromDate}&dateTo=${this.toDate}`)
            .then(response=>{
                console.log(response.data.data);
                this.amountTimeData = response.data.data;
                this.loader = false;
            }, this.handleError)
        },
        getHistory(page){
            console.log(this.date1)
            this.loader = true;            
            var begDay = new Date(this.date1);
            var endDay = new Date(this.date2);
            this.fromDate = begDay.getTime();
            this.toDate = endDay.getTime();
            this.amountData = [];
            this.amountTimeData = [];
            this.isAll = false;
            if(page === 1){
                this.content = [];
            }
            if(this.merchant&&this.terminal){
                this.$http.get(this.$store.getters.apiUrl+`/uzcard/epos-history?pageNumber=${page-1}&dateFrom=${this.fromDate}&dateTo=${this.toDate}&merchant=${this.merchant}&terminal=${this.terminal}`)
                .then(response=>{
                    console.log(response.data.data);
                    this.content = response.data.data.content;
                    this.totalPages = response.data.data.totalPages;
                    this.totalCredit = response.data.data.totalCredit;
                    this.totalDebit = response.data.data.totalDebit;
                    this.loader = false;
                }, this.handleError)
            }
            else{
                this.$store.commit('errorMessage', 'Введите данные')
            }
        }
    },
    mounted(){

    }
}
</script>
<style scoped>
    .main{
        width: 100%;
        padding: 15px;
    }
    .headline{
        text-align: center;
    }
    .select-date-box{
        background: #ffffff;
        padding: 10px;
        width: 415px;
        border-radius: 10px;
        margin: 25px 0px;
        display: flex;
        flex-direction: column;
        margin: 20px auto;
    }
    .select-date-box-child{
        display: flex;
    }
    .center{
        display: flex;
        justify-content: center;
        margin: 15px;
    }         
    .table{
        width: 100%;
    }  
    .total-amount{
        display: flex;
        justify-content: space-around;
    }
    .excel-btn{
        border-radius: 29px;
        background: #3d9c3d !important;
        color: #FFFF !important;
        margin: 20px 0;
    }    
    .buttons-box{
        display: flex;
        justify-content: center;
    }
</style>
