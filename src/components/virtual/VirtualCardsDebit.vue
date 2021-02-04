<template>
    <div>
        <div class="head">
            <h2 class="mt-3">Виртульная карта -  ДЕБЕТ</h2> 
            <v-btn small class="excel-btn" @click="getExcel">Скачать Excel</v-btn>           
            <download-excel
                    v-show="false"
                    id="excel-debit"
                    name="virtualcards_debit"
                    :fields="operationExport"
                    :data="excelData">
                <v-btn icon dark color="secondary">
                    <v-icon>mdi-file-excel</v-icon>
                </v-btn>
            </download-excel> 
        </div>
        <div class="amount-box">
                <span v-for="(item, index) in amountData" :key="index">
                    <h2>Сумма: {{parseInt(item.amount)/100|number-format}} {{item.currency}}</h2>
                </span>
            </div>
        <v-data-table
        :headers="headers"
        :items="data"
        :loading="loader"
        :pagination.sync="pagination"
        item-key="id"
        hide-actions
        >
            <template slot="items" slot-scope="props">
                <tr>
                    <td>{{ props.item.name }}</td>                      
                    <td>{{ props.item.amount / 100 | number-format }}</td>
                    <td>{{ props.item.currency }}</td>                    
                    <td>{{ props.item.status }}</td>                    
                    <td>{{ props.item.odate | timestamp-to-date }}</td>                    
                </tr>
            </template>                            
        </v-data-table>
        <v-pagination
        v-if="data.length"
        :disabled="loader"
        class="center"
        v-model="page"
        :length="totalPages"
        :total-visible="10"
        ></v-pagination> 
    </div>
</template>

<script>
import ReportVue from '../report/Report.vue';
export default {
    name: 'VirtualCardsDebit',
    props:{
        date: Object, cardProduct: Array
    },
    data(){
        return {
            loader: false,
            page:1, 
            totalPages: '',
            headers: [
                {text: "Наименование", value: "name", sortable: false},
                {text: "Сумма", value: "amount", sortable: false},
                {text: "Валюта", value: "currency", sortable: false},
                {text: "Статус", value: "status", sortable: false},
                {text: "Дата", value: "odate", sortable: false},
            ],         
            pagination: {
                rowsPerPage: 10
            },
            data: [],
            excelData: [],
            amountData: [],
        }
    },
    watch:{
        page(val){
            this.virtualCardsDebit(val);
        },
        date(val){
            if(this.page===1){
                this.virtualCardsDebit(1);
                this.getAmount();
            }
            else{
                this.page = 1;  
                this.getAmount();
            }
        }
    },
    computed:{
        operationExport() {
                let self = this, result = {};
                for (let i = 0; i < self.headers.length; i++) {
                    let currentHeader = self.headers[i];                  
                    result[currentHeader.text] = currentHeader.value;
                }
                result['Дата'] = {
                    field: "odate",
                    callback: value => {
                        let date = new Date(parseInt(value));
                        return date.toLocaleString();
                    }
                };
                result['Сумма'] = {
                    field: "amount",
                    callback: value => {                        
                        return (parseInt(value)/100).toString().replace('.',',');
                    }
                };
                return result;
            }
    },
    methods:{
        getExcel(){
            this.loader = true;
            let postData = {
                dateFrom: this.date.fromDate,
                dateTo: this.date.toDate,
                status: ['SUCCESS'],
                cardProduct: this.cardProduct
            }
            if(postData.dateFrom===''&&postData.dateTo===''){
                delete postData.dateFrom;
                delete postData.dateTo;
            }
            this.excelData = [];
            if(this.cardProduct.length!=0){
                this.$http.post(this.$store.getters.newApiUrl+`/report/virtual_card/debit/excel`, postData)
                .then(response=>{
                    this.excelData = response.data.data;  
                    if(this.excelData.length!=0){
                        let elem = document.getElementById('excel-debit');
                        setTimeout(()=>{
                            elem.click();
                        }, 500)
                    }
                    this.loader = false;
                }, this.handleError)
            }
        
        },
        getAmount(){
            let postData = {
                dateFrom: this.date.fromDate,
                dateTo: this.date.toDate,
                status: ['SUCCESS'],
                cardProduct: this.cardProduct
            }
            if(postData.dateFrom===''&&postData.dateTo===''){
                delete postData.dateFrom;
                delete postData.dateTo;
            }
            if(this.cardProduct.length!=0){
                this.$http.post(this.$store.getters.newApiUrl+`/report/virtual_card/debit/amount`, postData)
                .then(response=>{
                    // console.log(response.data.data)
                    this.amountData = response.data.data;
                }, this.handleError)
            }
        },
        virtualCardsDebit(page){
            this.loader = true;
            let postData = {
                dateFrom: this.date.fromDate,
                dateTo: this.date.toDate,
                status: ['SUCCESS'],
                cardProduct: this.cardProduct
            }
            if(postData.dateFrom===''&&postData.dateTo===''){
                delete postData.dateFrom;
                delete postData.dateTo;
            }
            if(this.cardProduct.length!=0){

                this.$http.post(this.$store.getters.newApiUrl+`/report/virtual_card/debit?page=${page-1}&size=10`, postData)
                .then(response=>{
                    // console.log(response.data.data);
                    this.data = response.data.data.content;
                    this.totalPages = response.data.data.totalPages;
                    this.loader = false;
                    
                }, this.handleError)
            }
        }
    },
    mounted(){
        this.getAmount();
        this.virtualCardsDebit(1)
    }

}
</script>

<style scoped>
    .center{
        display: flex;
        justify-content: center;
        margin: 15px;
        flex-wrap: wrap;
    } 
    .excel-btn{
        border-radius: 29px;
        background: #3d9c3d !important;
        color: #FFFF !important;
        margin: 20px 10px;
    }  
    .head{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .amount-box{
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        margin: 15px 0;
    }
</style>