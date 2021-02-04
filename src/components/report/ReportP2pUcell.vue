<template>
    <v-layout column wrap>
        <v-flex xs12>
            <div class="main">
                <v-card-text>
                        <!-- <h1 class="headline">Ucell P2P отчет</h1> -->

                    <v-layout row wrap>
                        <date-component @date="getDate"></date-component>
                        <div class="epos-box">
                            <!-- <v-btn @click="summeryLeftDialog=true" flat>Сводная 0,5%</v-btn>
                            <v-btn @click="summeryRightDialog=true" flat>Сводная 1%</v-btn> -->
                        </div>
                        <!-- <v-flex xs12>
                            <v-select
                                label="Операции"
                                :items="operationTypes"
                                v-model="operationType"
                                placeholder="Выберите опериции"
                                attach
                                chips
                                multiple>
                                <template v-slot:prepend-item>
                                    <v-list-tile ripple @click="toggle">
                                        <v-list-tile-action>
                                            <v-icon :color="operationType.length > 0 ? 'primary' : ''">{{ icon }}</v-icon> 
                                        </v-list-tile-action>
                                        <v-list-tile-content>
                                            <v-list-tile-title>Выбрать все</v-list-tile-title>
                                        </v-list-tile-content>
                                    </v-list-tile>
                                    <v-divider class="mt-2"></v-divider>
                                </template>
                                    
                            </v-select>
                        </v-flex> -->
                        <!-- <v-flex xs12>                        
                            <v-btn-toggle multiple v-model="filterToggle" key="all" class="selectedFilter">
                                <v-btn dark color="primary" @click="selectFilters('all')">Все</v-btn>
                                <v-btn dark color="accent" v-for="(filterItem,k) in operationTypes" :key="k"
                                    @click="selectFilters(filterItem)">
                                    {{filterItem}}
                                </v-btn>
                            </v-btn-toggle>
                        </v-flex> -->
                        <!-- <v-flex xs12 class="mt-3">
                            <report-date-time-picker :date-time-start.sync="operation.dateFrom"
                                                    :date-time-end.sync="operation.dateTo">
                                <v-btn :to="{name: 'clients'}" dark color="primary">Клиенты</v-btn>
                                <v-btn dark color="primary" @click="load" :loading="loader">Получить</v-btn>
                            </report-date-time-picker>
                        </v-flex> -->
                        <!-- <v-flex xs12>                        
                            <div class="d-flex flex-wrap checkbox">
                                <v-checkbox v-for="(item,index) in statusData" :key="index" v-model="status" :label="item.value" :value="item.key"></v-checkbox>
                            </div>
                        </v-flex> -->
                        <div class="button-box">
                            <v-btn dark color="primary" class="get-btn" @click="load" :loading="loader">Получить</v-btn>
                            <v-btn class="mt-3 excel-btn" :loading="loader" @click="getExcel">Скачать Excel</v-btn>
                                <download-excel
                                        v-show="false"
                                        id="excel2"
                                        name="p2p-Ucell.xls"
                                        :fields="operationExport"
                                        :data="excelData">
                                    <v-btn icon dark color="secondary">
                                        <v-icon>mdi-file-excel</v-icon>
                                    </v-btn>
                                </download-excel> 
                        </div>     
                        <div class="amount-box" v-if="operationAmount.totalAmount">
                            <span class="amount-box-child">
                                <span class="d-flex align-center column">
                                    <p class="amount-text">Общая сумма:</p>
                                    <p class="amount-value">{{operationAmount.totalAmount/100|number-format}}</p>
                                </span>
                                <span class="d-flex align-center column">
                                    <p class="amount-text">Чистая комиссия:</p>
                                    <p class="amount-value">{{operationAmount.netFee/100|number-format}}</p>
                                </span>
                            </span>  
                            
                        </div>                  
                        <template v-if="false">                        
                            <v-flex xs12>
                                <v-text-field
                                        v-model="search"
                                        prepend-icon="mdi-magnify"
                                        label="Поиск">
                                </v-text-field>
                            </v-flex>
                        </template>
                        <v-flex xs12 v-if="show">
                            <v-data-table
                                    :headers="operationsHeaders"
                                    :items="transactions"
                                    :loading="loader"
                                    :search="search"
                                    :pagination.sync="pagination"
                                    item-key="id"
                                    hide-actions
                                    >
                                <template slot="items" slot-scope="props">
                                    <tr @click="props.expanded = !props.expanded">               
                                        <td>{{ props.item.id }}</td>
                                        <td>{{props.item.amount/100| number-format}}</td>
                                        <td>{{ props.item.commission /100| number-format}}</td>
                                        <td>{{ props.item.bank }}</td>
                                        <td>{{ props.item.operationType}}</td>
                                        <td>{{ props.item.sender}}</td>
                                        <td>{{ props.item.receiver}}</td>
                                        <td>{{ props.item.status}}</td>
                                        <td>{{ props.item.timestamp | timestamp-to-date }}</td>
                                        <td>{{props.item.error}}</td>

                                    </tr>
                                </template>
                                <template slot="actions-append">
                                    <download-excel
                                            :fields="operationExport"
                                            name="ReportByTransactions"
                                            :data="operationsList.operations">
                                        <v-btn icon dark color="secondary">
                                            <v-icon>mdi-file-excel</v-icon>
                                        </v-btn>
                                    </download-excel>
                                </template>
                                <template slot="actions-prepend">
                                    <show-chart v-model="showCharts"/>
                                </template>
                            </v-data-table>
                                <v-pagination
                                v-if="transactions.length"
                                :disabled="loader"
                                class="center"
                                v-model="page"
                                :length="totalPages"
                                :total-visible="10"
                                ></v-pagination>    
                        </v-flex>                       
                    </v-layout>
                </v-card-text>
            </div>
        </v-flex>
    </v-layout>
