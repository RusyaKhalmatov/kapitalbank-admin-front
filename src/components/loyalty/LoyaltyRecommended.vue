<template>
    <div class="main">
        <h1 class="headline">Рекомендации программы лояльности</h1>
        <v-btn @click="addDialog=true">Добавить</v-btn>
        <v-data-table
            v-if="content.length!=0"
            :headers="headers"
            :items="content"                                                      
            hide-actions
            >
            <template slot="items" slot-scope="props">
                <tr>
                    <td>{{ props.item.id }}</td>         
                    <td>{{ props.item.category}}</td>        
                    <td>{{ props.item.description}}</td>   
                    <td>{{ props.item.title}}</td>   
                    <td>{{ props.item.status}}</td>   
                    <td>{{ props.item.disabled | checkStatus}}</td>   
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
                    <v-select label="Статус" v-model="data.statusId" :items="statusData" item-text="status" item-value="id"></v-select>               
                    <v-select label="Категория" v-model="data.categoryId" :items="categoryData" item-text="categoryName" item-value="id"></v-select>               
                    <v-text-field label="Название (Ru)" v-model="data.titleRu"></v-text-field>
                    <v-textarea label="Описание (Ru)" v-model="data.descriptionRu" ></v-textarea>
                    <v-divider class="divider"></v-divider>
                    <v-text-field label="Название (Uz)" v-model="data.titleUz"></v-text-field>
                    <v-textarea label="Описание (Uz)" v-model="data.descriptionUz" ></v-textarea>
                    <v-divider class="divider"></v-divider>
                    <v-text-field label="Название (En)" v-model="data.titleEn"></v-text-field>
                    <v-textarea label="Описание (En)" v-model="data.descriptionEn" ></v-textarea>
                    <v-divider class="divider"></v-divider>
                    <p class="logo-text mt-3">Логотип:</p>
                    <div class="file-box">
                        <span class="logo-box">
                            <img class="logo-preview" :src="logoPreview" v-if="logoPreview"/>
                        </span>
                        <input class="input-file" accept="image/*" type="file" @change="onLogoChange($event)" ref="fileupload">
                    </div>
                    <v-text-field v-model="data.order" label="Порядок"></v-text-field>
                    <v-text-field v-model="data.window" label="Ссылка для мобильной версии"></v-text-field>
                    <v-text-field v-model="data.windowWeb" label="Ссылка для Web версии"></v-text-field>
                    <v-checkbox label="Состояние" v-model="data.disabled"></v-checkbox>

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
                    <v-select label="Статус" v-model="data.statusId" :items="statusData" item-text="status" item-value="id"></v-select>               
                    <v-select label="Категория" v-model="data.categoryId" :items="categoryData" item-text="categoryName" item-value="id"></v-select>               
                    <v-text-field label="Название (Ru)" v-model="data.titleRu"></v-text-field>
                    <v-textarea label="Описание (Ru)" v-model="data.descriptionRu" ></v-textarea>
                    <v-divider class="divider"></v-divider>
                    <v-text-field label="Название (Uz)" v-model="data.titleUz"></v-text-field>
                    <v-textarea label="Описание (Uz)" v-model="data.descriptionUz" ></v-textarea>
                    <v-divider class="divider"></v-divider>
                    <v-text-field label="Название (En)" v-model="data.titleEn"></v-text-field>
                    <v-textarea label="Описание (En)" v-model="data.descriptionEn" ></v-textarea>
                    <v-divider class="divider"></v-divider>
                    <p class="logo-text mt-3">Логотип:</p>
                    <div class="file-box">
                        <span class="logo-box">
                            <img class="logo-preview" :src="logoPreview" v-if="logoPreview"/>
                        </span>
                        <input class="input-file" accept="image/*" type="file" @change="onLogoChange($event)" ref="fileupload">
                    </div>
                    <v-text-field v-model="data.order" label="Порядок"></v-text-field>
                    <v-text-field v-model="data.window" label="Ссылка для мобильной версии"></v-text-field>
                    <v-text-field v-model="data.windowWeb" label="Ссылка для Web версии"></v-text-field>
                    <v-checkbox label="Состояние" v-model="data.disabled"></v-checkbox>
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
                <v-btn  text @click="deleteRecommended">Да</v-btn>
                <v-btn  text @click="deleteDialog = false">Нет</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
