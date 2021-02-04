<template>
    <v-flex xs12>
        <v-card min-height="600">
            <v-card-title>
                <h1>Messages Form</h1>
                <v-spacer></v-spacer>
                <v-btn icon small @click="redirect('messages')">
                    <v-icon small>mdi-arrow-left</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <v-layout row wrap justify-center>
                    <V-flex xs12 sm12 md8>
                        <v-text-field
                                v-model="data.key"
                                label="Key">
                        </v-text-field>
                        <v-text-field
                                v-model="data.lang"
                                label="Lang">
                        </v-text-field>
                        <v-text-field
                                v-model="data.message"
                                label="Message">
                        </v-text-field>
                        <v-btn dark color="primary" @click="save">
                            Сохранить
                        </v-btn>
                    </V-flex>
                </v-layout>
            </v-card-text>
        </v-card>
    </v-flex>
</template>

<script>
    export default {
        name: "MessagesForm",
        data() {
            return {
                data: {},
                isNew: true
            }
        },
        methods: {
            save() {
                let self = this;
                if (self.isNew) {
                    self.$http.post(self.$store.getters.apiUrl + '/messages', self.data)
                        .then(() => {
                            self.redirect('messages');
                        }, self.handleError);
                } else {
                    self.$http.put(self.$store.getters.apiUrl + '/messages', self.data)
                        .then(() => {
                            self.redirect('messages');
                        }, self.handleError);
                }
            }
        },
        mounted() {
            if (this.$route.params.messages) {
                this.data = this.$route.params.messages;
                this.isNew = false;
            }
        }
    }
</script>

<style scoped>

</style>