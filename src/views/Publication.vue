<template>
    <div class="main">
        <h1 class="headline">Мини объявления</h1>
         <v-btn @click="addDialog=true">Добавить</v-btn>
         <v-btn @click="uploadDialog=true">Загрузить файл с номерами</v-btn>

        <v-data-table
            :headers="headers"
            :items="content"
            :loading="loader"
            :pagination.sync="pagination"
            item-key="id"
            hide-actions
        >
            <template slot="items" slot-scope="props">
                <tr>
                    <td>{{ props.item.id }}</td>
                    <td v-if="props.item.imageUrl">
                        <img class="logo" :src="props.item.imageUrl" alt="logo">
                    </td>
                    <td v-else></td>
                    <td>{{ props.item.titleRu }}</td>
                    <td>{{ props.item.descriptionRu }}</td>
                    <td>{{ props.item.shortDescriptionRu }}</td>
                    <td>{{ props.item.updatedDate | timestamp-to-date}}</td>                                    
                    <td style="min-width: 417px;">
                        <v-btn depressed small @click="showToAll(props.item.id)" v-if="props.item.forSpecificUsers">Оптравить всем</v-btn>
                        <v-btn @click="show(props.item.id)" :loading="loader" v-if="!props.item.visible" depressed small>Опубликовать</v-btn>
                        <v-btn  @click="hide(props.item.id)" :loading="loader" v-else depressed small>Скрыть</v-btn>
                        <v-btn  @click="openEditBox(props.item)" icon small>
                            <v-icon small>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon small @click="openDeleteBox(props.item)">
                            <v-icon small>mdi-delete</v-icon>
                        </v-btn>
                    </td>
                </tr>
            </template>
        </v-data-table>
        <v-pagination
        v-if="content.length"
        :disabled="loader"
        class="center"
        v-model="page"
        :length="totalPages"
        :total-visible="10"
        ></v-pagination>   
        <v-dialog v-model="addDialog" persistent max-width="800">
            <v-card>
                <v-card-title class="headline">Добавление</v-card-title>
                <v-card-text>
                    <v-radio-group v-model="radio">
                        <v-radio
                            label="Отправить всем"
                            :value="0"
                        ></v-radio>
                        <v-radio
                            label="Отправить пользователю"
                            :value="1"
                        ></v-radio>                     
                    </v-radio-group>
                    <v-text-field style="width:400px" v-if="radio===1" label="Номер телефона" v-model="formData.userPhones"></v-text-field>
                    <date v-if="addDialog" :is="isDate" :fromDate.sync="fromDate" :toDate.sync="toDate"></date>
                    <p class="mb-1">Логотип:</p>
                    <span class="logo-box">
                        <img v-if="formData.imageBase64" class="image-preview" :src="formData.imageBase64" alt="logo" >
                        <v-file-picker
                        class="file-picker"
                        :disabled="loader"
                        v-model="newImage"
                        ref="fileupload"
                        accept="image/*"
                            label="Логотип"/>
                    </span>
                    <span class="form-data">
                        <v-text-field
                            label="Заголовок (Ru)"
                            v-model="formData.titleRu"
                        ></v-text-field>
                        <v-textarea v-model="formData.descriptionRu" label="Описание (Ru)"></v-textarea>
                        <v-text-field
                            label="Короткое описание (Ru)"
                            v-model="formData.shortDescriptionRu"
                        ></v-text-field>
                    </span>
                    <span class="form-data">
                        <v-text-field
                            label="Заголовок (Uz)"
                            v-model="formData.titleUz"
                        ></v-text-field>
                        <v-textarea v-model="formData.descriptionUz" label="Описание (Uz)"></v-textarea>
                        <v-text-field
                            label="Короткое описание (Uz)"
                            v-model="formData.shortDescriptionUz"
                        ></v-text-field>
                    </span>
                    <span class="form-data">
                        <v-text-field
                            label="Заголовок (En)"
                            v-model="formData.titleEn"
                        ></v-text-field>
                        <v-textarea v-model="formData.descriptionEn" label="Описание (En)"></v-textarea>
                        <v-text-field
                            label="Короткое описание (En)"
                            v-model="formData.shortDescriptionEn"
                        ></v-text-field>
                    </span>                    
                </v-card-text>


                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-grey" style="color: #FFFF;" text @click="sendPublication">Отправить</v-btn>
                <v-btn color="blue-grey" style="color: #FFFF;" text @click="addDialog = false">Отмена</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="editDialog" persistent max-width="800">
            <v-card>
                <v-card-title class="headline">Изменение</v-card-title>
                <v-card-text>
                    <!-- <v-radio-group v-model="radio">
                        <v-radio
                            label="Отправить всем"
                            :value="0"
                        ></v-radio>
                        <v-radio
                            label="Отправить пользователю"
                            :value="1"
                        ></v-radio>
                    </v-radio-group>
                    <v-text-field style="width:400px" v-if="radio===1" label="Номер телефона" v-model="formData.userPhones"></v-text-field> -->
                    <date v-if="editDialog" :is="isDate" :fromDate.sync="fromDate" :toDate.sync="toDate"></date>
                    <!-- <date v-if="editDialog" :is="isDate" :fromDate.sync="fDate" :toDate.sync="toDate"></date> -->

                    <!-- <datetime v-if="editDialog" type="datetime" v-model="toDate"></datetime> -->


                    <p class="mb-1">Логотип:</p>
                    <span class="logo-box">
                        <img v-if="!formData.imageBase64" class="image-preview" :src="formData.imageUrl" alt="logo" >  
                        <img v-if="formData.imageBase64" class="image-preview" :src="formData.imageBase64" alt="logo" >
                        <v-file-picker
                        class="file-picker"
                        :disabled="loader"
                        v-model="newImage"
                        ref="fileupload"
                        accept="image/*"
                            label="Логотип"/>
                        <!-- <input type="file" @change="newImage" accept="image/*" ref="fileupload"> -->
                    </span>
                    <span class="form-data">
                        <v-text-field
                            label="Заголовок (Ru)"
                            v-model="formData.titleRu"
                        ></v-text-field>
                        <v-textarea v-model="formData.descriptionRu" label="Описание (Ru)"></v-textarea>
                        <v-text-field
                            label="Короткое описание (Ru)"
                            v-model="formData.shortDescriptionRu"
                        ></v-text-field>
                    </span>
                    <span class="form-data">
                        <v-text-field
                            label="Заголовок (Uz)"
                            v-model="formData.titleUz"
                        ></v-text-field>
                        <v-textarea v-model="formData.descriptionUz" label="Описание (Uz)"></v-textarea>
                        <v-text-field
                            label="Короткое описание (Uz)"
                            v-model="formData.shortDescriptionUz"
                        ></v-text-field>
                    </span>
                    <span class="form-data">
                        <v-text-field
                            label="Заголовок (En)"
                            v-model="formData.titleEn"
                        ></v-text-field>
                        <v-textarea v-model="formData.descriptionEn" label="Описание (En)"></v-textarea>
                        <v-text-field
                            label="Короткое описание (En)"
                            v-model="formData.shortDescriptionEn"
                        ></v-text-field>
                    </span>        
                    <p class="mb-1">Время создания: {{formData.createdDate | timestamp-to-date}}</p>            
                    <p>Время изменения: {{formData.updatedDate | timestamp-to-date}}</p>            
                </v-card-text>


                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-grey" style="color: #FFFF;" text @click="editPublication">Отправить</v-btn>
                <v-btn color="blue-grey" style="color: #FFFF;" text @click="editDialog = false">Отмена</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="deleteDialog" persistent max-width="500">
            <v-card>
                <v-card-title class="headline">Вы действительно хотите удалить?</v-card-title>
                <v-card-actions style="text-align: center">
                <v-spacer></v-spacer>
                <v-btn  text @click="deletePublication">Да</v-btn>
                <v-btn  text @click="deleteDialog = false">Нет</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="uploadDialog" persistent max-width="800">
            <v-card>
                <v-card-title class="headline">Отправить файл с номерами</v-card-title>
                <v-card-title>
                    <v-text-field v-model="publicId" label="ID публикации"></v-text-field>
                </v-card-title>
                <v-card-title>                    
                    <input class="file" type="file"  accept="text/plain" @change="onFileChange($event)" ref="fileupload">
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-grey" style="color: #FFFF;" text @click="sendFile">Отправить</v-btn>
                    <v-btn color="blue-grey" style="color: #FFFF;" text @click="uploadDialog = false">Отмена</v-btn>
                </v-card-actions>
            </v-card>
            
        </v-dialog>
    </div>
