<template>
    <div class="main">
        <h1 class="headline">Страны</h1>
        <v-btn depressed color="#facb00" @click="dialog=true">Добавить</v-btn>
        <v-data-table :items="content" :headers="headers">
            <template slot="items" slot-scope="props">
                <tr>
                    <td>{{ props.item.id }}</td>                
                    <td>{{ props.item.nameRu }}</td>
                    <td>{{ props.item.nameUz }}</td>
                    <td>{{ props.item.nameEn }}</td>
                    <td>{{ props.item.isoName }}</td>
                    <td>{{ props.item.alpha2 }}</td>
                    <td>
                        <v-checkbox style="padding-top: 15px;" disabled v-model="props.item.visaAllowed"></v-checkbox>
                    </td>
                    <td>
                        <v-btn icon small @click="openEditBox(props.item)">
                            <v-icon small>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon small @click="openRemoveBox(props.item)">
                            <v-icon small>mdi-delete</v-icon>
                        </v-btn>
                    </td>
                    
                </tr>
            </template>
        </v-data-table>
        <v-dialog v-model="dialog" persistent max-width="800px">
            <v-card>              
                <v-card-title class="headline">{{dialogText}}</v-card-title>            
                    <v-container>       
                        <v-text-field v-model="data.nameRu" label="Название (RU)"></v-text-field>
                        <v-text-field v-model="data.nameUz" label="Название (UZ)"></v-text-field>
                        <v-text-field v-model="data.nameEn" label="Название (EN)"></v-text-field>
                        <v-text-field v-model="data.isoName" label="isoName"></v-text-field>
                        <v-text-field v-model="data.alpha2" label="alpha2"></v-text-field>
                        <v-checkbox v-model="data.visaAllowed" label="Разрешить для VISA"></v-checkbox>
                    </v-container>
            
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn v-if="isEdit" text flat @click="edit">Изменить</v-btn>
                <v-btn v-else text flat @click="add">Сохранить</v-btn>
                <v-btn text flat @click="dialog = false">Отмена</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="deleteDialog" persistent max-width="400">
            <v-card>
                <v-card-title class="headline">Вы действительно хотите удалить?</v-card-title>
                <v-card-actions style="text-align: center">
                <v-spacer></v-spacer>
                <v-btn :loading="loader" text flat @click="remove">Да</v-btn>
                <v-btn  text flat @click="deleteDialog = false">Нет</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
export default {
    name: 'Countries',
    data(){
        return{
            loader: false,
            dialog: false,
            isEdit: false,
            data:{},
            content: [],
            headers: [
                {text: "ID", value: "id"},
                {text: "Название (RU)", value: "nameRu"},
                {text: "Название (UZ)", value: "nameUz"},
                {text: "Название (EN)", value: "nameEn"},
                {text: "isoName", value: "isoName"},
                {text: "alpha2", value: "alpha2"},                   
                {text: "Разрешить для VISA", value: "visaAllowed"},
                {text: "Действия", value: ""},
            ],
            deleteDialog: false,
            id: '',
        }
    },
    computed:{
        dialogText(){
            if(this.isEdit){
                return 'Изменение'
            }
            else{
                return 'Добавление'
            }
        },
    },
    watch:{
        dialog(val){
            if(!val){
                this.data = {}
                if(this.isEdit){
                    this.getList();
                    this.isEdit = false;
                }
            }
        },
        deleteDialog(val){
            if(!val){
                this.id = '';
            }
        }

    },  
    methods:{
        openRemoveBox(item){
            this.deleteDialog = true;
            this.loader = false
            this.id = item.id;
        },
        openEditBox(item){
            this.isEdit = true;
            this.data = item;
            this.dialog = true;
        },  
        getList(){
            this.loader = true;
            this.$http.get(this.$store.getters.apiUrl+'/country')
            .then(response=>{
                this.content = response.data.data;
                console.log(this.content)

            }, this.handleError)
        },
        remove(){
            this.loader = true;
            this.$http.delete(this.$store.getters.apiUrl+`/country/delete/${this.id}`)
            .then(response=>{
                this.loader = false;
                this.deleteDialog = false;
                this.getList();
            }, this.handleError)
        },
        edit(){
            this.loader = true;
            this.$http.put(this.$store.getters.apiUrl+'/country/edit', this.data)
            .then(response=>{
                this.loader = false;
                this.dialog = false;
            }, this.handleError)
        },
        add(){
            this.loader = true;
            this.$http.post(this.$store.getters.apiUrl+'/country/add', this.data)
            .then(response=>{
                this.loader = false;
                this.getList();
                this.dialog = false;
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
</style>