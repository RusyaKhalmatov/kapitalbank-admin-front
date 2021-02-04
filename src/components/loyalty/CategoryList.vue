<template>
    <div class="main">
        <h1 class="headline">Категории лояльности</h1>
        <v-btn @click="addDialog=true">Добавить</v-btn>
        <div class="search-box mt-3">
            <v-text-field class="search-input" solo @keyup.enter="search"  v-model="categoryName" label="Поиск"></v-text-field>
            <v-btn class="search-btn" @click="search">Найти</v-btn>
        </div>
        <v-data-table
            v-if="content.length!=0"
            :headers="headers"
            :items="content"                                                      
            hide-actions
            >
            <template slot="items" slot-scope="props">
                <tr :class="{'chilren': props.expanded&&props.item.children.length}" @click="props.expanded = !props.expanded">
                    <td style="min-width:92px" v-if="props.item.children.length"><v-btn small icon><v-icon>keyboard_arrow_down</v-icon></v-btn></td>  
                    <td style="min-width:92px" v-else></td>         
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
                    <category-children @getList="callList" :page="page" :children="props.item.children"></category-children>                 
                </v-card>
            </template>
            <template slot="no-data">
                <vue-content-loading :width="300" :height="98">
                    <rect x="0" y="3" rx="3" ry="10" width="8%" height="5" />
                    <rect x="30" y="3" rx="3" ry="10" width="10%" height="5" />
                    <rect x="67" y="3" rx="3" ry="10" width="5%" height="5" />
                    <rect x="90" y="3" rx="3" ry="10" width="13%" height="5" />
                    <rect x="135" y="3" rx="3" ry="10" width="12%" height="5" />
                    <rect x="180" y="3" rx="3" ry="10" width="8%" height="5" />
                    <rect x="215" y="3" rx="3" ry="10" width="7%" height="5" />
                    <rect x="245" y="3" rx="3" ry="10" width="7%" height="5" />
                    <rect x="275" y="3" rx="3" ry="10" width="7%" height="5" />

                    <rect x="0" y="12" rx="3" ry="10" width="8%" height="5" />
                    <rect x="30" y="12" rx="3" ry="10" width="10%" height="5" />
                    <rect x="67" y="12" rx="3" ry="10" width="5%" height="5" />
                    <rect x="90" y="12" rx="3" ry="10" width="13%" height="5" />
                    <rect x="135" y="12" rx="3" ry="10" width="12%" height="5" />
                    <rect x="180" y="12" rx="3" ry="10" width="8%" height="5" />
                    <rect x="215" y="12" rx="3" ry="10" width="7%" height="5" />
                    <rect x="245" y="12" rx="3" ry="10" width="7%" height="5" />
                    <rect x="275" y="12" rx="3" ry="10" width="7%" height="5" />
                    
                    <rect x="0" y="22" rx="3" ry="10" width="8%" height="5" />
                    <rect x="30" y="22" rx="3" ry="10" width="10%" height="5" />
                    <rect x="67" y="22" rx="3" ry="10" width="5%" height="5" />
                    <rect x="90" y="22" rx="3" ry="10" width="13%" height="5" />
                    <rect x="135" y="22" rx="3" ry="10" width="12%" height="5" />
                    <rect x="180" y="22" rx="3" ry="10" width="8%" height="5" />
                    <rect x="215" y="22" rx="3" ry="10" width="7%" height="5" />
                    <rect x="245" y="22" rx="3" ry="10" width="7%" height="5" />
                    <rect x="275" y="22" rx="3" ry="10" width="7%" height="5" />                   

                    <rect x="0" y="32" rx="3" ry="10" width="8%" height="5" />
                    <rect x="30" y="32" rx="3" ry="10" width="10%" height="5" />
                    <rect x="67" y="32" rx="3" ry="10" width="5%" height="5" />
                    <rect x="90" y="32" rx="3" ry="10" width="13%" height="5" />
                    <rect x="135" y="32" rx="3" ry="10" width="12%" height="5" />
                    <rect x="180" y="32" rx="3" ry="10" width="8%" height="5" />
                    <rect x="215" y="32" rx="3" ry="10" width="7%" height="5" />
                    <rect x="245" y="32" rx="3" ry="10" width="7%" height="5" />
                    <rect x="275" y="32" rx="3" ry="10" width="7%" height="5" />                   

                    <rect x="0" y="42" rx="3" ry="10" width="8%" height="5" />
                    <rect x="30" y="42" rx="3" ry="10" width="10%" height="5" />
                    <rect x="67" y="42" rx="3" ry="10" width="5%" height="5" />
                    <rect x="90" y="42" rx="3" ry="10" width="13%" height="5" />
                    <rect x="135" y="42" rx="3" ry="10" width="12%" height="5" />
                    <rect x="180" y="42" rx="3" ry="10" width="8%" height="5" />
                    <rect x="215" y="42" rx="3" ry="10" width="7%" height="5" />
                    <rect x="245" y="42" rx="3" ry="10" width="7%" height="5" />
                    <rect x="275" y="42" rx="3" ry="10" width="7%" height="5" /> 

                    <rect x="0" y="52" rx="3" ry="10" width="8%" height="5" />
                    <rect x="30" y="52" rx="3" ry="10" width="10%" height="5" />
                    <rect x="67" y="52" rx="3" ry="10" width="5%" height="5" />
                    <rect x="90" y="52" rx="3" ry="10" width="13%" height="5" />
                    <rect x="135" y="52" rx="3" ry="10" width="12%" height="5" />
                    <rect x="180" y="52" rx="3" ry="10" width="8%" height="5" />
                    <rect x="215" y="52" rx="3" ry="10" width="7%" height="5" />
                    <rect x="245" y="52" rx="3" ry="10" width="7%" height="5" />
                    <rect x="275" y="52" rx="3" ry="10" width="7%" height="5" /> 

                    <rect x="0" y="62" rx="3" ry="10" width="8%" height="5" />
                    <rect x="30" y="62" rx="3" ry="10" width="10%" height="5" />
                    <rect x="67" y="62" rx="3" ry="10" width="5%" height="5" />
                    <rect x="90" y="62" rx="3" ry="10" width="13%" height="5" />
                    <rect x="135" y="62" rx="3" ry="10" width="12%" height="5" />
                    <rect x="180" y="62" rx="3" ry="10" width="8%" height="5" />
                    <rect x="215" y="62" rx="3" ry="10" width="7%" height="5" />
                    <rect x="245" y="62" rx="3" ry="10" width="7%" height="5" />
                    <rect x="275" y="62" rx="3" ry="10" width="7%" height="5" /> 

                    <rect x="0" y="72" rx="3" ry="10" width="8%" height="5" />
                    <rect x="30" y="72" rx="3" ry="10" width="10%" height="5" />
                    <rect x="67" y="72" rx="3" ry="10" width="5%" height="5" />
                    <rect x="90" y="72" rx="3" ry="10" width="13%" height="5" />
                    <rect x="135" y="72" rx="3" ry="10" width="12%" height="5" />
                    <rect x="180" y="72" rx="3" ry="10" width="8%" height="5" />
                    <rect x="215" y="72" rx="3" ry="10" width="7%" height="5" />
                    <rect x="245" y="72" rx="3" ry="10" width="7%" height="5" />
                    <rect x="275" y="72" rx="3" ry="10" width="7%" height="5" /> 

                    <rect x="0" y="82" rx="3" ry="10" width="8%" height="5" />
                    <rect x="30" y="82" rx="3" ry="10" width="10%" height="5" />
                    <rect x="67" y="82" rx="3" ry="10" width="5%" height="5" />
                    <rect x="90" y="82" rx="3" ry="10" width="13%" height="5" />
                    <rect x="135" y="82" rx="3" ry="10" width="12%" height="5" />
                    <rect x="180" y="82" rx="3" ry="10" width="8%" height="5" />
                    <rect x="215" y="82" rx="3" ry="10" width="7%" height="5" />
                    <rect x="245" y="82" rx="3" ry="10" width="7%" height="5" />
                    <rect x="275" y="82" rx="3" ry="10" width="7%" height="5" /> 

                    <rect x="0" y="92" rx="3" ry="10" width="8%" height="5" />
                    <rect x="30" y="92" rx="3" ry="10" width="10%" height="5" />
                    <rect x="67" y="92" rx="3" ry="10" width="5%" height="5" />
                    <rect x="90" y="92" rx="3" ry="10" width="13%" height="5" />
                    <rect x="135" y="92" rx="3" ry="10" width="12%" height="5" />
                    <rect x="180" y="92" rx="3" ry="10" width="8%" height="5" />
                    <rect x="215" y="92" rx="3" ry="10" width="7%" height="5" />
                    <rect x="245" y="92" rx="3" ry="10" width="7%" height="5" />
                    <rect x="275" y="92" rx="3" ry="10" width="7%" height="5" />                     
                </vue-content-loading>                   
            </template>
        </v-data-table>
        <v-pagination
        v-if="totalPages"
        :disabled="loader"
        class="center"
        v-model="page"
        :length="totalPages"
        :total-visible="10"
        ></v-pagination>  
        <v-dialog v-model="addDialog" persistent max-width="650px">
            <v-card>
                <v-card-title><h2>Добавление</h2></v-card-title>  
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
                    <p class="mt-3 logo-text">Рекомендуемый логотип:</p>
                    <div class="file-box">
                        <span class="logo-box">
                            <img class="logo-preview" :src="logoRecommendedPreview" v-if="logoRecommendedPreview"/>
                        </span>
                        <input class="input-file" accept="image/*" type="file" @change="onRecommendedLogoChange($event)" ref="filerecomupload">
                    </div>
                    <p class="mt-3 logo-text">Рекомендуемое изображение:</p>
                    <div class="file-box">
                        <span class="logo-box">
                            <img class="logo-preview" :src="logoRecommendedImagePreview" v-if="logoRecommendedImagePreview"/>
                        </span>
                        <input class="input-file" accept="image/*" type="file" @change="onRecommendedImageChange($event)" ref="filerecomimageupload">
                    </div>
                    <v-checkbox class="status" label="Активный" v-model="data.disabled"></v-checkbox>                    
                </v-card-text>
            
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="add">Сохранить</v-btn>
                <v-btn text @click="addDialog = false">Отмена</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
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
                <v-btn text @click="edit">Сохранить</v-btn>
                <v-btn text @click="editDialog = false">Отмена</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="deleteDialog" persistent max-width="290">
            <v-card>
                <v-card-title class="headline">Вы действительно хотите удалить?</v-card-title>
                <v-card-actions style="text-align: center">
                <v-spacer></v-spacer>
                <v-btn  text @click="deleteCategory">Да</v-btn>
                <v-btn  text @click="deleteDialog = false">Нет</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import CategoryChildren from './CategoryChildren'
