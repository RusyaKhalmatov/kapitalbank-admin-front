<template>
    <div class="main">
        <h2 class="headline">Категории для оплаты на местах</h2>
        <v-btn depressed @click="dialog=true">Добавить</v-btn>
        <div class="search">
            <v-text-field v-model="search" label="Поиск"></v-text-field>
        </div>
        <v-data-table :loading="loader" :search="search" :pagination.sync="pagination" :items="tableData" :headers="headers">
            <template slot="items" slot-scope="props">
                <tr >
                    <td>{{ props.item.id }}</td>
                    <td>{{ props.item.nameRu }}</td>                  
                    <td>{{ props.item.nameUz }}</td>                  
                    <td>{{ props.item.nameEn }}</td>         
                    <td>{{ props.item.active?'Да':'Нет' }}</td>                  
                    <td>
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

        <v-dialog  v-model="dialog" persistent max-width="800">
            <v-card>
                <v-card-title v-if="isEdit" class="headline">Изменение</v-card-title>
                <v-card-title v-else class="headline">Добавление</v-card-title>
                <v-card-title>
                    <v-text-field v-model="data.nameRu" label="Название (Ru)"></v-text-field>                
                </v-card-title>
                <v-card-title>
                    <v-text-field v-model="data.nameUz" label="Название (Uz)"></v-text-field>
                </v-card-title>
                <v-card-title>
                    <v-text-field v-model="data.nameEn" label="Название (En)"></v-text-field>
                </v-card-title>
                <v-card-title>
                    <v-checkbox v-model="data.active" label="Активный"></v-checkbox>
                </v-card-title>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn v-if="isEdit" depressed  :loading="loader" text @click="edit">Изменить</v-btn>
                <v-btn v-else depressed  text :loading="loader" @click="add">Сохранить</v-btn>
                <v-btn depressed  text @click="dialog = false">Закрыть</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog  v-model="deleteDialog" persistent max-width="500">
            <v-card>
                <v-card-title class="headline">Вы действительно хотите удалить?</v-card-title>                
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn depressed  text :loading="loader" @click="remove">Да</v-btn>
                <v-btn depressed  text @click="deleteDialog = false">Нет</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
export default {
    name: 'LocalPaymentCategory',
    data(){
        return{
            dialog: false,
            data: {},
            isEdit: false,
            tableData: [],
            headers:[
                {text: "ID", value: "id"},
                {text: "Название (Ru)", value: "nameRu"},
                {text: "Название (Uz)", value: "nameUz"},
                {text: "Название (En)", value: "nameEn"},  
                {text: "Активный", value: "active"},  

                {text: "Действия", value: ""},        
            ],
            pagination: {
                rowsPerPage: 15
            },
            search: '',
            deleteDialog: false,
            id: '',
        }
    },
    watch: {
        dialog(val){
            if(!val){
                this.data = {}
                this.isEdit = false;
                this.getList();
            }
        },
        deleteDialog(val){
            if(!val){
                this.id = '';
            }
        }
    },
    methods:{
        openEditBox(item){
            this.isEdit = true;
            this.data = item;
            this.dialog = true;
        },
        openDeleteBox(item){
            this.id = item.id;
            this.deleteDialog = true;
        },  
        getList(){
            this.loader = true;
            this.$http.get(this.$store.getters.newApiUrl+`/payment/local/categories`)
                .then(response=>{
                    console.log(response.data.data);   
                    this.tableData = response.data.data; 
                    this.loader = false;                
                }, this.handleError)
        },
        add(){
            this.loader = true;
            this.data.id = 0
            this.$http.post(this.$store.getters.newApiUrl+`/payment/local/addNewCategory`, this.data)
                .then(response=>{
                    console.log(response.data.data);  
                    this.dialog = false;
                    this.loader = false;
                    // this.getList();                  
                }, this.handleError)
        },
        edit(){
            this.loader = true;
            this.$http.put(this.$store.getters.newApiUrl+`/payment/local/updateCategory`, this.data)
                .then(response=>{
                    console.log(response.data.data);  
                    this.dialog = false;
                    this.loader = false;
                    // this.getList();                  
                }, this.handleError)
        },
        remove(){
            this.loader = true;
            this.$http.delete(this.$store.getters.newApiUrl+`/payment/local/delete/${this.id}`)
                .then(response=>{
                    this.deleteDialog = false;
                    this.getList();
                    this.loader = false;
                }, this.handleError)
        }

    },
    mounted(){
        this.getList();
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
    .search{
        background: #FFFF;
        padding: 10px;
    }
</style>