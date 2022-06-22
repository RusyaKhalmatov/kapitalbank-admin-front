<template>
    <v-flex xs12>
        <div class="main">
            <v-card-title>
                <v-spacer/>

                <h1 class="headline">Отчет по конвертации валют</h1>

                <v-spacer/>
                <v-btn icon small @click="redirect('report')">
                    <v-icon small>mdi-arrow-left</v-icon>
                </v-btn>
            </v-card-title>
            <date-component @date="getDate"></date-component>
            <v-card-text>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-flex xs12>
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
                        </v-flex>
                        <v-flex xs12>
                            <div class="d-flex flex-wrap checkbox">
                                <v-checkbox v-for="(item,index) in statusData" :key="index" v-model="status" :label="item.value" :value="item.key"></v-checkbox>
                            </div>
                        </v-flex>
                        <div class="button-box">
                            <v-btn dark color="primary" class="get-btn" @click="load" :loading="loader">Получить</v-btn>
                            <v-btn v-if="result.content" class="mt-3 excel-btn" :loading="loader" @click="getExcel">Скачать Excel</v-btn>
                                <download-excel
                                        v-show="false"
                                        id="excel"
                                        name="conversion.xls"
                                        :fields="conversionExport"
                                        :data="excelData">
                                    <v-btn icon dark color="secondary">
                                        <v-icon>mdi-file-excel</v-icon>
                                    </v-btn>
                                </download-excel>
                        </div>
                        <v-layout row wrap>
                            <v-flex xs12>
                                <v-layout justify-center wrap>
                                    <div class="box" v-for="(item, value, i) in resultAmount" :key="i">
                                        <h1>{{value.toUpperCase()}}</h1>
                                        <span class="d-flex align-center my-3" style="-ms-flex-wrap: wrap;flex-wrap: wrap">
                                            <span :class="['mx-3', {'brd': index===0}]" v-for="(val, type, index) in item" :key="index">
                                                <h2>{{type}}:</h2>
                                                <span class="d-flex column" style="-ms-flex-wrap: wrap;flex-wrap: wrap">
                                                    <p class="amount-text">Общая сумма:</p>
                                                    <p class="amount-value">{{val.sum / 100 | numberFormat}}</p>
                                                </span>
                                                <span class="d-flex column" style="-ms-flex-wrap: wrap;flex-wrap: wrap">
                                                    <p class="amount-text">Сумма карты наших банков:</p>
                                                    <p class="amount-value">{{val.our / 100 | numberFormat}}</p>
                                                </span>
                                                <span class="d-flex column" style="-ms-flex-wrap: wrap;flex-wrap: wrap">
                                                    <p class="amount-text">Сумма карты друних банков:</p>
                                                    <p class="amount-value">{{val.other / 100 | numberFormat}}</p>
                                                </span>
                                            </span>
                                            <v-divider
                                                class="mx-4"
                                                vertical
                                            ></v-divider>
                                        </span>

                                    </div>

                                </v-layout>
                            </v-flex>

                            <v-flex xs12 v-if="result">

                                <v-text-field
                                        v-model="search"
                                        prepend-icon="mdi-magnify"
                                        v-if="result.content"
                                        label="Поиск"/>

                                <v-data-table
                                        :headers="conversionHeader"
                                        :items="result.content"
                                        v-if="result.content"
                                        :loading="loader"
                                        :pagination.sync="pagination"
                                        hide-actions
                                        >
                                    <template slot="items" slot-scope="props">
                                        <tr @click="props.expanded = !props.expanded">
                                            <td>{{props.item.id}}</td>
                                            <td>{{props.item.userId}}</td>
                                            <td>{{props.item.customerId}}</td>
                                            <td style="font-size:10px">{{props.item.username}}</td>
                                            <td>{{props.item.login}}</td>
                                            <td>{{props.item.city}}</td>
                                            <td>{{props.item.sender}}</td>
                                            <td>{{props.item.receiver}}</td>
                                            <td>{{props.item.operationType}}</td>
                                            <td>{{props.item.senderAmount / 100 | number-format}} {{props.item.senderCurrency}}</td>
                                            <td>{{props.item.receiverAmount / 100 | number-format}} {{props.item.receiverCurrency}}</td>
                                            <td>{{props.item.fee / 100 | number-format}} {{props.item.senderFeeCurrency}}</td>
                                            <td>{{props.item.operationStatus}}</td>
                                            <td>{{props.item.platform}}</td>
                                            <td>{{props.item.appVersion}}</td>
                                            <td>{{props.item.endTime | timestamp-to-date}}</td>
                                        </tr>
                                    </template>
                                    <template slot="actions-append">
                                        <download-excel
                                                :fields="conversionExport"
                                                name="ReportByPaynet"
                                                :data="result.operations">
                                            <v-btn icon dark color="secondary">
                                                <v-icon>mdi-file-excel</v-icon>
                                            </v-btn>
                                        </download-excel>
                                    </template>
                                </v-data-table>
                                <v-pagination
                                v-if="result.length!=0"
                                :disabled="loader"
                                class="center"
                                v-model="page"
                                :length="totalPages"
                                :total-visible="10"
                                ></v-pagination>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-card-text>
        </div>
    </v-flex>
