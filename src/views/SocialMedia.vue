<template>
    <div class="main">
        <h1 class="headline">Социальные адреса</h1>
        <v-btn @click="dialog=true" text>Добавить</v-btn>
        <v-data-table
            :items="data"
            :headers="headers"
            :loading="loader"
            :pagination.sync="pagination"
        >
            <template slot="items" slot-scope="props">
                <tr>
                    <td>{{ props.item.id }}</td>                
                    <td>{{ props.item.name }}</td>                                        
                    <td>{{ props.item.link }}</td>
                    <td>
                        <v-btn @click="openEditBox(props.item)" icon small>
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn @click="openDeleteBox(props.item)" icon small>
                            <v-icon>delete</v-icon>
                        </v-btn>
                    </td>
                </tr>
            </template>
        </v-data-table>
        <v-dialog v-model="dialog" persistent max-width="650">
            <v-card>
                <v-card-title v-if="isEdit" class="headline">Изменение</v-card-title>
                <v-card-title v-else class="headline">Добавление</v-card-title>
                <v-card-text>
                    <v-text-field v-model="name" label="Название"></v-text-field>
                    <v-text-field v-model="link" label="Ссылка"></v-text-field>
                </v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn depressed text v-if="isEdit" :loading="loader" @click="edit">Изменить</v-btn>
                <v-btn depressed text v-else :loading="loader" @click="add">Добавить</v-btn>
                <v-btn depressed text @click="dialog = false">Закрыть</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="deleteDialog" persistent max-width="450">
            <v-card>
                <v-card-title class="headline">Вы действительно хотите удалить?</v-card-title>            
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
    name: 'SocialMedia',
    data(){
        return {
            data: [],
            headers: [
                {text: "ID", value: "id"},
                {text: "Название", value: "name"},
                {text: "Ссылка", value: "link"},
                {text: "Действия", value: ""},
            ],
            dialog: false,
            id: '',
            name: '',
            link: '',
            loader: false,
            pagination: {                    
                rowsPerPage: 10
            },
            isEdit: false,
            deleteDialog: false,
        }
    },
    watch:{
        dialog(val){
            if(!val){
                this.id = '';
                this.name = '';
                this.link = '';
                this.isEdit = false
            }
        },
        deleteDialog(val){
            if(!val){
                this.id = '';
            }
        }
    },
    methods:{
        getList(){
            this.$http.get(this.$store.getters.apiUrl + '/social-media')
            .then(response => {
                this.data = response.data.data
            }, this.handleError)
        },
        openEditBox(item){
            this.id = item.id;
            this.name = item.name;
            this.link = item.link;
            this.isEdit = true;
            this.dialog = true;
        },
        edit(){
            this.loader = true;
            const putData = {
                id: this.id,
                name: this.name,
                link: this.link
            }
            this.$http.put(this.$store.getters.apiUrl + '/social-media', putData)
            .then(response => {
                this.loader = false;
                this.getList()
                this.dialog = false;
            }, this.handleError)
        },
        add(){
            this.loader = true;
            const postData = {
                name: this.name,
                link: this.link
            }
            this.$http.post(this.$store.getters.apiUrl + '/social-media', postData)
            .then(response => {
                this.loader = false;
                this.getList()
                this.dialog = false;            
            }, this.handleError)
        },
        openDeleteBox(item){
            this.id = item.id;
            this.deleteDialog = true;
        },
        remove(){
            this.loader = false;
            this.$http.delete(this.$store.getters.apiUrl + `/social-media/${this.id}`)
            .then(response => {
                this.loader = false;
                this.getList()
                this.deleteDialog = false;            
            }, this.handleError)
        }
    },
    mounted(){
        this.getList()
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
</style>