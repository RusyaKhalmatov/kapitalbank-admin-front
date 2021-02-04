<template>
    <div class="main">
        <v-data-table
            v-if="children.length!=0"
            :items="children"                                                      
            hide-actions
            hide-headers            
            >
            <template slot="items" slot-scope="props">
                <tr :class="[{'chilren': props.expanded&&props.item.children.length}, 'table-tr']"  @click="props.expanded = !props.expanded">
                    <td  v-if="props.item.children.length"><v-btn small icon><v-icon>keyboard_arrow_down</v-icon></v-btn></td>  
                    <td  v-else></td>         
                    <td>{{ props.item.id }}</td>
                    <td v-if="props.item.logoUrl"><img class="logo" :src="props.item.logoUrl" alt="logoUrl"></td>
                    <td v-else></td>
                    <td v-if="props.item.recommendedLogoUrl"><img class="logo" :src="props.item.recommendedLogoUrl" alt="recommendedLogoUrl"></td>
                    <td v-else></td>
                    <td v-if="props.item.recommendedImageUrl"><img class="logo" :src="props.item.recommendedImageUrl" alt="recommendedLogoUrl"></td>
                    <td v-else></td>
                    <td>{{ props.item.categoryNameRu}}</td>
                    <td>{{ props.item.categoryNameEn}}</td>
                    <td>{{ props.item.categoryNameUz }}</td>
                    <td>{{ props.item.disabled | checkStatus}}</td>         
                    <td>{{ props.item.updatedAt | timestamp-to-date}}</td>   
                    <td>
                        <v-btn  @click="openEditBox(props.item)" icon small>
                            <v-icon small>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon small @click="openRemoveBox(props.item)">
                            <v-icon small>mdi-delete</v-icon>
                        </v-btn>   
                    </td>   
                </tr>
            </template>
            <template slot="expand" slot-scope="props">
                <v-card flat>
                    <category-children @getList="callList" :children="props.item.children"></category-children>                 
                </v-card>
            </template>
        </v-data-table>
        <v-dialog v-model="editDialog" persistent max-width="650px">
            <v-card>
                <v-card-title><h2>Изменение</h2></v-card-title>  
                <v-card-text>
                    <!-- <p>ID: {{data.id}}</p> -->
                    <v-text-field label="ID родителя" v-model="data.parentCategoryId"></v-text-field>

                    <v-text-field label="Название категории (Ru)" v-model="data.categoryNameRu"></v-text-field>
                    <!-- <v-flex xs12 class="quill-container pb-3">
                        <p class="tariff-text">Описание (Ru)</p>
                        <quill-editor v-model="data.shortDescriptionRu"/>
                    </v-flex> -->
                    <v-textarea label="Описание (Ru)" v-model="data.shortDescriptionRu" ></v-textarea>
                    <v-divider class="divider"></v-divider>
                    <v-text-field label="Название категории (Uz)" v-model="data.categoryNameUz"></v-text-field>
                    <v-textarea label="Описание (Uz)" v-model="data.shortDescriptionUz" ></v-textarea>
                    <v-divider class="divider"></v-divider>
                    <v-text-field label="Название категории (En)" v-model="data.categoryNameEn"></v-text-field>
                    <v-textarea label="Описание (En)" v-model="data.shortDescriptionEn" ></v-textarea>
                    <v-divider class="divider"></v-divider>

                    <p class="logo-text">Логотип:</p>
                    <div class="file-box">
                        <span class="logo-box">
                            <img class="logo-preview" :src="logoPreview" v-if="logoPreview"/>
                        </span>
                        <input class="input-file" accept="image/*" type="file" @change="onLogoChange($event)" ref="fileupload">
                    </div>
                    <p class="logo-text">Рекомендуемый логотип:</p>
                    <div class="file-box">
                        <span class="logo-box">
                            <img class="logo-preview" :src="logoRecommendedPreview" v-if="logoRecommendedPreview"/>
                        </span>
                        <input class="input-file" accept="image/*" type="file" @change="onRecommendedLogoChange($event)" ref="filerecomupload">
                    </div>
                    <p class="logo-text">Рекомендуемое изображение:</p>
                    <div class="file-box">
                        <span class="logo-box">
                            <img class="logo-preview" :src="logoRecommendedImagePreview" v-if="logoRecommendedImagePreview"/>
                        </span>
                        <input class="input-file" accept="image/*" type="file" @change="onRecommendedImageChange($event)" ref="filerecomimageupload">
                    </div>
                    <v-checkbox class="status" label="Активный" v-model="data.disabled"></v-checkbox>
                    <div>
                        <p class="my-2">Время создания: {{data.createdAt | timestamp-to-date}}</p>
                        <p>Время изменения: {{data.updatedAt | timestamp-to-date}}</p>
                    </div>
                </v-card-text>
            
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text :loading="loader" @click="edit">Сохранить</v-btn>
                <v-btn text @click="editDialog = false">Отмена</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="deleteDialog" persistent max-width="290">
            <v-card>
                <v-card-title class="headline">Вы действительно хотите удалить?</v-card-title>
                <v-card-actions style="text-align: center">
                <v-spacer></v-spacer>
                <v-btn :loading="loader"  text @click="deleteCategory">Да</v-btn>
                <v-btn  text @click="deleteDialog = false">Нет</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import CategoryChildren from './CategoryList'
