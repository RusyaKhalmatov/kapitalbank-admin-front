<template>
    <v-flex xs12>
        <v-card min-height="600">
            <v-card-title>
                <h1>Внешний Сервис</h1>
            </v-card-title>
            <v-card-text>
                <v-layout column wrap>
                    <v-text-field
                            v-model="search"
                            label="Поиск"/>
                    <v-flex xs12>
                        <v-data-table
                                :headers="exServHeader"
                                :items="extServData"
                                :loading="loader"
                                :pagination.sync="pagination"
                                :search="search"
                                :item-key="extServData.id">
                            <template slot="items" slot-scope="props">
                                <tr>
                                    <td>{{props.item.id}}</td>
                                    <td>{{props.item.name}}</td>
                                    <td>{{props.item.type}}</td>
                                    <td>{{props.item.timeoutCount}}</td>
                                    <td>
                                        <v-checkbox
                                                v-model="props.item.available"
                                                @change="dialog = true"
                                                @click.native="selectItem(props.item)"/>
                                    </td>
                                    <td>{{props.item.updatedAt | timestamp-to-date}}</td>
                                    <v-dialog v-model="dialog" width="400">
                                        <v-card>
                                            <v-card-title>
                                                <h3>Внешний Сервис</h3>
                                            </v-card-title>
                                            <v-card-text>
                                                Вы действительно хотите изменить?
                                            </v-card-text>
                                            <v-card-actions>
                                                <v-spacer/>
                                                <v-btn @click.stop="dialog = false, getExternalServices()"
                                                       color="primary">Нет
                                                </v-btn>
                                                <v-btn @click.native="changeStatement(selected.id,selected.available)"
                                                       color="primary">Да
                                                </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>
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
        name: "ExternalServices",
        data() {
            return {
                exServHeader: [
                    {text: "ID", value: "id"},
                    {text: "Name", value: "name"},
                    {text: "Type", value: "type"},
                    {text: "Timeout Count", value: "timeoutCount"},
                    {text: "Available", value: "available"},
                    {text: "Update At", value: "updatedAt"}
                ],
                extServData: [],
                selected: {},
                pagination: {},
                search: '',
                dialog: false
            }
        },
        methods: {
            getExternalServices() {
                let self = this;
                self.$http.get(self.$store.getters.apiUrl + '/external-services')
                    .then(response => {
                        self.loader = false;
                        self.extServData = response.data.data;
                    }, self.handleError);
            },
            changeStatement(extId, available) {
                let self = this;
                self.$http.put(self.$store.getters.apiUrl + `/external-services/${extId}?switch=${available}`)
                    .then(() => {
                        location.reload();
                    }, self.handleError);
            },
            selectItem(item) {
                this.selected = item;
            }
        },
        mounted() {
            this.getExternalServices();
        }
    }
</script>

<style scoped>

</style>