</template>

<script>
    import ReportDateTimePicker from "./ReportDateTimePicker";
    import DateComponent from '@/components/date/DateComponent'

    export default {
        name: "ReportConversion",
        components: {ReportDateTimePicker, DateComponent},
        data() {
            return {
                conversionHeader: [
                    {text: "ID транзакции", value: "id"},
                    {text: "ID клиента", value: "userId"},
                    {text: "Customer ID", value: "customerId"},
                    {text: "Имя", value: "username"},
                    {text: "Login", value: "login"},
                    {text: "Город", value: "city"},
                    {text: "Отправитель", value: "sender"},
                    {text: "Получатель", value: "receiver"},
                    {text: "Тип операции", value: "operationType"},
                    {text: "Сумма отправителя", value: "senderAmount"},
                    // {text: "Валюта отправителя", value: "senderCurrency"},
                    {text: "Сумма получателя", value: "receiverAmount"},
                    // {text: "Валюта получателя", value: "receiverCurrency"},
                    {text: "Вознаграждения", value: "fee"},
                    // {text: "Валюта комиссии", value: "senderFeeCurrency"},
                    {text: "Статус", value: "operationStatus"},
                    {text: "Платформа", value: "platform"},
                    {text: "Версия", value: "appVersion"},
                    {text: "Дата и время", value: "endTime"},
                ],
                filterGroups: [],
                conversionData: {
                    dateStart: null,
                    dateEnd: (new Date).toLocaleString(),
                    operationType: [],
                    status: 'SUCCESS'
                },
                pagination: {
                    // sortBy: "date",
                    // descending: true,
                    rowsPerPage: 10
                },
                result: [],
                resultAmount: [],
                filterToggle: [],
                selectedFilters: [],
                search: '',
                totalAmount: '',
                postData : {},
                totalPages: 0,
                page: 1,
                loader: false,
                isSearch: false,
                excelData: [],
                date:{},
                operationType: [],
                operationTypes: [],
                statusData: [],
                status: [],

            }
        },
        watch:{
            page(val){
                this.getConversionData(val);
            },
            search(val){
                if(val){
                    this.isSearch = true;
                    if(this.page!=1)
                        this.page = 1;
                    else{
                        this.getConversionData(1);
                    }
                }
                else{
                    this.isSearch = false;
                    this.getConversionData(1);
                }
            },
            status(val){
                this.result = [];
            },
            operationType(val){
                this.result = [];
            }
        },
        methods: {
            toggle(){
                this.$nextTick(() => {
                    if(this.likesAllFruit){
                        this.operationType = [];
                    }else{
                        this.operationType = this.operationTypes;
                    }
                })
            },
            getDate(val){
                this.date = val;
                this.result = [];
            },
            load() {
                let dateFrom =  this.date.fromDate;
                let dateTo = this.date.toDate;

                Object.assign(this.postData, {
                    dateFrom :  dateFrom,
                    dateTo : dateTo,
                    operationType: this.operationType,
                    // status: this.conversionData.status
                    status: this.status
                })
                if(this.postData.dateFrom===''&&this.postData.dateTo===''){
                    delete this.postData.dateFrom;
                    delete this.postData.dateTo;
                }
                this.getConversionDataAmount();
                if(this.page===1)
                    this.getConversionData(1);
                else
                    this.page = 1;
            },
            getStatus(){
                this.$http.get(this.$store.getters.newApiUrl2+`/report/conversion/status`)
                .then(response=>{
                    console.log(response.data.data);
                    this.statusData = response.data.data;
                    response.data.data.forEach(x=>{
                        this.status.push(x.key);
                    })
                }, this.handleError)

            },
            getExcel(){
                this.loader = true;
                this.excelData = [];
                this.$http.post(this.$store.getters.newApiUrl2+`/report/conversion/excel?q=${this.search}`, this.postData)
                .then(response=>{
                    console.log(response.data.data)
                    this.excelData = response.data.data;
                    if(this.excelData.length!=0){
                        let elem = document.getElementById('excel');
                        setTimeout(()=>{
                            elem.click();
                        }, 500)

                    }
                    this.loader = false;
                },this.handleError)
            },
            getConversionData(page) {
                let self = this;
                self.loader = true;
                self.$http.post(self.$store.getters.newApiUrl2 + '/report/conversion?page='+(page-1)+'&size=10&q='+this.search, self.postData)
                    .then(response => {
                        self.result = response.data.data;
                        self.totalPages = response.data.data.totalPages;

                        self.loader = false;
                    }, self.handleError);
            },
            getConversionDataAmount() {
                let self = this;
                this.resultAmount = [];
                self.$http.post(self.$store.getters.newApiUrl2 + '/report/conversion/amount?q='+this.search, self.postData)
                    .then(response => {
                        self.resultAmount = response.data.data;
                        console.log(self.resultAmount)
                    }, self.handleError);
            },
            getOperationTypes(){
                let self = this;
                self.operationType = [];
                self.$http.get(self.$store.getters.newApiUrl2 + '/report/conversion/operationTypes')
                    .then(response => {
                        self.operationTypes = response.data.data;
                        self.operationType = self.operationTypes;
                    }, self.handleError);
            },
            selectFilters(template) {
                let self = this, isEnabled = false;
                self.$nextTick(() => {
                    isEnabled = self.filterToggle.indexOf(self.filterGroups.indexOf(template) + 1) !== -1;
                    if (template === "all") {
                        if (self.filterToggle.indexOf(0) !== -1) {
                            self.selectedFilters = self.filterGroups;
                            self.conversionData.operationType = self.selectedFilters;
                        } else {
                            self.selectedFilters = [];
                        }
                        return;
                    }

                    for (let i = 0; i < self.filterGroups.length; i++) {
                        let currentItem = self.filterGroups[i];
                        if (currentItem.indexOf(template) !== -1) {
                            let index = self.selectedFilters.indexOf(currentItem);
                            if (isEnabled) {
                                if (index === -1) {
                                    self.selectedFilters.push(currentItem);
                                    self.conversionData.operationType = self.selectedFilters;
                                }
                            } else {
                                if (index !== -1) {
                                    self.selectedFilters.splice(index, 1);
                                    self.conversionData.operationType = self.selectedFilters;
                                }
                            }
                        }
                    }
                })
            },
        },
        computed: {
            conversionExport() {
                let self = this,
                    result = {};

                for (let i = 0; i < self.conversionHeader.length; i++) {
                    let currentHeader = self.conversionHeader[i];
                    result[currentHeader.text] = currentHeader.value;
                }
                result['Отправитель'] = {
                    field: "sender",
                    callback: value => {
                        let date = new Date(value);
                        return "'"+value;
                    }
                };
                result['Получатель'] = {
                    field: "receiver",
                    callback: value => {
                        let date = new Date(value);
                        return "'"+value;
                    }
                };
                result['Дата и время'] = {
                    field: "endTime",
                    callback: value => {
                        let date = new Date(value);
                        return date.toLocaleString();
                    }
                };
                result['Сумма отправителя'] = {
                    field: "senderAmount",
                    callback: value => {
                        return (value / 100).toString().replace('.',',');
                    }
                };
                result['Сумма получателя'] = {
                    field: "receiverAmount",
                    callback: value => {
                        return (value / 100).toString().replace('.',',');
                    }
                };
                result['Вознаграждения'] = {
                    field: "fee",
                    callback: value => {
                        return (value / 100).toString().replace('.',',');
                    }
                };
                result['Валюта отправителя'] = {
                    field: "senderCurrency",
                    callback: value => {
                        return value;
                    }
                };
                result['Валюта получателя'] = {
                    field: "receiverCurrency",
                    callback: value => {
                        return value;
                    }
                };
                result['Валюта комиссии'] = {
                    field: "senderFeeCurrency",
                    callback: value => {
                        return value;
                    }
                };
                return result;
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
        },
        mounted(){
            this.getOperationTypes();
            this.getStatus();
        }
    }
</script>

<style scoped>
    .selectedFilter {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-wrap: wrap;
            flex-wrap: wrap;
    }
    .v-item-group{
        -ms-flex-wrap: wrap !important;
            flex-wrap: wrap !important;
        -webkit-box-shadow: none;
        box-shadow: none;
    }
    .checkbox{
        background: #fff;
        padding: 0 10px;
        border-radius: 15px;
        margin: 15px 0;
        -ms-flex-wrap: wrap;
            flex-wrap: wrap;
    }
    .center{
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: center;
            -ms-flex-pack: center;
                justify-content: center;
        margin: 15px;
        -ms-flex-wrap: wrap;
            flex-wrap: wrap;
    }
    .amount-text{
        margin: 0;
        width: 195px;
        text-align: center;
    }
    .amount-value{
        font-weight: 600;
        font-size: 18px;
        margin: 0;
    }
    /*small{
        color: #9c9c9c;
        font-weight: 400;
        font-size:14px;
    }*/
    .main{
        width: 100%;
    }
    .headline{
        text-align: center;
    }
    br{
        display: none;
    }
    hr{
        display: none;
        height: 1px;
        border: none;
        background: #c4c4c4;
        margin-bottom: 20px;
    }
    .excel-btn{
        border-radius: 29px;
        background: #3d9c3d !important;
        color: #FFFF !important;
        margin: 20px 0;
    }
    .get-btn{
        border-radius: 20px;
    }
    .button-box{
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: justify;
            -ms-flex-pack: justify;
                justify-content: space-between;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        width: 100%;
        align-items: center;
        margin: 10px;
    }
    .box{
        border: 1px solid silver;
        padding: 15px;
        border-radius: 18px;
        margin: 10px;
        min-width: 80%;
    }
    .brd{
        border-right: 1px solid silver;
        padding: 0px 33px 0 0;
    }
    @media only screen and (max-width: 820px){
        .v-btn{
            margin: 5px 10px 5px 0px !important;

        }
        .brd{
            border: 0;
            padding: 0;
        }
    }
    @media only screen and (max-width: 600px){
        br{
            display: block;
        }
        small{
            color: #9c9c9c;
            font-weight: 400;
            font-size:16px;
        }
        .mb{
            font-size: 24px;
        }
        hr{
            display: block;
        }
        .column{
            -webkit-box-orient: vertical;-webkit-box-direction: normal;-ms-flex-direction: column;flex-direction: column;
                -webkit-box-align: center;
                    -ms-flex-align: center;
                        align-items: center;
        }
        .brd{
            border: 0;
            padding: 0;
        }
        h2{
            text-align: center;

        }
    }

</style>
