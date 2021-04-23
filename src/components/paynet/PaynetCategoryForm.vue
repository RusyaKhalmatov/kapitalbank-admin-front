<template>
    <v-layout column wrap>
        <v-card min-height="600">
            <v-card-title>
                <h1>Paynet Category</h1>
                <v-spacer></v-spacer>
                <v-btn icon small @click="redirect('PaynetCategory')">
                    <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <v-layout row wrap justify-center>
                    <v-flex xs12>
                        <img :src="formItems.logoUrl" height="50px">
                        <v-file-picker
                                :disabled="loader"
                                v-model="newImage"
                                accept="image/*"
                                label="Изображение">
                        </v-file-picker>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field
                                v-model="formItems.categoryId"
                                label="ID категории">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field
                                v-model="formItems.categoryNameEn"
                                label="Название на английском">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field
                                v-model="formItems.categoryNameRu"
                                label="Название на русском">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field
                                v-model="formItems.categoryNameUz"
                                label="Название на узбекском">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-select
                                label="Родительская категория"
                                :items="allCategories"
                                v-model="formItems.parentCategoryId">
                        </v-select>
                    </v-flex>
                    <v-flex xs12>
                        <v-checkbox
                                label="Для отображения Select Box"
                                v-model="formItems.subcategory">
                        </v-checkbox>
                        <v-checkbox
                                label="Добавить в мой дом"
                                v-model="formItems.showMyHome">
                        </v-checkbox>
                    </v-flex>
                    <v-flex xs12>
                        <v-btn dark color="primary" :loading="loader" @click="saveCategories">Сохранить</v-btn>
                    </v-flex>
                </v-layout>
            </v-card-text>
        </v-card>
    </v-layout>
</template>

<script>
    export default {
        name: "PaynetCategoryForm",
        data() {
            return {
                newImage: "",
                formItems: {},
                allCategories: [],
                isNew: true
            }
        },
        methods: {
            loadCategories() {
                let self = this;
                self.$http.get(self.$store.getters.newApiUrl + '/payment/categories').then(
                    response => {
                        self.allCategories = [{value: 0, text: ""}];
                        response.data.data.forEach(category => {
                            self.allCategories.push({
                                value: category.categoryId,
                                text: category.categoryNameRu
                            })
                        })
                    }, self.handleError
                )
            },
            saveCategories() {
                let self = this;
                if (self.isNew === true) {
                    self.$http.post(self.$store.getters.newApiUrl + '/payment/addNewCategory', self.formItems)
                        .then(() => {
                            self.loader = false;
                            self.redirect("PaynetCategory");
                        }, self.handleError);
                } else {
                    self.$http.put(self.$store.getters.newApiUrl + '/payment/updateCategory', self.formItems)
                        .then(() => {
                            self.loader = false;
                            self.redirect("PaynetCategory");
                        }, self.handleError);
                }
            }
        },
        mounted() {
            this.loadCategories();
            if (this.$route.params.category) {
                this.formItems = this.$route.params.category;
                this.isNew = false;
            }
        },
        watch: {
            newImage(image) {
                let self = this;
                if (image.length > 0) {
                    let reader = new FileReader();
                    reader.onload = e => {
                        self.$set(self.formItems, 'logoUrl', e.target.result);
                    };

                    reader.readAsDataURL(image[0]);
                }
                self.$set(self.formItems, 'logoUrl', '');
            }
        }
    }
</script>

<style scoped>

</style>