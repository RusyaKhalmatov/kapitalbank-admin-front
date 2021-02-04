<template>
    <v-flex xs12>
        <v-card min-height="600">
            <v-card-title>
                <h1>Комиссия</h1>
                <v-spacer/>
                <v-btn icon small @click="redirect('commission')">
                    <v-icon small>mdi-arrow-left</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <v-layout row wrap justify-center>
                    <v-flex xs12 sm12 md8>
                        <v-text-field
                                v-model="commissionData.commissionCode"
                                label="Код комиссии"/>
                        <v-select
                                :items="currency"
                                v-model="commissionData.defaultCurrency"
                                label="Валюта по умолчанию"/>
                        <v-text-field
                                v-model="commissionDetail.rate"
                                label="Ставка"/>
                        <v-select
                                :items="currency"
                                v-model="commissionDetail.currency"
                                label="Валюта"/>
                        <v-layout row wrap>
                            <v-flex xs6>
                                <money-format
                                        v-model="commissionDetail.fromAmount"
                                        label="От суммы"/>
                            </v-flex>
                            <v-flex xs6>
                                <money-format
                                        v-model="commissionDetail.toAmount"
                                        label="На сумму"/>
                            </v-flex>
                        </v-layout>
                        <v-layout row wrap>
                            <v-flex xs6>
                                <v-text-field
                                        v-model="commissionDetail.minCommission"
                                        label="Минимальная комиссия"/>
                            </v-flex>
                            <v-flex xs6>
                                <v-text-field
                                        v-model="commissionDetail.maxCommission"
                                        label="Максимальная комиссия"/>
                            </v-flex>
                        </v-layout>
                        <v-select
                                :items="roundType"
                                v-model="commissionDetail.roundType"
                                label="Круглый тип"/>
                        <v-checkbox
                                v-model="commissionDetail.roundType"
                                label="Сумма фиксированная"/>
                        <v-btn color="primary" @click="saveCommission">
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
        name: "CommissionForm",
        components: {MoneyFormat},
        data() {
            return {
                commissionDetail: {},
                commissionData: {
                    commissionDetailList: []
                },
                isNew: true,
                currency: ["UZS", "USD", "EUR", "RUB", "GBP", "JPY", "KZT", "CNY", "CHF", "KRW", "UNKNOWN"],
                roundType: ["HIGH", "LOW", "NATURAL", "MATH"]
            }
        },
        methods: {
            saveCommission() {
                let self = this;
                if (self.isNew) {
                    self.commissionData.commissionDetailList.push(self.commissionDetail);
                    self.$http.post(self.$store.getters.apiUrl + '/commission', self.commissionData)
                        .then(() => {
                            self.redirect('commission');
                        }, self.handleError);
                } else {
                    self.commissionData.commissionDetailList.push(self.commissionDetail);
                    self.$http.put(self.$store.getters.apiUrl + '/commission', self.commissionData)
                        .then(() => {
                            self.redirect('commission');
                        }, self.handleError);
                }
            }
        },
        mounted() {
            if (this.$route.params.commission) {
                this.isNew = false;
                this.commissionData = this.$route.params.commission;
                this.commissionData.commissionDetailList.forEach(item => {
                    this.commissionDetail = item;
                })
            }
        }
    }
</script>

<style scoped>

</style>