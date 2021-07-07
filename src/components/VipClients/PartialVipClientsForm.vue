<template>
    <v-flex xs12>
        <v-card min-height="600">
            <v-card-title>
                <h1>Частичные VIP-пользователи</h1>
                <v-spacer></v-spacer>
                <v-btn icon small @click="redirect('clients')">
                    <v-icon small>mdi-arrow-left</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-layout row wrap>
                            <v-btn dark color="primary" @click="redirect('clients')">Пользователи</v-btn>
                            <v-text-field
                                    v-model="user.fullName"
                                    disabled
                                    label="Пользователь">
                            </v-text-field>
                        </v-layout>
                    </v-flex>
                    <v-flex xs12>
                        <v-select
                            label="Код операции"
                            :items="operationCode"
                            v-model="limitUser.operationCode"
                            >                                                    
                        </v-select>
                        <!-- <v-select
                            label="Код операции"
                            :items="operationCode"
                            v-model="limitUser.operationCode"
                            multiple>
                            <template v-slot:prepend-item>
                                <v-list-tile ripple @click="toggle">
                                    <v-list-tile-action>
                                        <v-icon :color="limitUser.operationCode.length > 0 ? 'primary' : ''">{{ icon }}</v-icon> 
                                    </v-list-tile-action>
                                    <v-list-tile-content>
                                        <v-list-tile-title>Выбрать все</v-list-tile-title>
                                    </v-list-tile-content>
                                </v-list-tile>
                                <v-divider class="mt-2"></v-divider>
                            </template>
                                
                        </v-select> -->
                        <v-select :items="['UZS', 'USD']" v-model="limitUser.currency" label="Валюта"></v-select>
                        <v-text-field v-model="limitUser.minAmount" label="Минимальная сумма"></v-text-field>
                        <v-text-field v-model="limitUser.maxAmount" label="Максимальная сумма"></v-text-field>
                        <v-checkbox v-model="limitUser.receiver" label="Лимит для получателя"></v-checkbox>
                        <v-text-field v-model="limitUser.details" label="Детали"></v-text-field>
                        <v-datetime-picker
                            prepend-icon="mdi-clock"
                            v-model="limitUser.validTill"
                            label="Срок действия"
                        />
                        
                    </v-flex>
                    <v-btn dark color="success" large @click="save()">Сохранить</v-btn>
                </v-layout>
            </v-card-text>
        </v-card>
    </v-flex>
</template>

<script>
    export default {
        name: "VipClientsForm",
        data() {
            return {
                user: {},
                limitUser: {userId: '', operationCode: [], currency: '', minAmount: '', maxAmount: '', receiver: false, details: '', validTill:''},
                operationCode: []
            }
        },
        computed:{
            likesAllFruit(){
                return this.limitUser.operationCode.length === this.operationCode.length
            },
            likesSomeFruit(){
                return this.limitUser.operationCode.length > 0 && !this.likesAllFruit
            },
            icon(){
                if(this.likesAllFruit) return 'mdi-close-box'
                if(this.likesSomeFruit) return 'mdi-minus-box'
                return 'mdi-checkbox-blank-outline'
            }
        },
        methods: {
            toggle(){
                this.$nextTick(() => {
                    if(this.likesAllFruit){
                        this.limitUser.operationCode = [];
                    }else{
                        this.limitUser.operationCode = this.operationCode;
                    }
                })
            },
            getOperationCode() {
                let self = this;
                self.$http.get(self.$store.getters.newApiUrl + '/operationCode')
                    .then(response => {
                        self.filterOperationCode(response.data.data);
                    }, self.handleError);
            },
            filterOperationCode(operationCodes) {
                let self = this;
                for (let i = 0; i < operationCodes.length; i++) {
                    self.operationCode.push(operationCodes[i].operationCode);
                }
            },
            save() {
                let self = this;
                // console.log(self.limitUser)
                self.limitUser.minAmount = self.limitUser.minAmount * 100;
                self.limitUser.maxAmount = self.limitUser.maxAmount * 100;
                self.limitUser.validTill = new Date(self.limitUser.validTill).getTime();
                self.$http.post(self.$store.getters.newApiUrl + '/limit/partialVip', self.limitUser)
                    .then(() => {
                        self.redirect('PartialVipClients');
                    }, self.handleError);
            }
        },
        mounted() {
            this.getOperationCode();
            if (this.$route.params.userLimit) {
                this.user = this.$route.params.userLimit;
                this.limitUser.userId = this.user.id;
            }
        }
    }
</script>

<style scoped>

</style>
