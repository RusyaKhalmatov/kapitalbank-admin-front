<template>
    <div class="main">
        <h1 class="headline">Отчет по клиентам и картам</h1>
        <date-component @date="getDate"></date-component>
        <div class="d-flex flex-wrap checkbox">
            <v-checkbox v-for="(item,index) in accountTypeData" :key="index" v-model="accountType" :label="item" :value="item"></v-checkbox>
        </div>
        <div class="button-box">
            <v-btn @click="start" color="primary" class="get-btn" :loading="loader">Получить</v-btn>
            <v-btn class="mt-3 excel-btn" :loading="loader" @click="getExcel">Скачать Excel</v-btn>
            <download-excel
                    v-show="false"
                    id="excel"
                    name="reportByClientAndCards.xls"
                    :fields="operationExport"
                    :data="excelData">
                <v-btn icon dark color="secondary">
                    <v-icon>mdi-file-excel</v-icon>
                </v-btn>
            </download-excel> 
        </div>
        <p v-if="content.length!=0">Количество: {{totalElements | number-format}}</p>
        <v-data-table
            v-if="content.length!=0"
            :headers="headers"
            :items="content"   
            :loading="loader"                                                   
            hide-actions
            >
            <template slot="items" slot-scope="props">
                <tr>
                    <td v-if="props.item.phone.split(':').length>1">{{ props.item.phone.split(':')[0]}} - Удален: {{props.item.phone.split(':')[1] | timestamp-to-date}}</td>
                    <td v-else>{{ props.item.phone}}</td>
                    <td>{{ props.item.maskedPan}}</td>
                    <td>{{ props.item.cardOwnerName }}</td>
                    <td>{{ props.item.userCardType }}</td>         
                    <td>{{ props.item.userType }}</td>   
                    <td>{{ props.item.registeredDate | timestamp-to-date}}</td>         
                </tr>
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
                {text: "Номер телефона", value: "phone",sortable: false},
                {text: "Номер карты", value: "maskedPan",sortable: false},
                {text: "Имя владельца карты", value: "cardOwnerName",sortable: false},
                {text: "Тип карты", value: "userCardType",sortable: false},
                {text: "Тип клиента", value: "userType",sortable: false},
                {text: "Дата регистрации", value: "registeredDate",sortable: false},
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
            totalElements: '',
        }
    },
    computed:{
        operationExport() {
                let self = this, result = {};
                for (let i = 0; i < self.headers.length; i++) {
                    let currentHeader = self.headers[i];                  
                    result[currentHeader.text] = currentHeader.value;
                }
                result['Номер телефона'] = {
                    field: "phone",
                    callback: value => {
                        if(value.split(':').length>1){
                            return value.split(':')[0]+ ' - Удален:'+ new Date(parseInt(value.split(':')[1])).toLocaleString()
                        }
                        else{
                            return value
                        }
                    }
                };        
                result['Дата регистрации'] = {
                    field: "registeredDate",
                    callback: value => {
                        let date = new Date(parseInt(value)).toLocaleString();
                        return date;
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
            this.getList(newVal);
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
        }
    },
    methods:{
        getExcel() {
            const postData = {
                types: this.accountType,
                dateFrom: this.date.fromDate,
                dateTo: this.date.toDate,
            }
            if(this.date.fromDate==="")
                delete postData.dateFrom
            if(this.date.toDate==="")
                delete postData.dateTo
            // this.content = []
            this.loader = true;
            this.$http.post(this.$store.getters.newApiUrl2+`/report/client_card/excel`, postData)
            .then(response=>{
                // console.log(response.data.data);
                this.excelData = response.data.data;  
                if(this.excelData.length!=0){
                    let elem = document.getElementById('excel');
                    setTimeout(()=>{
                        elem.click();
                    }, 500)
                
                }
                this.loader = false;
            }, this.handleError);
        },
        details(item){
            this.dialogData = item;
            this.dialog = true;
        },
        start(){
            if(this.page===1){
                this.getList(this.page);
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

        
        getList(page){
            const postData = {
                types: this.accountType,
                dateFrom: this.date.fromDate,
                dateTo: this.date.toDate,
            }
            if(this.date.fromDate==="")
                delete postData.dateFrom
            if(this.date.toDate==="")
                delete postData.dateTo
            // this.content = []
            this.loader = true;
            this.$http.post(this.$store.getters.newApiUrl2+`/report/client_card?page=${page-1}&size=10`, postData)
            .then(response=>{
                console.log(response.data.data);
                this.content = response.data.data.content;
                this.totalPages = response.data.data.totalPages;
                this.totalElements = response.data.data.totalElements;
                this.loader = false;
            }, this.handleError);
        },
        getAccountType(){
            this.$http.get(this.$store.getters.newApiUrl2+`/report/client_card/types`)
            .then(response=>{
                console.log(response.data.data);
                this.accountTypeData = response.data.data;
                this.accountTypeData.forEach(x=>{
                    this.accountType.push(x);
                })

            }, this.handleError);
        },

    },
    mounted(){
        this.getAccountType();
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
