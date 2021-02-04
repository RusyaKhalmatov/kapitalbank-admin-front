<template>
    <v-flex xs12>
        <v-card min-height="600">
            <v-card-title>
                <h1>Виды Кредиты</h1>
                <v-spacer/>
                <v-btn icon small @click="redirect('depositType')">
                    <v-icon small>mdi-arrow-left</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <v-layout row wrap justify-center>
                    <v-flex xs12 sm12 md8>
                        <img :src="depositTypeRequest.loanImage" height="50px"/>
                        <v-file-picker
                                :disabled="loader"
                                v-model="newImage"
                                accept="image/*"
                                label="Логотип"/>
                        <v-text-field
                                v-model="depositTypeRequest.typeCode"
                                label="Код Типа"/>
                        <v-text-field
                                v-model="depositTypeRequest.nameUz"
                                label="Name Uz"/>
                        <v-text-field
                                v-model="depositTypeRequest.nameRu"
                                label="Name Ru"/>
                        <v-text-field
                                v-model="depositTypeRequest.nameEn"
                                label="Name En"/>
                        <v-btn color="primary" @click="save">
                            Сохранить
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-card-text>
        </v-card>
    </v-flex>
</template>

<script>
    export default {
        name: "DepositTypeForm",
        data() {
            return {
                depositTypeRequest: {},
                newImage: "",
                isNew: true
            }
        },
        methods: {
            save() {
                let self = this;
                if (self.isNew) {
                    self.$http.post(self.$store.getters.apiUrl + '/loan', self.depositTypeRequest)
                        .then(() => {
                            self.redirect('depositType');
                        }, self.handleError);
                } else {
                    self.$http.put(self.$store.getters.apiUrl + '/loan', self.depositTypeRequest)
                        .then(() => {
                            self.redirect('depositType');
                        }, self.handleError);
                }
            }
        },
        mounted() {
            if (this.$route.params.depositType) {
                this.depositTypeRequest = this.$route.params.depositType;
                this.isNew = false;
            }
        },
        watch: {
            newImage(image) {
                let self = this;
                if (image.length > 0) {
                    let reader = new FileReader();
                    reader.onload = e => {
                        self.$set(self.depositTypeRequest, 'loanImage', e.target.result);
                    };

                    reader.readAsDataURL(image[0]);
                }
                self.$set(self.depositTypeRequest, 'loanImage', '');
            }
        }
    }
</script>

<style scoped>

</style>