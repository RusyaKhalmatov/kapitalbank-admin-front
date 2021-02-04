<template>
    <div class="main">
        <h1 class="headline">Список сотрудников</h1>
        <v-btn depressed @click="dialog=true">Добавить сотрудника</v-btn>
            <div class="search">
                <span  style="width:500px">
                    <v-text-field v-model="search" @keyup.enter="load" label="Поиск"></v-text-field>
                </span>
                <v-btn class="mt-3" small depressed @click="load">Поиск</v-btn>
                <v-spacer></v-spacer>
                <v-btn class="mt-3 excel-btn" :loading="loader" depressed small @click="getExcel">Выгрузить в Excel</v-btn>
                <download-excel
                        v-show="false"
                        id="excel"
                        name="employees.xls"
                        :fields="operationExport"
                        :data="excelData">
                    <v-btn icon dark color="secondary">
                        <v-icon>mdi-file-excel</v-icon>
                    </v-btn>
                </download-excel> 
            </div>
            <v-data-table
                    :headers="headers"
                    :loading="loader"
                    :items="content"       
                    :pagination.sync="pagination"
                    hide-actions                                                                   
                    item-key="id">
                <template slot="items" slot-scope="props">
                    <tr>
                        <!-- <td>{{ props.item.id }}</td> -->
                        <td>{{ props.item.userId  }}</td>
                        <td>{{ props.item.login.split(':').length===2 ? props.item.login.split(':')[0] + ' (в.у.:' + new Date(parseInt(props.item.login.split(':')[1])).toLocaleString()+')' : props.item.login }}</td>
                        <td>{{ props.item.phone }}</td>
                        <td>{{ props.item.firstName }}</td>
                        <td>{{ props.item.lastName }}</td>
                        <td>{{ props.item.email }}</td>
                        <td>{{ props.item.branchName }}</td>
                        <td>{{ props.item.userRole }}</td>
                        <td>{{ props.item.employeeState }}</td>
                        <td>{{ props.item.createTime | timestamp-to-date }}</td>                        
                        <td style="min-width:292px">
                            <v-btn @click="openResetPassword(props.item.id)" depressed small>Сбросить пароль</v-btn>
                            <v-btn @click="openEditBox(props.item)" small icon><v-icon small>mdi-pencil</v-icon></v-btn>
                            <v-btn @click="openRemoveBox(props.item)" small icon><v-icon small>mdi-delete</v-icon></v-btn>                    
                        </td>
                    </tr>
                </template>    
                <template slot="no-data">
                    <h4 style="text-align:center">Нет данных</h4>
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
        <v-dialog v-model="dialog" persistent max-width="650px">
            <v-card>
                <v-card-title>
                    <h2>{{dialogHeader}}</h2>
                </v-card-title>  
                <v-card-text>        
                    <template v-if="!isEdit">
                        <v-text-field v-model="data.login" label="Логин"></v-text-field>
                        <v-text-field type="password" v-model="data.password" label="Пароль"></v-text-field>
                        <v-text-field v-model="data.firstName" label="Имя"></v-text-field>
                        <v-text-field v-model="data.lastName" label="Фамилия"></v-text-field>

                    </template>
                    <v-text-field v-model="data.phone" label="Номер телефона" placeholder="9989########" maxlength="12"></v-text-field>
                    <v-text-field v-model="data.email" label="Email"></v-text-field>
                    <v-select v-model="data.branchId" :items="branches" item-text="name" item-value="branchId" label="Филиал"></v-select>
                    <v-select v-model="data.userRole" :items="rolesData" label="Роль" item-text="value" ></v-select>
                </v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn v-if="!isEdit" depressed text :loading="loader" @click="add">Cохранить</v-btn>
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
        <v-dialog v-model="resetDialog" persistent max-width="400">
            <v-card>
                <v-card-title class="headline">Вы действительно хотите сбросить пароль?</v-card-title>
                <template v-if="newPassword">
                    <p style="text-align: center">Новый пароль: <strong>{{newPassword}}</strong></p>
                    <p style="text-align: center">Никому не передавайте пароль!</p>
                </template>
                <v-card-actions style="text-align: center">
                <v-spacer></v-spacer>
                <template v-if="!newPassword">
                    <v-btn depressed text @click="resetPassword">Да</v-btn>
                    <v-btn depressed text @click="resetDialog = false">Нет</v-btn>
                </template>
                <template v-else>
                    <v-btn  @click="resetDialog = false" depressed>Закрыть</v-btn>
                </template>
                
                </v-card-actions>
            </v-card>
        </v-dialog> 
    </div>
