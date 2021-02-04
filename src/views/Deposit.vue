<template>
    <v-flex xs12>
        <v-card min-height="600">
            <v-card-title>
                <h1>Депозиты</h1>
                <v-spacer></v-spacer>
                <v-btn icon small @click="redirect('DepositProductForm')">
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
                                :headers="headers"
                                :items="depositProducts"
                                :search="search"
                                :pagination.sync="pagination"
                                :loading="loader"
                                item-key="product_code">
                            <template slot="items" slot-scope="props">
                                <tr @click="props.expanded = !props.expanded">
                                    <td>{{ props.item.productCode }}</td>
                                    <td>{{ props.item.productName }}</td>
                                    <td>{{ props.item.currency}}</td>
                                    <td>{{ props.item.term }}</td>
                                    <td>{{ props.item.minAmount / 100 | number-format }}</td>
                                    <td>{{ props.item.status }}</td>
                                    <td>
                                        <v-checkbox disabled v-model="props.item.depositRegisterType"/>
                                    </td>
                                    <td>
                                        <v-checkbox disabled v-model="props.item.incAllowed"/>
                                    </td>
                                    <td>
                                        <v-checkbox disabled v-model="props.item.earlyClosure"/>
                                    </td>
                                    <td>
                                        <v-checkbox disabled v-model="props.item.partialEnabled"/>
                                    </td>
                                    <td>{{ props.item.lang }}</td>
                                    <td>
                                        <v-btn :to="{name: 'DepositProductForm', params: {depositProduct: props.item}}"
                                               icon small>
                                            <v-icon small>mdi-pencil</v-icon>
                                        </v-btn>

                                        <v-btn @click.stop="deleteDepositProduct(props.item.id)" icon small>
                                            <v-icon small>mdi-delete</v-icon>
                                        </v-btn>
                                    </td>
                                </tr>
                            </template>
                            <template slot="expand" slot-scope="props">
                                <v-card flat>
                                    <v-card-text>
                                        <h4>{{ props.item.comment }}</h4>
                                        <v-img :src="props.item.imageUrl" v-if="props.item.imageUrl"></v-img>
                                        <v-list>
                                            <v-list-tile>
                                                <v-list-tile-content>
                                                    Процентная ставка (%): {{ props.item.interest }}
                                                    ({{props.item.interestCurrency }})
                                                </v-list-tile-content>
                                            </v-list-tile>
                                            <v-list-tile>
                                                <v-list-tile-content>
                                                    Период: {{ props.item.term }} ({{ props.item.termUnit }})
                                                </v-list-tile-content>
                                            </v-list-tile>
                                            <v-list-tile>
                                                <v-list-tile-content>
                                                    Максимальная сумма: {{ props.item.maxAmount / 100 | number-format }}
                                                </v-list-tile-content>
                                            </v-list-tile>
                                            <v-list-tile>
                                                <v-list-tile-content>
                                                    Доступные транзацкии: {{ props.item.allowedTransactionList }}
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
        name: "Deposit",
        data() {
            return {
                headers: [
                    {text: "Код депозита", value: "productCode"},
                    {text: "Название", value: "productName"},
                    {text: "Валюта", value: "currency"},
                    {text: "Период", value: "term"},
                    {text: "Минимальная сумма", value: "minAmount"},
                    {text: "Статус", value: "status"},
                    {text: "Оформление вклада", value: "depositRegisterType"},
                    {text: "Пополнять", value: "incAllowed"},
                    {text: "Досрочного закрытия", value: "earlyClosure"},
                    {text: "Частичного списания", value: "partialEnabled"},
                    {text: "Язык", value: "lang"},
                    {text: "Действия", sortable: false}
                ],
                depositProducts: [],
                pagination: {},
                search: ""
            }
        },
        methods: {
            getDepositProduct() {
                let self = this;
                self.$http.get(self.$store.getters.apiUrl + "/deposit-product")
                    .then(response => {
                        self.loader = false;
                        self.depositProducts = response.data.data;
                    }, self.handleError);
            },
            deleteDepositProduct(id) {
                let self = this;
                self.$http.delete(self.$store.getters.apiUrl + "/deposit-product/"+id)
                .then(() => {
                    // location.reload();
                    self.getDepositProduct();
                    self.redirect("deposit");
                }, self.handleError);
            }
        },
        mounted() {
            this.getDepositProduct();
        }
    }
</script>