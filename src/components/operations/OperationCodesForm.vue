<template>
    <v-layout column wrap>
        <v-card min-height="600">
            <v-card-title>
                <h1>Код Операции</h1>
                <v-spacer/>
                <v-btn icon small @click="redirect('operationCodes')">
                    <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <v-layout row wrap justify-center>
                    <v-flex xs12 sm12 md8>
                        <v-flex xs12 sm12 md12>
                            <v-text-field
                                    :disabled="loader"
                                    v-model="currentItem.operationCode"
                                    label="Код операции"/>
                        </v-flex>
                        <v-flex xs12 sm12 md12>
                            <v-text-field
                                    :disabled="loader"
                                    v-model="currentItem.operationType"
                                    label="Тип операции"/>
                        </v-flex>
                        <v-layout>
                            <v-flex xs12 sm12 md6>
                                <v-text-field
                                        v-model="currentItem.senderType"
                                        label="Тип Отправителя"/>
                            </v-flex>
                            <v-flex xs12 sm12 md6>
                                <v-text-field
                                        :disabled="loader"
                                        v-model="currentItem.receiverType"
                                        label="Тип Получателя"/>
                            </v-flex>
                        </v-layout>
                        <v-layout>
                            <v-flex xs12>
                                <v-text-field
                                        v-model="currentItem.operationCodeComment"
                                        label="Коммент"/>
                            </v-flex>
                        </v-layout>
                        <v-flex xs12>
                            <v-checkbox
                                    :disabled="loader"
                                    v-model="currentItem.allowed"
                                    label="Разрешено"/>
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
        name: "OperationCodesForm",
        data() {
            return {
                currentItem: {},
                isNew: true,
            }
        },
        methods: {
            save() {
                let self = this;
                console.log(self.currentItem);
                if(self.currentItem.id){
                    self.$http.put(self.$store.getters.apiUrl + '/operation-code', self.currentItem)
                        .then(() => {
                            self.loader = false;
                            self.redirect('operationCodes');
                        }, self.handleError);
                }
                else{
                    self.$http.post(self.$store.getters.apiUrl + '/operation-code', self.currentItem)
                        .then(() => {
                            self.loader = false;
                            self.redirect('operationCodes');
                        }, self.handleError);
                }
            }
        },
        mounted() {
            if (this.$route.params.operations) {
                this.currentItem = this.$route.params.operations;
            }
        }
    }
</script>

<style scoped>

</style>