export default {
    name: 'LoyaltyRecommended',
    data(){
        return {
            statusData: [],
            pagination: {              
                rowsPerPage: 10
            },
            totalPages: '',
            page: 1,
            content: [],
            addDialog: false,
            editDialog: false,
            deleteDialog: false,
            loader: false,
            data: {
                disabled: false
            },
            headers: [
                {text: "ID", value: "id", sortable: false},
                {text: "Категория", value: "category", sortable: false},
                {text: "Описание", value: "description", sortable: false},
                {text: "Заголовок", value: "title", sortable: false},
                {text: "Статус", value: "status", sortable: false},
                {text: "Состояние", value: "disabled", sortable: false},
                {text: "Действия", sortable: false}
            ],
            categoryData: [],
            logoPreview: '',
            isChange: false,
            id: '',
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
    watch: {
        deleteDialog(val){
            if(!val){
                this.id = '';
            }
        },
        addDialog(val){
            if(!val){
                this.data = {
                    disabled: false,
                    banner: '',
                };
                this.logoPreview = '';
                
                this.isChange = false;
            }
        },
        editDialog(val){
            if(!val){
                this.data = {
                    disabled: false,
                    banner: '',
                };
                this.logoPreview = '';
                
                this.isChange = false;
            }
        },
    },
    methods:{
        onLogoChange(e){
            this.data.banner = e.target.files[0];
            if(this.data.banner){
                this.logoPreview = URL.createObjectURL(e.target.files[0]);    
                this.isChange = true;            
            }
            else{
                this.logoPreview = '';
            }
        },
        openEditBox(item){
            this.getRecommendedById(item.id)
        },
        openRemoveBox(item){
            this.id = item.id;
            this.deleteDialog = true;
        },
        getAllStatus(){
            this.$http.get(this.$store.getters.apiUrl+`/loyalty/recommended-status/list-all`)
            .then(response=>{
                // console.log(response.data.data)
                this.statusData = response.data.data;
            }, this.handleError)
        },
        getAllCategory(){
            this.$http.get(this.$store.getters.apiUrl+`/loyalty/category/get/all`)
            .then(response=>{
                // console.log(response.data.data)
                this.categoryData = response.data.data;
            }, this.handleError)
        },
        deleteRecommended(){
            this.$http.delete(this.$store.getters.apiUrl+`/loyalty/recommended//delete/${this.id}`)
            .then(response=>{
                this.deleteDialog = false;
                this.getRecommended(this.page);
            }, this.handleError)
        },
        add(){
            let data = new FormData();
            data.append('statusId', this.data.statusId);
            data.append('categoryId', this.data.categoryId);
            data.append('titleUz', this.data.titleUz);
            data.append('titleRu', this.data.titleRu);
            data.append('titleEn', this.data.titleEn);
            data.append('descriptionUz', this.data.descriptionUz);
            data.append('descriptionRu', this.data.descriptionRu);
            data.append('descriptionEn', this.data.descriptionEn);
            data.append('order', this.data.order);
            data.append('window', this.data.window);
            data.append('windowWeb', this.data.windowWeb);
            data.append('disabled', !this.data.disabled);

            if(this.isChange)
                data.append('banner', this.data.banner);
            this.$http.post(this.$store.getters.apiUrl+`/loyalty/recommended/add-update`, data, {headers: {'Content-Type': 'multipart/form-data'}})
            .then(response=>{
                console.log(response.data.data);
                this.addDialog = false;
                this.getRecommended(this.page);
            }, this.handleError)
        },
        edit(){
            let data = new FormData();
            data.append('id', this.data.id);
            data.append('statusId', this.data.statusId);
            data.append('categoryId', this.data.categoryId);
            data.append('titleUz', this.data.titleUz);
            data.append('titleRu', this.data.titleRu);
            data.append('titleEn', this.data.titleEn);
            data.append('descriptionUz', this.data.descriptionUz);
            data.append('descriptionRu', this.data.descriptionRu);
            data.append('descriptionEn', this.data.descriptionEn);
            data.append('order', this.data.order);
            data.append('window', this.data.window);
            data.append('windowWeb', this.data.windowWeb);
            data.append('disabled', !this.data.disabled);

            if(this.isChange)
                data.append('banner', this.data.banner);
            this.$http.post(this.$store.getters.apiUrl+`/loyalty/recommended/add-update`, data, {headers: {'Content-Type': 'multipart/form-data'}})
            .then(response=>{
                console.log(response.data.data);
                this.editDialog = false;
                this.getRecommended(this.page);
            }, this.handleError)
        },
        getRecommendedById(id){
            this.$http.get(this.$store.getters.apiUrl+`/loyalty/recommended/get/${id}`)
            .then(response=>{
                const item = response.data.data
                this.data.id = item.id;
                this.data.statusId = item.statusId
                this.data.categoryId = item.categoryId;
                this.data.titleUz = item.titleUz
                this.data.titleRu = item.titleRu;
                this.data.titleEn = item.titleEn;
                this.data.descriptionUz = item.descriptionUz;
                this.data.descriptionRu = item.descriptionRu;
                this.data.descriptionEn = item.descriptionEn;
                this.data.order = item.order;
                this.data.window = item.window;
                this.logoPreview = item.bannerUrl;
                this.data.windowWeb = item.windowWeb;
                this.data.disabled = !item.disabled;            
                this.editDialog = true;            
            
            }, this.handleError)
        },
        getRecommended(page){
            this.$http.get(this.$store.getters.apiUrl+`/loyalty/recommended/list?page=${page-1}&size=10`)
            .then(response=>{
                console.log(response.data.data)
                this.content = response.data.data.content;
                this.totalPages = response.data.data.totalPages;
            }, this.handleError)
        }
    },
    mounted(){
        this.getAllStatus();
        this.getAllCategory()
        this.getRecommended(1);
    }
}
</script>

<style scoped>
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
.logo-preview{
    max-width: 100px;
    max-height: 100px;
    margin: 5px 10px;
}

</style>