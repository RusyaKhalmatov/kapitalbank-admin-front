<template>
    <v-flex xs12>
        <v-card min-height="600">
            <v-card-title>
                <h1>EPOS</h1>
                <v-spacer/>
                <v-btn icon small @click="redirect('eposForm')">
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
                            :headers="eposHeaders"
                            :items="eposData"
                            :loading="loader"
                            :search="search"
                            :pagination.sync="pagination"
                            :item-key="eposData.id">
                        <template slot="items" slot-scope="props">
                            <tr>
                                <td>{{props.item.id}}</td>
                                <td>{{props.item.merchant}}</td>
                                <td>{{props.item.terminal}}</td>
                                <td>{{props.item.eposType}}</td>
                                <td>{{props.item.accountType}}</td>
                                <td>{{props.item.port}}</td>
                                <td>
                                    <v-btn icon small
                                           :to="{name: 'eposForm',params: {epos: props.item}}">
                                        <v-icon small>mdi-pencil</v-icon>
                                    </v-btn>
                                    <v-btn icon small @click="deleteEpos(props.item.id)">
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
        name: "epos",
        data() {
            return {
                search: '',
                eposData: [],
                eposHeaders: [
                    {text: "ID", value: "id"},
                    {text: "Merchant", value: "merchant"},
                    {text: "Terminal", value: "terminal"},
                    {text: "Epos Type", value: "eposType"},
                    {text: "Account Type", value: "accountType"},
                    {text: "Port", value: "port"},
                    {text: "Действие", sortable: false}
                ],
                pagination: {}
            }
        },
        methods: {
            getEposTypes() {
                let self = this;
                self.$http.get(self.$store.getters.apiUrl + '/epos')
                    .then(response => {
                        self.eposData = response.data.data;
                    }, self.handleError);
            },
            deleteEpos(id) {
                let self = this;
                self.$http.delete(self.$store.getters.apiUrl + '/epos/'+id)
                .then(() => {
                    // location.reload();
                    self.getEposTypes();
                }, self.handleError);
            }
        },
        mounted() {
            this.getEposTypes();
        }
    }
</script>

<style scoped>

</style>