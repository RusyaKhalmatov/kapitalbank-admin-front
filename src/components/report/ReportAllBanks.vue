<template>
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
                    <h3>Все банки</h3>
                    <v-flex xs12>
                        <report-date-time-picker :date-time-start.sync="banks.dateStart"
                                                 :date-time-end.sync="banks.dateEnd">
                            <v-btn dark color="primary" @click="loadReports" :loading="loader">Получить</v-btn>
                        </report-date-time-picker>
                    </v-flex>
                    <v-layout row wrap>
                        <v-radio-group v-model="banks.operationType" row>
                            <v-radio key="uzcard2uzcard" label="U2U" value="uzcard2uzcard"/>
                            <v-radio key="humo2humo" label="H2H" value="humo2humo"/>
                        </v-radio-group>
                    </v-layout>
                    <v-flex xs12 v-if="allBanks.length > 0">
                        <v-select
                                :items="allBanks"
                                label="Выберите банки"
                                v-model="selectedBanks"
                                multiple
                        />
                    </v-flex>
                    <v-flex xs12 v-if="filteredResult.length > 0 && chartToggle && showCharts"
                            @click="chartToggle = !chartToggle">
                        <bar-chart :chartdata="chartFeeData" :options="chartOptions"/>
                    </v-flex>
                    <v-flex xs12 v-if="filteredResult.length > 0 && !chartToggle && showCharts"
                            @click="chartToggle = !chartToggle">
                        <bar-chart :chartdata="chartTransfersData" :options="chartOptions"/>
                    </v-flex>
                    <v-flex xs12 v-if="!bankRefresh">
                        <v-tabs v-model="activeTab">
                            <v-tab v-for="item in filteredResult" :key="item.bank.bankCode">
                                {{item.bank.name}}
                            </v-tab>
                            <v-tab-item v-for="item in filteredResult" :key="item.bank.bankCode">
                                <v-layout row wrap>
                                    <v-flex xs12 sm12 md4 lg4 xl3>
                                        <h3>{{ item.bank.name}}<small>({{ item.bank.bankCode}})</small></h3>
                                        <v-list>
                                            <v-list-tile>
                                                <v-list-tile-title>
                                                    <small>Наша комиссия</small>
                                                    {{ item.bank.ourFee}}%
                                                </v-list-tile-title>
                                            </v-list-tile>
                                        </v-list>
                                        <v-list>
                                            <v-list-tile>
                                                <v-list-tile-title>
                                                    <small>Комиссия принимающей стороны</small>
                                                    {{ item.bank.receiverFee}}
                                                </v-list-tile-title>
                                            </v-list-tile>
                                        </v-list>
                                        <v-list>
                                            <v-list-tile>
                                                <v-list-tile-title>
                                                    <small>Комиссия UzCard</small>
                                                    {{ item.bank.uzcardFee}}
                                                </v-list-tile-title>
                                            </v-list-tile>
                                        </v-list>
                                        <v-list>
                                            <v-list-tile>
                                                <v-list-tile-title>
                                                    <small>Могут принимать</small>
                                                    {{ item.bank.receiveEnabled}}
                                                </v-list-tile-title>
                                            </v-list-tile>
                                        </v-list>
                                    </v-flex>
                                    <v-flex xs12 sm12 md8 lg8 xl9>
                                        <v-list>
                                            <v-list-tile>
                                                <v-list-tile-title>
                                                    <small>Общая сумма (с комиссией)</small>
                                                    {{ item.totalAmount / 100 | number-format}}
                                                </v-list-tile-title>
                                            </v-list-tile>
                                        </v-list>
                                        <v-list>
                                            <v-list-tile>
                                                <v-list-tile-title>
                                                    <small>Сумма</small>
                                                    {{ item.amount / 100 | number-format}}
                                                </v-list-tile-title>
                                            </v-list-tile>
                                        </v-list>
                                        <v-list>
                                            <v-list-tile>
                                                <v-list-tile-title>
                                                    <small>Сумма комиссии</small>
                                                    {{ item.feeAmount / 100 | number-format}}
                                                </v-list-tile-title>
                                            </v-list-tile>
                                        </v-list>
                                        <v-list>
                                            <v-list-tile>
                                                <v-list-tile-title>
                                                    <small>Наша комиссия (сум)</small>
                                                    {{ item.ourFee / 100 | number-format}}
                                                </v-list-tile-title>
                                            </v-list-tile>
                                        </v-list>
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-data-table
                                                :items="item.operations"
                                                :loading="loader"
                                                :headers="operationHeaders"
                                                pagination.sync="pagination">
                                            <template slot="items" slot-scope="props">
                                                <tr>
                                                    <td>{{ props.item.id }}</td>
                                                    <td>{{ props.item.sender }}</td>
                                                    <td>{{ props.item.receiver }}</td>
                                                    <td>{{ props.item.operationType }}</td>
                                                    <td>{{ props.item.amount / 100 | number-format }}</td>
                                                    <td>{{ props.item.fullAmount / 100 | number-format }}</td>
                                                    <td>{{ props.item.feeAmount / 100 | number-format }}</td>
                                                </tr>
                                            </template>
                                            <template slot="actions-append">
                                                <download-excel
                                                        :name="item.bank.name"
                                                        :data="item.operations">
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
                            </v-tab-item>
                        </v-tabs>
                    </v-flex>
                </v-layout>
            </v-card-text>
        </v-card>
    </v-flex>
