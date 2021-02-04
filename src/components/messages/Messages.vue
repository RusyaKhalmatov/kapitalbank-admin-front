<template>
    <v-flex xs12>
        <v-card min-height="600">
            <v-card-title>
                <h1>Messages</h1>
                <v-spacer></v-spacer>
                <v-btn icon small @click="redirect('messagesForm')">
                    <v-icon small>mdi-plus</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <v-layout row wrap>
                    <v-text-field
                            v-model="search"
                            label="Поиск">
                    </v-text-field>
                    <v-flex xs12>
                        <v-data-table
                                :headers="messageHeaders"
                                :items="messageData"
                                :loading="loader"
                                :search="search"
                                :pagination.sync="pagination"
                                :item-key="messageData.key">

                            <template slot="items" slot-scope="props">
                                <tr>
                                    <td>{{props.item.key}}</td>
                                    <td>{{props.item.lang}}</td>
                                    <td>{{props.item.message}}</td>
                                    <td>
                                        <v-btn icon small :to="{name: 'messagesForm', params: {messages: props.item}}">
                                            <v-icon small>mdi-pencil</v-icon>
                                        </v-btn>
                                        <v-btn icon small @click="deleteMessage(props.item.id)">
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
        name: "Messages",
        data() {
            return {
                messageHeaders: [
                    {text: "Key", value: "key"},
                    {text: "Lang", value: "lang"},
                    {text: "Message", value: "message"},
                    {text: "Действия", sortable: false}
                ],
                messageData: [],
                pagination: {},
                search: ''
            }
        },
        methods: {
            getMessagesList() {
                let self = this;
                self.$http.get(self.$store.getters.apiUrl + '/messages')
                    .then(response => {
                        self.loader = false;
                        self.messageData = response.data.data;
                    }, self.handleError);
            },
            deleteMessage(key) {
                let self = this;
                self.$http.delete(self.$store.getters.apiUrl + `/messages/${key}`)
                    .then(() => {
                        // location.reload();
                        self.getMessagesList();
                    }, self.handleError);
            }
        },
        mounted() {
            this.getMessagesList();
        }
    }
</script>

<style scoped>

</style>