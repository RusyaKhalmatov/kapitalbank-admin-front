<template>
    <v-layout column wrap>
        <v-card min-height="600">
            <v-card-title>
                <h1>Банки</h1>
                <v-spacer></v-spacer>
                <v-btn icon small @click="redirect('BankForm')">
                    <v-icon small>mdi-plus</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <v-layout row wrap>
                    <v-flex xs12 sm12 md12 lg12 xl12>
                        <v-text-field
                                v-model="search"
                                prepend-icon="mdi-magnify"
                                label="Поиск">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-data-table
                                :headers="bankHeaders"
                                :items="banks"
                                :search="search"
                                :loading="loader"
                                :pagination.sync="pagination"
                                item-key="bankCode"
                        >
                            <template slot="items" slot-scope="props">
                                <tr @click="props.expanded = !props.expanded">
                                    <td>{{ props.item.bankCode }}</td>
                                    <td>
                                        <span class="pl-1">{{ props.item.name }}</span>
                                    </td>
                                    <td>
                                        <span class="pl-1">{{ props.item.shortName }}</span>
                                    </td>
                                    <td v-if="props.item.maxAmount>0">
                                        {{props.item.maxAmount / 100| number-format}}
                                    </td>
                                    <td v-else>
                                        Без Лимита
                                    <td>
                                        <v-btn small icon color="primary" :href="props.item.logoUrl"
                                               v-if="props.item.logoUrl">
                                            <v-icon>
                                                mdi-file-image
                                            </v-icon>
                                        </v-btn>
                                    </td>
                                    <td>
                                        {{ props.item.receiveEnabled }}
                                    </td>
                                    <td>
                                        <v-btn :to="{name: 'BankForm', params: {bank: props.item}}"
                                               icon small>
                                            <v-icon small>mdi-pencil</v-icon>
                                        </v-btn>
                                        <v-btn icon small @click.native="deleteBank(props.item.id)">
                                            <v-icon small>mdi-delete</v-icon>
                                        </v-btn>
                                    </td>
                                </tr>
                            </template>
                            <template slot="expand" slot-scope="props">
                                <v-card flat>
                                    <v-card-text>
                                        <v-list>
                                            <v-list-tile>
                                                <v-list-tile-content>
                                                    {{ "Наша комиссия" }}: {{ props.item.ourFee / 100 }}%
                                                </v-list-tile-content>
                                            </v-list-tile>
                                            <v-list-tile>
                                                <v-list-tile-content>
                                                    {{ "Комиссия принимающей стороны" }}: {{ props.item.receiverFee /
                                                    100 }}%
                                                </v-list-tile-content>
                                            </v-list-tile>
                                            <v-list-tile>
                                                <v-list-tile-content>
                                                    {{ "Комиссия UzCard" }}: {{ props.item.uzCardFee / 100}}%
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
    </v-layout>
</template>

<script>
    export default {
        name: "Bank",
        data() {
            return {
                bankHeaders: [
                    {text: "Код банка", value: "bankCode"},
                    {text: "Название", value: "name"},
                    {text: "Короткое имя", value: "shortName"},
                    {text: "Max Amount", value: "maxAmount"},
                    {text: "Лого", value: "logoUrl"},
                    {text: "Могут принимать", value: "receiveEnabled"},
                    {text: "Действия", sortable: false}
                ],
                banks: [],
                search: "",
                pagination: {}
            }
        },
        methods: {
            getBankList() {
                let self = this;
                self.$http.get(self.$store.getters.apiUrl + "/bank")
                    .then(response => {
                        self.banks = response.data.data;
                        self.loader = false;
                    }, self.handleError);
            },
            deleteBank(code) {
                let self = this;
                self.$http.delete(self.$store.getters.apiUrl + "/bank/"+code)
                .then(() => {
                    self.redirect('bank');
                    self.getBankList();
                }, self.handleError);
            }
        },
        mounted() {
            this.getBankList();
        }
    }
</script>

<style scoped>

</style>