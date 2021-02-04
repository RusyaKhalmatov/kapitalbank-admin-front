<template>
    <v-flex xs12>
        <v-card min-height="600">
            <v-card-title>
                <h1>VIP-пользователи</h1>
                <v-spacer/>
                <v-btn icon small @click="redirect('vipClientsForm')">
                    <v-icon small>mdi-plus</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-text-field
                                v-model="search"
                                label="Поиск">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-data-table
                                :headers="vipClientHeaders"
                                :items="vipClientData"
                                :loading="loader"
                                :search="search"
                                :pagination.sync="pagination"
                                :item-key="vipClientData.operationCode">
                            <template slot="items" slot-scope="props">
                                <tr>
                                    <td>{{props.item.user_id}}</td>
                                    <td>{{props.item.user_name}}</td>
                                    <td>{{props.item.operation_code}}</td>
                                    <td>
                                        <v-btn icon small @click="deleteVipUser(props.item.id)">
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
    </v-flex>
</template>

<script>
    export default {
        name: "VipClients",
        data() {
            return {
                vipClientHeaders: [
                    {text: "Идентификатор пользователя", value: "user_id"},
                    {text: "Полное имя пользователя", value: "user_name"},
                    {text: "Код Операции", value: "operation_code"},
                    {text: "Действие", sortable: false}
                ],
                search: '',
                vipClientData: [],
                pagination: {}
            }
        },
        methods: {
            getAllLimits() {
                let self = this;
                self.$http.get(self.$store.getters.apiUrl + '/client/vip')
                    .then(response => {
                        self.loader = false;
                        self.vipClientData = response.data.data;
                    }, self.handleError)
            },
            deleteVipUser(id) {
                let self = this;
                self.$http.delete(self.$store.getters.apiUrl + `/client/vip/${id}`)
                    .then(() => {
                        location.reload();
                    }, self.handleError)
            }
        },
        mounted() {
            this.getAllLimits();
        }
    }
</script>

<style scoped>

</style>