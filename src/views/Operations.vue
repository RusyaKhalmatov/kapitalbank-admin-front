<template>
    <v-layout column wrap>
        <v-card min-height="600">
            <v-card-title>
                <h1>Операции</h1>
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
                                :loading="loader"
                                :search="search"
                                :pagination.sync="pagination"
                                item-key="operationId">
                            <template slot="items" slot-scope="props">
                                <tr>
                                    <td>{{props.item.operationCode}}</td>
                                    <td>{{props.item.operationStatus}}</td>
                                    <td>{{props.item.operationType}}</td>
                                    <td>{{props.item.sender}}</td>
                                    <td>{{props.item.receiver}}</td>
                                </tr>
                            </template>
<!--                            <template>-->
<!--                                <tr @click="props.expaded = !props.expanded">-->
<!--                                    <td></td>-->
<!--                                </tr>-->
<!--                            </template>-->
                        </v-data-table>
                    </v-flex>
                </v-layout>
            </v-card-text>
        </v-card>
    </v-layout>
</template>

<script>
    export default {
        name: "Operations",
        data() {
            return {
                operationsHeaders: [
                    {text: "Operation Code", value: "operationCode"},
                    {text: "Operation Status", value: "operationStatus"},
                    {text: "Operation Type", value: "operationType"},
                    {text: "Sender", value: "Sender"},
                    {text: "Receiver", value: "Receiver"},
                    // {text: "Действия", sortable: false}
                ],
                operations: [],
                pagination: {},
                search: ""
            }
        },
        methods: {
            getAllOperations() {
                let self = this;
                self.$http.get(self.$store.getters.apiUrl + '/transaction/hold/operations')
                    .then(response => {
                        self.loader = false;
                        self.operations = response.data.data;
                    }, self.handleError);
            }
        },
        mounted() {
            this.getAllOperations();
        }
    }
</script>

<style scoped>

</style>