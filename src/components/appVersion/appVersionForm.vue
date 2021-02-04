<template>
    <v-flex xs12>
        <v-card min-height="600">
            <v-card-title>
                <h1>Версия приложения</h1>
                <v-spacer></v-spacer>
                <v-btn icon small @click="redirect('appVersion')">
                    <v-icon small>mdi-arrow-left</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <v-layout row wrap justify-center>
                    <v-flex xs12 md8>
                        <v-flex xs12>
                            <v-select
                                    :items="platforms"
                                    v-model="versionData.platform"
                                    label="Платформа">
                            </v-select>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field
                                    v-model="versionData.version"
                                    label="Версия">
                            </v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-datetime-picker
                                    prepend-icon="mdi-clock"
                                    v-model="versionData.releaseDate"
                                    label="Дата выхода">
                            </v-datetime-picker>
                        </v-flex>
                        <v-text-field
                                v-model="versionData.details"
                                label="Подробности">
                        </v-text-field>
                        <v-checkbox
                                v-model="versionData.active"
                                label="Активный"/>
                        <v-btn dark color="primary" @click="save">Сохранять</v-btn>
                    </v-flex>
                </v-layout>
            </v-card-text>
        </v-card>
    </v-flex>
</template>

<script>
    export default {
        name: "appVersionForm",
        data() {
            return {
                versionData: {},
                platforms: [
                    {text: "Android", value: "ANDROID"},
                    {text: "IOS", value: "IOS"},
                    {text: "Web", value: "WEB"},
                ],
                dateTime: null,
                isNew: true
            }
        },
        methods: {
            save() {
                let self = this;
                console.log(self.versionData)
                if(self.versionData.id){
                    self.versionData.releaseDate = new Date(self.versionData.releaseDate).getTime();
                    self.$http.put(self.$store.getters.apiUrl + '/app-version', self.versionData)
                        .then(() => {
                            self.redirect('appVersion');
                        }, self.handleError);
                }
                else{
                    self.versionData.releaseDate = new Date(self.versionData.releaseDate).getTime();
                    self.$http.post(self.$store.getters.apiUrl + '/app-version', self.versionData)
                        .then(() => {
                            self.redirect('appVersion');
                        }, self.handleError);
                }

            }
        },
        mounted() {
            if (this.$route.params.version) {
                this.versionData = this.$route.params.version;
            }
        }
    }
</script>

<style scoped>

</style>