<template>
    <v-flex xs12>
        <v-card min-height="600">
            <v-card-title>
                <h1>Лимиты</h1>
                <v-spacer/>
                <v-btn icon small @click="redirect('limits')">
                    <v-icon small>mdi-arrow-left</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <v-layout row wrap justify-center>
                    <v-flex xs12 sm12 md8>
                        <v-select
                                :items="operationCodes"
                                v-model="limitData.operationCode"
                                label="Код операции">
                        </v-select>
                        <v-select
                                :items="periodData"
                                v-model="limitData.period"
                                label="Период">
                        </v-select>
                        <v-text-field
                                v-model="limitData.minAmount"
                                label="Минимальная сумма"/>
                        <v-text-field
                                v-model="limitData.maxAmount"
                                label="Максимальная сумма"/>
                        <v-select
                                :items="currencyData"
                                v-model="limitData.currency"
                                label="Валюта">
                        </v-select>
                        <v-checkbox
                        v-model="limitData.receiver"
                        label="Лимит для получателя"
                        ></v-checkbox>
                        <v-text-field
                                v-model="limitData.limitComment"
                                label="Коммент"/>
                        <v-btn dark color="primary" @click="save">
                            Сохранить
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-card-text>
        </v-card>
    </v-flex>
</template>

<script>
    import MoneyFormat from "../money-format/MoneyFormat";

    export default {
        name: "LimitsForm",
        components: {MoneyFormat},
        data() {
            return {
                operationCodes: [],
                limitData: {},
                periodData: [],
                currencyData: [],
                newLimit: true
            }
        },
        methods: {
            getPeriod() {
                let self = this;
                self.$http.get(self.$store.getters.apiUrl + '/limit/period')
                    .then(response => {
                        self.periodData = response.data.data;
                    }, self.handleError);
            },
            getOperationCode() {
                let self = this;
                self.$http.get(self.$store.getters.apiUrl + '/operationCode')
                    .then(response => {
                        self.filterOperationCode(response.data.data);
                    }, self.handleError);
            },
            filterOperationCode(operationCodes) {
                let self = this;
                for (let i = 0; i < operationCodes.length; i++) {
                    self.operationCodes.push(operationCodes[i].operationCode);
                }
            },
            getCurrency() {
                let self = this;
                self.$http.get(self.$store.getters.apiUrl + '/limit/currency')
                    .then(response => {
                        self.currencyData = response.data.data;
                    }, self.handleError);
            },
            save() {
                let self = this;
                self.limitData.minAmount = self.limitData.minAmount * 100;
                self.limitData.maxAmount = self.limitData.maxAmount * 100;
                if (self.limitData.id) {
                    self.$http.put(self.$store.getters.apiUrl + '/limit', self.limitData)
                        .then(() => {
                            self.redirect('limits');
                        }, self.handleError);
                } else {
                    self.$http.post(self.$store.getters.apiUrl + '/limit', self.limitData)
                        .then(() => {
                            self.redirect('limits');
                        }, self.handleError);
                }
            }
        },
        mounted() {
            if (this.$route.params.limit) {
                this.limitData = this.$route.params.limit;
                this.limitData.minAmount = this.limitData.minAmount / 100;
                this.limitData.maxAmount = this.limitData.maxAmount / 100;
            }
            // console.log(this.limitData)
            this.getOperationCode();
            this.getPeriod();
            this.getCurrency();
            this.newLimit = false;
        }
    }
</script>

<style scoped>

</style>