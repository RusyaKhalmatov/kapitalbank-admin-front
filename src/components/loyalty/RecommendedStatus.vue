<template>
    <div class="main">
        <h1 class="headline">Статус рекомендаций лояльности</h1>
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
                    <td v-if="props.item.logoUrl"><img class="logo" :src="props.item.logoUrl" alt="logoUrl"></td>
                    <td v-else></td>                
                    <td>{{ props.item.status}}</td>        
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
                    <v-text-field label="Статус" v-model="data.status"></v-text-field>
                    <p class="logo-text">Статус лого:</p>
                    <div class="file-box">
                        <span class="logo-box">
                            <img class="logo-preview" :src="logoPreview" v-if="logoPreview"/>
                        </span>
                        <input class="input-file" accept="image/*" type="file" @change="onLogoChange($event)" ref="fileupload">
                    </div>                
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
                    <v-text-field label="Статус" v-model="data.status"></v-text-field>
                    <p class="logo-text">Статус лого:</p>
                    <div class="file-box">
                        <span class="logo-box">
                            <img class="logo-preview" :src="logoPreview" v-if="logoPreview"/>
                        </span>
                        <input class="input-file" accept="image/*" type="file" @change="onLogoChange($event)" ref="fileupload">
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
                <v-btn  text @click="deleteStatus">Да</v-btn>
                <v-btn  text @click="deleteDialog = false">Нет</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
export default {
    name: 'RecommendedStatus',
    data(){
        return {
            pagination: {              
                rowsPerPage: 10
            },
            page:1,
            totalPages: '',
            content: [],
            loader: false,
            headers: [
                {text: "ID", value: "id", sortable: false},
                {text: "Лого", value: "logoUrl", sortable: false},
                {text: "Статус", value: "status", sortable: false},
                {text: "Время обновления", value: "updatedAt", sortable: false},
                {text: "Действия", sortable: false}
            ],
            addDialog: false,
            editDialog: false,
            deleteDialog: false,
            data: {},
            logoPreview: '',
            isChange: false,
            statusId: '',
        }
    },
    watch:{
        deleteDialog(val){
            if(!val){
                this.statusId = '';
            }
        },
        editDialog(val){
            if(!val){
                this.data = {
                    statusLogo: '',
                };                
                if(this.isChange){
                    this.$refs.fileupload.value = null;
                }
                this.logoPreview = '';
                this.isChange = false;
            }
        },
        page(val){
            this.getStatus(val);
        }
    },
    methods: {
        getStatus(page){
            this.loader = true;
            this.$http.get(this.$store.getters.apiUrl+`/loyalty/recommended-status/list?page=${page-1}&size=10`)
            .then(response=>{
                console.log(response.data.data)
                this.content = response.data.data.content;
                this.totalPages = response.data.data.totalPages;
                this.loader = false;
            }, this.handleError)
        },
        onLogoChange(e){
            this.data.statusLogo = e.target.files[0];
            console.log(this.data.logo)
            if(this.data.statusLogo){
                this.logoPreview = URL.createObjectURL(e.target.files[0]);    
                this.isChange = true;            
            }
            else{
                this.logoPreview = '';
            }
        },
        openEditBox(item){
            this.data.id = item.id;
            this.data.status = item.status;
            this.logoPreview = item.logoUrl;
            this.editDialog = true;
            
        },
        openRemoveBox(item){
            this.statusId = item.id;
            this.deleteDialog = true;
        },
        add(){
            let data = new FormData();
            console.log(this.data)
            data.append('status', this.data.status);
            if(this.isChange)
                data.append('statusLogo', this.data.statusLogo);
            this.$http.post(this.$store.getters.apiUrl+`/loyalty/recommended-status/add-update`, data, {headers: {'Content-Type': 'multipart/form-data'}})
            .then(response=>{
                console.log(response.data.data);
                this.addDialog = false;
                this.getStatus(this.page);
            }, this.handleError)
        },
        edit(){
            let data = new FormData();
            console.log(this.data)
            data.append('status', this.data.status);
            data.append('id', this.data.id);
            if(this.isChange)
                data.append('statusLogo', this.data.statusLogo);
            this.$http.post(this.$store.getters.apiUrl+`/loyalty/recommended-status/add-update`, data, {headers: {'Content-Type': 'multipart/form-data'}})
            .then(response=>{
                console.log(response.data.data);
                this.editDialog = false;
                this.getStatus(this.page);
            }, this.handleError)
        },
        deleteStatus(){
            this.$http.delete(this.$store.getters.apiUrl+`/loyalty/recommended-status/delete/${this.statusId}`)
            .then(response=>{
                // console.log(response.data.data);
                this.deleteDialog = false;
                this.getStatus(this.page);
            }, this.handleError)
        }

    },
    mounted(){
        this.getStatus(1)
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
    margin: 5px;
    max-width: 50px;
    max-height: 50px;
    background: #efefef;
    padding: 5px;
    border-radius: 5px;
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
    background: #ececec;
    padding: 5px;
}
</style>