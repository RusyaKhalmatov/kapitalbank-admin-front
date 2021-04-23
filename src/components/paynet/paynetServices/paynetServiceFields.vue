<template>
    <div class="paynet-fields">
        <h3>Поля в Apelsin</h3>
        <div class="dflex">
            <div style="font-size: 12px;">
                <p class="mb-0">*fieldAlias - user_id, FIO, invoice_number</p>
                <p class="mb-0">*fieldType - N только числы, S строка</p>
            </div>
            <v-spacer></v-spacer>
            <v-btn @click="dialog=true" color="#f9ca03" round depressed>Добавить</v-btn>
        </div>
        <v-data-table no-data-text="Поле не добавлено" :pagination.sync="pagination" rows-per-page-text="Количество страниц" :headers="headers" :items="data">
            <template slot="items" slot-scope="props">
                <tr>
                    <td>{{props.item.fieldAlias}}</td>
                    <td>{{props.item.fieldType}}</td>
                    <td>{{props.item.nameRu}}</td>
                    <td>{{props.item.nameEn}}</td>
                    <td>{{props.item.nameUz}}</td>
                    <td>
                        <v-btn icon small @click="openEditBox(props.item)">
                            <v-icon small >mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon small @click.stop="openRemoveBox(props.item)">
                            <v-icon small>mdi-delete</v-icon>
                        </v-btn>
                    </td>
                </tr>
            </template>
        </v-data-table>
        <v-dialog persistent v-model="dialog" scrollable max-width="600px">
            <v-card>
                <v-card-title v-if="!isEdit" class="headline">Поля в Apelsin</v-card-title>
                <v-divider></v-divider>
                <v-card-text style="height: 400px;">
                        <v-text-field v-model.trim="dialogData.fieldAlias" label="Имя поле (fieldAlias)"></v-text-field>
                        <v-select v-model="dialogData.fieldType"  :items="['S', 'N','E']" label="Тип поле"></v-select>
                        <v-text-field v-model="dialogData.nameRu" label="Название поле (RU)"></v-text-field>
                        <v-text-field v-model="dialogData.nameEn" label="Название поле (EN)"></v-text-field>
                        <v-text-field v-model="dialogData.nameUz" label="Название поле (UZ)"></v-text-field>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn v-if="!isEdit" color="#f9ca03" flat @click="add" :loading="loader">Сохранить</v-btn>
                <v-btn v-else color="#f9ca03" flat @click="edit" :loading="loader">Изменить</v-btn>
                <v-btn color="black" flat @click="dialog = false">Закрыть</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>        
        <v-dialog persistent v-model="deleteDialog" max-width="400px">
            <v-card>
                <v-card-title class="headline">Вы действительно хотите удалить?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat :loading="loader" @click="deleteField">Да</v-btn>
                    <v-btn flat @click="deleteDialog=false">Нет</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
export default {
    name: 'PaynetServiceFields',
    props:{
        serviceItems: Object,
        serviceId: String
    },
    data(){
        return{
            data: this.serviceItems.paynetServiceFields || [],
            headers: [
                {text: "Имя поле (fieldAlias)", value: "fieldAlias", sortable: false},
                {text: "Тип поле", value: "fieldType", sortable: false},
                {text: "Название поле (RU)", value: "nameRu", sortable: false},
                {text: "Название поле (EN)", value: "nameEn", sortable:false},
                {text: "Название поле (UZ)", value: "nameUz", sortable: false},
            ],
            pagination: {
                rowsPerPage: 10
            },
            isEdit: false,
            dialog: false,
            dialogData: {},
            tmpDialogData: {},
            deleteDialog: false,
            id: null,
        }
    },
    watch: {
        dialog(val){
            if(!val){
                this.dialogData = {};
                this.tmpDialogData = {};
                this.isEdit = false;
            }
        },
        deleteDialog(val){
            if(!val){
                this.id = null;
                this.tmpDialogData = {};
            }
        },
        data:{
            handler(val){
                this.$emit('update:paynetServiceFields', val)
            },      
            deep: true
        }
    },  
    methods:{
        add(){
            if(this.serviceId){
                const postData = {
                    serviceId: this.serviceId,
                    fieldId: 0,
                    ...this.dialogData
                }
                this.loader = true
                this.$http.post(this.$store.getters.newApiUrl+`/payment-service/${this.serviceId}/field`, postData)
                .then(response=>{                    
                    this.$emit('update:paynetServiceFields', response.data.data.paynetServiceFields)
                    this.data = response.data.data.paynetServiceFields
                    this.loader = false;
                    this.dialog = false;
                }, this.handleError)
            }
            else{
                this.data.push(this.dialogData)
                this.$emit('update:paynetServiceFields', this.data)

                this.dialog = false;
            }
        },
        edit(){
            if(this.serviceId){
                const putData = {
                    serviceId: this.serviceId,
                    fieldId: 0,
                    ...this.dialogData
                }
                this.loader = true
                this.$http.put(this.$store.getters.newApiUrl+`/payment-service/${this.serviceId}/field/${putData.id}`, putData)
                .then(response=>{                   
                    let index = this.data.indexOf(this.data.find(x=>x.id===putData.id));
                    this.data.splice(index, 1, response.data.data);
                    this.loader = false;
                    this.dialog = false;
                }, this.handleError)
            }
            else{
                let index = this.data.indexOf(this.data.find(x=>x===this.tmpDialogData));
                this.data.splice(index, 1, this.dialogData);
                this.dialog = false;
            }
        },
        openEditBox(item){
            this.tmpDialogData = item;
            Object.assign(this.dialogData, item)
            this.isEdit = true;
            this.dialog = true;
        },
        openRemoveBox(item){
            this.id = item.id;
            this.tmpDialogData = item;
            this.deleteDialog = true;
        },
        deleteField(){
            if(this.serviceId){
                this.loader = true
                this.$http.delete(this.$store.getters.newApiUrl+`/payment-service/${this.serviceId}/field/${this.id}`)
                .then(()=>{             
                    let item = this.data.find(x => x.id === this.id);
                    this.data.splice(this.data.indexOf(item),1);       
                    this.loader = false;
                    this.deleteDialog = false;
                }, this.handleError)
            }
            else{
                let index = this.data.indexOf(this.data.find(x=>x===this.tmpDialogData));
                this.data.splice(index, 1);
                this.deleteDialog = false;
            }
        }
    }
}
</script>
<style scoped>
    .paynet-fields{
        margin: 20px 0;
        border-radius: 10px;
        background: #FFFF;
        padding: 10px;
    }
</style>