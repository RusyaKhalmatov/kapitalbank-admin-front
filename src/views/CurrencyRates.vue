<template>
    <v-layout column wrap>
        <v-card min-height="600">
            <v-card-title> 
                <h1>Курс валют</h1> 
                <v-progress-linear v-if="!rates.length" indeterminate color="yellow" ></v-progress-linear>
            </v-card-title>
            <v-card-text v-if="rates.length">
                <v-layout row wrap>
                    <v-flex xs12 sm12 md12 lg12 xl12>
                        <v-data-table :headers="ratesHeaders" :items="rates" :loading="loader" :search="search" :pagination.sync="pagination" :item-key="rates.isoCode">
                            <template slot="items" slot-scope="props">
                                <tr @click="props.expanded = !props.expanded">
                                    <td>{{ props.item.iso_code }}</td>
                                    <td>{{ props.item.reval_rate }}</td>
                                    <td>{{ props.item.buy_rate }}</td>
                                    <td>{{ props.item.sell_rate }}</td>
                                </tr>
                            </template>
                        </v-data-table>
                    </v-flex>
                </v-layout>
            </v-card-text>
        </v-card>
    </v-layout>
</template>
<script>
    export default {
        name: "CurrencyRates",
        data() {
            return {
                rates: [],
                allRates: [],
                ratesHeaders: [
                    {text: "Валюта", value: "isoCode"},
                    {text: "Курс ЦБ", value: "revalRate"},
                    {text: "Покупка", value: "buyRate"},
                    {text: "Продажа", value: "sellRate"}
                ],
                search: "",
                pagination: {},
                selected: []
            }
        },
        methods: {
            loadCurrencyRates() {
                let self = this;
                self.$http.get(self.$store.getters.apiUrl + '/currency-rate')
                    .then(response => {
                        self.loader = false;
                        self.rates = response.data.data;
                    }, self.handleError);
            }
        },
        mounted() {
            this.loadCurrencyRates();
        }
    }
</script>