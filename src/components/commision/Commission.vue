<template>
    <v-flex xs12>
        <v-card min-height="600">
            <v-card-title>
                <h1>Комиссии</h1>
                <v-spacer/>
                <v-btn icon small @click="redirect('commissionForm')">
                    <v-icon small>mdi-plus</v-icon>
                </v-btn>
                <v-progress-linear v-if="!commissionData.length" indeterminate color="yellow" ></v-progress-linear>
            </v-card-title>
            <v-card-text v-if="commissionData.length">
                <v-layout column wrap>
                    <v-text-field
                            v-model="search"
                            label="Search"/>
                    <v-flex xs12>
                        <v-data-table
                                :headers="commissionHeader"
                                :items="commissionData"
                                :loading="loader"
                                :search="search"
                                :pagination="pagination"
                                :item-key="commissionData.id">
                            <template slot="items" slot-scope="props">
                                <tr @click="props.expanded = !props.expanded">
                                    <td>{{props.item.id}}</td>
                                    <td>{{props.item.commissionCode}}</td>
                                    <td>{{props.item.defaultCurrency}}</td>
                                    <td>
                                        <v-btn icon small
                                               :to="{name: 'commissionForm', params: {commission: props.item}}">
                                            <v-icon small>mdi-pencil</v-icon>
                                        </v-btn>
                                        <v-btn icon small @click.stop="deleteCommission(props.item.id)">
                                            <v-icon small>mdi-delete</v-icon>
                                        </v-btn>
                                    </td>
                                </tr>
                            </template>
                            <template slot="expand" slot-scope="props">
                                <v-card flat>
                                    <v-card-text>
                                        <v-list v-for="item in props.item.commissionDetailList" :key="item">
                                            <v-list-tile>
                                                <v-list-tile-content>
                                                    <v-list-tile-title>
                                                        Currency: {{item.currency}}
                                                    </v-list-tile-title>
                                                </v-list-tile-content>
                                                <v-list-tile-content>
                                                    <v-list-tile-title>
                                                        Round Type: {{item.roundType}}
                                                    </v-list-tile-title>
                                                </v-list-tile-content>
                                                <v-list-tile-content>
                                                    <v-list-tile-title>
                                                        Rate: {{item.rate}}
                                                    </v-list-tile-title>
                                                </v-list-tile-content>
                                            </v-list-tile>
                                            <v-list-tile>
                                                <v-list-tile-content>
                                                    <v-list-tile-title>
                                                        <v-checkbox
                                                                disabled
                                                                label="Amount is Fixed"
                                                                v-model="item.amountIsFix">
                                                        </v-checkbox>
                                                    </v-list-tile-title>
                                                </v-list-tile-content>
                                            </v-list-tile>
                                            <v-list-tile v-if="item.amountIsFix">
                                                <v-list-tile-content>
                                                    <v-list-tile-title>
                                                        Fix Amount: {{item.fixAmount}}
                                                    </v-list-tile-title>
                                                </v-list-tile-content>
                                            </v-list-tile>
                                            <v-list-tile v-if="item.amountIsFix">
                                                <v-list-tile-content>
                                                    <v-list-tile-title>
                                                        From Amount: {{item.fromAmount}}
                                                    </v-list-tile-title>
                                                </v-list-tile-content>
                                                <v-list-tile-content>
                                                    <v-list-tile-title>
                                                        To Amount: {{item.toAmount}}
                                                    </v-list-tile-title>
                                                </v-list-tile-content>
                                            </v-list-tile>
                                            <v-list-tile v-if="item.amountIsFix">
                                                <v-list-tile-content>
                                                    <v-list-tile-title>
                                                        Min Commission: {{item.minCommission}}
                                                    </v-list-tile-title>
                                                </v-list-tile-content>
                                                <v-list-tile-content>
                                                    <v-list-tile-title>
                                                        Max Commission: {{item.maxCommission}}
                                                    </v-list-tile-title>
                                                </v-list-tile-content>
                                            </v-list-tile>
                                        </v-list>
                                    </v-card-text>
                                </v-card>
                            </template>
                        </v-data-table>
                    </v-flex>
                </v-layout>
            </v-card-text>
        </v-card>
    </v-flex>
</template>

<script>
    export default {
        name: "Commission",
        data() {
            return {
                commissionHeader: [
                    {text: "id", value: "id"},
                    {text: "Код комиссии", value: "commissionCode"},
                    {text: "Валюта по умолчанию", value: "defaultCurrency"},
                    {text: "Действия", sortable: false}
                ],
                search: '',
                commissionData: [],
                pagination: {}
            }
        },
        methods: {
            getCommissionList() {
                let self = this;
                self.$http.get(self.$store.getters.apiUrl + '/commission')
                    .then(response => {
                        self.commissionData = response.data.data;
                    }, self.handleError);
            },
            deleteCommission(id) {
                let self = this;
                self.$http.delete(self.$store.getters.apiUrl + '/commission/'+id)
                .then(() => {
                    // location.reload();
                    self.getCommissionList();
                }, self.handleError);
            }
        },
        mounted() {
            this.getCommissionList();
        }
    }
</script>

<style scoped>

</style>