export default {
    name: 'CategoryList',
    components:{
        CategoryChildren
    },
    data(){
        return{
            content: [],
            totalPages: '',
            page: 1,
            pagination: {              
                rowsPerPage: 10
            },
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
            data: {
                disabled: false,
        
            },
            logoPreview: '',
            logoRecommendedPreview: '',
            isRecommendedChange: false,
            logoRecommendedImagePreview: '',
            isRecommendedImageChange: false,
            isChange: false,
            addDialog: false,
            deleteDialog: false,
            id: '',
            searchType: 'ALL',
            categoryName: '',

        }
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
    watch:{
        categoryName(val){
            if(val===''){
                console.log('watch')
                this.searchType = 'ALL'
                this.getList(1)
            }
        },
        page(val){
            this.getLit(val);
        },
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
        addDialog(val){
            if(!val){
                // console.log(this.$refs.filerecomupload.value)

                if(this.isRecommendedChange){
                    this.$refs.filerecomupload.value = null;
                }
                if(this.isRecommendedImageChange){
                    this.$refs.filerecomimageupload.value = null;
                }                
                if(this.isChange){
                    this.$refs.fileupload.value = null;
                }
                this.data = {
                    disabled: false,
                    logo: '',
                    recommendedLogo: '',
                    recommendedImage: ''

                };
                // if(this.isRecommendedChange){
                    // this.$refs.filerecomupload.value = null;
                this.logoPreview = '';
                this.logoRecommendedPreview = ''; 
                this.logoRecommendedImagePreview = '';

                // }
                // if(this.isChange){
                    // this.data.logo = '';
                    // console.log(this.$refs.fileupload.value)
                    // this.$refs.fileupload.value = null;

                // }
                this.isChange = false;
                this.isRecommendedChange = false;  
                this.isRecommendedImageChange = false;                

            }
            else{
                this.data.parentCategoryId = 0;
            }
        },
        deleteDialog(val){
            if(!val){
                this.id = '';
            }
        }
    },
    methods:{
        callList(){
            this.getList(this.page);
        },
        search(){
            if(this.page ===1){
                this.getList(1)
            }
            else{
                this.page = 1;
            }
        },
        openRemoveBox(item){
            this.id = item.id;
            this.deleteDialog = true;
        },
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
            console.log(this.data.logo)
            if(this.data.logo){
                this.logoPreview = URL.createObjectURL(e.target.files[0]);    
                this.isChange = true;            
            }
            else{
                this.logoPreview = '';
            }
        },
        add(){
            let data = new FormData();
            console.log(this.data)
            data.append('categoryNameUz', this.data.categoryNameUz);
            data.append('parentCategoryId', this.data.parentCategoryId);
            data.append('categoryNameRu', this.data.categoryNameRu);
            data.append('categoryNameEn', this.data.categoryNameEn);
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
                console.log(response.data.data);
                this.addDialog = false;
                this.getList(this.page);
            }, this.handleError)
        },
        edit(){
            let data = new FormData();
            data.append('id', this.data.id);
            data.append('categoryNameUz', this.data.categoryNameUz);
            data.append('parentCategoryId', this.data.parentCategoryId);
            data.append('categoryNameRu', this.data.categoryNameRu);
            data.append('categoryNameEn', this.data.categoryNameEn);
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
            this.$http.post(this.$store.getters.apiUrl+`/loyalty/category/add-update`, data, {headers: {'Content-Type': 'multipart/form-data'}})
            .then(response=>{
                console.log(response.data.data);
                this.editDialog = false;
                this.getList(this.page);
            }, this.handleError)
        },
        openEditBox(item){
            this.data.id = item.id;
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
            this.data.parentCategoryId = item.parentId;
            this.logoPreview = item.logoUrl;
            this.logoRecommendedPreview = item.recommendedLogoUrl;
            this.data.updatedAt = item.updatedAt;            
            this.editDialog = true;            
        },
        getList(page){
            console.log(this.categoryName)
            if(this.categoryName===''){
                this.searchType = 'ALL'

            }
            else{
                this.searchType = 'PAGED_SEARCH'
            }
            let params
            if(this.searchType==='ALL'){
                // delete params.categoryName; 
                params = {
                    search_type: this.searchType,                    
                }
            }
            else {
                params = {
                    search_type: this.searchType,
                    category_name: this.categoryName.trim()
                }
            }
            this.$http.get(this.$store.getters.apiUrl+`/loyalty/category/list?page=${page-1}&size=10`,{
                params: params
            })
            .then(response=>{
                console.log(response.data.data);
                this.content = response.data.data.content;
                this.totalPages = response.data.data.totalPages;
            }, this.handleError);
        }
    },
    mounted(){
        this.getList(1);
    }
}
</script>
<style scoped>
.chilren{
    background: #faca00 !important;
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