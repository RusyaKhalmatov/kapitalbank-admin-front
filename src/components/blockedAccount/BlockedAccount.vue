<template>
    <v-flex xs12>
        <v-card min-height="600">
            <v-card-title>
                <h1>Заблокированный Аккаунт</h1>
            </v-card-title>
            <v-card-text>
                <v-layout row wrap>
                    <v-text-field
                            v-model="search"
                            label="Поиск">
                    </v-text-field>
                    <v-flex xs12>
                        <v-data-table
                                :headers="blockedAccountHeader"
                                :items="result"
                                :loading="loader"
                                :search="search"
                                :pagination="pagination"
                                :item-key="result.id">
                            <template slot="items" slot-scope="props">
                                <tr @click="props.expanded = !props.expanded">
                                    <td>{{props.item.id}}</td>
                                    <td>{{props.item.phoneNumber.split(":")[0]}}
                                        {{phoneFormat(props.item.phoneNumber.split(":")[1]) | timestamp-to-date}}
                                    </td>
                                    <td>{{props.item.fullName}}</td>
                                    <td>{{props.item.blockedStatus}}</td>
                                    <td>{{props.item.blockedTime | timestamp-to-date}}</td>
                                    <td>
                                        <v-btn icon small @click="unblockAccount(props.item.id)">
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
        name: "BlockedAccount",
        data() {
            return {
                blockedAccountHeader: [
                    {text: "Идентификатор Пользователь", value: "id"},
                    {text: "Логин", value: "phoneNumber"},
                    {text: "Ф.И.О", value: "fullName"},
                    {text: "Заблокированный статус", value: "blockedStatus"},
                    {text: "Заблокированное время", value: "blockedTime"},
                    {text: "Действие", value: "false"},
                ],
                result: [],
                pagination: {},
                search: '',
            }
        },
        methods: {
            getListBlockedAccount() {
                let self = this;
                self.$http.get(self.$store.getters.apiUrl + '/blocked-account')
                    .then(response => {
                        self.loader = false;
                        self.result = response.data.data;
                    }, self.handleError);
            },
            unblockAccount(id) {
                let self = this;
                self.$http.post(self.$store.getters.apiUrl + `/blocked-account?userId=${id}`,)
                    .then(() => {
                        location.reload();
                    }, self.handleError);
            },
            phoneFormat(phone) {
                if (phone === '' || phone === null) {
                    return '';
                }
                return phone;
            }
        },
        mounted() {
            this.getListBlockedAccount();
        }
    }
</script>

<style scoped>

</style>