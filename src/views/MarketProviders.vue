<template>
    <div class="main">
        <h2 class="headline">Поставщики маркетплейса</h2>
        <v-btn depressed @click="dialog=true">Добавить</v-btn>
        <div class="search">
            <v-text-field v-model="search" label="Поиск"></v-text-field>
        </div>
        <v-data-table :loading="loader" :search="search" :pagination.sync="pagination" :items="tableData" :headers="headers">
            <template slot="items" slot-scope="props">
                <tr >
                    <td>{{ props.item.id }}</td>
                    <td>{{ props.item.name }}</td>                  
                    <td>{{ props.item.mfo }}</td>                  
                    <td>{{ props.item.account }}</td> 
                    <td>{{ props.item.rate }}</td> 
                    <td>{{ props.item.taxNumber }}</td> 
                    <td>{{ props.item.transitAccount }}</td> 
                    <td>{{ props.item.status }}</td>                  
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
                <v-container>       
                    
                        <v-text-field
                            v-model="data.name"
                            label="Название"
                        ></v-text-field>
                        <v-text-field
                            v-model="data.mfo"
                            label="МФО"
                        ></v-text-field>
                        <v-text-field
                            v-model="data.account"
                            label="Счет"
                        ></v-text-field>
                         <v-text-field
                            v-model="data.rate"
                            type="number"
                            label="rate"
                        ></v-text-field>
                         <v-text-field
                            v-model="data.taxNumber"
                            label="taxNumber"
                        ></v-text-field>
                         <v-text-field
                            v-model="data.transitAccount"
                            label="transitAccount"
                        ></v-text-field>                          
                        <v-select v-model="data.status" :items="statusData" label="Статус" item-text="value" item-value="key"></v-select>        
                    </v-container>
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
    name: 'MarketProviders',
    data(){
        return{
            dialog: false,
            data: {},
            isEdit: false,
            tableData: [],
            headers:[
                {text: "ID", value: "id"},
                {text: "Название", value: "name"},
                {text: "МФО", value: "mfo"},
                {text: "Счет", value: "account"},  
                {text: "rate", value: "rate"},  
                {text: "taxNumber", value: "taxNumber"}, 
                {text: "transitAccount", value: "transitAccount"},  
                {text: "Статус", value: "status"},  
                {text: "Действия", value: ""},        
            ],
            pagination: {
                rowsPerPage: 10
            },
            search: '',
            deleteDialog: false,
            id: '',
            statusData: [],
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
            this.$http.get(this.$store.getters.newApiUrl+`/market/merchant`)
                .then(response=>{
                    console.log(response.data.data);   
                    this.tableData = response.data.data; 
                    this.loader = false;                
                }, this.handleError)
        },
        getStatus(){
            this.$http.get(this.$store.getters.newApiUrl+`/market/merchant/status`)
                .then(response=>{
                    this.statusData = response.data.data; 
                }, this.handleError)
        },
        add(){
            this.loader = true;
            this.$http.post(this.$store.getters.newApiUrl+`/market/merchant`, this.data)
                .then(response=>{
                    console.log(response.data.data);  
                    this.dialog = false;
                    this.loader = false;
                    // this.getList();                  
                }, this.handleError)
        },
        edit(){
            this.loader = true;
            this.$http.put(this.$store.getters.newApiUrl+`/market/merchant`, this.data)
                .then(response=>{
                    console.log(response.data.data);  
                    this.dialog = false;
                    this.loader = false;
                    // this.getList();                  
                }, this.handleError)
        },
        remove(){
            this.loader = true;
            this.$http.delete(this.$store.getters.newApiUrl+`/market/merchant/${this.id}`)
                .then(response=>{
                    this.deleteDialog = false;
                    this.getList();
                    this.loader = false;
                }, this.handleError)
        }

    },
    mounted(){
        this.getStatus();
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