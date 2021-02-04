<template>
    <v-layout column wrap>
        <v-card min-height="600">
            <v-card-title>
                <h1>Банки</h1>
                <v-spacer/>
                <v-btn icon small @click="redirect('bank')">
                    <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <v-layout row wrap justify-center>
                    <v-flex xs12 sm12 md8>
                        <v-flex xs12 sm12 md12>
                            <img :src="currentItem.logoUrl" :alt="currentItem.name" height="50px">
                            <v-file-picker
                                    :disabled="loader"
                                    v-model="newImage"
                                    accept="image/*"
                                    label="Логотип"/>
                        </v-flex>
                        <v-layout>
                            <v-flex xs12 sm12 md6>
                                <v-text-field
                                        :disabled="loader"
                                        v-model="currentItem.bankCode"
                                        label="Код банка"/>
                            </v-flex>
                            <v-flex xs12 sm12 md6>
                                <v-text-field
                                        :disabled="loader"
                                        v-model="currentItem.shortName"
                                        label="Короткое имя"/>
                            </v-flex>
                        </v-layout>
                        <v-flex xs12 sm12 md12>
                            <v-text-field
                                    :disabled="loader"
                                    v-model="currentItem.name"
                                    label="Название"/>
                        </v-flex>
                        <v-flex xs12>
                            <money-format
                                    v-model="currentItem.maxAmount"
                                    label="Максимальная сумма"/>
                        </v-flex>
                        <v-layout>
                            <v-flex xs12 sm12 md6>
                                <v-text-field
                                        :disabled="loader"
                                        v-model="currentItem.ourFee"
                                        label="Наша комиссия"/>
                            </v-flex>
                            <v-flex xs12 sm12 md6>
                                <v-text-field
                                        :disabled="loader"
                                        v-model="currentItem.receiverFee"
                                        label="Комиссия принимающей стороны"/>
                            </v-flex>
                        </v-layout>
                        <v-layout row wrap>
                            <v-flex xs12 sm12 md6>
                                <v-text-field
                                        :disabled="loader"
                                        v-model="currentItem.uzCardFee"
                                        label="Комиссия UzCard"/>
                            </v-flex>
                            <v-spacer/>
                            <v-flex xs12 sm12 md6>
                                <v-text-field
                                        :disabled="loader"
                                        v-model="currentItem.humoFee"
                                        label="Комиссия HUMO"/>
                            </v-flex>
                        </v-layout>
                        <v-flex xs12>
                            <v-checkbox
                                    :disabled="loader"
                                    v-model="currentItem.receiveEnabled"
                                    label="Могут принимать"/>
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
    import MoneyFormat from "../money-format/MoneyFormat";

    export default {
        name: "BankForm",
        components: {MoneyFormat},
        data() {
            return {
                currentItem: {},
                isNew: true,
                newImage: ""
            }
        },
        methods: {
            save() {
                let self = this;
                self.loader = true;
                self.convertSumToCoinOnAdd(self.currentItem);
                console.log(self.currentItem);
                if(self.currentItem.id){
                    self.$http.put(self.$store.getters.apiUrl + "/bank", self.currentItem)
                        .then(() => {
                            self.loader = false;
                            self.redirect('bank');
                        }, self.handleError);
                }
                else{
                    self.$http.post(self.$store.getters.apiUrl + "/bank", self.currentItem)
                        .then(() => {
                            self.loader = false;
                            self.redirect('bank');
                        }, self.handleError);
                }
            },
            convertSumToCoinOnAdd(data) {
                this.currentItem.maxAmount = data.maxAmount * 100;
                this.currentItem.ourFee = data.ourFee / 100;
                this.currentItem.receiverFee = data.receiverFee / 100;
                this.currentItem.uzCardFee = data.uzCardFee / 100;
                this.currentItem.humoFee = data.humoFee / 100;
            },
            convertSumToCoinOnEdit(data) {
                this.currentItem.maxAmount = data.maxAmount / 100;
                this.currentItem.ourFee = data.ourFee / 100;
                this.currentItem.receiverFee = data.receiverFee / 100;
                this.currentItem.uzCardFee = data.uzCardFee / 100;
                this.currentItem.humoFee = data.humoFee / 100;
            }
        },
        mounted() {
            if (this.$route.params.bank) {
                this.currentItem = this.$route.params.bank;
                this.convertSumToCoinOnEdit(this.currentItem);
            }
        },
        watch: {
            newImage(image) {
                let self = this;
                if (image.length > 0) {
                    let reader = new FileReader();
                    reader.onload = e => {
                        self.$set(self.currentItem, 'logoUrl', e.target.result);
                    };

                    reader.readAsDataURL(image[0]);
                }
                self.$set(self.currentItem, 'logoUrl', '');
            }
        }
    }
</script>

<style scoped>

</style>