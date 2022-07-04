<template>
    <v-flex xs12>
        <div class="main">
            <v-card-title>
                <v-spacer/>

                <h1 class="headline">Отчет по конвертации валют</h1>

                <v-spacer/>
                <v-btn icon @click="redirect('report')">
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
                                multiple
                            >
                                <template v-slot:prepend-item>
                                    <v-list-tile ripple @click="toggle">
                                        <v-list-tile-action>
                                            <v-icon :color="operationType.length > 0 ? 'primary' : ''">
                                              {{ icon }}
                                            </v-icon>
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
                            <v-card class="d-flex flex-wrap">
                                <v-card-title style="font-size: large">Статус конвертации:</v-card-title>
                                <v-checkbox
                                    v-for="(item, index) in statusData"
                                    :key="index"
                                    v-model="statuses"
                                    :label="item.value"
                                    :value="item.key"
                                />
                            </v-card>
                        </v-flex>

                        <div class="button-box">
                            <v-btn
                                color="primary"
                                @click="load"
                                :loading="loader"
                            >
                                Получить
                            </v-btn>
                            <v-btn
                                color="success"
                                :loading="loader"
                                @click="getExcel"
                            >
                                Скачать Excel
                            </v-btn>
                            <download-excel
                                v-show="false"
                                id="excel"
                                :name="reportFileName"
                                :fields="conversionExport"
                                :data="excelData"
                            />
                        </div>

                        <v-layout row wrap>
                            <v-flex xs12>
                                <v-layout justify-center wrap>
                                    <div class="box" v-for="(item, value, i) in conversionAmount" :key="i">
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

                            <v-flex xs12 v-if="table">

                                <v-text-field
                                    v-if="table.content"
                                    v-model="search"
                                    prepend-icon="mdi-magnify"
                                    label="Поиск"
                                />

                                <v-data-table
                                    v-if="table.content"
                                    :headers="conversionHeader"
                                    :items="table.content"
                                    :loading="loader"
                                    :pagination.sync="pagination"
                                    hide-actions
                                >
                                    <template slot="items" slot-scope="props">
                                        <tr @click="props.expanded = !props.expanded">
                                            <td>{{props.item.id}}</td>
                                            <td>{{props.item.userId}}</td>
                                            <td>{{props.item.login}}</td>
                                            <td>{{props.item.customerId}}</td>
                                            <td>{{props.item.endTime | timestampToDate}}</td>
                                            <td>{{props.item.operationStatus}}</td>
                                            <td>{{props.item.username}}</td>
                                            <td>{{props.item.city}}</td>
                                            <td>{{props.item.sender}}</td>
                                            <td>{{props.item.receiver}}</td>
                                            <td>{{props.item.operationType}}</td>
                                            <td>{{props.item.senderAmount / 100 | numberFormat}}</td>
                                            <td>{{props.item.senderCurrency}}</td>
                                            <td>{{props.item.receiverAmount / 100 | numberFormat}}</td>
                                            <td>{{props.item.receiverCurrency}}</td>
                                            <td>{{props.item.senderFeeAmount / 100 | numberFormat}}</td>
                                            <td>{{props.item.senderFeeCurrency}}</td>
                                            <td>{{props.item.platform}}</td>
                                            <td>{{props.item.appVersion}}</td>
                                        </tr>
                                    </template>
                                </v-data-table>
                                <v-pagination
                                    v-if="table.length !== 0"
                                    :disabled="loader"
                                    class="center"
                                    v-model="page"
                                    :length="totalPages"
                                    :total-visible="10"
                                />
                            </v-flex>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-card-text>
        </div>
    </v-flex>
</template>