</template>

<script>
    import ReportDateTimePicker from "./ReportDateTimePicker";
    import ShowChart from "../chart/ShowChart";
    import TransactionChart from "../chart/TransactionChart";
    import DateComponent from '@/components/date/DateComponent'
    export default {
        name: "ReportP2pUcell",
        components: {ReportDateTimePicker, ShowChart, TransactionChart, DateComponent},
        data() {
            return {
                search: '',
                filterStatus: 'success',
                status: 'SUCCESS',
                showCharts: false,
                operationsList: {},
                operationAmount: {},
                transactions: [],
                operationTypes: [],
                selectedFilters: [],
                filterToggle: [],
                availableFilters: [],
                amountData: {},
                pagination: {
                    sortBy: "createdDate",
                    descending: true,
                    rowsPerPage: 10
                },
                status: [],
                show: false,
                maskedFilters: [
                    'UZCARD',
                    'HUMO',
                    'VISA',
                    'Кошелек',
                    'Вклад'
                ],
                filters: [
                    {text: 'UZCARD2UZCARD', value: 'uzcard2uzcard'},
                    {text: 'UZCARD2HUMO', value: 'uzcard2humo'},
                    {text: 'HUMO2UZCARD', value: 'humo2uzcard'},
                    {text: 'HUMO2HUMO', value: 'humo2humo'},
                    {text: 'VISA2VISA', value: 'visa2visa'},
                    {text: 'UZCARD2WALLET', value: 'uzcard2wallet'},
                    {text: 'WALLET2UZCARD', value: 'wallet2uzcard'},
                    {text: 'HUMO2WALLET', value: 'humo2wallet'},
                    {text: 'WALLET2HUMO', value: 'wallet2humo'},
                    {text: 'VISA2WALLET', value: 'visa2wallet'},
                    {text: 'WALLET2VISA', value: 'wallet2visa'},
                    {text: 'WALLET2ACCOUNT', value: 'wallet2account'},
                    {text: 'WALLET2LOAN', value: 'wallet2loanRepayment'}
                ],
                operation: {
                    dateStart: null,
                    dateEnd: (new Date).toLocaleString(),
                    operationType: [],
                    phoneNumber: '',
                    operationStatus: 'SUCCESS'
                },
                operationsHeaders: [
                    {text: "ID", value: "id"},
                    {text: "Сумма", value: "amount"},
                    {text: "Комиссия", value: "commission"},
                    {text: "Банк", value: "bank"},
                    {text: "Тип операции", value: "operationType"},                   
                    {text: "Отправитель", value: "sender"},
                    {text: 'Получатель', value: "receiver"},
                    {text: "Статус", value: "status"},
                    {text: "Дата и время", value: "timestamp"},
                    {text: "Ошибки", value: "error"},
                ],
                filtersTypeTemp: [],
                statusData: [],
                operationType: [],
                data: {
                    status: [],
                    operationType: [],
                    dateFrom: '',
                    dateTo: '',
                },
                totalPages: '',
                page: 1,
                excelData: [],
                summeryLeftDialog: false,
                summeryRightDialog: false,
                totalElements: '',
                date: {}
            }
        },
        methods: {
            getDate(val){
                this.date = val;
                this.transactions = [];
                this.totalPages = '';
                this.amountData = [];
                this.show = false;
                this.operationAmount = {}
                // console.log(this.date)
                // if(this.page===1)
                //     this.getRequisite(this.page);
                // else
                //     this.page = 1;
            },
            toggle(){
                this.$nextTick(() => {
                    if(this.likesAllFruit){
                        this.operationType = [];
                    }else{
                        this.operationType = this.operationTypes;
                    }
                })
            },
            getStatus(){
                this.$http.get(this.$store.getters.beelineUrl+`/apelsin/transaction/status`, {headers:{
                    Authorization: 'Basic YmVlbGluZS1rYXBpdGFsOmNXQTM4JUpALFllR2U9VDY=',
                }})
                .then(response=>{
                    console.log(response.data.data);
                    this.statusData = response.data.data;
                    response.data.data.forEach(x=>{
                        this.status.push(x.key);                        
                    })
                }, this.handleError)

            },
            getTypeOperations() {
                let self = this;
                self.$http.get(self.$store.getters.beelineUrl + '/apelsin/transaction/operationType', {headers:{
                    Authorization: 'Basic YmVlbGluZS1rYXBpdGFsOmNXQTM4JUpALFllR2U9VDY=',
                }})
                    .then(response => {
                        self.operationTypes = response.data.data;
                        this.operationType = self.operationTypes
                        this.selectFilters('all')
                        

                    }, self.handleError);
            },
            selectFilters(template) {
                let self = this, isEnabled = false;
                self.$nextTick(() => {
                    self.filters.forEach(item => self.filtersTypeTemp.push(item.value));
                    isEnabled = self.filterToggle.indexOf(self.filtersTypeTemp.indexOf(template) + 1) !== -1;
                    if (template === "all") {
                        if (self.filterToggle.indexOf(0) !== -1) {
                            self.filters.forEach(item => self.selectedFilters.push(item.value));
                            self.operation.operationType = self.selectedFilters;
                        } else {
                            self.selectedFilters = [];
                        }
                        return;
                    }

                    for (let i = 0; i < self.operationTypes.length; i++) {
                        let currentItem = self.operationTypes[i];
                        if (currentItem.indexOf(template) !== -1) {
                            let index = self.selectedFilters.indexOf(currentItem);
                            if (isEnabled) {
                                if (index === -1) {
                                    self.selectedFilters.push(currentItem);
                                    self.operation.operationType = self.selectedFilters;
                                }
                            } else {
                                if (index !== -1) {
                                    self.selectedFilters.splice(index, 1);
                                    self.operation.operationType = self.selectedFilters;
                                }
                            }
                        }
                    }
                })
            },
            loadAmount() {
                let self = this;       
                let data = {
                    from: this.data.dateFrom,
                    to: this.data.dateTo
                }
                if(this.data.dateFrom===''&&this.data.dateTo===''){
                    delete data.from;
                    delete data.to
                }         
                self.$http.get(self.$store.getters.ucellUrl + '/reports/p2p/getAll/amountAndFee',{headers:{Authorization: 'Basic dWNlbGwta2FwaXRhbDo1WD8nJWRWezdEcyNAdnBW'}
                , params: data})
                    .then(response => {
                        self.operationAmount = response.data.data;
                        // console.log(response.data.data);
                        this.show = true;
                    }, self.handleError);
            },
            load() {
                let self = this;
                this.data.dateFrom = this.date.fromDate;
                this.data.dateTo = this.date.toDate;
                this.data.status = this.status;
                this.data.operationType = this.operationType;
                if(this.date.fromDate==="")
                    delete this.data.dateFrom
                if(this.date.toDate==="")
                    delete this.data.dateTo
                // this.data.operationType = this.operation.operationType;
                self.loadAmount();
                self.loadReports(1);
                
            },
            getExcel() {
                let self = this;
                self.loader = true;
                self.excelData = [];
                this.data.dateFrom = this.date.fromDate;
                this.data.dateTo = this.date.toDate;
                this.data.status = this.status;
                this.data.operationType = this.operationType;
                // if(this.date.fromDate==="")
                //     delete this.data.dateFrom
                // if(this.date.toDate==="")
                //     delete this.data.dateTo
                let data = {
                    from: this.data.dateFrom,
                    to: this.data.dateTo
                }
                if(this.data.dateFrom===''&&this.data.dateTo===''){
                    delete data.from;
                    delete data.to
                }
                self.$http.get(self.$store.getters.ucellUrl + `/reports/p2p/getAll/excel`,{headers:{
                    Authorization: 'Basic dWNlbGwta2FwaXRhbDo1WD8nJWRWezdEcyNAdnBW',
                }, params: data})
                    .then(response => {
                        self.loader = false;
                        self.excelData = response.data.data;  
                        // console.log(self.excelData)
                        if(this.excelData.length!=0){
                            let elem = document.getElementById('excel2');
                            setTimeout(()=>{
                                elem.click();
                            }, 500)
                        
                        }                                          
                    }, self.handleError);
            },
            loadReports(page) {
                let self = this;
                self.loader = true;
                // self.transactions = [];
                // console.log(this.operation)
                console.log(this.data)
                let data = {
                    from: this.data.dateFrom,
                    to: this.data.dateTo
                }
                if(this.data.dateFrom===''&&this.data.dateTo===''){
                    delete data.from;
                    delete data.to
                }
                self.$http.get(self.$store.getters.ucellUrl + `/reports/p2p/getAll?page=${page-1}&size=10`, {headers:{
                    Authorization: 'Basic dWNlbGwta2FwaXRhbDo1WD8nJWRWezdEcyNAdnBW',
                }, params: data})
                    .then(response => {
                        self.loader = false;
                        self.operationsList = response.data.data;
                        self.transactions = self.operationsList.content;
                        self.totalPages = self.operationsList.totalPages;
                        this.totalElements = response.data.data.totalElements

                        self.show = true;
                        
                    }, self.handleError);
                    
            },
            phoneFormat(phone) {
                if (phone === '' || phone === null) {
                    return '';
                }
                return phone;
            }
        },
        computed: {
            sortedAvailableFilter() {
                let self = this;
                // return self.operationTypes.sort();
                return self.filterGroups;
            },
            likesAllFruit(){
                return this.operationType.length === this.operationTypes.length
            },
            likesSomeFruit(){
                return this.operationType.length > 0 && !this.likesAllFruit
            },
            icon(){
                if(this.likesAllFruit) return 'mdi-close-box'
                if(this.likesSomeFruit) return 'mdi-minus-box'
                return 'mdi-checkbox-blank-outline'
            },
            operationExport() {
                let self = this, result = {};
                for (let i = 0; i < self.operationsHeaders.length; i++) {
                    let currentHeader = self.operationsHeaders[i];                  
                    result[currentHeader.text] = currentHeader.value;
                }

                result['Сумма'] = {
                    field: "amount",
                    callback: value => {
                        return (value / 100).toString().replace('.',',');
                    }
                };
                result['Комиссия'] = {
                    field: "commission",
                    callback: value => {
                        return (value / 100).toString().replace('.',',');
                    }
                };

                result['Дата и время'] = {
                    field: "timestamp",
                    callback: value => {
                        let date = new Date(parseInt(value)).toLocaleString();
                        return date;
                    }
                };
                return result;
            }
        },
        watch: {
            page(val){
                this.loadReports(val);
            },
            filterStatus(value) {
                let self = this;
                if (value === 'success') {
                    self.operation.operationStatus = 'SUCCESS';
                    self.loadReports();
                }
                if (value === 'failed') {
                    self.operation.operationStatus = 'FAILED';
                    self.loadReports();
                }
            },
            status(val){
                
                this.transactions = [];
                this.totalPages = '';
                this.show = false;
                this.operationAmount = {}
                
            },
            operationType(val){
                this.transactions = [];
                this.totalPages = '';
                this.show = false;
                this.operationAmount = {}

            }
        
        },
        mounted() {
            this.getTypeOperations();
            this.getStatus();
            // this.loadReports(1);
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
    .selectedFilter {
        display: flex;
        flex-wrap: wrap;
    }
    .get-btn{
        border-radius: 20px;
    }
    .checkbox{
        background: #fff;
        padding: 0 10px;
        border-radius: 15px;
        margin: 15px 0;
        flex-wrap: wrap;
    }    
    .v-item-group{
        flex-wrap: wrap !important;
        -webkit-box-shadow: none;
        box-shadow: none;
    }
    .epos-box{
        margin: auto;
    }
    small{
        color: #9c9c9c;
        font-weight: 400;
        font-size:14px;
    }
    /* hr{
        display: none;
        height: 1px;
        border: none;
        background: #c4c4c4;
    } */
    .new{
        display: block;
        margin: 20px 0;
        background: white;
    } 
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
        margin: 20px 0;
    }
    .amount-text{
        margin: 0;
        font-style: italic;
        font-size: 16px;
    }
    .amount-value{
        font-size: 18px;
        font-weight: 600;
        margin: 0 7px;
    }
    .amount-box{
        display: flex;
        justify-content: center;
        width: 100%;
        flex-wrap: wrap;
        margin: 10px 0 25px 0;
    }
    .amount-box-child{
        padding: 10px 20px; 
        border: 1px solid silver;
        border-radius: 17px;
        margin: 10px 20px;
    }
    .epos-content{
        height: 500px;
        overflow: auto;
    }
    .button-box{
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        align-items: center;
        margin: 10px;
    }
    .v-btn{
            margin: 5px 10px 5px 0px !important;
            
        }
    @media only screen and (max-width: 820px){
        .v-btn{
            margin: 5px 10px 5px 0px !important;
            
        }
    }
    @media only screen and (max-width: 600px){
        /* hr{
            display: block;
            height: 1px;
            border: none;
            background: #c4c4c4;
        } */
    }
    .right{
        margin-right:50px;
    }
    .column{
        flex-direction: column;
    }
    .amount-box-child{
        width: 310px;
    }
    h1{
        margin-bottom: 5px;
    }
    .dialog-text{
        width: 200px;
        margin: 10px;
    }
    .dialog{
        text-align: center;
        padding: 0;
    }
    .dialog-header{
        background: #eadaa0;
        padding: 16px;
        flex-wrap: nowrap;
    }
    .bg-color{
        background: #efefef !important;
    }
</style>