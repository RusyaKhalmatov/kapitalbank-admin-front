<template>
    <div class="main">
        <h1 class="headline">Автопушки</h1>
        <v-btn depressed @click="dialog=true">Добавить</v-btn>
        <v-data-table :headers="headers" :items="content" :pagination.sync="pagination">
            <template slot="items" slot-scope="props">
                <tr>
                    <td><v-btn depressed small :loading="loader" @click="getUsers(props.item.id)">Получить</v-btn></td>
                    <td>{{ props.item.id}}</td>
                    <td>{{ props.item.userType}}</td>
                    <td>{{ props.item.accountType }}</td>
                    <td>{{ props.item.accountTypeUsed?"Да":"Нет" }}</td>         
                    <td>{{ showOperationType(props.item.operationCodeId) }}</td>   
                    <td>{{ props.item.used? "Да":"Нет" }}</td>   
                    <td>{{ props.item.period }}</td> 
                    <td>{{props.item.notificationId}}</td>  
                    <td>{{ props.item.time| timestamp-to-date }}</td>         
                    <td>{{ props.item.active ? "Да":"Нет"}}</td> 
                

                    <td style="min-width:136px">
                        <v-btn @click="openEditBox(props.item)" small icon><v-icon small>mdi-pencil</v-icon></v-btn>
                        <v-btn @click="openRemoveBox(props.item)" small icon><v-icon small>mdi-delete</v-icon></v-btn>                    
                    </td>
                </tr>
            </template> 
        </v-data-table>
        <v-dialog v-model="dialog" persistent max-width="650px">
            <v-card>
                <v-card-title>
                    <h2>{{dialogHeader}}</h2>
                </v-card-title>  
                <v-card-text>                  
                    <v-select v-model="data.userType" label="Тип пользователей" :items="clientData"></v-select>
                    <v-select v-model="data.operationCodeId" label="Тип операции" multiple :items="typesData" item-text="operationType" item-value="id"></v-select>
                    <div v-if="data.operationCodeId" class="dflex">
                        <v-switch v-model="data.used" :label="operationTypeUsed"></v-switch>
                    </div>
                    <v-select v-model="data.accountType" label="Тип карты" multiple :items="accountTypeData"></v-select>
                    <div v-if="data.accountType" class="dflex">
                        <v-switch v-model="data.accountTypeUsed" :label="accountTypeUsed"></v-switch>
                    </div>
                    <v-text-field type="number" v-model="data.period" label="Период" ></v-text-field>
                    <v-text-field v-model="data.notificationId" label="ID уведомления" ></v-text-field>
                    <v-datetime-picker
                    prepend-icon="mdi-clock"
                    v-model="time"
                    label="Время уведомления"
                    />
                    <v-textarea v-model="data.description" label="Описание"></v-textarea>
                    <v-checkbox v-model="data.active" label="Активный"></v-checkbox>
                </v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn v-if="!isEdit" depressed text :loading="loader" @click="save">Сохранить</v-btn>
                <v-btn v-else depressed text :loading="loader" @click="edit">Изменить</v-btn>
                <v-btn depressed text @click="dialog = false">Отмена</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="deleteDialog" persistent max-width="290">
            <v-card>
                <v-card-title class="headline">Вы действительно хотите удалить?</v-card-title>
                <v-card-actions style="text-align: center">
                <v-spacer></v-spacer>
                <v-btn  text @click="remove">Да</v-btn>
                <v-btn  text @click="deleteDialog = false">Нет</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <download-excel
                v-show="false"
                id="excel"
                name="users.xls"
                :fields="excelHeaders"
                :data="excelData">
            <v-btn icon dark color="secondary">
                <v-icon>mdi-file-excel</v-icon>
            </v-btn>
        </download-excel> 

    </div>
</template>

