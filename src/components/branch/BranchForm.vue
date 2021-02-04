<template>
    <v-layout column wrap>
        <v-card min-height="600">
            <v-card-title>
                <h1>Филиал</h1>
                <v-spacer></v-spacer>
                <v-btn icon small @click="redirect('branch')">
                    <v-icon small>mdi-arrow-left</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <v-layout row wrap justify-center>
                    <v-flex xs12 sm12 md8>
                        <v-flex xs12>
                            <img :src="branchItems.imageUrl" height="50px">
                            <v-file-picker
                                    :disabled="loader"
                                    v-model="newImage"
                                    accept="image/*"
                                    label="Логотип"/>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field
                                    v-model="branchItems.mfo"
                                    label="МФО"/>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field
                                    v-model="branchItems.name"
                                    label="Ф.И.О."/>
                        </v-flex>
                        <v-flex xs12>
                            <v-select
                                    v-model="branchItems.cityId"
                                    :items="city"
                                    item-text="name"
                                    item-value="id"
                                    label="Город">
                            </v-select>
                        </v-flex>
                        <v-layout row wrap>
                            <v-flex xs10>
                                <v-text-field
                                        v-model="branchItems.address"
                                        label="Адрес"/>
                            </v-flex>
                            <v-flex xs2>
                                <v-text-field
                                        v-model="branchItems.lang"
                                        label="Язык"/>
                            </v-flex>
                        </v-layout>
                        <v-layout row wrap>
                            <v-flex xs6>
                                <v-text-field
                                        v-model="branchItems.openTime"
                                        label="Время открытия"/>
                            </v-flex>
                            <v-flex xs6>
                                <v-text-field
                                        v-model="branchItems.closeTime"
                                        label="Время закрытия"/>
                            </v-flex>
                        </v-layout>
                        <v-layout row wrap>
                            <v-flex xs6>
                                <v-text-field
                                        v-model="branchItems.latitude"
                                        label="Широта"/>
                            </v-flex>
                            <v-flex xs6>
                                <v-text-field
                                        v-model="branchItems.longitude"
                                        label="Долгота"/>
                            </v-flex>
                        </v-layout>
                        <v-flex xs12>
                            <v-text-field
                                    v-model="branchItems.phone"
                                    label="Телефон"/>
                        </v-flex>
                        <v-btn
                                dark color="primary" :loading="loader" @click="save">Сохранить
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-card-text>
        </v-card>
    </v-layout>
</template>

<script>
    export default {
        name: "BranchForm",
        data() {
            return {
                branchItems: {},
                city: [],
                newImage: "",
                isNew: true
            }
        },
        methods: {
            save() {
                let self = this;
                if (self.isNew === true) {
                    self.$http.post(self.$store.getters.apiUrl + '/branch', self.branchItems)
                        .then(() => {
                            self.loader = false;
                            self.redirect('branch');
                        }, self.handleError);
                } else {
                    self.$http.put(self.$store.getters.apiUrl + '/branch', self.branchItems)
                        .then(() => {
                            self.loader = false;
                            self.redirect('branch');
                        }, self.handleError);
                }
            },
            getCityList() {
                let self = this;
                self.$http.get(self.$store.getters.apiUrl + '/city')
                    .then(response => {
                        self.city = response.data.data;
                    }, self.handleError);
            }
        },
        mounted() {
            this.getCityList();
            if (this.$route.params.branch) {
                this.branchItems = this.$route.params.branch;
                this.isNew = false;
            }
        },
        watch: {
            newImage(image) {
                let self = this;
                if (image.length > 0) {
                    let reader = new FileReader();
                    reader.onload = e => {
                        self.$set(self.branchItems, 'imageUrl', e.target.result);
                    };

                    reader.readAsDataURL(image[0]);
                }
                self.$set(self.branchItems, 'imageUrl', '');
            }
        }
    }
</script>

<style scoped>

</style>