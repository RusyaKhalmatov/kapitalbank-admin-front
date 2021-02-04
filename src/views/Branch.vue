<template>
    <v-layout column wrap>
        <v-card min-height="600">
            <v-card-title>
                <h1>Филиал</h1>
                <v-spacer/>
                <v-btn icon small @click="redirect('branchForm')">
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
                                :headers="branchHeaders"
                                :items="branches"
                                :loading="loader"
                                :search="search"
                                :pagination.sync="pagination"
                                :item-key="branches.id">
                            <template slot="items" slot-scope="props">
                                <tr @click="props.expanded = !props.expanded">
                                    <td>{{props.item.id}}</td>
                                    <td>{{props.item.mfo}}</td>
                                    <td>{{props.item.name}}</td>
                                    <td>{{props.item.address}}</td>
                                    <td>
                                        <v-btn :to="{name: 'branchForm',params: {branch: props.item}}" icon small>
                                            <v-icon small>mdi-pencil</v-icon>
                                        </v-btn>
                                        <v-btn icon small @click.native="deleteBranch(props.item.id)">
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
        name: "Branch",
        data() {
            return {
                search: '',
                branches: [],
                pagination: {},
                branchHeaders: [
                    {text: "ID", value: "id"},
                    {text: "МФО", value: "mfo"},
                    {text: "Ф.И.О.", value: "name"},
                    {text: "Адрес", value: "address"},
                    {text: "Действия", sortable: false}
                ]
            }
        },
        methods: {
            getBranches() {
                let self = this;
                self.$http.get(self.$store.getters.apiUrl + '/branch')
                    .then(response => {
                        self.loader = false;
                        self.branches = response.data.data;
                    }, self.handleError);
            },
            deleteBranch(id) {
                let self = this;
                self.$http.delete(self.$store.getters.apiUrl + '/branch/'+id)
                .then(() => {
                    self.redirect('branch');
                    self.getBranches();
                }, self.handleError);
            }
        },
        mounted() {
            this.getBranches();
        }
    }
</script>

<style scoped>

</style>