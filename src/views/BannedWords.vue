<template>
    <div class="main">
        <h1 class="headline mb-4">Запрещенные слова Visa Direct</h1>
        <v-btn depressed color="#ffea90" @click="dialog=true">Добавить</v-btn>
        <v-text-field class="search" label="Поиск" v-model="search"></v-text-field>
        <v-data-table :headers="headers" :items="data" :loading="loader" :pagination.sync="pagination" :search="search">
            <template slot="items" slot-scope="props">
                <tr>
                    <td>{{ props.item.word }}</td>
                    <td>{{ props.item.createdAt | timestamp-to-date }}</td>
                    <td>
                        <!-- <v-btn  @click="openEditBox(props.item)" icon small>
                            <v-icon small>mdi-pencil</v-icon>
                        </v-btn> -->
                        <v-btn icon small @click="openDeleteBox(props.item)">
                            <v-icon small>mdi-delete</v-icon>
                        </v-btn>
                    </td>
                </tr>
            </template>
        </v-data-table>
        <v-dialog v-model="dialog" persistent max-width="650px">
                <v-card>
                    <v-card-title><h2>Добавление</h2></v-card-title>  
                    <v-card-text>
                        <v-text-field label="Слово" v-model="postData.word"></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn depressed text :loading="loader" @click="add">Сохранить</v-btn>
                    <v-btn depressed text @click="dialog = false">Отмена</v-btn>
                    </v-card-actions>
                </v-card>
        </v-dialog>
        <v-dialog v-model="deleteDialog" persistent max-width="450px">
            <v-card>
                <v-card-title><h2>Вы действительно хотите удалить?</h2></v-card-title>  
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn depressed text :loading="loader" @click="remove">Да</v-btn>
                <v-btn depressed text @click="deleteDialog = false">Нет</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
export default {
    name: 'BannedWords',
    data(){
        return{
            data: [],
            headers: [
                {text:'Слово', value: "word"},
                {text:'Время создания', value: "createdAt"},
                {text:'Действие', value: ""},
            ],
            pagination: {
                rowsPerPage: 10
            },
            search: '',
            loader: false,
            postData: {},
            dialog: false,
            deleteDialog: false,
            word: '',
        }   
    },
    watch:{
        dialog(val){
            if(!val){
                this.postData = {};
            }
        },
        deleteDialog(val){
            if(!val){
                this.word = '';
            }
        }
    },
    methods:{
        openDeleteBox(item){    
            this.word = item.word;
            this.deleteDialog = true;
        },
        getWords(){
            this.loader = true;
            this.$http.get(this.$store.getters.apiUrl+`/visa/ecomm/bannedword`)
            .then(response=>{
                this.data = response.data.data;
                this.loader = false;
            }, this.handleError)
        },
        add(){
            this.loader = true;
            this.$http.post(this.$store.getters.apiUrl+`/visa/ecomm/bannedword`, this.postData)
            .then(response=>{
                this.dialog = false;
                this.getWords();
                this.loader = false;
            }, this.handleError)
        },
        remove(){
            this.loader = true;
            this.$http.delete(this.$store.getters.apiUrl+`/visa/ecomm/bannedword/${this.word}`)
            .then(response=>{
                this.deleteDialog = false;
                this.getWords();
                this.loader = false;
            }, this.handleError)
        }
    },
    mounted(){
        this.getWords();
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
        padding: 15px 10px 0;
    }
</style>