<template>
    <div class="main">
        <h1 class="header">Отчет по транзакциям программы лояльности</h1>
        <div class="param-box" v-if="filterType==='NONE'">
            <span class="row">
                <v-menu
                    v-model="menu1"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                >
                    <template v-slot:activator="{ on }">
                        <v-text-field
                            v-model="date1"
                            label="С"
                            prepend-icon="event"
                            readonly
                            v-on="on"
                        ></v-text-field>
                    </template>
                    <v-date-picker v-model="date1" @input="menu1 = false"></v-date-picker>
                </v-menu>
                <v-menu
                    v-model="menu2"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                >
                    <template v-slot:activator="{ on }">
                    <v-text-field
                        v-model="date2"
                        label="До"
                        prepend-icon="event"
                        readonly
                        v-on="on"
                    ></v-text-field>
                    </template>
                    <v-date-picker v-model="date2" @input="menu2 = false"></v-date-picker>
                </v-menu>
            </span>
            <!-- <v-btn class="get-button" :loading="loader" @click="getTransactions">Показать</v-btn> -->

        </div>
        <div class="search-box">
                <p class="search-text">Поиск: </p>
                <span class="select">
                    <v-select :items="filterTypeData" v-model="filterType"></v-select>
                </span>
                <template v-if="filterType!='NONE'">
                    <the-mask @keyup.enter="getFilterTransactions(1, 10)" v-if="filterType==='PHONE'" :mask="['998 9# ###-##-##']" class="phone"  v-model="filterValue" placeholder="998 " @keypress="isNumber($event)" type="text" />
                    <input  @keyup.enter="getFilterTransactions(1, 10)" v-if="filterType!='PHONE'&&filterType!='TRANSACTION_STATUS'" :placeholder="filterType" type="text" v-model="filterValue" class="phone">
                    <!-- <v-text-field  v-model="search" label="Поиск"></v-text-field> -->
                    <span class="select" v-if="filterType==='TRANSACTION_STATUS'">
                        <v-select v-model="filterValue" label="Выберите статус" :items="['SUCCESS', 'FAIL', 'TIMEOUT', 'PENDING', 'REVERSED', 'REVERSE_FAILED']"></v-select>
                    </span>
                    <v-btn :loading="loader" @click="getFilterTransactions(1, 10)">Найти</v-btn>
                </template>
                <v-progress-circular style="height:30px; width: 30px;"            
                v-if="loader"
                indeterminate
                color="amber"
                ></v-progress-circular>
                <v-spacer></v-spacer>
                <v-btn class="mt-3 excel-btn" :loading="loader" @click="getExcel">Скачать Excel</v-btn>
                    <download-excel
                        v-show="false"
                        id="excel"
                        name="loyaltyTransactions.xls"
                        :fields="operationExport"
                        :data="excelData">
                        <v-btn icon dark color="secondary">
                            <v-icon>mdi-file-excel</v-icon>
                        </v-btn>
                    </download-excel>   

        </div>
        <v-data-table
        :headers="headers"
        :items="content"                                                      
        hide-actions
        item-key="id">
            <template slot="items" slot-scope="props">
                <tr>
                    <td>{{ props.item.phone }}</td>
                    <td v-if="props.item.logo_url"><img class="logo" :src="props.item.logo_url" alt="logo"></td>
                    <td v-else>{{ props.item.logo_url }}</td>
                    <td>{{props.item.income | isPositive}} {{ props.item.apelsin_amount}} ALS</td>
                    <td>{{getAmount(props.item.currency, props.item.payment_amount, props.item.income) | number-format}}</td>            
                    <td>{{ props.item.sender }}</td>
                    <td>{{ props.item.receiver }}</td>
                    <td>{{ props.item.promo_code}}</td>  
                    <td>{{ props.item.status}}</td>    
                    <td>{{ props.item.transaction_date | timestamp-to-date}}</td>  
                    <td>{{ props.item.transaction_id}}</td>                    
                </tr>
            </template>                     
        </v-data-table>
        <v-pagination
        v-if="totalPages"
        class="center"
        v-model="page"
        :length="totalPages"
        :total-visible="10"
        ></v-pagination>
    </div>
</template>
<script>

