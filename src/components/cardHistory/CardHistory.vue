<template>
    <v-flex xs12>
        <v-card min-height="600">
            <v-card-title>
                <h1>История карт {{tmp}}</h1>
            </v-card-title>
            <v-card-text>
                <v-layout column wrap>
                    <v-spacer/>
                    <h2 align="right">Баланс: {{cardInfo.balance / 100 | number-format}}</h2>
                    <v-layout row wrap>
                        <v-flex xs3>
                            <v-text-field disabled label="Номер карты" v-model="cardInfo.maskedPan"/>
                        </v-flex>
                        <v-flex xs3>
                            <v-text-field disabled label="Срок действия" v-model="cardInfo.expiry"/>
                        </v-flex>
                        <v-flex xs3>
                            <v-text-field disabled label="Состояние карты" v-model="cardInfo.state"/>
                        </v-flex>
                        <v-flex xs3>
                            <v-text-field disabled label="Номер СМС информирования" v-model="cardInfo.smsPhone"/>
                        </v-flex>
                    </v-layout>
                    <v-flex xs12>
                        <v-layout row wrap justify-center>
                            <v-flex xs6 md2>
                                <v-menu
                                        v-model="menu1"
                                        :close-on-content-click="false"
                                        :nudge-right="40"
                                        lazy
                                        transition="scale-transition"
                                        offset-y
                                        full-width
                                        min-width="290px"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                                v-model="dateFrom"
                                                label="С: "
                                                prepend-icon="event"
                                                readonly
                                                v-on="on"
                                        />
                                    </template>
                                    <v-date-picker v-model="dateFrom" @input="menu1 = false" no-title
                                                   scrollable/>
                                </v-menu>
                            </v-flex>
                            <v-flex xs6 md2>
                                <v-menu
                                        v-model="menu2"
                                        :close-on-content-click="false"
                                        :nudge-right="40"
                                        lazy
                                        transition="scale-transition"
                                        offset-y
                                        full-width
                                        min-width="290px"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                                v-model="dateTo"
                                                label="До: "
                                                prepend-icon="event"
                                                readonly
                                                v-on="on"
                                        />
                                    </template>
                                    <v-date-picker v-model="dateTo" @input="menu2 = false" no-title scrollable/>
                                </v-menu>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                    <v-flex xs12>
                        <v-layout row wrap>
                            <v-flex xs2>
                                <v-select
                                        v-model="type"
                                        :items="types"
                                        label="Тип Карты"/>
                            </v-flex>
                            <v-flex xs6>
                                <v-text-field
                                        v-model="search"
                                        label="Номер Карты"/>
                            </v-flex>
                            <v-flex xs4>
                                <v-btn dark color="primary" :loading="loader" @click="getHistory">
                                    <v-icon>search</v-icon>
                                    Показать историю
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                    <v-data-table
                            :headers="cardHeader"
                            :pagination.sync="pagination"
                            :loading="loader"
                            :items="results.cardHistory">
                        <template slot="items" slot-scope="props">
                            <tr>
                                <td>{{props.item.merchantName}}</td>
                                <td>{{props.item.merchantId}}</td>
                                <td>{{props.item.terminalId}}</td>
                                <td>{{props.item.transType}}</td>
                                <td>{{props.item.amount}}</td>
                                <td>{{statusTransaction(props.item.reversed)}}</td>
                                <td>{{props.item.transDate | timestamp-to-date}}</td>
                            </tr>
                        </template>
                        <template slot="actions-append">
                        <download-excel
                                v-if="results.cardHistory"
                                :fields="operationExport"
                                name="cardHistory.xls"
                                :data="results.cardHistory">
                            <v-btn icon dark color="secondary">
                                <v-icon>mdi-file-excel</v-icon>
                            </v-btn>
                        </download-excel>
                    </template>
                    </v-data-table>
                </v-layout>
            </v-card-text>
        </v-card>
    </v-flex>
</template>

<script>
    export default {
        name: "CardHistory",
        data() {
            return {
                cardHeader: [
                    {text: "Имя поставщика", value: "merchantName", sortable: false},
                    {text: "Merchant", value: "merchantId", sortable: false},
                    {text: "Terminal", value: "terminalId", sortable: false},
                    {text: "Тип трансфера", value: "transType", sortable: false},
                    {text: "Сумма", value: "amount", sortable: false},
                    {text: "Статус платежа", value: "reversed", sortable: false},
                    {text: "Дата трансфера", value: "transDate", sortable: true}
                ],
                results: [],
                cardInfo: {},
                pagination: {
                    sortBy: "transDate",
                    rowsPerPage: 10,
                },
                search: '',
                types: [],
                menu1: false,
                menu2: false,
                dateFrom: null,
                dateTo: null,
                type: '',
                tmp: '',
            }
        },
        computed:{
            operationExport() {
                let self = this, result = {};
                for (let i = 0; i < self.cardHeader.length; i++) {
                    let currentHeader = self.cardHeader[i];                  
                    result[currentHeader.text] = currentHeader.value;
                }

                result['Статус платежа'] = {
                    field: "reversed",
                    callback: value => {
                        return this.statusTransaction(value);
                    }
                };
                result['Дата трансфера'] = {
                    field: "transDate",
                    callback: value => {
                        let date = new Date(parseInt(value)).toLocaleString();
                        return date;
                    }
                };

            
                return result;
            }
        },
        methods: {
            statusTransaction(val){
                if(!val){
                    return 'Проведен'
                }
                else{
                    return 'Отменен'
                }
            },
            getTypes() {
                let self = this;
                self.$http.get(self.$store.getters.apiUrl + '/epos/accountType')
                    .then(response => {
                        self.types = response.data.data;
                    }, self.handleError);
            },
            getHistory() {
                let self = this;
                self.loader = true;
                this.results = [];
                this.cardInfo = {};
                self.$http.get(self.$store.getters.apiUrl + '/general/admin/card/history', {
                    params: {
                        dateFrom: self.getDateMillis(self.dateFrom),
                        dateTo: self.getDateMillis(self.dateTo),
                        type: self.type,
                        pan: self.search
                    }
                })
                    .then(response => {
                        self.loader = false;
                        self.results = response.data.data;
                        self.cardInfo = self.results.cardInfo;
                    }, self.handleError);
            },
            getDateMillis(dateStr) {
                if (dateStr) {
                    let parsedDate = dateStr.split('-');
                    return new Date(parsedDate[0], parsedDate[1] - 1, parsedDate[2]).getTime();
                }
            }
        },
        mounted() {
            this.getTypes();
            // console.log(this.$route.params.chat)
            if (this.$store.state.cardId) {
                this.tmp = this.$store.state.cardId;
                
            }
        }
    }
</script>

<style scoped>

</style>