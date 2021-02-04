<template>
    <div class="main">
        <h1 class="header">Описание разделов</h1>
        <v-btn @click="dialog=true">Добавить</v-btn>

        <v-data-table
            :headers="headers"
            :items="data"                                                      
            hide-actions
            item-key="id">
        <template slot="items" slot-scope="props">
            <tr>
                <td>{{ props.item.id }}</td>
                <td>{{ props.item.key }}</td>
                <td>{{ props.item.publishingRu }}</td>
                <td>{{ props.item.publishingEn }}</td>
                <td>{{ props.item.publishingUz }}</td>
                <td v-if="props.item.imageUrl"><img class="logo" :src="props.item.imageUrl" alt="imageUrl"></td>
                <td v-else></td>
                <td>
                    <v-btn icon small @click="openEditBox(props.item)">
                        <v-icon small>mdi-pencil</v-icon>
                    </v-btn>
                </td>
            </tr>
        </template>
        </v-data-table>
        <v-pagination
        class="center"
        v-model="page"
        :length="totalPages"
        :total-visible="6"
        ></v-pagination>
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                
                <span class="head-text"></span>            
                    <v-container>       
                        <v-text-field
                            v-model="key"
                            label="Ключ"
                        ></v-text-field>
                        <p class="logo-text">Изображение:</p>
                        <input class="input-file" type="file" @change="onFileChange($event)" ref="fileupload">    
                        <img v-if="image" class="image-preview" :src="imagePreview" alt="image">
                        <p class="mb-0 mt-2">Название (Ru)</p>
                        <quill-editor v-model="publishingRu"/>
                        <!-- <v-text-field
                            v-model="publishingRu"
                            label="Название (Ru)"
                        ></v-text-field> -->
                        <p class="mb-0 mt-2">Название (Uz)</p>
                        <quill-editor v-model="publishingUz"/>
                        <p class="mb-0 mt-2">Название (En)</p>
                        <quill-editor v-model="publishingEn"/>
                    </v-container>
            
                <v-card-actions>
                <v-spacer></v-spacer>
                
                <v-btn text @click="save">Сохранить</v-btn>
                <v-btn text @click="dialog = false">Отмена</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    name: 'Publishings',
    data(){
        return {
            key: '',
            image:'',
            id: '',
            lang: 'RU',
            publishingRu: '',
            publishingEn: '',
            publishingUz: '',
            totalPages: 1,
            curPage: '',
            data: [],
            page: 1,
            headers: [
                {text: "ID", value: "id", sortable: false},
                {text: "Ключ", value: "key",sortable: false},
                {text: "Название (Ru)", value: "publishingRu",sortable: false},
                {text: "Название (En)", value: "publishingEn",sortable: false},
                {text: "Название (Uz)", value: "publishingUz",sortable: false},
                {text: "Логотип", value: "imageUrl",sortable: false},
                {text: "Действия", value: "",sortable: false},
            ],
            dialog: false,
            imagePreview:'',
            isEdit: false,
            isChangeFile: false,

        }
    },
    watch:{
        page(val){
            this.getAllPaged(val);
            console.log(val)
        },
        dialog(val){
            if(!val){
                this.image = '';
                this.$refs.fileupload.value = null;
                this.key =  ''
                this.publishingRu = '';
                this.publishingEn = '';
                this.publishingUz = '';
                this.imagePreview = '';
                this.id = '';
                this.isEdit = false;
                this.isChangeFile = false;

            }
        }
    },
    methods:{
        openEditBox(item){
            this.id = item.id;
            this.key = item.key;
            this.publishingRu = item.publishingRu;
            this.publishingEn = item.publishingEn;
            this.publishingUz = item.publishingUz;
            this.imagePreview = item.imageUrl;
            this.image = item.imageUrl
            this.dialog = true;
            this.isEdit = true;
        },
        onFileChange(e){
            this.image = e.target.files[0];
            this.imagePreview = URL.createObjectURL(e.target.files[0]);
            this.isChangeFile = true;
        },
        getAllPaged(page){
            let self = this;
            self.data = [];
            self.$http.get(self.$store.getters.loyaltyUrl + "/loyalty/publishings/get-paged",{
                params:{
                    page: page-1,
                    size: 10,
                }
            })
            .then((response) => {                
                self.totalPages = response.data.data.totalPages;
                self.data = response.data.data.content;
            }, self.handleError);
        },
        save(){
            let self = this;
            let data = new FormData();
            if(this.image&&this.isChangeFile)
                data.append("image", this.image);
            data.append("key", this.key);
            data.append("publishingRu", this.publishingRu);
            data.append("publishingUz", this.publishingUz);
            data.append("publishingEn", this.publishingEn);
            if(this.isEdit){
                data.append("id", this.id);
                self.$http.put(self.$store.getters.loyaltyUrl + "/loyalty/publishings/update", data,  {headers: {'Content-Type': 'multipart/form-data'}})
                .then((response) => {                
                    self.dialog = false;
                    self.getAllPaged(self.page);
                }, self.handleError);

            }
            else{    
                self.$http.post(self.$store.getters.loyaltyUrl + "/loyalty/publishings/add", data,  {headers: {'Content-Type': 'multipart/form-data'}})
                .then((response) => {                
                    self.dialog = false;
                    self.getAllPaged(1);
                }, self.handleError);
            }
        },
    },
    mounted(){
        this.getAllPaged(1);
    }
}
</script>

<style scoped>
    .image-preview{
        max-width: 100px;
        max-height: 100px;
        margin: 10px;
    }
    .logo-text{
        margin: 5px 0;
    }
    .logo{
        max-width: 50px;
        max-height: 50px;
        margin: 5px;
    }
    .header{
        text-align: center;
    }
    .head-text{
        font-size: 21px !important;
        padding: 9px 25px;
        display: flex;
        font-weight: 600;
    }
    .main{
        width: 100%;
    }
    .center{
        margin: 10px;
        display: flex;
        justify-content: center;
    }
</style>