</template>

<script>
    import ReportDateTimePicker from "./ReportDateTimePicker";
    import colors from "../../colors";
    import BarChart from "../chart/BarChart";
    import ShowChart from "../chart/ShowChart";

    export default {
        name: "ReportAllBanks",
        components: {ReportDateTimePicker, BarChart, ShowChart},
        data() {
            return {
                result: {},
                filteredResult: {},
                allBanks: [],
                selectedBanks: [],
                operationTypes: [],
                colors: colors,
                activeTab: null,
                showCharts: false,
                chartToggle: false,
                bankRefresh: false,
                operationsTypes: [
                    'uzcard2uzcard',
                    'humo2humo'
                ],
                pagination: {
                    sortBy: "datetime",
                    descending: true
                },
                banks: {
                    dateStart: null,
                    dateEnd: (new Date()).toLocaleString(),
                    operationType: ''
                },
                chartOptions: {
                    maintainAspectRatio: false,
                    scales: {
                        xAxes: [{
                            stacked: true,
                            ticks: {
                                autoSkip: false
                            }
                        }],
                        yAxes: [{
                            stacked: true
                        }]
                    }
                },
                operationHeaders: [
                    {text: "Id", value: "id"},
                    {text: "Отправитель", value: "sender"},
                    {text: "Получатель", value: "receiver"},
                    {text: "Тип операции", value: "operationType"},
                    {text: "Сумма", value: "amount"},
                    {text: "Общая сумма (с комиссией)", value: "fullAmount"},
                    {text: "Сумма комиссии", value: "feeAmount"},
                ]
            }
        },
        methods: {
            loadReports() {
                let self = this;
                self.loader = true;
                self.$http.post(self.$store.getters.apiUrl + '/report/allBanks', self.banks)
                    .then(response => {
                        self.result = response.data.data;
                        self.loader = false;
                    }, self.handleError);
            }
        },
        computed: {
            chartFeeData() {
                let self = this,
                    labels = [],
                    data = [];
                for (let i = 0; i < self.filteredResult.length; i++) {
                    labels[i] = self.filteredResult[i].bank.name;
                    data[i] = self.filteredResult[i].ourFee / 100;
                }
                return {
                    labels: labels,
                    datasets: [
                        {
                            label: "our fee",
                            backgroundColor: colors[2],
                            data: data
                        },
                    ]
                };
            },
            chartTransfersData() {
                let self = this,
                    labels = [],
                    data = [];
                for (let i = 0; i < self.filteredResult.length; i++) {
                    labels[i] = self.filteredResult[i].bank.name;
                    data[i] = self.filteredResult[i].amount / 100;
                }
                return {
                    labels: labels,
                    datasets: [
                        {
                            label: "Transfers",
                            backgroundColor: colors[1],
                            data: data
                        }
                    ]
                };
            }
        },
        watch: {
            result(result) {
                let self = this;
                self.allBanks = [];
                self.selectedBanks = [];
                for (let i = 0; i < result.length; i++) {
                    self.allBanks.push(result[i].bank.name);
                    if (result[i].totalAmount > 0) {
                        self.selectedBanks.push(result[i].bank.name);
                    }
                }
                self.allBanks.sort();
            },
            selectedBanks(banks) {
                let self = this,
                    result = [];

                self.bankRefresh = true;

                for (let i = 0; i < banks.length; i++) {
                    let currentBank = banks[i];
                    for (let j = 0; j < self.result.length; j++) {
                        let compareBank = self.result[j];
                        if (currentBank === compareBank.bank.name) {
                            result.push(compareBank);
                            break;
                        }
                    }
                }

                self.activeTab = null;
                self.filteredResult = result;

                self.$nextTick(() => {
                    self.bankRefresh = false;
                })
            }
        },
        mounted() {
            // this.getOperationsTypes();
        }
    }
</script>

<style scoped>

</style>