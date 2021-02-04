<template>
    <v-layout column wrap>
        <v-card min-height="600">
            <v-card-title>
                <h1>ATM</h1>
                <v-spacer/>
                <v-btn icon small @click="redirect('atm')">
                    <v-icon small>mdi-arrow-left</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <v-layout row wrap justify-center>
                    <v-flex xs12 sm12 md8>
                        <v-flex xs12>
                            <img :src="atmLists.imageUrl" height="50px">
                            <v-file-picker
                                    :disabled="loader"
                                    v-model="newImage"
                                    accept="image/*"
                                    label="Логотип"/>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field
                                    v-model="atmLists.name"
                                    label="Ф.И.О."/>
                        </v-flex>
                        <v-flex xs12>
                            <v-select
                                    v-model="atmLists.cityId"
                                    :items="city"
                                    item-text="name"
                                    item-value="id"
                                    label="Город">
                            </v-select>
                        </v-flex>
                        <v-layout row wrap>
                            <v-flex xs10>
                                <v-text-field
                                        v-model="atmLists.address"
                                        label="Адрес"/>
                            </v-flex>
                            <v-flex xs2>
                                <v-text-field
                                        v-model="atmLists.lang"
                                        label="Язык"/>
                            </v-flex>
                        </v-layout>
                        <v-layout row wrap>
                            <v-flex xs6>
                                <v-text-field
                                        v-model="atmLists.openTime"
                                        label="Время открытия"/>
                            </v-flex>
                            <v-flex xs6>
                                <v-text-field
                                        v-model="atmLists.closeTime"
                                        label="Время закрытия"/>
                            </v-flex>
                        </v-layout>
                        <v-layout row wrap>
                            <v-flex xs6>
                                <v-text-field
                                        v-model="atmLists.latitude"
                                        label="Широта"/>
                            </v-flex>
                            <v-flex xs6>
                                <v-text-field
                                        v-model="atmLists.longitude"
                                        label="Долгота"/>
                            </v-flex>
                        </v-layout>
                        <v-flex xs12>
                            <v-text-field
                                    v-model="atmLists.phone"
                                    label="Телефон"/>
                        </v-flex>
                        <v-flex xs12>
                            <v-select :items="type" v-model="atmLists.type" label="Тип"/>
                        </v-flex>
                        <v-flex xs12>
                            <v-checkbox
                                    v-model="atmLists.tfHours"
                                    label="24 часа"/>
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
        name: "atmForm",
        data() {
            return {
                atmLists: {},
                newImage: "",
                isNew: true,
                type: [
                    {text: "ATM", value: "ATM"},
                    {text: "Mini Bank", value: "MINIBANK"},
                    {text: "Exchange Office", value: "EXCHANGEOFFICE"}
                ],
                city: []
            }
        },
        methods: {
            save() {
                let self = this;
                if (self.isNew === true) {
                    self.$http.post(self.$store.getters.apiUrl + '/atm', self.atmLists)
                        .then(() => {
                            self.loader = false;
                            self.redirect('atm');
                        }, self.handleError);
                } else {
                    self.$http.put(self.$store.getters.apiUrl + '/atm', self.atmLists)
                        .then(() => {
                            self.loader = false;
                            self.redirect('atm');
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
            if (this.$route.params.atm) {
                this.atmLists = this.$route.params.atm;
                this.isNew = false;
            }
        },
        watch: {
            newImage(image) {
                let self = this;
                if (image.length > 0) {
                    let reader = new FileReader();
                    reader.onload = e => {
                        self.$set(self.atmLists, 'imageUrl', e.target.result);
                    };

                    reader.readAsDataURL(image[0]);
                }
                self.$set(self.atmLists, 'imageUrl', '');
            }
        }
    }
</script>

<style scoped>

</style>