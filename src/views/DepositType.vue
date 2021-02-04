<template>
    <v-flex xs12>
        <v-card min-height="600">
            <v-card-title>
                <h1>Виды Кредитов</h1>
                <v-spacer/>
                <v-btn icon small @click="redirect('depositTypeForm')">
                    <v-icon small>mdi-plus</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <v-layout column wrap>
                    <v-text-field
                            v-model="search"
                            label="Поиск"/>
                    <v-flex xs12>
                        <v-data-table
                                :headers="depositTypeHeader"
                                :items="depositData"
                                :loading="loader"
                                :search="search"
                                :pagination.sync="pagination"
                                :item-key="depositData.id">
                            <template slot="items" slot-scope="props">
                                <tr>
                                    <td>{{props.item.id}}</td>
                                    <td>{{props.item.typeCode}}</td>
                                    <td>{{props.item.nameUz}}</td>
                                    <td>{{props.item.nameRu}}</td>
                                    <td>{{props.item.nameEn}}</td>
                                    <td>
                                        <v-btn icon small
                                               :to="{name: 'depositTypeForm', params: {depositType: props.item}}">
                                            <v-icon small>mdi-pencil</v-icon>
                                        </v-btn>
                                        <v-btn icon small @click="deleteDepositType(props.item.id)">
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
        name: "DepositType",
        data() {
            return {
                depositTypeHeader: [
                    {text: "Id", value: "id"},
                    {text: "Type Code", value: "typeCode"},
                    {text: "Name Uz", value: "nameUz"},
                    {text: "Name Ru", value: "nameRu"},
                    {text: "Name En", value: "nameEn"},
                    {text: "Действия", sortable: false}
                ],
                depositData: [],
                search: '',
                pagination: {}
            }
        },
        methods: {
            getDepositTypes() {
                let self = this;
                self.$http.get(self.$store.getters.apiUrl + '/loan')
                    .then(response => {
                        self.loader = false;
                        self.depositData = response.data.data;
                    }, self.handleError);
            },
            deleteDepositType(id) {
                let self = this;
                self.$http.delete(self.$store.getters.apiUrl + `/loan/${id}`)
                    .then(() => {
                        // location.reload();
                        self.getDepositTypes();
                    }, self.handleError);
            }
        },
        mounted() {
            this.getDepositTypes();
        }
    }
</script>

<style scoped>

</style>