<script>
export default {
    name: 'Autonotifications',
    data(){
        return{
            typesData: [],
            data:{
                accountTypeUsed: true,
                operationCodeId: [],
                accountType: [],
                used: true,
            },
            dialog: false,
            accountTypeData: ['UZCARD', 'HUMO', 'VISA', 'CARD', 'NONE'],
            switch: false,
            time: new Date(),
            clientData: ['CLIENT', 'NONCLIENT', 'ALL'],
            loader: false,
            content: [],
            pagination: {
                rowsPerPage: 10
            },
            headers:[
                {text: "Список пользователей", value: "", sortable: false},
                {text: "ID", value: "id"},
                {text: "Тип пользователя", value: "userType"},                
                {text: "Тип карты", value: "accountType"},
                {text: "Использующие данный тип карты", value: "accountTypeUsed"},
                {text: "код операции", value: "operationCodeId"},
                {text: "Использующие данный код операции", value: "used"},
                {text: "Период", value: "period"},
                {text: "ID уведомления", value: "notificationId"},
                {text: "Время уведомления", value: "time"},
                {text: "Активный", value: "active"},                  
            ],
            isEdit: false,
            id: '',
            deleteDialog: false,
            excelHeaders: {
                "Номер телефонов": ""
            },
            excelData: [],
        }
    },
    computed:{
        dialogHeader(){
            if(this.isEdit){
                return 'Изменение'
            }
            else
                return 'Добавление'
        },
        accountTypeUsed(){
        //    console.log(this.data.accountTypeUsed)
            if(this.data.accountTypeUsed)
                return `Использующие ${this.data.accountType}`
            else    
                return `Не использующие ${this.data.accountType}`
        },
        operationTypeUsed(){
            if(this.data.used)            
                return `Использующие ${this.data.operationCodeId}`
            else    
                return `Не использующие ${ this.data.operationCodeId}`
        }
    },
    watch:{
        deleteDialog(val){
            if(!val){
                this.id = '';
            }
        },
        dialog(val){
            if(!val){
                this.isEdit = false;
                let date = new Date();
                this.time = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.toLocaleTimeString();
                this.data = {
                    accountTypeUsed: true,
                    used: true,
                };
                this.getList();    
            }
        }
    },
    methods:{
        showOperationType(item){
            let value = this.typesData.find(x=>x.id===item)
            if(value){
                return value.operationType
            }
            else{
                return ''
            }
        },
        getUsers(id){
            this.loader = true;
            this.$http.get(this.$store.getters.apiUrl+`/autonotifications/users/${id}`)
            .then(response=>{
                // console.log(response.data.data)
                this.excelData = response.data.data;
                if(this.excelData.length!=0){
                    let elem = document.getElementById('excel');
                    setTimeout(()=>{
                        elem.click();
                    }, 500)                
                }   
                this.successMessage("Успешно")
                this.loader = false
            }, this.handleError)
        },
        openEditBox(item){
            this.isEdit = true;
            this.data = item
            this.data = {
                accountTypeUsed: item.accountTypeUsed,
                accountType: item.accountTypes.split(';'),
                active: item.active,
                description: item.description,
                id: item.id,
                notificationId: item.notificationId, 
                operationCodeId: item.operationCodeIds.split(';').map(x=>parseInt(x)),
                period: item.period,
                time: item.time,
                used: item.used,
                userType: item.userType
                
            }
            let date = new Date(this.data.time);
            delete this.data.time
            this.time = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.toLocaleTimeString();
            this.dialog = true
        },
        openRemoveBox(item){
            this.id = item.id;
            this.deleteDialog = true;
        },
        remove(){
            this.loader = true;
            this.$http.post(this.$store.getters.apiUrl+`/autonotifications/delete/${this.id}`)
            .then(response=>{
                // console.log(response.data.data)
                this.deleteDialog = false;
                this.getList();
                this.loader = false
            }, this.handleError)
        
        },
        edit(){
            this.loader = true;
            Object.assign(this.data, {time: new Date(this.time).getTime()})
            this.data.operationCodeIds = this.data.operationCodeId.toString().replace(',',';');
            this.data.accountTypes = this.data.accountType.toString().replace(',',';');
            delete this.data.operationCodeId
            delete this.data.accountType
            this.$http.post(this.$store.getters.apiUrl+`/autonotifications/save`, this.data)
            .then(response=>{
                // console.log(response.data.data)
                this.successMessage("Успешно")
                this.dialog = false;
                this.getList();
                this.loader = false
            }, this.handleError)
        },
        getList(){
            this.$http.get(this.$store.getters.apiUrl+`/autonotifications`)
            .then(response=>{
                // console.log(response.data.data)
                this.content = response.data.data;
            }, this.handleError)
        },
        getTypes(){
            this.$http.get(this.$store.getters.apiUrl+`/autonotifications/operationTypes`)
            .then(response=>{
                // console.log(response.data.data)
                this.typesData = response.data.data
                // console.log(this.typesData)

            }, this.handleError)
        },
        save(){
            this.loader = true;
            console.log(this.data)
            Object.assign(this.data, {time: new Date(this.time).getTime()})
            this.data.operationCodeIds = this.data.operationCodeId.toString().replace(',',';');
            this.data.accountTypes = this.data.accountType.toString().replace(',',';');
            delete this.data.operationCodeId
            delete this.data.accountType
            this.$http.post(this.$store.getters.apiUrl+`/autonotifications/save`, this.data)
            .then(response=>{
                // console.log(response.data.data)
                this.successMessage("Успешно")
                this.dialog = false;
                this.getList();
                this.loader = false
            })
            .catch(()=>{
                // this.handleError();
                this.errorMessage('Неверные поля (ID уведомления не найдено)')

                this.loader = false;
            })
        }
    },
    mounted(){
        this.getTypes();
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
    .dflex{
        display: flex;
    }
</style>