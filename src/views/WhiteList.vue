<template>
    <div class="main">
        <h1 class="headline">Белый лист по скорингу</h1>
        <v-text-field
                v-model="search"
                prepend-icon="mdi-magnify"
                label="Поиск">
        </v-text-field>
        <v-data-table
            :items="data"
            :headers="headers"   
            :search="search"
            :pagination.sync="pagination"         
        >
            <template slot="items" slot-scope="props">
                <tr>
                    <td>{{props.item.adminId}}</td>
                    <td>{{props.item.adminName}}</td>
                    <td>{{props.item.userId}}</td>                                      
                    <td>{{props.item.createTime | timestamp-to-date}}</td>    
                    <td>{{props.item.allowed | checkStatus}}</td>                                      
                    <td>
                        <v-btn icon small @click="openEditBox(props.item)"> 
                            <v-icon small>mdi-pencil</v-icon>
                        </v-btn>
                        <!-- <v-btn icon small @click="openDeleteBox(props.item)">
                            <v-icon small>mdi-delete</v-icon>
                        </v-btn> -->
                    </td>                   
                </tr>
            </template>
        </v-data-table>
        <v-dialog
            v-model="editDialog"
            width="400">
            <v-card>
            <v-card-title>
                <h3>Изменение</h3>
            </v-card-title>
            <v-card-text>
                <p>Полное имя: {{adminName}}</p>
                <v-checkbox v-model="allowed" :label="`Разрешить (${$options.filters.checkStatus(allowed)})`"></v-checkbox>
            </v-card-text>
            <v-card-actions>
                <v-spacer/>
                <v-btn @click.stop="editWhiteList" color="primary">Да</v-btn>         
                <v-btn @click.stop="editDialog = false" color="primary">Нет</v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>
        <v-dialog
            v-model="deleteDialog"
            width="400">
            <v-card>
            <v-card-title>
                <h3>Вы действительно хотите удалить?</h3>
            </v-card-title>
            <v-card-actions>
                <v-spacer/>
                <v-btn @click.stop="deleteWhiteList" color="primary">Да</v-btn>         
                <v-btn @click.stop="deleteDialog = false" color="primary">Нет</v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>
    </div>
</template>
<script>
export default {
    name: 'WhiteList',
    data(){
        return {
            pagination: {    
                rowsPerPage: 10
            },
            data: [],
            headers: [
                {text: "AdminID", value: "adminId"},
                {text: "Admin name", value: "adminName"},
                {text: "UserID", value: "userId"},
                {text: "Create time", value: "createTime"},
                {text: "Allowed", value: "allowed"},
                {text: "", value: ""},
            ],
            allowed: false,
            id: '',
            adminName: '',
            editDialog: false,
            search: '',
            deleteDialog: false,
            
        }
    },
    filters:{
        checkStatus(val){
        if(val){
            return 'Yes'
        }
        else{
            return 'No'
        }
        }
    },    
    watch:{
        editDialog(val){
            if(!val){
                this.id = '';
                this.adminName = '';
                this.allowed = false;
            }
        },
    },
    methods:{
        editWhiteList(){
            const putData = {
                'id': this.id,
                'allowed': this.allowed
            }            
            this.$http.put(this.$store.getters.newApiUrl+`/admin/external-history/white-list`, putData)
            .then(response=>{
                this.getWhiteList();
                this.editDialog = false;
            }, this.handleError)
        },
        deleteWhiteList(){        
            this.$http.delete(this.$store.getters.newApiUrl+`/admin/external-history/white-list/${this.id}`)
            .then(response=>{
                this.getWhiteList();
                this.deleteDialog = false;
            }, this.handleError)
        },
        openEditBox(item){
            this.editDialog = true;
            this.id = item.id;
            this.allowed = item.allowed;
            this.adminName = item.adminName;
        },
        openDeleteBox(item){
            this.id = item.id;
            this.deleteDialog = true;
        },
        getWhiteList(){
            this.data = [];
            this.$http.get(this.$store.getters.newApiUrl+`/admin/external-history/white-list`)
            .then(response=>{
                console.log(response.data.data);
                this.data = response.data.data;
            }, this.handleError)
        }
    },
    mounted(){
        this.getWhiteList();
    }
}
</script>
<style scoped>
    .main{
        width: 100%;
    }
    h1{
        text-align: center;
    }
</style>
