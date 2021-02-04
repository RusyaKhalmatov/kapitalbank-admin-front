<template>
    <div class="main">
        <h1 class="headline">Список специальных клиентов</h1>
        <div class="btn-box">
            <v-btn small @click="addDialog=true">Добавить</v-btn>
            <span>        
                <v-btn small @click="openDisableBox">Отключить всех по тарифу</v-btn>
                <v-btn :loading="loader" small @click="disableAll">Отключить всех</v-btn>
            </span>
        </div>
        <v-data-table
            :headers="headers"
            :items="content"
            :loading="loader"
            :search="search"
            hide-actions
            >
                <template slot="items" slot-scope="props">
                    <tr>            
                        <td>{{ props.item.id }}</td>
                        <td>{{ props.item.personaNumber }}</td>
                        <td>{{ props.item.tariff.tariffName }}</td>                
                        <td>
                            <v-checkbox disabled
                                        v-model="props.item.active">
                            </v-checkbox>
                        </td>
                        <td>
                            <!-- <v-btn :to="{name: 'PaynetServicesForm', params: {paynetServices: props.item}}" -->
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
            v-if="content.length!=0"
            :disabled="loader"
            class="center"
            v-model="page"
            :length="totalPages"
            :total-visible="10"
            ></v-pagination>    
            <v-dialog v-model="addDialog" persistent max-width="600px">
                    <v-card>
                        <v-card-title><h2>Добавление</h2></v-card-title>  
                        <v-card-text>
                            <v-select v-model="tariffId" label="Тарифы" :items="tariffsData" item-text="tariffName" item-value="id"></v-select>
                            <!-- <div class="tariff-box">
                                <p v-for="(tariff,index) in tariffsData" :key="index">{{tariff.tariffName}}</p>
                            </div> -->
                        </v-card-text>
                        <v-card-text>
                            <p>Файл с номерами телефонов:</p>
                            <input class="input-file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"  type="file" @change="onFileChange($event)" ref="fileupload">
                        </v-card-text>
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text @click="add">Сохранить</v-btn>
                        <v-btn text @click="addDialog = false">Отмена</v-btn>
                        </v-card-actions>
                    </v-card>
            </v-dialog>
            <v-dialog v-model="editDialog" persistent max-width="600px">
                    <v-card>
                        <v-card-title><h2>Изменение</h2></v-card-title>  
                        <v-card-text>
                            <v-select v-model="tariffId" label="Тарифы" :items="tariffsData" item-text="tariffName" item-value="id"></v-select>
                            <!-- <div class="tariff-box">
                                <p v-for="(tariff,index) in tariffsData" :key="index">{{tariff.tariffName}}</p>
                            </div> -->
                        </v-card-text>
                        <v-card-text>
                            <v-text-field label="Номер телефона" v-model="personaNumber"></v-text-field>
                            <v-checkbox label="Состояние" v-model="active"></v-checkbox>

                        </v-card-text>
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text @click="edit">Сохранить</v-btn>
                        <v-btn text @click="editDialog = false">Отмена</v-btn>
                        </v-card-actions>
                    </v-card>
            </v-dialog>
            <v-dialog v-model="disableDialog" persistent max-width="600px">
                    <v-card>
                        <v-card-title><h2>Выберите тариф</h2></v-card-title>  
                        <v-card-text>
                            <v-select v-model="tariffId" label="Тарифы" :items="tariffsData" item-text="tariffName" item-value="id"></v-select>                            
                        </v-card-text>                    
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text @click="disableByTariff">Подтвердить</v-btn>
                        <v-btn text @click="disableDialog = false">Отмена</v-btn>
                        </v-card-actions>
                    </v-card>
            </v-dialog>
            <v-dialog v-model="deleteDialog" persistent max-width="290">
                <v-card>
                    <v-card-title class="headline">Вы действительно хотите удалить?</v-card-title>
                    <v-card-actions style="text-align: center">
                    <v-spacer></v-spacer>
                    <v-btn  text @click="deleteSpecialClients">Да</v-btn>
                    <v-btn  text @click="deleteDialog = false">Нет</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
    </div>
