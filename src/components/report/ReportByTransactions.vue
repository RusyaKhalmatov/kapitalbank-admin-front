<template>
    <v-layout column wrap>
        <v-flex xs12>
            <div class="main">
                <v-card-text>
                        <h1 class="headline">По Транзакциям</h1>

                    <v-layout row wrap>
                        <date-component @date="getDate"></date-component>
                        <div class="epos-box">
                            <v-btn @click="summeryLeftDialog=true" flat>Сводная 0,5%</v-btn>
                            <v-btn @click="summeryRightDialog=true" flat>Сводная 1%</v-btn>
                        </div>
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
                        <v-flex xs12>
                            <!-- <v-radio-group v-model="operation.operationStatus" row>
                                <v-radio key="success" label="Success" value="SUCCESS"/>
                                <v-radio key="failed" label="Failed" value="FAILED"/>
                            </v-radio-group> -->
                            <div class="d-flex flex-wrap checkbox">
                                <v-checkbox v-for="(item,index) in statusData" :key="index" v-model="status" :label="item.value" :value="item.key"></v-checkbox>
                            </div>
                        </v-flex>
                        <div class="button-box">
                            <v-btn dark color="primary" class="get-btn" @click="load" :loading="loader">Получить</v-btn>
                            <v-btn class="mt-3 excel-btn" :loading="loader" @click="getExcel">Скачать Excel</v-btn>
                                <download-excel
                                        v-show="false"
                                        id="excel"
                                        name="p2p.xls"
                                        :fields="operationExport"
                                        :data="excelData">
                                    <v-btn icon dark color="secondary">
                                        <v-icon>mdi-file-excel</v-icon>
                                    </v-btn>
                                </download-excel> 
                        </div>  
                        <div class="amount-box">
                            <span v-for="(item,key,index) in operationAmount" :key="index" class="amount-box-child">
                                <h1>{{key}}:</h1>
                                <span class="d-flex align-center column">
                                    <p class="amount-text">Общая сумма:</p>
                                    <p class="amount-value">{{item.amount/100|number-format}}</p>
                                </span>
                                <span class="d-flex align-center column">
                                    <p class="amount-text">Комиссия:</p>
                                    <p class="amount-value">{{item.fee/100|number-format}}</p>
                                </span>
                            </span>  
                            
                        </div>    
                        <!-- <template v-if="isClick">
                            <v-btn class="mb-3" v-if="chartLoader" depressed small @click="isChartShow=!isChartShow">{{chartBtnShow}}</v-btn>
                            <v-progress-circular style="height:30px; width: 30px;"      
                            v-else   
                            class="center ml-2"
                            indeterminate
                            color="amber"
                            ></v-progress-circular>
                            <div v-if="isChartShow"  style="width:100%">
                                <line-chart :chartdata="chartdata" :options="chartOptions"/>    
                            </div>      
                        </template>                         -->
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
                                        <td>{{props.item.login.split(":")[0]}}
                                            {{phoneFormat(props.item.login.split(":")[1]) | timestamp-to-date}}
                                        </td>
                                        <td>{{ props.item.userType }}</td>
                                        <td>{{ props.item.sender }}</td>
                                        <td>{{ props.item.receiver }}</td>
                                        <td>{{ props.item.bank }}</td>
                                        <td>{{ props.item.operationType }}</td>
                                        <td>{{ props.item.currency }}</td>                                    
                                        <td style="min-width:145px">{{ props.item.amount / 100 | number-format }}</td>
                                        <td>{{ props.item.fee / 100 | number-format }}</td>
                                        <td>{{ props.item.status }}</td>
                                        <td>{{ props.item.platform }}</td>
                                        <td>{{ props.item.appVersion }}</td>                                        
                                        <td>{{ props.item.dateTime | timestamp-to-date}}</td>

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
        <v-dialog  v-model="summeryLeftDialog" persistent max-width="800">
            <v-card>
                <v-card-title class="headline">Сводная 0,5%</v-card-title>
                <v-card-title class="d-flex dialog dialog-header">
                    <p class="dialog-text ma-0">Название</p>
                    <p class="dialog-text ma-0">Merchant</p>
                    <p class="dialog-text ma-0">Terminal</p>
                </v-card-title>
                <v-card-text class="epos-content dialog">
                    <span class="d-flex">
                        <p class="dialog-text">Xalq Bank</p>
                        <p class="dialog-text">9006101523</p>
                        <p class="dialog-text">92800312</p>
                    </span>
                    <span class="d-flex bg-color">
                        <p class="dialog-text">Agro Bank</p>
                        <p class="dialog-text">90040658830</p>
                        <p class="dialog-text">93019138</p>
                    </span>
                    <span class="d-flex">
                        <p class="dialog-text">NBU</p>
                        <p class="dialog-text">900230115</p>
                        <p class="dialog-text">91000341</p>
                    </span>
                    <span class="d-flex bg-color">
                        <p class="dialog-text">AsakaBank</p>
                        <p class="dialog-text">901334027</p>
                        <p class="dialog-text">92000136</p>
                    </span>
                    <span class="d-flex">
                        <p class="dialog-text">IpotekaBank</p>
                        <p class="dialog-text">90330080001</p>
                        <p class="dialog-text">96015798</p>
                    </span>
                    <span class="d-flex bg-color">
                        <p class="dialog-text">Mikrokreditbank</p>
                        <p class="dialog-text">9005223714</p>
                        <p class="dialog-text">91404355</p>
                    </span>
                    <span class="d-flex">
                        <p class="dialog-text">Sanoat qurilish bank (UzPSB)</p>
                        <p class="dialog-text">900333026</p>
                        <p class="dialog-text">95000599</p>
                    </span>
                    <span class="d-flex bg-color">
                        <p class="dialog-text">Ipak Yuli Bank</p>
                        <p class="dialog-text">90140025997</p>
                        <p class="dialog-text">91300678</p>
                    </span>
                    <span class="d-flex">
                        <p class="dialog-text">Qishloq Qurilish Bank</p>
                        <p class="dialog-text">900932825</p>
                        <p class="dialog-text">98000141</p>
                    </span>
                    <span class="d-flex bg-color">
                        <p class="dialog-text">Hamkorbank</p>
                        <p class="dialog-text">901246731</p>
                        <p class="dialog-text">91500257</p>
                    </span>
                    <span class="d-flex">
                        <p class="dialog-text">Kapital Bank</p>
                        <p class="dialog-text">90490011502</p>
                        <p class="dialog-text">91100673</p>
                    </span>
                    <span class="d-flex bg-color">
                        <p class="dialog-text">Turon Bank</p>
                        <p class="dialog-text">901116986</p>
                        <p class="dialog-text">99000047</p>
                    </span>
                    <span class="d-flex">
                        <p class="dialog-text">Aloqa Bank</p>
                        <p class="dialog-text">903119289</p>
                        <p class="dialog-text">97004014</p>
                    </span>
                    <span class="d-flex bg-color">
                        <p class="dialog-text">Savdogar Bank</p>
                        <p class="dialog-text">900820610</p>
                        <p class="dialog-text">91600122</p>
                    </span>
                    <span class="d-flex">
                        <p class="dialog-text">TrastBank</p>
                        <p class="dialog-text">903016329</p>
                        <p class="dialog-text">91200195</p>
                    </span>
                    <span class="d-flex bg-color">
                        <p class="dialog-text">Orient Finans Bank</p>
                        <p class="dialog-text">10716147</p>
                        <p class="dialog-text">92800456</p>
                    </span>
                    <span class="d-flex">
                        <p class="dialog-text">Invest Finance Bank (InfinBank)</p>
                        <p class="dialog-text">90530011760</p>
                        <p class="dialog-text">92600489</p>
                    </span>
                    <span class="d-flex bg-color">
                        <p class="dialog-text">Asia Alliance Bank</p>
                        <p class="dialog-text">105739920</p>
                        <p class="dialog-text">92800646</p>
                    </span>
                    <span class="d-flex">
                        <p class="dialog-text">Davrbank</p>
                        <p class="dialog-text">90510000205</p>
                        <p class="dialog-text">92901737</p>
                    </span>
                    <span class="d-flex bg-color">
                        <p class="dialog-text">KDB Bank Uzbekistan</p>
                        <p class="dialog-text">903400000000216</p>
                        <p class="dialog-text">93600281</p>
                    </span>
                    <span class="d-flex">
                        <p class="dialog-text">Universal Bank</p>
                        <p class="dialog-text">90484793</p>
                        <p class="dialog-text">92403518</p>
                    </span>
                    <span class="d-flex bg-color">
                        <p class="dialog-text">Ziraat Bank Uzbekistan</p>
                        <p class="dialog-text">3950002366</p>
                        <p class="dialog-text">91800061</p>
                    </span>
                    <span class="d-flex">
                        <p class="dialog-text">Turkiston Bank</p>
                        <p class="dialog-text">89800032282</p>
                        <p class="dialog-text">93735115</p>
                    </span>
                    <span class="d-flex bg-color">
                        <p class="dialog-text">Ravnaq Bank</p>
                        <p class="dialog-text">9801981112</p>
                        <p class="dialog-text">92300062</p>
                    </span>
                    <span class="d-flex">
                        <p class="dialog-text">Hi-Tech Bank</p>
                        <p class="dialog-text">10660001126</p>
                        <p class="dialog-text">93500108</p>
                    </span>
                    <span class="d-flex bg-color">
                        <p class="dialog-text">Madad Invest Bank</p>
                        <p class="dialog-text">90580000549</p>
                        <p class="dialog-text">93500062</p>
                    </span>
                    <span class="d-flex">
                        <p class="dialog-text">Saderat Bank</p>
                        <p class="dialog-text">94300112</p>
                        <p class="dialog-text">95000000051</p>
                    </span>
                    <span class="d-flex bg-color">
                        <p class="dialog-text">UzAgroExportBank</p>
                        <p class="dialog-text">9059203633</p>
                        <p class="dialog-text">95900120</p>
                    </span>
                    <span class="d-flex">
                        <p class="dialog-text">Poytaxt Bank</p>
                        <p class="dialog-text">906012108</p>
                        <p class="dialog-text">99600159</p>
                    </span>
                </v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn depressed color="#eadba0" text @click="summeryLeftDialog = false">Закрыть</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
    import ReportDateTimePicker from "./ReportDateTimePicker";
    import ShowChart from "../chart/ShowChart";
    import TransactionChart from "../chart/TransactionChart";
    import DateComponent from '@/components/date/DateComponent'
    import lineChart from '@/components/chart/LineChart'

    export default {
        name: "ReportByTransactions",
        components: {ReportDateTimePicker, ShowChart, TransactionChart, DateComponent, lineChart},
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
                    {text: "Login", value: "login"},
                    {text: "Тип клиента", value: "userType"},
                    {text: "Отправитель", value: "sender"},
                    {text: "Получатель", value: "receiver"},
                    {text: "Банк получателя", value: "bank"},
                    {text: "Тип", value: "operationType"},   
                    {text: "Валюта", value: "currency"},                   
                    {text: "Сумма", value: "amount"},
                    {text: "Сумма комиссии", value: "fee"},
                    {text: "Статус", value: "status"},
                    {text: "Платформа", value: "platform"},
                    {text: "Версия", value: "appVersion"},
                    {text: "Дата и время", value: "dateTime"}
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
                graphicData: [],
                chartOptions:  {
                    responsive: true,
                    maintainAspectRatio: false
                },
                chartdata: {
                    labels: ['Январь', 'Февраль', '23', '23', '23'],
                    datasets: [
                        {
                            label: 'Количество транзакций',
                            backgroundColor: '#FFB446',
                            data: [40, 20, 30, 35, 123]
                        },
                        {
                            label: 'Сумма транзакций',
                            backgroundColor: '#35c161',
                            data: [40, 20, 30, 35, 123]
                        }
                    ]
                },
                isChartShow: false,
                chartLoader: false,
                isClick: false,
                date: {}
            }
        },
        methods: {
            diffDates(date1, date2){
                // return Math.abs((date1-date2)/(60*60*24*1000))
                return Math.ceil(Math.abs(date2 - date1) / (1000 * 3600 * 24));
            },
            getChartsData() {
                let self = this;
                this.isShow = false;
                this.loader = false;
                this.data.dateFrom = this.date.fromDate;
                this.data.dateTo = this.date.toDate;
                this.data.status = this.status;
                this.data.operationType = this.operationType;
                if(this.date.fromDate==="")
                    delete this.data.dateFrom
                if(this.date.toDate==="")
                    delete this.data.dateTo
                self.$http.post(self.$store.state.prodApiUrl2 + '/report/transaction/excel', self.data)
                .then(response => {
                    this.graphicData = response.data.data;
                    console.log(this.graphicData)
                    const diffDate = this.diffDates(this.date.dateFrom, this.date.dateTo);
                    if(diffDate!=1){
                        let date = new Date()
                        let dayInMonth = 33 - new Date(date.getFullYear(), date.getMonth(), 33).getDate();  
                        // console.log(dayInMonth)
                        // console.log('start')
                        let selectedDay;
                        let array = [];
                        let arrayAmount = [];
                        let arrayDate = [];
                        let i;
                        
                        for(i = 1; i <=dayInMonth; i++){
                            // console.log(i, ' - ', dayInMonth)
                            selectedDay = new Date(date.getFullYear(), (new Date(this.date.fromDate).getMonth()) ,i).getTime();
                            let endDay = new Date(date.getFullYear(),(new Date(this.date.fromDate).getMonth()) , i, 23,59,59).getTime();
                            arrayDate.push(new Date(selectedDay).toLocaleDateString())
                            array.push(this.graphicData.filter(x=>(selectedDay<=x.dateTime)&&(endDay>=x.dateTime)).length)
                            let filteredArr = this.graphicData.filter(x=>(selectedDay<=x.dateTime)&&(endDay>=x.dateTime));
                            // console.log(filteredArr)
                            var sum = 0;
                            filteredArr.forEach(x=>{
                                sum = sum + x.amount/100;
                            })
                            arrayAmount.push(sum)
                            // console.log('arrayAmount')
                            console.log(arrayAmount)
                            // console.log(this.graphicData.filter(x=>(selectedDay<=x.dateTime)&&(endDay>=x.dateTime)))
                            // console.log('result: ', array)
                        }
                        this.chartdata.labels = arrayDate;
                        this.chartdata.datasets[0].data = array;
                        this.chartdata.datasets[1].data = arrayAmount;

                        this.isShow = true;
                        console.log(array)
                        console.log(arrayDate);
                    }
                    else{

                    }

                    this.chartLoader = true;
                }, self.handleError);
            },
            getDate(val){
                this.date = val;
                this.isClick = false;
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
                this.$http.get(this.$store.state.prodApiUrl2+`/report/transaction/status`)
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
                self.$http.get(self.$store.state.prodApiUrl2 + '/report/transaction/operation-type')
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
                self.$http.post(self.$store.state.prodApiUrl2 + '/report/transaction/amount', self.data)
                    .then(response => {
                        self.operationAmount = response.data.data;
                        console.log(response.data.data);
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
                if(this.page===1){
                    self.loadReports(1);
                }
                else{
                    this.page=1
                }            
                // this.getChartsData();
                this.isClick = true;
                
            },
            getExcel() {
                let self = this;
                self.loader = true;
                self.excelData = [];
                this.data.dateFrom = this.date.fromDate;
                this.data.dateTo = this.date.toDate;
                this.data.status = this.status;
                this.data.operationType = this.operationType;
                if(this.date.fromDate==="")
                    delete this.data.dateFrom
                if(this.date.toDate==="")
                    delete this.data.dateTo
                self.$http.post(self.$store.state.prodApiUrl2 + `/report/transaction/excel`, self.data)
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
            loadReports(page) {
                let self = this;
                self.loader = true;
                // self.transactions = [];
                console.log(this.operation)
                self.$http.post(self.$store.getters.newApiUrl2 + `/report/transaction?page=${page-1}&size=10`, self.data)
                    .then(response => {
                        self.loader = false;
                        self.operationsList = response.data.data;
                        self.transactions = self.operationsList.content;
                        self.totalPages = self.operationsList.totalPages;
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
            chartBtnShow(){
                return this.isChartShow ? 'Скрыть график' : 'Показать график'
            },
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

                result['Отправитель'] = {
                    field: "sender",
                    callback: value => {
                        return "'"+value;
                    }
                };
                result['Получатель'] = {
                    field: "receiver",
                    callback: value => {
                        return "'"+value;
                    }
                };
                result['Сумма комиссии'] = {
                    field: "fee",
                    callback: value => {
                        return (value / 100).toString().replace('.',',');
                    }
                };

                result['Дата и время'] = {
                    field: "dateTime",
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
                this.isClick = false;
                this.transactions = [];
                this.totalPages = '';
                this.show = false;
                this.operationAmount = {}
                
            },
            operationType(val){
                this.isClick = false;
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