export default {
    name: 'CategoryChildren',
    components:{
        CategoryChildren
    },
    props:{
        children: Array, page: Number
    },
    filters:{
        checkStatus(val){
            if(!val){
                return 'Активный'
            }
            else{
                return 'Неактивный'
            }
        }
    },
    data(){
        return{
            headers: [
                {text: "", value: "", sortable: false},
                {text: "ID", value: "id", sortable: false},
                {text: "Лого", value: "logoUrl", sortable: false},
                {text: "Рекомендуемый логотип", value: "recommendedLogoUrl", sortable: false},
                {text: "Рекомендуемое изображение", value: "recommendedImageUrl", sortable: false},
                {text: "Название категории (Ru)", value: "categoryNameRu", sortable: false},
                {text: "Название категории (Uz)", value: "categoryNameUz", sortable: false},
                {text: "Название категории (En)", value: "categoryNameEn", sortable: false},
                {text: "Статус", value: "disabled", sortable: false},
                {text: "Время обновления", value: "updatedAt", sortable: false},
                {text: "Действия", sortable: false}
            ],
            editDialog: false,
            deleteDialog: false,
            logoPreview: '',
            logoRecommendedPreview: '',
            isRecommendedChange: false,
            logoRecommendedImagePreview: '',
            isRecommendedImageChange: false,
            isChange: false,
            id: '',
            searchType: 'ALL',
            categoryName: '',
            data: {
                disabled: false,        
            },
            loader: false,
        }
    },
    watch:{
        editDialog(val){
            if(!val){
                this.data = {
                    disabled: false,
                    logo: '',
                    recommendedLogo: '',
                    recommendedImage: ''
                };
                if(this.isRecommendedChange){
                    this.$refs.filerecomupload.value = null;
                }
                if(this.isRecommendedImageChange){
                    this.$refs.filerecomimageupload.value = null;
                }                
                if(this.isChange){
                    this.$refs.fileupload.value = null;
                }
                    this.logoRecommendedPreview = '';
                    this.logoRecommendedImagePreview = '';

                    this.logoPreview = '';


                this.isChange = false;
                this.isRecommendedChange = false;  
                this.isRecommendedImageChange = false;                

            }
        },
    },
    methods:{
        deleteCategory(){
            this.$http.delete(this.$store.getters.apiUrl+`/loyalty/category/delete/${this.id}`)
            .then(response=>{
                // console.log(response.data.data);
                this.deleteDialog = false;
                this.getList(this.page);
            }, this.handleError)
        },
        onRecommendedImageChange(e){
            this.data.recommendedImage = e.target.files[0];
            if(this.data.recommendedImage){
                this.logoRecommendedImagePreview = URL.createObjectURL(e.target.files[0]);       
                this.isRecommendedImageChange = true;
            }
            else{
                this.logoRecommendedImagePreview = '';
            }
        },
        onRecommendedLogoChange(e){
            this.data.recommendedLogo = e.target.files[0];
            if(this.data.recommendedLogo){
                this.logoRecommendedPreview = URL.createObjectURL(e.target.files[0]);       
                this.isRecommendedChange = true;
            }
            else{
                this.logoRecommendedPreview = '';
            }
        },
        onLogoChange(e){
            this.data.logo = e.target.files[0];
            // console.log(this.data.logo)
            if(this.data.logo){
                this.logoPreview = URL.createObjectURL(e.target.files[0]);    
                this.isChange = true;            
            }
            else{
                this.logoPreview = '';
            }
        },
        openRemoveBox(item){
            this.id = item.id;
            this.deleteDialog = true;
        },
        edit(){
            let data = new FormData();
            data.append('id', this.data.id);
            data.append('categoryNameUz', this.data.categoryNameUz);
            data.append('categoryNameRu', this.data.categoryNameRu);
            data.append('categoryNameEn', this.data.categoryNameEn);
            data.append('parentCategoryId', this.data.parentCategoryId);

            data.append('disabled', !this.data.disabled);
            data.append('shortDescriptionUz', this.data.shortDescriptionUz);
            data.append('shortDescriptionRu', this.data.shortDescriptionRu);
            data.append('shortDescriptionEn', this.data.shortDescriptionEn);
            if(this.isChange)
                data.append('logo', this.data.logo);
            if(this.isRecommendedChange)
                data.append('recommendedLogo', this.data.recommendedLogo);
            if(this.isRecommendedImageChange)
                data.append('recommendedImage', this.data.recommendedImage);
            this.loader = true;
            this.$http.post(this.$store.getters.apiUrl+`/loyalty/category/add-update`, data, {headers: {'Content-Type': 'multipart/form-data'}})
            .then(response=>{
                this.loader = false;
                // console.log(response.data.data);
                this.editDialog = false;
                this.$emit('getList')
            }, this.handleError)
        },
        callList(){
            this.$emit('getList')
        },
        deleteCategory(){
            this.$http.delete(this.$store.getters.apiUrl+`/loyalty/category/delete/${this.id}`)
            .then(response=>{
                // console.log(response.data.data);
                this.deleteDialog = false;
                this.$emit('getList')
            }, this.handleError)
        },
        openEditBox(item){
            this.data.id = item.id;
            this.data.parentCategoryId = item.parentId;
            this.data.categoryNameUz = item.categoryNameUz
            this.data.categoryNameRu = item.categoryNameRu;
            this.data.categoryNameEn = item.categoryNameEn
            this.data.createdAt = item.createdAt;
            this.data.disabled = !item.disabled;
            this.data.logoUrl = item.logoUrl;
            this.data.recommendedLogoUrl = item.recommendedLogoUrl;
            this.data.recommendedImageUrl = item.recommendedImageUrl;
            this.data.shortDescriptionEn = item.shortDescriptionEn;
            this.data.shortDescriptionRu = item.shortDescriptionRu;
            this.data.shortDescriptionUz = item.shortDescriptionUz;
            this.logoPreview = item.logoUrl;
            this.logoRecommendedPreview = item.recommendedLogoUrl;
            this.data.updatedAt = item.updatedAt;            
            this.editDialog = true;            
        },
    }
}
</script>
<style scoped>
.chilren{
    background: #faca00 !important;
}
.table-tr{
    display: flex;
    justify-content: space-between;
    align-items: baseline;
}
.main{
    width: 100%;
}
.headline{
    text-align: center;
}
.center{
    margin: 10px;
    display: flex;
    justify-content: center;
}
.logo{
    max-width: 50px;
    max-height: 50px;
    margin: 5px;
}
.logo-text{
    margin: 0;
}
.logo-preview{
    max-width: 100px;
    max-height: 100px;
    margin: 5px 10px;
}
.logo-box{
    width: 200px;
}
.file-box{
    display: flex;
    align-items: center;
}
.divider{
    margin: 15px 0;
}
.status{
    margin-top: 30px !important;
}
.search-box{
    display: flex;
}
.search-input{
    height: 48px;
}
.search-btn{
    height: 48px;
    margin: 0 5px;
}
</style>