</template>

<script>
import date from '@/components/date/Date'

export default {
    name: 'Publication',
    components:{
        date
    },
    data(){
        return{
            loader: false,
            totalPages: '',
            page: 1,
            content: [],
            pagination: {
                rowsPerPage: 10
            },
            headers: [
                {text: "ID", value: "id", sortable: false},
                {text: "Лого", value: "imageUrl", sortable: false},
                {text: "Заголовок (Ru)", value: "titleRu", sortable: false},
                {text: "Описание (Ru)", value: "descriptionRu", sortable: false},
                {text: "Короткое описание (Ru)", value: "shortDescriptionRu", sortable: false},
                {text: "Время изменения", value: "updatedDate", sortable: false},   
                {text: "Действия", value: "", sortable: false},                   
            ],  
            addDialog: false,   
            formData: {}   ,
            image: '',    
            imagePreview:'',
            id: '',
            deleteDialog: false,
            newImage: '',
            editDialog: false,
            isEdit: false,
            tmpData: {},
            uploadDialog: false,
            file: '',
            fromDate: new Date().getTime(),
            toDate: new Date().getTime(),
            radio: 0,
            userNumber: '',
            file: '',
            publicId: '',
            isDate: '',


        }
    },
    watch:{
        fromDate(val){
            // console.log('fromDate: ',val, ' - ', new Date(val))
        },
        toDate(val){
            // console.log('toDate: ', val, ' - ', new Date(val))
        },
        page(val){
            this.getPublication(val);
        },
        deleteDialog(val){
            if(!val){
                this.id = '';
            }
        },
        uploadDialog(val){
            if(!val){
                this.publicId = '';
                this.file = '';
            }
        },
        addDialog(val){
            if(!val){
                this.formData = {}
                this.imagePreview = '';
                this.isDate = ''
            }
            else{
                this.isDate = 'date'
            }
        },
        editDialog(val){
            if(!val){
                this.formData = {}
                this.imagePreview = '';
                this.isEdit = false;
                this.isDate = ''

            }
        },
        newImage(image) {
            ////console.log(image);
            let self = this;
            if (image.length > 0) {
                let reader = new FileReader();
                reader.onload = e => {
                    self.$set(self.formData, 'imageBase64', e.target.result);
                };
                reader.readAsDataURL(image[0]);
                // ////console.log(self.currentItem);
            }
            self.$set(self.formData, 'imageBase64', '');

        },
    },
    computed:{
        fileValue:{
            set(value){
                this.$refs.fileupload.value = value
            },
            get(){
                return this.$refs.fileupload.value
            }
        }
    },
    methods:{
        onFileChange(e) {
            const files = e.target.files || e.dataTransfer.files
            if (!files.length){
                this.$refs.fileupload.value = null;
                this.file = '';
            }
            else
                this.file = files[0];
            // this.sendFile(files[0]);
        },
        showToAll(id){
            this.loader = true;
            this.$http.post(this.$store.getters.apiUrl+`/publication/showtoall/${id}`)
            .then(response=>{
                //console.log(response.data.data)
                this.getPublication(this.page);
                this.loader = false;
            }, this.handleError)
        },
        show(id){
            this.loader = true;
            this.$http.post(this.$store.getters.apiUrl+`/publication/show/${id}`)
            .then(response=>{
                //console.log(response.data.data)
                this.getPublication(this.page);
                this.loader = false;
            }, this.handleError)
        },
        hide(id){
            this.loader = true;
            this.$http.post(this.$store.getters.apiUrl+`/publication/hide/${id}`)
            .then(response=>{
                //console.log(response.data.data)
                this.getPublication(this.page);
                this.loader = false;
            }, this.handleError)
        },
        onFileChange(e){
            if(e)
                this.file = e.target.files[0];
            else{
                this.$refs.fileupload.value = null;
                this.file = '';
            }
        },
        openEditBox(item){
            this.isEdit = true;
            //console.log(item);
            this.formData.id = item.id;
            this.formData.titleRu = item.titleRu;
            this.formData.titleUz = item.titleUz;
            this.formData.titleEn = item.titleEn;
            this.formData.descriptionRu = item.descriptionRu;
            this.formData.descriptionUz = item.descriptionUz;
            this.formData.descriptionEn = item.descriptionEn;
            this.formData.shortDescriptionRu = item.shortDescriptionRu;
            this.formData.shortDescriptionUz = item.shortDescriptionUz;
            this.formData.shortDescriptionEn = item.shortDescriptionEn;
            this.formData.updatedDate = item.updatedDate;
            this.formData.imageUrl = item.imageUrl;
            // this.formData.imageBase64 = item.imageBase64;
            this.formData.createdDate = item.createdDate;
            this.fromDate = item.beginDateTime
            this.toDate = item.endDateTime
            this.imagePreview = item.imageUrl;
            this.editDialog = true;
            this.isDate = 'date';
        },
        editPublication(){
            this.loader = true;
            Object.assign(this.formData, {
                "beginDateTime": this.fromDate,
                "endDateTime": this.toDate
            })
            console.log(this.formData)
            this.$http.post(this.$store.getters.apiUrl+`/publication/add`, this.formData)
            .then(response=>{
                //console.log(response.data.data);
                this.editDialog = false;
                this.getPublication(1);
                this.loader = false
            }, this.handleError)
        },
        sendFile(){
            let data = new FormData();
            data.append("file", this.file);
            this.$http.post(this.$store.getters.apiUrl+`/publication/fromFile/${this.publicId}`, data,  {headers: {'Content-Type': 'multipart/form-data'}})
            .then(response=>{
                //console.log(response.data.data);
                this.uploadDialog = false;
                this.getPublication(1);
                this.loader = false
            }, this.handleError)
        },
        sendPublication(){
            this.loader = true;
            Object.assign(this.formData, {
                "beginDateTime": this.fromDate,
                "endDateTime": this.toDate
            })
            if(this.radio===1)
                this.formData.userPhones = [this.formData.userPhones];
            // console.log(this.formData)        
            this.$http.post(this.$store.getters.apiUrl+`/publication/add`, this.formData)
            .then(response=>{
                //console.log(response.data.data);
                this.addDialog = false;
                this.getPublication(1);
                this.loader = false
            }, this.handleError)
            
        },
        getPublication(page){
            this.loader = true;
            this.$http.get(this.$store.getters.apiUrl+`/publication/get?page=${page-1}&size=10`)
            .then(response=>{
                //console.log(response.data.data)
                this.content = response.data.data.content;
                this.totalPages = response.data.data.totalPages;
                this.loader = false;
            }, this.handleError)
        },
        deletePublication(){
            this.$http.delete(this.$store.getters.apiUrl+`/publication/delete?id=${this.id}`)
            .then(response=>{
                this.deleteDialog = false;
                this.getPublication(this.page);
            }, this.handleError)
        },
        openDeleteBox(item){
            this.id = item.id;
            this.deleteDialog = true;
        },
        handleImage(e){
            let reader = new FileReader();
                reader.onload = e => {
                    this.$set(this.formData, 'imageBase64', e.target.result);
                };

                reader.readAsDataURL(image[0]);
            // if(this.$refs.fileupload.value){
            //     const selectedImage = e.target.files[0];
            //     this.imagePreview = URL.createObjectURL(e.target.files[0]); 
            //     this.createBase64Image(selectedImage);
            // }
            // else{
            //     this.imagePreview = '';
            //     this.formData.imageBase64 = null;
            //     this.$refs.fileupload.value = null;

            // }
        },
        createBase64Image(fileObject){
            const reader = new FileReader();
            reader.onload = (e) => {
                // this.formData.imageBase64 = e.target.result;
                this.$set(this.formData, 'imageBase64', e.target.result);

                //console.log(this.formData)
            }
            reader.readAsBinaryString(fileObject)
        }
    },
    created(){

    
    },
    mounted(){
        this.getPublication(1);
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
    .logo{
        max-width: 60px;
        max-height: 60px;
        margin: 5px;
    }
    .logo-box{
        display: flex;
        flex-direction: column;
    }
    .image-preview{
        max-width: 150px;
        max-height: 150px;
        margin: 0 0px 10px;
    }
    .center{
        margin: 10px;
        display: flex;
        justify-content: center;
    }
    .form-data{
        border: 1px solid #e6e6e6;
        display: flex;
        flex-direction: column;
        padding: 15px;
        margin: 15px 0;
        border-radius: 7px;
    }
</style>