<script>
    import DateComponent from '@/components/date/DateComponent'

    export default {
        name: "ReportConversion",
        components: {DateComponent},
        data() {
            return {
                conversionHeader: [
                    {text: "ID транзакции", value: "id"},
                    {text: "ID клиента", value: "userId"},
                    {text: "Login", value: "login"},
                    {text: "Customer ID", value: "customerId"},
                    {text: "Дата и время", value: "endTime"},
                    {text: "Статус", value: "operationStatus"},
                    {text: "Имя", value: "username"},
                    {text: "Город", value: "city"},
                    {text: "Отправитель", value: "sender"},
                    {text: "Получатель", value: "receiver"},
                    {text: "Тип операции", value: "operationType"},
                    {text: "Сумма отправителя", value: "senderAmount"},
                    {text: "Валюта отправителя", value: "senderCurrency"},
                    {text: "Сумма получателя", value: "receiverAmount"},
                    {text: "Валюта получателя", value: "receiverCurrency"},
                    {text: "Комиссия", value: "senderFeeAmount"},
                    {text: "Валюта комиссии", value: "senderFeeCurrency"},
                    {text: "Платформа", value: "platform"},
                    {text: "Версия", value: "appVersion"},
                ],
                filterGroups: [],
                conversionData: {
                    dateStart: null,
                    dateEnd: (new Date).toLocaleString(),
                    operationType: [],
                    status: ['SUCCESS']
                },
                pagination: {
                  sortBy: "createdDate",
                  descending: true,
                  rowsPerPage: 10
                },
                table: [],
                conversionAmount: [],
                filterToggle: [],
                search: '',
                totalAmount: '',
                postData : {
                    search: '',
                    dateFrom: Date.now(),
                    dateTo: Date.now(),
                    operationType: this.operationType,
                    statuses: this.statuses,
                },
                totalPages: 0,
                page: 1,
                loader: false,
                excelData: [],
                date:{},
                operationType: [],
                operationTypes: [],
                statusData: [],
                statuses: [],
            }
        },
        watch:{
            page(value) {
                this.page = value;
                this.getConversionData();
            },
            search() {
                this.page = 1;
                this.getConversionData();
            },
            statuses(statuses) {
                this.table = [];
                if (statuses.length === 0) {
                    this.statuses = this.statusData.map(status => status.key);
                }
            },
            operationType() {
                this.table = [];
            }
        },
        methods: {
            toggle() {
                this.$nextTick(() => {
                    this.operationType = this.operationType.length === this.operationTypes.length ? [] : this.operationTypes;
                })
            },
            getDate(val){
                this.date = val;
                this.table = [];
            },
            load() {
                this.page = 1;
                this.preparePostData()
                this.getConversionDataAmount();
                this.getConversionData();
            },
            preparePostData() {
                this.postData = {
                    search: '',
                    dateFrom :  this.date.fromDate === '' ? Date.now() : this.date.fromDate,
                    dateTo : this.date.toDate === '' ? Date.now() : this.date.toDate,
                    operationType: this.operationType,
                    status: this.statuses
                };
            },
            getStatuses(){
                this.$http.get(this.$store.getters.newApiUrl2 + `/report/conversion/status`)
                .then(response => {
                    this.statusData = response.data.data;
                    response.data.data.forEach( x => {
                        this.statuses.push(x.key);
                    })
                }, this.handleError)
            },
            getExcel(){
                this.preparePostData();
                this.loader = true;
                this.excelData = [];
                this.$http.post(
                    this.$store.getters.newApiUrl2 + `/report/conversion/excel`,
                    {...this.postData, search: this.search})
                .then(response => {
                    this.excelData = response.data.data;
                    if (this.excelData.length !== 0) {
                        let elem = document.getElementById('excel');
                        setTimeout(() => {
                            elem.click();
                        }, 500)
                    }
                    this.loader = false;
                }, this.handleError)
            },
            getConversionData() {
                this.loader = true;
                this.$http.post(
                    this.$store.getters.newApiUrl2
                    + `/report/conversion?page=${this.page - 1}&size=${this.pagination.rowsPerPage}`,
                    {...this.postData, search: this.search})
                    .then(response => {
                        this.table = response.data.data;
                        this.totalPages = response.data.data.totalPages;
                        this.loader = false;
                    }, this.handleError);
            },
            getConversionDataAmount() {
                // this.conversionAmount = [];
                // this.$http.post(this.$store.getters.newApiUrl2 + '/report/conversion/amount?q='+this.search,
                // {...this.postData, search: this.search})
                //     .then(response => {
                //         this.conversionAmount = response.data.data;
                //     }, this.handleError);
            },
            getOperationTypes() {
                this.operationType = [];
                this.$http.get(this.$store.getters.newApiUrl2 + '/report/conversion/operationTypes')
                    .then(response => {
                        this.operationTypes = response.data.data;
                        this.operationType = this.operationTypes;
                    }, this.handleError);
            },
        },
        computed: {
            reportFileName() {
                return "conversion_" + (new Date()).toLocaleDateString() + ".xls"
            },
            conversionExport() {
                let data = {};
                for (let i = 0; i < this.conversionHeader.length; i++) {
                    let currentHeader = this.conversionHeader[i];
                    data[currentHeader.text] = currentHeader.value;
                }
                data['Отправитель'] = {field: "sender", callback: value => "'"+value};
                data['Получатель'] = {field: "receiver", callback: value => "'"+value};
                data['Дата и время'] = {field: "endTime", callback: value => new Date(value).toLocaleString()};
                data['Сумма отправителя'] = {
                    field: "senderAmount",
                    callback: value => (value / 100).toString().replace('.',',')};
                data['Сумма получателя'] = {
                    field: "receiverAmount",
                    callback: value => (value / 100).toString().replace('.',',')};
                data['Комиссия'] = {
                    field: "senderFeeAmount",
                    callback: value => (value / 100).toString().replace('.',',')};
                data['Валюта отправителя'] = {field: "senderCurrency", callback: value => value};
                data['Валюта получателя'] = {field: "receiverCurrency", callback: value => value};
                data['Валюта комиссии'] = {field: "senderFeeCurrency", callback: value => value};
                return data;
            },
            icon(){
                let icon = 'mdi-checkbox-blank-outline';
                if (this.operationType.length === this.operationTypes.length) {
                    icon = 'mdi-close-box';
                }
                if (this.operationType.length > 0 && !(this.operationType.length === this.operationTypes.length)) {
                    icon = 'mdi-minus-box';
                }
                return icon;
            },
        },
        mounted(){
            this.getOperationTypes();
            this.getStatuses();
        }
    }
</script>

<style scoped>
    .center {
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
    .main{
        width: 100%;
    }
    .headline{
        text-align: center;
    }
    br {
        display: none;
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
    @media only screen and (max-width: 820px){

    }
    @media only screen and (max-width: 600px) {
        br {
            display: block;
        }
        small {
            color: #9c9c9c;
            font-weight: 400;
            font-size:16px;
        }
    }

    .column {
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
            -ms-flex-direction: column;
            flex-direction: column;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
    }

    h2 {
        text-align: center;
    }
</style>
