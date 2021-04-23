<template>
    <v-layout column wrap>
        <v-card min-height="600">
            <v-card-title>
                <h1>Service Category</h1>
                <v-spacer></v-spacer>
                <v-btn small icon @click="redirect('PaynetServices')">
                    <v-icon small>mdi-format-list-bulleted</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <v-container fluid>
                    <v-data-iterator
                            :items="categories"
                            content-tag="v-layout"
                            row wrap
                            v-if="categories.length>0 && services.length>0 && !loader"
                            :pagination.sync="pagination">
                        <template slot="item" slot-scope="props">
                            <v-flex xs12 sm12 md4 lg3 xl3 class="my-2 px-2">
                                <v-card @drop="drop(props.item, $event)"
                                        @dragover="dragover(props.item, $event)"
                                        @dragleave="dragleave(props.item,$event)"
                                        :class="{'highlight': props.item.highlight}">
                                    <v-card-title class="py-0 cursor-pointer"
                                                  @click="props.item.fullList = !props.item.fullList">
                                        <h4>{{props.item.categoryNameRu}}</h4>
                                        <v-spacer></v-spacer>
                                        <v-btn small icon flat>
                                            <v-icon small v-if="props.item.fullList">mdi-chevron-up</v-icon>
                                            <v-icon small v-if="!props.item.fullList">mdi-chevron-down</v-icon>
                                        </v-btn>
                                    </v-card-title>
                                    <v-card-text :class="{'not-full-list': !props.item.fullList}">
                                        <v-divider></v-divider>
                                        <h5>({{props.item.categoryNameEn}}, {{props.item.categoryNameUz}})</h5>
                                        <table class="mt-2">
                                            <tbody>
                                            <tr v-for="(service, index) in getServiceByCategoryId(props.item.categoryId)"
                                                :key="index"
                                                class="cursor-pointer" draggable="true"
                                                @dragstart="dragstart(service,$event)"
                                            >
                                                <td style="padding: 5px"><img v-bind:src="service.logoUrl" height="16px"></td>
                                                <td style="padding: 5px; text-align: left">{{service.serviceName}}</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </v-card-text>
                                </v-card>
                            </v-flex>
                        </template>
                    </v-data-iterator>
                </v-container>
            </v-card-text>
        </v-card>
    </v-layout>
</template>

<script>
    export default {
        name: "ServiceCategory",
        data() {
            return {
                categories: [],
                services: [],
                selectedService: {},
                serviceCategoriesItems: [],
                pagination: {
                    rowsPerPage: -1
                }
            }
        },
        methods: {
            getAllCategories() {
                let self = this;
                self.$http.get(self.$store.getters.apiUrl + '/payment/categories')
                    .then(response => {
                        self.categoryId = [];
                        response.data.data.forEach(category => {
                            category.highlight = false;
                            category.fullList = false;
                            self.categories.push(category);
                        });
                    }, self.handleError);
            },
            getAllServices() {
                let self = this;
                self.$http.get(self.$store.getters.apiUrl + '/payment-services')
                    .then(response => {
                        self.services = response.data.data.sort((serv1, serv2) => (serv1.serviceOrder > serv2.serviceOrder) ? 1 : -1);
                    })
            },
            getServiceByCategoryId(categoryId) {
                let self = this,
                    result = [];
                self.services.forEach(service => {
                    if (service.categoryId === categoryId) {
                        result.push(service);
                    }
                }, self.handleError);
                return result;
            },
            dragstart(service) {
                this.selectedService = service;
            },
            drop(category) {
                let self = this;
                category.highlight = false;
                self.changeCategoryId(self.selectedService, category);
            },
            changeCategoryId(service, category) {
                let self = this;
                service.categoryId = category.categoryId;
                self.$http.post(self.$store.getters.newApiUrl + "/payment-service", service)
                    .then(() => {
                        self.loader = false;
                    }, self.handleError);
            },
            dragover(category, evt) {
                evt.preventDefault();
                category.highlight = true;
            },

            dragleave(category, evt) {
                evt.preventDefault();
                category.highlight = false;
            },
        },
        mounted() {
            this.getAllCategories();
            this.getAllServices();
        }
    }
</script>

<style scoped>
    .not-full-list {
        max-height: 150px;
        overflow: hidden;
        padding-bottom: 15px;
    }

    .cursor-pointer {
        cursor: pointer;
    }

    .crossed-text {
        text-decoration: line-through;
    }
</style>
