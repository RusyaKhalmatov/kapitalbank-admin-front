<template>
    <v-flex xs12>
        <v-card min-height="600">
            <v-card-title>
                <h1>Заблокированные Устройства</h1>
            </v-card-title>
            <v-card-text>
                <v-layout row wrap>
                    <v-text-field
                            v-model="search"
                            label="Поиск">
                    </v-text-field>
                    <v-flex xs12>
                        <v-data-table
                                :headers="blockedDevicesHeader"
                                :items="result"
                                :loading="loader"
                                :search="search"
                                :pagination.sync="pagination"
                                :item-key="result.deviceId">
                            <template slot="items" slot-scope="props">
                                <tr @click="props.expanded = !props.expanded">
                                    <td>{{props.item.deviceId}}</td>
                                    <td v-if="props.item.device">{{props.item.device.name}}</td>
                                    <td v-else/>
                                    <td>{{props.item.blockedStatus}}</td>
                                    <td>{{props.item.blockedTime | timestamp-to-date}}</td>
                                    <td>{{props.item.event}}</td>
                                    <td>
                                        <v-btn icon small @click.native="unblockDevice(props.item.deviceId)">
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
        name: "BlockedDevices",
        data() {
            return {
                blockedDevicesHeader: [
                    {text: "Идентификатор устройства", value: "deviceId"},
                    {text: "Имя", value: "name"},
                    {text: "Заблокированный статус", value: "blockedStatus"},
                    {text: "Заблокированное время", value: "blockedTime"},
                    {text: "Событие", value: "event"},
                    {text: "Действие", value: "false"},
                ],
                pagination: {},
                result: [],
                search: ''
            }
        },
        methods: {
            getAllBlockedDevices() {
                let self = this;
                self.$http.get(self.$store.getters.apiUrl + '/blocked-devices')
                    .then(response => {
                        self.loader = false;
                        self.result = response.data.data;
                    }, self.handleError);
            },
            unblockDevice(deviceId) {
                let self = this;
                self.$http.post(self.$store.getters.apiUrl + `/blocked-devices/${deviceId}`).then(() => {
                    location.reload();
                }, self.handleError);
            }
        },
        mounted() {
            this.getAllBlockedDevices();
        }
    }
</script>

<style scoped>

</style>