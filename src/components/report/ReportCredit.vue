<template>
    <v-layout column wrap>
        <v-flex xs12>
            <v-card min-height="600">
                <v-card-title>
                    <h1>Отчеты</h1>
                    <v-spacer/>
                    <v-btn icon small @click="redirect('report')">
                        <v-icon small>mdi-arrow-left</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <v-layout row wrap>
                        <h3>По кредит</h3>
                        <v-flex xs12>
                            <v-btn-toggle multiple v-model="filterToggle" key="all" class="selectedFilter">
                                <v-btn dark color="primary" @click="selectFilters('all')">Все</v-btn>
                                <v-btn dark color="accent" v-for="(filterItem,k) in filters" :key="k"
                                       @click="selectFilters(filterItem.value)">
                                    {{filterItem.text}}
                                </v-btn>
                            </v-btn-toggle>
                        </v-flex>
                        <v-flex xs12 class="mt-3">
                            <report-date-time-picker :date-time-start.sync="operation.dateStart"
                                                     :date-time-end.sync="operation.dateEnd">
                                <v-btn :to="{name: 'clients'}" dark color="primary">Клиенты</v-btn>
                            </report-date-time-picker>
                        </v-flex>
                        <v-flex xs12>
                            <v-radio-group v-model="operation.operationStatus" row>
                                <v-radio key="success" label="Success" value="SUCCESS"/>
                                <v-radio key="failed" label="Failed" value="FAILED"/>
                            </v-radio-group>
                        </v-flex>
                        <v-flex xs12>
                            <v-btn dark color="primary" @click="loadReports" :loading="loader">Получить</v-btn>
                        </v-flex>
                        <v-flex xs12 lg6 xl6>
                            <h2 class="text-xs-left text-lg-left"><small>Сумма: </small><br>
                                {{operationsList.totalAmount / 100 | number-format}}
                            </h2>
                            <hr>
                        </v-flex>
                        <v-flex xs12 lg6 xl6>
                            <h2><small>Общая сумма с карт нашего банка: </small><br>
                                {{operationsList.ourCardsAmountFrom / 100 | number-format}}
                            </h2>
                            <hr>
                        </v-flex>
                        <v-flex xs12 xl6 lg6>
                            <h2><small>Общая сумма на карты нашего банка: </small><br>
                                {{operationsList.ourCardsAmountTo / 100 | number-format}}
                            </h2>
                            <hr>
                        </v-flex>
                        <v-flex xs12 xl6 lg6>
                            <h2><small>Общая сумма на карты других банков: </small><br>
                                {{operationsList.otherCardsAmountTo / 100 | number-format}}
                            </h2>
                            <hr>
                        </v-flex>
                        <v-flex xs12 sm12 md12 lg12 xl12 v-if="operationsList && transactions.length && showCharts">
                            <transaction-chart :transactions="transactions"/>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field
                                    v-model="search"
                                    prepend-icon="mdi-magnify"
                                    label="Поиск">
                            </v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-data-table
                                    :headers="operationsHeaders"
                                    :items="transactions"
                                    :loading="loader"
                                    :search="search"
                                    :pagination.sync="pagination"
                                    item-key="id">
                                <template slot="items" slot-scope="props">
                                    <tr @click="props.expanded = !props.expanded">
                                        <td>{{ props.item.id }}</td>
                                        <td>{{props.item.login.split(":")[0]}}
                                            {{phoneFormat(props.item.login.split(":")[1]) | timestamp-to-date}}
                                        </td>
                                        <td>{{ props.item.sender }}</td>
                                        <td>{{ props.item.receiver }}</td>
                                        <td>{{ props.item.receiverName }}</td>
                                        <td>{{ props.item.operationType }}</td>
                                        <td>{{ props.item.amount / 100 | number-format }}</td>
                                        <td>{{ props.item.createdDate | timestamp-to-date }}</td>
                                        <td>{{ props.item.status }}</td>
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
                        </v-flex>
                    </v-layout>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
    import ReportDateTimePicker from "./ReportDateTimePicker";
    import ShowChart from "../chart/ShowChart";
    import TransactionChart from "../chart/TransactionChart";

    export default {
        name: "ReportCredit",
        components: {ReportDateTimePicker, ShowChart, TransactionChart},
        data() {
            return {
                search: '',
                filterStatus: 'success',
                showCharts: false,
                operationsList: {},
                transactions: [],
                operationTypes: [],
                selectedFilters: [],
                filterToggle: [],
                availableFilters: [],
                pagination: {
                    sortBy: "createdDate",
                    descending: true
                },
                filters: [
                    {text: 'Погашения кредита U', value: 'uzcard2loanRepayment'},
                    {text: 'Погашения кредита H', value: 'humo2loanRepayment'},
                    {text: 'Досрочное погашение кредита U',value: 'uzcard2loanPrematureRepayment'},
                    {text: 'Досрочное погашение кредита H',value: 'humo2loanPrematureRepayment'}
                ],
                operation: {
                    dateStart: null,
                    dateEnd: (new Date).toLocaleString(),
                    operationType: [],
                    phoneNumber: '',
                    operationStatus: ''
                },
                operationsHeaders: [
                    {text: "ID", value: "id"},
                    {text: "Login", value: "login"},
                    {text: "Отправитель", value: "sender"},
                    {text: "Получатель", value: "receiver"},
                    {text: "Имя", value: "receiverName"},
                    {text: "Тип", value: "operationType"},
                    {text: "Сумма", value: "amount"},
                    {text: "Дата и время", value: "createdDate"},
                    {text: "Статус", value: "status"}
                ],
                filtersTypeTemp: []
            }
        },
        methods: {
            getTypeOperations() {
                let self = this;
                self.$http.get(self.$store.getters.apiUrl + '/report/operationTypes')
                    .then(response => {
                        self.operationTypes = response.data.data;
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
            loadReports() {
                let self = this;
                self.loader = true;
                self.$http.post(self.$store.getters.newApiUrl2 + '/report/deposit', self.operation)
                    .then(response => {
                        self.operationsList = response.data.data;
                        self.transactions = self.operationsList.operations;
                        self.loader = false;
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
            operationExport() {
                let self = this, result = {};
                for (let i = 0; i < self.operationsHeaders.length; i++) {
                    let currentHeader = self.operationsHeaders[i];
                    result[currentHeader.text] = currentHeader.value;
                }

                result['Общая сумма (с комиссией)'] = {
                    field: "fullAmount",
                    callback: value => {
                        return value / 100;
                    }
                };

                result['Сумма'] = {
                    field: "amount",
                    callback: value => {
                        return value / 100;
                    }
                };

                result['Сумма комиссии'] = {
                    field: "feeAmount",
                    callback: value => {
                        return value / 100;
                    }
                };

                result['Дата и время'] = {
                    field: "createdDate",
                    callback: value => {
                        let date = new Date(value);
                        return date.toLocaleString();
                    }
                };
                return result;
            }
        },
        watch: {
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
            }
        },
        mounted() {
            this.getTypeOperations();
        }
    }
</script>

<style scoped>
.selectedFilter {
    display: flex;
    flex-wrap: wrap;
}
.v-item-group{
    flex-wrap: wrap !important;
    -webkit-box-shadow: none;
    box-shadow: none;
}
.v-btn{
    margin: 5px 10px 5px 0px !important;       
}
small{
    color: #9c9c9c;
    font-weight: 400;
    font-size:14px;
}
hr{
    display: none;
    height: 1px;
    border: none;
    background: #c4c4c4;
    margin-bottom: 20px;

}
@media only screen and (max-width: 600px){
    hr{
        display: block;
    }
}
</style>