export default {
    name: 'LoyaltyFilterTransactions',
    data(){
        return {
            date1: '',
            date2: new Date().toISOString().substr(0, 10),
            menu1: false,
            menu2: false,
            loader: false,
            search: '',
            filterType: 'NONE',
            filterValue: '',
            page: 1,
            totalPages: '',
            content: [],
            headers: [
                {text: "Номер телефона", value: "phone",sortable: false},
                {text: "Лого", value: "logo_url",sortable: false},
                {text: "Стоимость апельсина", value: "apelsin_amount", sortable: false},
                {text: "Сумма платежа", value: "payment_amount",sortable: false},

                {text: "Отправитель  ", value: "sender",sortable: false},
                {text: "Получатель", value: "receiver",sortable: false},
                {text: "Промокод", value: "promo_code",sortable: false},
                {text: "Статус", value: "status",sortable: false},
                {text: "Дата транзакции", value: "transaction_date",sortable: false},
                {text: "ID транзакции", value: "transaction_id",sortable: false},
            ],
            excelHeaders: [
                {text: "Номер телефона", value: "phone",sortable: false},
                {text: "Лого", value: "logo_url",sortable: false},
                {text: "Пополнение/списание", value: "income",sortable: false},
                {text: "Стоимость апельсина", value: "apelsin_amount", sortable: false},
                {text: "Сумма платежа", value: "payment_amount",sortable: false},

                {text: "Отправитель  ", value: "sender",sortable: false},
                {text: "Получатель", value: "receiver",sortable: false},
                {text: "Промокод", value: "promo_code",sortable: false},
                {text: "Статус", value: "status",sortable: false},
                {text: "Дата транзакции", value: "transaction_date",sortable: false},
                {text: "ID транзакции", value: "transaction_id",sortable: false},
            ],
            loader: true,
            filterTypeData: [
                'PHONE', 'SENDER', 'RECEIVER',  'TRANSACTION_ID' , 'TRANSACTION_STATUS', 'NONE'
            ],
            totalElements: '',
            excelData: [],
        }
    },
    watch:{
        page(val){
            this.getFilterTransactions(val, 10);
        },
        filterType(val){
            if(val==='NONE'){
                this.getFilterTransactions(this.page, 10);
            }
            this.filterValue = '';
        },
        date1(val){
            this.filterType = 'NONE';
            this.getFilterTransactions(1, 10);
        },
        date2(val){
            this.filterType = 'NONE';
            this.getFilterTransactions(1, 10);
        }
    },
    filters: {
        isPositive(val){
            if(val){
                return '+'
            }
            else{
                return '-'
            }
        }
    },
    computed:{
        operationExport() {
            let self = this, result = {};
            for (let i = 0; i < self.excelHeaders.length; i++) {
                let currentHeader = self.excelHeaders[i]; 
                if(currentHeader.text!="Лого")                 
                    result[currentHeader.text] = currentHeader.value;
            }
            result['Сумма платежа'] = {
                field: "payment_amount",
                callback: value => {
                    return (value / 100).toString().replace('.',',');
                }
            };
            result['Пополнение/списание'] = {
                field: "income",
                callback: value => {
                    if(value){
                        return 'ALS +'
                    }
                    else{
                        return 'ALS -'
                    }
                }
            };
            result['Дата транзакции'] = {
                field: "transaction_date",
                callback: value => {
                    let date = new Date(parseInt(value)).toLocaleString();
                    return date;
                }
            };
            return result;
        }
    },
    methods:{
        isNumber: function(evt) {
            evt = (evt) ? evt : window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                evt.preventDefault();
            } else {
                return true;
            }
        },
        getAmount(curObj, amount, income){
            if(income){
                return amount/ Math.pow(10, curObj.scale) + ' '+curObj.name;
            }
            else{
                return amount
            }
        },
        getTransactions(){
            let self = this;
            this.loader = true;
            var tmpTime = this.date2.split('-');
            var endTime  = new Date(tmpTime[0], tmpTime[1]-1, tmpTime[2], 23,59,59);
            tmpTime = this.date1.split('-');
            var begTime  = new Date(tmpTime[0], tmpTime[1]-1, tmpTime[2], 0,0,0);
            self.$http.get(self.$store.getters.newApiUrl2 + '/dashboard/loyalty/filter/loyalty/transactions',{
                params: {
                    page: 0,
                    size: 10,
                    start_date: begTime.getTime(),
                    end_date: endTime.getTime(),
                    // filter_type: "INTERVAL"
                }
            })
			.then((response) => {
                console.log(response.data.data);
                self.loader = false;
			}, self.handleError);
        },
        getExcel(){
            let self = this;
            
            var tmpTime = this.date2.split('-');
            var endTime  = new Date(tmpTime[0], tmpTime[1]-1, tmpTime[2], 23,59,59);
            tmpTime = this.date1.split('-');
            var begTime  = new Date(tmpTime[0], tmpTime[1]-1, tmpTime[2], 0,0,0);
            
            this.loader = true;

            // this.content = [];
            if(this.filterType==='PHONE'&&this.filterValue.length!=12)
                this.filterValue = '9989'+this.filterValue;
            if(this.filterType==='NONE'){
                var data = {
                    page: 0,
                    size: this.totalElements,
                    filter_type: "INTERVAL",
                    start_date: begTime.getTime(),
                    end_date: endTime.getTime()
                }
            }
            else{
                var data = {
                    page: 0,
                    size: this.totalElements,
                    filter_type: this.filterType,
                    filter_value: this.filterValue
                }
            
            }
            self.$http.get(self.$store.getters.newApiUrl2 + '/dashboard/loyalty/filter/transactions',{
                params: data
            })
            .then(response=>{
                self.excelData = response.data.data.content;
                self.loader = false;

                if(this.excelData.length!=0){
                    let elem = document.getElementById('excel');
                    setTimeout(()=>{
                        elem.click();
                    }, 500)
                }
            }, self.handleError)
        },
        getFilterTransactions(page, size){
            let self = this;
            
            var tmpTime = this.date2.split('-');
            var endTime  = new Date(tmpTime[0], tmpTime[1]-1, tmpTime[2], 23,59,59);
            tmpTime = this.date1.split('-');
            var begTime  = new Date(tmpTime[0], tmpTime[1]-1, tmpTime[2], 0,0,0);
            
            this.loader = true;

            // this.content = [];
            if(this.filterType==='PHONE'&&this.filterValue.length!=12)
                this.filterValue = '9989'+this.filterValue;
            if(this.filterType==='NONE'){
                var data = {
                    page: (page-1),
                    size: size,
                    filter_type: "INTERVAL",
                    start_date: begTime.getTime(),
                    end_date: endTime.getTime()
                }
            }
            else{
                var data = {
                    page: (page-1),
                    size: size,
                    filter_type: this.filterType,
                    filter_value: this.filterValue
                }
            
            }
            self.$http.get(self.$store.getters.newApiUrl2 + '/dashboard/loyalty/filter/transactions',{
                params: data
            })
            .then(response=>{
                // console.log(response.data.data);
                if(page===1){
                    self.page = 1;  
                }
                self.totalPages = response.data.data.totalPages;
                self.totalElements = response.data.data.totalElements;
                self.content = response.data.data.content;
                self.loader = false;
            }, self.handleError)
        }
        
    },
    created(){
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
        this.date1 = firstDay.getFullYear()+'-'+('0'+(firstDay.getMonth()+1)).substr(-2)+'-'+('0'+1).substr(-2);
    },
    mounted(){
        // this.getFilterTransactions(1);
    }

}
</script>

<style scoped>
    .excel-btn{
        border-radius: 29px;
        background: #3d9c3d !important;
        color: #FFFF !important;
        margin: 20px 0;
    }
    .header{
        text-align: center;
    }
    .head-text{
        font-size: 21px !important;
        padding: 9px 25px;
        display: flex;
        font-weight: 600;
    }
    .main{
        width: 100%;
    }
    .logo{
        max-width: 50px;
        max-height: 50px;
    }
    .center{
        margin: 10px;
        display: flex;
        justify-content: center;
    }
    .param-box{
        width: 500px;
        margin: 25px auto;
        background: #FFFF;
        padding: 19px;
        border-radius: 18px;
        display: flex;
        flex-direction: column;
    }
    .row{
        display: flex;
    }
    .get-button{
        margin: auto;
        width: 240px;
    }
    .search-box{
        display: flex;
        align-items: center;
    }
    .filter{
        /* width: 175px; */
    }
    .phone{
        height: 37px;
        border: 1px solid silver;
        padding: 10px;
        border-radius: 5px;
        width: 20%;
        margin: 5px;
    }
    .select{
        height: 64px;
        width: 200px;
        margin: 0 5px;
    }
    .search-text{
        margin: 5px;
        font-size: 18px;
    }

</style>