</template>
<script>
export default {
    name: 'EmployeesList',
    data(){
        return {
            loader: false,
            search: '',
            content: [],
            headers:[
                // {text: 'ID', value: 'id', sortable:false},
                {text: 'ID пользователя', value: 'userId', sortable:false},
                {text: 'Логин', value: 'login', sortable:false},
                {text: 'Номер телефона', value: 'phone', sortable:false},
                {text: 'Имя', value: 'firstName', sortable:false},
                {text: 'Фамилия', value:'lastName', sortable:false},
                {text: 'email', value: 'email', sortable:false},
                {text: 'Филиал', value: 'branchName', sortable:false},
                {text: 'Роль', value: 'userRole', sortable:false},
                {text: 'Состояние', value: 'employeeState', sortable:false},
                {text: 'Время создания', value: 'createTime', sortable:false},
                {text: 'Действия', value: '', sortable:false},

            ],
            excelHeaders:[
                // {text: 'ID', value: 'id', sortable:false},
                {text: 'ID пользователя', value: 'userId', sortable:false},
                {text: 'Логин', value: 'login', sortable:false},
                {text: 'Номер телефона', value: 'phone', sortable:false},
                {text: 'Имя', value: 'firstName', sortable:false},
                {text: 'Фамилия', value:'lastName', sortable:false},
                {text: 'email', value: 'email', sortable:false},
                {text: 'Филиал', value: 'branchName', sortable:false},
                {text: 'Роль', value: 'userRole', sortable:false},
                {text: 'Состояние', value: 'employeeState', sortable:false},
                {text: 'Время создания', value: 'createTime', sortable:false},

            ],
            totalPages: '',
            page: 1,
            pagination: {
                rowsPerPage: 10
            },
            isEdit: false,
            dialog: false,
            deleteDialog: false,
            branches: [],
            data: {},
            rolesData: [],
            id: '',
            resetDialog: false,
            newPassword: '',
            excelData: []

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
        operationExport() {
            let self = this, result = {};
            for (let i = 0; i < self.excelHeaders.length; i++) {
                let currentHeader = self.excelHeaders[i];                  
                result[currentHeader.text] = currentHeader.value;
            }
            result['Время создания'] = {
                field: "createTime",
                callback: value => {
                    let date = new Date(parseInt(value)).toLocaleString();
                    return date;
                }
            };
            return result;
        }
    },
    watch:{
        page(val){
            this.getList(val)
        },
        search(val){
            if(!val){
                this.load();
            }
        },
        deleteDialog(val){
            if(!val){
                this.id = '';
            }
        },
        dialog(val){
            if(!val){
                this.data = {};
                this.id = '';
                this.isEdit = false;
            }
        },
        resetDialog(val){
            if(!val){
                this.newPassword = '';
                this.id = '';
            }
        }
    },
    methods:{
        getRoles(){
            this.$http.get(this.$store.getters.newApiUrl+`/card-employee/v2/user-role`)
            .then(response=>{
                this.rolesData = response.data.data;
            }, this.handleError)
        },
        getBranches(){
            this.$http.get(this.$store.getters.apiUrl + `/branch/list`)
                .then(response => {
                    this.branches = response.data.data;
                    //console.log(response.data.data);
                }, this.handleError);
        },
        openEditBox(item){
            this.data = {
                phone: item.phone,
                email: item.email,
                branchId: item.branchId,
                userRole: item.userRole,
            }
            this.id = item.id;
            this.dialog = true
            this.isEdit = true;
        },
        openRemoveBox(item){
            this.id = item.id;
            this.deleteDialog = true;
        },
        load(){
            if(this.page===1){
                this.getList(1);
            }
            else{
                this.page=1
            }            
        },
        edit(){
            this.loader = true;
            this.$http.put(this.$store.getters.newApiUrl+`/card-employee/v2/${this.id}`, this.data)
            .then(response=>{
                this.getList(this.page)
                this.dialog = false;
                this.loader = false;
                console.log(response.data.data)
            }, this.handleError)
        },
        add(){
            this.loader = true;
            this.$http.post(this.$store.getters.newApiUrl+`/card-employee/v2`, this.data)
            .then(response=>{
                this.getList(this.page)
                this.dialog = false;
                this.loader = false;
            }, this.handleError)
        },
        remove(){
            this.loader = true;
            this.$http.delete(this.$store.getters.newApiUrl+`/card-employee/v2/${this.id}`)
            .then(response=>{
                this.getList(this.page);
                this.deleteDialog = false
                this.loader = false;
                // console.log(response.data.data)
            }, this.handleError)
        },
        getList(page){
            this.loader = true;
            this.$http.post(this.$store.getters.newApiUrl+`/card-employee/v2/pageable?page=${page-1}&size=10&search=${this.search}`)
            .then(response=>{
                this.content = response.data.data.content;
                this.totalPages = response.data.data.totalPages
                this.loader = false;
                // console.log(response.data.data)
            }, this.handleError)
        },
        getExcel(){
            this.loader = true;
            this.$http.post(this.$store.getters.newApiUrl+`/card-employee/v2/excel?search=${this.search}`)
            .then(response=>{
                this.excelData = response.data.data;
                if(this.excelData.length!=0){
                    let elem = document.getElementById('excel');
                    setTimeout(()=>{
                        elem.click();
                    }, 500)
                }          
                this.loader = false;
                // console.log(response.data.data)
            }, this.handleError)
        },
        resetPassword(){
            this.loader = true;
            this.$http.post(this.$store.getters.newApiUrl+`/card-employee/v2/${this.id}/reset-password`)
            .then(response=>{                
                console.log(response.data.data)
                this.newPassword = response.data.data;
                this.loader = false
            }, this.handleError)
        },
        openResetPassword(id){
            this.id = id;
            this.resetDialog = true;
        }
    },
    mounted(){
        this.getRoles()
        this.getBranches();
        this.getList(1);
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
    .center{
        margin: 10px;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }
    .search{
        display: flex;
        align-items: cener;
    }
    .excel-btn{
        border-radius: 29px;
        background: #3d9c3d !important;
        color: #FFFF !important;
        margin: 20px 0;
    }
</style>