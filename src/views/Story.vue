<template>
    <v-flex xs12>
        <v-card min-height="600">
            <v-card-title>
                <h1>Stories</h1>
                <v-spacer/>
                <v-btn icon small @click="redirect('storyForm')">
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
                                :headers="storyHeader"
                                :items="storyData"
                                :loading="loader"
                                :search="search"
                                :pagination.sync="pagination"
                                :item-key="storyData.id">
                            <template slot="items" slot-scope="props">
                                <tr>
                                    <td>{{props.item.id}}</td>
                                    <td>{{props.item.title}}</td>
                                    <td>{{props.item.description}}</td>
                                    <td>
                                        <v-btn small icon color="primary" :href="props.item.iconUrl"
                                               v-if="props.item.iconUrl">
                                            <v-icon>
                                                mdi-file-image
                                            </v-icon>
                                        </v-btn>
                                    </td>
                                    <td>
                                        <v-btn icon small
                                               :to="{name: 'storyForm', params: {story: props.item}}">
                                            <v-icon small>mdi-pencil</v-icon>
                                        </v-btn>
                                        <v-btn icon small @click="deleteStory(props.item.id)">
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
        name: "Story",
        data() {
            return {
                storyHeader: [
                    {text: 'ID', value: 'id'},
                    {text: 'Title', value: 'title'},
                    {text: 'Description', value: 'description'},
                    {text: 'Icon URL', value: 'iconUrl'},
                    {text: 'Действие', sortable: false},
                ],
                storyData: [],
                pagination: {},
                search: '',
            }
        },
        methods: {
            getAllStoryList() {
                let self = this;
                self.$http.get(self.$store.getters.apiUrl + '/story/list')
                    .then(response => {
                        self.loader = false;
                        self.storyData = response.data.data;
                    }, self.handleError);
            },
            deleteStory(id) {
                let self = this;
                self.$http.delete(self.$store.getters.apiUrl + `/story/delete/${id}`)
                    .then(() => {
                        location.reload();
                    }, self.handleError);
            }
        },
        mounted() {
            this.getAllStoryList();
        }
    }
</script>

<style scoped>

</style>