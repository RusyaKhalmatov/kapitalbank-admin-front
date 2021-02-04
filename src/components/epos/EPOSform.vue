<template>
    <v-flex xs12>
        <v-card min-height="600">
            <v-card-title>
                <h1>EPOS</h1>
                <v-spacer/>
                <v-btn icon small @click="redirect('epos')">
                    <v-icon small>mdi-arrow-left</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <v-layout row wrap justify-center>
                    <v-flex xs12 sm12 md8>
                        <v-text-field
                                v-model="eposData.merchant"
                                label="Merchant">
                        </v-text-field>
                        <v-text-field
                                v-model="eposData.terminal"
                                label="Terminal">
                        </v-text-field>
                        <v-text-field
                                v-model="eposData.eposType"
                                label="Epos Type">
                        </v-text-field>
                        <v-select
                                :items="accountType"
                                v-model="eposData.accountType"
                                label="Account Type">
                        </v-select>
                        <v-text-field
                                v-model="eposData.port"
                                label="Port">
                        </v-text-field>
                        <v-btn dark color="primary" @click="save">
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
        name: "EPOSform",
        data() {
            return {
                eposData: {},
                accountType: []
            }
        },
        methods: {
            getAccountType() {
                let self = this;
                self.$http.get(self.$store.getters.apiUrl + '/epos/accountType')
                    .then(response => {
                        self.accountType = response.data.data;
                    }, self.handleError);
            },
            save() {
                // console.log(this.eposData)
                let self = this;
                if(this.eposData.id){
                    self.$http.put(self.$store.getters.newApiUrl + '/epos', this.eposData)
                    .then(() => {
                        self.redirect('epos');
                    }, self.handleError);
                }
                else{
                    self.$http.post(self.$store.getters.newApiUrl + '/epos', this.eposData)
                        .then(() => {
                            self.redirect('epos');
                        }, self.handleError);
                }

            }
        },
        mounted() {
            this.getAccountType();
            if (this.$route.params.epos) {
                this.eposData = this.$route.params.epos;
            }
        }
    }
</script>

<style scoped>

</style>