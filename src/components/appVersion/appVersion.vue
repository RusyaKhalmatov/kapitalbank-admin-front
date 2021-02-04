<template>
    <v-flex xs12>
        <v-card min-height="600">
            <v-card-title>
                <h1>Версия приложения</h1>
                <v-spacer></v-spacer>
                <v-btn icon small @click="redirect('appVersionForm')">
                    <v-icon small>mdi-plus</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <v-layout row wrap>
                    <v-text-field
                            v-model="search"
                            label="Поискк">
                    </v-text-field>
                    <v-flex xs12>
                        <v-data-table
                                :headers="versionHeaders"
                                :items="versionList"
                                :loading="loader"
                                :search="search"
                                :pagination.sync="pagination"
                                :item-key="versionList.platform">
                            <template slot="items" slot-scope="props">
                                <tr @click="props.expanded = !props.expanded">
                                    <td>{{props.item.platform}}</td>
                                    <td>{{props.item.version}}</td>
                                    <td>{{props.item.releaseDate | timestamp-to-date}}</td>
                                    <td>{{props.item.details}}</td>
                                    <td>
                                        <v-checkbox disabled v-model="props.item.active"/>
                                    </td>
                                    <td>
                                        <v-btn icon small :to="{name: 'appVersionForm', params: {version: props.item}}">
                                            <v-icon small>mdi-pencil</v-icon>
                                        </v-btn>
                                        <v-btn icon small @click.native="deleteVersion(props.item.id)">
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
        name: "appVersion",
        data() {
            return {
                versionHeaders: [
                    {text: "Платформа", value: "platform"},
                    {text: "Версия", value: "version"},
                    {text: "Дата выхода", value: "releaseDate"},
                    {text: "Подробности", value: "details"},
                    {text: "Активный", value: "active"},
                    {text: "Действие", value: "false"},
                ],
                versionList: [],
                pagination: {},
                search: '',
            }
        },
        methods: {
            getAppVersionList() {
                let self = this;
                self.$http.get(self.$store.getters.apiUrl + '/app-version')
                    .then(response => {
                        self.loader = false;
                        self.versionList = response.data.data;
                    })
            },
            deleteVersion(id) {
                let self = this;
                self.$http.delete(self.$store.getters.apiUrl + '/app-version/'+id)
                    .then(() => {
                        // location.reload();
                        // self.redirect('appVersion');
                        self.getAppVersionList();
                    }, self.handleError);
            }
        },
        mounted() {
            this.getAppVersionList();
        }
    }
</script>

<style scoped>

</style>