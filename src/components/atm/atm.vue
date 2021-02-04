<template>
    <v-layout column wrap>
        <v-card min-height="600">
            <v-card-title>
                <h1>ATM</h1>
                <v-spacer/>
                <v-btn icon small @click="redirect('atmForm')">
                    <v-icon small>mdi-plus</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <v-layout row wrap>
                    <v-text-field
                            v-model="search"
                            prepend-icon="mdi-magnify"
                            label="Поиск"/>
                    <v-flex xs12>
                        <v-data-table
                                :headers="atmHeaders"
                                :items="atmItems"
                                :loading="loader"
                                :search="search"
                                :pagination.sync="pagination"
                                :item-key="atmItems.id">
                            <template slot="items" slot-scope="props">
                                <tr>
                                    <td>{{props.item.id}}</td>
                                    <td>{{props.item.name}}</td>
                                    <td>{{props.item.address}}</td>
                                    <td>
                                        <v-checkbox v-model="props.item.tfHours" disabled>
                                        </v-checkbox>
                                    </td>
                                    <td>
                                        <v-btn :to="{name: 'atmForm',params: {atm: props.item}}" icon small>
                                            <v-icon small>mdi-pencil</v-icon>
                                        </v-btn>
                                        <v-btn icon small @click.native="deleteAtm(props.item.id)">
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
        name: "atm",
        data() {
            return {
                search: '',
                atmHeaders: [
                    {text: "ID", value: "id"},
                    {text: "Ф.И.О.", value: "name"},
                    {text: "Адрес", value: "address"},
                    {text: "24 часа", value: "tfHours"},
                    {text: "Действия", sortable: false}
                ],
                atmItems: [],
                pagination: {}
            }
        },
        methods: {
            getAtmList() {
                let self = this;
                this.loader = true;
                self.$http.get(self.$store.getters.apiUrl + '/atm')
                    .then(response => {
                        self.atmItems = response.data.data;
                        self.loader = false;
                    }, self.handleError);
            },
            deleteAtm(id) {
                let self = this;
                this.loader = true;
                self.$http.delete(self.$store.getters.apiUrl + '/atm/'+id)
                .then(() => {
                    this.loader = false;
                    self.redirect('atm');
                    self.getAtmList();
                }, self.handleError);
            }
        },
        mounted() {
            this.getAtmList();
        }
    }
</script>

<style scoped>

</style>