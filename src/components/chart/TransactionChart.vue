<template>
    <v-layout row wrap>
        <v-flex xs12 sm12 md12 lg12 xl12>
            <v-radio-group v-model="byHours">
                <v-radio label="По часам" value="hours"/>
                <v-radio label="По дням" value="days"/>
                <v-radio label="По месяцам" value="months"/>
            </v-radio-group>
        </v-flex>
        <v-flex xs12 sm12 md12 lg12 xl12>
            <bar-chart :chartdata="chartData" :options="chartOptions"/>
        </v-flex>
    </v-layout>
</template>

<script>
    import colors from '../../colors'
    import BarChart from './BarChart'

    export default {
        name: "TransactionChart",
        components: {BarChart},
        props: {
            transactions: {
                type: Array,
                required: false,
                default: []
            },
            datetimeField: {
                type: String,
                required: false,
                default: "createdDate",
            },
            amountField: {
                type: String,
                required: false,
                default: "amount"
            }
        },
        data() {
            return {
                byHours: "months",
                initByHours: false,
                chartOptions: {
                    maintainAspectRatio: false,
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                    },
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                        }],
                        yAxes: [
                            {
                                id: "amount",
                                type: "linear",
                                position: "left"
                            },
                            {
                                id: "count",
                                type: "linear",
                                position: "right"
                            }
                        ]
                    }
                }
            };
        },
        methods: {
            getDateStr(date, byHours) {
                return `${byHours !== "months" ? this.getNumberWithPrefix(date.getDate()) : "01"}.${this.getNumberWithPrefix(date.getMonth() + 1)}.${date.getFullYear()}` +
                    (byHours === "hours" ? ` ${this.getNumberWithPrefix(date.getHours())}:00` : "");
            },

            getDateLong(date, byHours) {
                return parseInt(date.getFullYear() + this.getNumberWithPrefix(date.getMonth() + 1) + (byHours !== "months" ? this.getNumberWithPrefix(date.getDate()) : "") +
                    (byHours === "hours" ? ("" + this.getNumberWithPrefix(date.getHours())) : ""));
            },

            getNumberWithPrefix(number) {
                return number < 10 ? "0" + number : number;
            }
        },
        computed: {
            chartData() {
                let self = this,
                    labels = [],
                    data = [],
                    transactionsDatetime = {},
                    transactions = {},
                    transactionsCount = {},
                    transactionsCountData = [],
                    start = null,
                    end = null;

                for (let i = 0; i < self.transactions.length; i++) {
                    let currentItem = self.transactions[i];
                    if (start === null || start > currentItem[self.datetimeField]) {
                        start = currentItem[self.datetimeField];
                    }

                    if (end === null || end < currentItem[self.datetimeField]) {
                        end = currentItem[self.datetimeField];
                    }
                }

                if (start !== null && end !== null && !self.initByHours) {
                    let startDate = new Date(start),
                        endDate = new Date(end);

                    if (endDate.getMonth() - startDate.getMonth() > 1) {
                        self.byHours = "months";
                    } else {
                        if (endDate.getDate() - startDate.getDate() > 1) {
                            self.byHours = "days";
                        } else {
                            self.byHours = "hours";
                        }
                    }
                    self.initByHours = true;
                }

                for (let i = 0; i < self.transactions.length; i++) {
                    let currentItem = self.transactions[i];

                    let currentDate = new Date(currentItem[self.datetimeField]),
                        currentDateStr = "",
                        currentDateLong = 0;

                    currentDateStr = self.getDateStr(currentDate, self.byHours);
                    currentDateLong = self.getDateLong(currentDate, self.byHours);

                    if (!transactions[currentDateStr]) {
                        transactions[currentDateStr] = 0;
                    }
                    if (!transactionsCount[currentDateStr]) {
                        transactionsCount[currentDateStr] = 0;
                    }
                    transactionsDatetime[currentDateLong] = currentDateStr;
                    transactions[currentDateStr] = parseFloat(transactions[currentDateStr]) +
                        parseFloat(currentItem[this.amountField]) / 100;
                    transactionsCount[currentDateStr] = parseInt(transactionsCount[currentDateStr]) + 1;
                }

                Object.keys(transactionsDatetime).sort().forEach(timestamp => {
                    let label = transactionsDatetime[timestamp];
                    labels.push(label);
                    data.push(transactions[label]);
                    transactionsCountData.push(transactionsCount[label]);
                });

                return {
                    labels: labels,
                    datasets: [
                        {
                            yAxisID: "count",
                            label: "Количество транзакций",
                            color: colors[2],
                            backgroundColor: colors[2],
                            data: transactionsCountData,
                            type: "line",
                            fill: false,
                        },
                        {
                            yAxisID: "amount",
                            label: "Сумма",
                            backgroundColor: colors[0],
                            data: data,
                        },
                    ]
                };
            },
        }
    }
</script>

<style scoped>

</style>