<template>
    <v-layout column wrap>
        <v-card min-height="600">
            <v-card-title>
                <h1>Код Операции</h1>
                <v-spacer/>
                <v-btn icon small @click="redirect('OperationCodesForm')">
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
                                :headers="operationsHeaders"
                                :items="operations"
                                :search="search"
                                :loading="loader"
                                :pagination.sync="pagination"
                                item-key="operationCode"
                        >
                            <template slot="items" slot-scope="props">
                                <tr>
                                    <td @click="props.expanded = !props.expanded">{{ props.item.operationCode }}</td>
                                    <td @click="props.expanded = !props.expanded">
                                        <span class="pl-1">{{ props.item.operationType }}</span>
                                    </td>
                                    <td>{{props.item.senderType}}</td>
                                    <td>{{props.item.receiverType}}</td>
                                    <td>{{props.item.operationCodeComment}}</td>
                                    <td>
                                        <v-checkbox
                                                disabled
                                                v-model="props.item.allowed">
                                        </v-checkbox>
                                    </td>
                                    <td>
                                        <v-btn :to="{name: 'OperationCodesForm', params: {operations: props.item}}"
                                               icon small>
                                            <v-icon small>mdi-pencil</v-icon>
                                        </v-btn>
                                        <v-btn icon small @click.native="deleteOperation(props.item.id)">
                                            <v-icon small>mdi-delete</v-icon>
                                        </v-btn>
                                    </td>
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
        name: "OperationCodes",
        data() {
            return {
                operationsHeaders: [
                    {text: "Код операции", value: "operationCode"},
                    {text: "Тип операции", value: "operationType"},
                    {text: "Тип Отправителя", value: "senderType"},
                    {text: "Тип Получателя", value: "receiverType"},
                    {text: "Коммент",value: "operationCodeComment"},
                    {text: "Разрешено", value: "isAllowed"},
                    {text: "Действия", sortable: false}
                ],
                operations: [],
                search: "",
                pagination: {}
            }
        },
        methods: {
            getOperations() {
                let self = this;
                self.$http.get(self.$store.getters.apiUrl + '/operation-code')
                    .then(response => {
                        self.operations = response.data.data;
                        self.loader = false;
                    }, self.handleError);
            },
            deleteOperation(code) {
                let self = this;
                self.$http.delete(self.$store.getters.apiUrl + '/operation-code/'+code)
                .then(() => {
                    self.redirect('operationCodes');
                    self.getOperations();
                }, self.handleError);
            }
        },
        mounted() {
            this.getOperations();
        }
    }
</script>

<style scoped>

</style>