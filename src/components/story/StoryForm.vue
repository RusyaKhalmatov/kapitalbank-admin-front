<template>
    <v-flex xs12>
        <v-card min-height="600">
            <v-card-title>
                <v-spacer/>
                <v-btn icon small @click="redirect('story')">
                    <v-icon small>mdi-arrow-left</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <v-layout row wrap justify-center>
                    <v-flex xs12 sm12 md8>
                        <img :src="storyData.imageUrl" height="50px"/>
                        <v-file-picker
                                :disabled="loader"
                                v-model="newImage"
                                accept="image/*"
                                label="Логотип"/>
                        <v-text-field
                                v-model="storyData.title"
                                label="Title"/>
                        <v-text-field
                                v-model="storyData.description"
                                label="Description"/>
                        <v-layout>
                            <v-flex xs12 sm12 md9>
                                <v-text-field
                                        v-model="storyData.color"
                                        label="Color"/>
                            </v-flex>
                            <v-flex xs12 sm12 md3>
                                <v-text-field
                                        v-model="storyData.lang"
                                        label="Language"/>
                            </v-flex>
                        </v-layout>
                        <v-text-field
                                v-model="storyData.storyOrder"
                                label="Order"/>
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
        name: "StoryForm",
        data() {
            return {
                storyData: {
                    storyPages: []
                },
                newImage: "",
                isNew: true
            }
        },
        methods: {
            save() {
                let self = this;
                 console.log(self.storyData);
                if (self.isNew) {
                   
                    self.$http.post(self.$store.getters.apiUrl + '/story/add', self.storyData)
                        .then(() => {
                            self.redirect('story');
                        }, self.handleError);
                } else {
                    self.$http.put(self.$store.getters.apiUrl + '/story/edit', self.storyData)
                        .then(() => {
                            self.redirect('story');
                        }, self.handleError);
                }
            }
        },
        mounted() {
            if (this.$route.params.story) {
                this.storyData = this.$route.params.story;
                this.isNew = false;
            }
        },
        watch: {
            newImage(image) {
                let self = this;
                if (image.length > 0) {
                    let reader = new FileReader();
                    reader.onload = e => {
                        self.$set(self.storyData, 'imageUrl', e.target.result);
                    };

                    reader.readAsDataURL(image[0]);
                }
                self.$set(self.storyData, 'imageUrl', '');
            }
        }
    }
</script>

<style scoped>

</style>