</template>
<script>
export default {
    name: 'specialClients',
    data(){
        return{
            totalPages: '',
            page: 1,
            content: [],
            search: '',
            headers: [
                {text: "ID", value: "id", sortable: false},
                {text: "Номер телефона", value: "personaNumber", sortable: false},
                {text: "Название тарифа", value: "tariff.tariffName", sortable: false},
                {text: "Состояние", value: "active", sortable: false},
                {text: "Действия", value: "", sortable: false},
            ],
            addDialog: false,
            personaNumber: '',
            tariffsData: [],
            file: '',
            tariffId: '',
            editDialog: false,
            id: '',
            personaNumber: '',
            active: '',
            disableDialog: false,
            loader: false,
            deleteDialog: false,
        }
    },
    watch:{
        addDialog(val){
            if(!val){
                this.tariffId = '';
                this.file = '';
                this.$refs.fileupload.value = null;
            }
        },
        editDialog(val){
            if(!val){
                this.tariffId = '';
                this.personaNumber = '';
                this.id = '';
                this.active = '';
            }
        },
        disableDialog(val){
            if(!val){
                this.tariffId = '';
            }
        },
        page(val){
            this.getList(val)
        }
    },  
    methods:{
        deleteSpecialClients(){
            const data = [this.id]
            
            console.log(data)
            this.$http.delete(this.$store.getters.apiUrl+`/loyalty/special-clients/delete`, {body: data})
            .then(response=>{
                this.loader = false;
                this.deleteDialog = false;
                setTimeout(()=>{
                    this.getList(1);
                }, 500)
            }, this.handleError)
        },
        disableAll(){
            const putData = {
                searchType: 'ALL',
                active: false
            }
            this.loader = true;
            this.$http.put(this.$store.getters.apiUrl+`/loyalty/special-clients/disable`, putData)
            .then(response=>{
                this.loader = false;
                setTimeout(()=>{
                    this.getList(1);
                }, 500)
            }, this.handleError)
        },
        disableByTariff(){
            const putData = {
                searchType: 'ALL_BY_FIELD',
                tariffId: this.tariffId,
                active: false,
            }
            this.$http.put(this.$store.getters.apiUrl+`/loyalty/special-clients/disable`, putData)
            .then(response=>{
                this.disableDialog = false;
                setTimeout(()=>{
                    this.getList(1);
                }, 500)
            }, this.handleError)
        },
        openDeleteBox(item){
            this.id = item.id;
            this.deleteDialog = true;
        },
        openDisableBox(){
            this.disableDialog = true;
        },
        openEditBox(item){
            this.editDialog = true;
            this.id = item.id;
            this.tariffId = item.tariff.id;
            this.personaNumber = item.personaNumber;
            this.active = item.active;
        },
        add(){
            let data = new FormData();
            data.append('personal_number_file', this.file);
            this.$http.put(this.$store.getters.apiUrl+`/loyalty/special-clients/upload/${this.tariffId}`, data,  {headers: {'Content-Type': 'multipart/form-data'}})
            .then(response=>{
                console.log(response.data.data);
                this.addDialog = false;
                setTimeout(()=>{
                    this.getList(1);
                }, 500)
            }, this.handleError)
        },
        edit(val){
            const putData = {
                id: this.id,
                personalNumber: this.personaNumber,
                tariffId: this.tariffId,
                active: this.active
            }
            this.$http.put(this.$store.getters.apiUrl+`/loyalty/special-clients/edit`, putData)
            .then(response=>{
                console.log(response.data.data);
                this.editDialog = false;
                setTimeout(()=>{
                    this.getList(1);
                }, 500)
            }, this.handleError)
        },
        onFileChange(e){
            this.file = e.target.files[0];
        },
        getList(page){
            this.$http.get(this.$store.getters.apiUrl+`/loyalty/special-clients/get/list?page=${page-1}&size=10`)
            .then(response=>{
                console.log(response.data.data);
                this.totalPages = response.data.data.totalPages;
                this.content = response.data.data.content;
            }, this.handleError)
        },
        getTariffs(page){
            let self = this;
            self.$http.get(self.$store.getters.loyaltyUrl + "/loyalty/tariffs/get/paged-tariffs", {
                params:{
                    page: page-1,
                    size: 10,
                }
            })
                .then((response) => {
                    //console.log(response.data.data)
                    response.data.data.content.forEach(x=>{
                        self.tariffsData.push(x);
                    })
                    if(parseInt(page)<parseInt(response.data.data.totalPages))
                        this.getTariffs(page+1)
                
                }, self.handleError);
        },        
    },
    mounted(){
        this.getList(1);
        this.getTariffs(1);
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
    .center{
        display: flex;
        justify-content: center;
        margin: 15px;
    }       
    .tariff-box{
        height: 200px;
        overflow: auto;
    }
    .btn-box{
        display: flex;
        justify-content: space-between;
    }
</style>