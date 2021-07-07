<template>
    <v-layout column wrap>
        <v-card min-height="600">
            <v-card-title>
                <h1>Пользователь</h1>
                <v-spacer></v-spacer>
                <v-btn icon small @click="redirect('clients')">
                    <v-icon small>mdi-arrow-left</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <v-layout row wrap justify-center>
                    <v-flex xs12 sm12 md8>
                        <v-flex xs12>
                            <v-text-field
                                    v-model="userItem.firstName"
                                    label="First Name">
                            </v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field
                                    v-model="userItem.lastName"
                                    label="Last Name">
                            </v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field
                                    v-model="userItem.login"
                                    label="Login">
                            </v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field
                                    v-model="userItem.email"
                                    label="Email">
                            </v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field
                                    v-model="userItem.password"
                                    label="Пароль">
                            </v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-select
                                    v-model="userItem.userRole"
                                    :items="types"
                                    label="Тип пользователя"/>
                        </v-flex>
                        <v-flex xs12>
                            <v-btn dark color="primary" :loading="loader" @click="save">Сохранить</v-btn>
                        </v-flex>
                    </v-flex>
                </v-layout>
            </v-card-text>
        </v-card>
    </v-layout>
</template>

<script>
    export default {
        name: "UserForm",
        data() {
            return {
                userItem: {},
                types: [
                    {text: "Admin", value: "ADMIN"},
                    {text: "Manager", value: "MANAGER"},
                    {text: "Head Of Call Center", value: "HEAD_CALL_CENTER"},
                    {text: "Call Center", value: "CALL_CENTER"},
                    {text: "Plastic call center", value: "PLASTIC_CALL_CENTER"},
                    {text: "Front office", value: "FRONT_OFFICE"}
                    

                ]
            }
        },
        methods: {
            save() {
                let self = this;
                self.$http.post(self.$store.getters.newApiUrl + '/register/new-user', self.userItem)
                    .then(() => {
                        self.loader = false;
                        self.redirect('clients');
                    }, self.handleError);
            },
            getRole(){
                let self = this;
                self.$http.get(self.$store.getters.newApiUrl + '/user/role', self.userItem)
                    .then((response) => {
                        self.types = response.data.data; 
                    }, self.handleError);
            }
        },
        mounted(){
            this.getRole();
        }
    }
</script>

<style scoped>

</style>
