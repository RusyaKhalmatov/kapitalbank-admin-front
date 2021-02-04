<template>
    <v-flex xs12>
        <v-card min-height="600">
            <v-card-title>
                <h1>Лимиты по транзакциям</h1>
                <v-spacer/>
                <v-btn icon small @click="redirect('limitsForm')">
                    <v-icon small>mdi-plus</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <v-layout column wrap>
                    <v-text-field
                            v-model="search"
                            label="Поиск">
                    </v-text-field>
                    <v-data-table
                            :headers="limitHeaders"
                            :items="limitData"
                            :loading="loader"
                            :search="search"
                            :pagination.sync="pagination"
                            :item-key="limitData.id">
                        <template slot="items" slot-scope="props">
                            <tr>
                                <td>{{props.item.id}}</td>
                                <td>{{props.item.operationCode}}</td>
                                <td>{{props.item.period}}</td>
                                <td>{{props.item.minAmount/100 | number-format}}</td>
                                <td>{{props.item.maxAmount/100 | number-format}}</td>
                                <td>{{props.item.currency}}</td>
                                <td>{{props.item.receiver}}</td>
                                <td>{{props.item.limitComment}}</td>
                                <td>
                                    <v-btn icon small :to="{name: 'limitsForm',params: {limit: props.item}}">
                                        <v-icon small>mdi-pencil</v-icon>
                                    </v-btn>
                                    <v-btn icon small @click="deleteLimit(props.item.id)">
                                        <v-icon small>mdi-delete</v-icon>
                                    </v-btn>
                                </td>
                            </tr>
                        </template>
                    </v-data-table>
                </v-layout>
            </v-card-text>
        </v-card>
    </v-flex>
</template>

<script>
    export default {
        name: "Limits",
        data() {
            return {
                limitHeaders: [
                    {text: 'ID', value: 'id'},
                    {text: 'Код Операции', value: 'operation_code'},
                    {text: 'Период', value: 'period'},
                    {text: 'Минимальная cумма', value: 'min_amount'},
                    {text: 'Максимальная cумма', value: 'max_amount'},
                    {text: 'Валюта', value: 'currency'},
                    {text: 'Лимит для получателя', value: 'receiver'},
                    {text: 'Коммент', value: 'limitComment'},
                    {text: 'Действия', sortable: false}
                ],
                limitData: [],
                pagination: {},
                search: ''
            }
        },
        methods: {
            getLimits() {
                let self = this;
                self.$http.get(self.$store.getters.apiUrl + '/limit')
                    .then(response => {
                        self.loader = false;
                        self.limitData = response.data.data;
                    }, self.handleError);
            },
            deleteLimit(id) {
                let self = this;
                self.$http.delete(self.$store.getters.apiUrl + `/limit/${id}`)
                    .then(() => {
                        location.reload();
                    }, self.handleError);
            }
        },
        mounted() {
            this.getLimits();
        }
    }
</script>

<style scoped>

</style>