<template>
    <v-flex xs12>
        <v-card min-height="600">
            <v-card-title>
                <h1>Список сотрудников</h1>
                <v-spacer/>
                <!-- <v-btn v-if="$store.getters.roles === 'ADMIN'" icon small @click="redirect('clientForm')">
                    <v-icon small>mdi-plus</v-icon>
                </v-btn> -->
            </v-card-title>
            <v-card-text>
                <v-text-field
                        v-model="search"
                        prepend-icon="mdi-magnify"
                        label="Поиск"
                        @keydown.enter="searchWord(search)">
                </v-text-field>
                <v-data-table
                        :headers="clientHeaders"
                        :items="clientsData"
                        :loading="loader"
                        :pagination.sync="pagination"
                        :search="search"

                        >
                        
                    <template slot="items" slot-scope="props">
                        <tr @click="user(props.item)">
                            <td>{{props.item.id}}</td>
                            <td>{{props.item.userId}}</td>
                            <td>{{props.item.firstName}}</td>
                            <td>{{props.item.lastName}}</td>
                            <td>{{props.item.createTime  | timestamp-to-date}}</td>
                            <td>{{props.item.branchId}}</td>
                            <td>{{props.item.email}}</td>
                            <td>{{props.item.employeeState}}</td>
                            <td>{{props.item.phone}}</td>
                        </tr>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
        <v-dialog
            v-model="detailDialog"
            width="400"
            persistent
            >
        <v-card>
            <!-- <v-card-title>
                <h3>Detail</h3>
            </v-card-title> -->
            <v-card-text>
                <v-container grid-list-md>
                    <v-layout wrap>
                    <v-flex xs12 sm6 md6>
                        <v-text-field label="Id" v-model="id" disabled></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                        <v-text-field label="UserId" v-model="userId" disabled></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md12>
                        <v-text-field label="BranchId" v-model="item.name" disabled v-for="(item, index) in barches" :key="index" v-show="item.id == branchId" :value="item.name"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6>
                        <v-text-field label="Фамилия" v-model="lastName" disabled></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6>
                        <v-text-field label="Имя" v-model="firstName" disabled></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field label="E-mail" v-model="email" disabled></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field label="Телефон" v-model="phone" disabled></v-text-field>
                    </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer/>
                <v-btn @click="toDo('delete')" color="primary">Удалить</v-btn>
                <v-btn @click="toDo('edit')" color="primary">Изменить</v-btn>
                <v-btn @click="toDo('close')" color="primary">Закрыть окно</v-btn>         
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog
            v-model="editDialog"
            width="400"
            persistent
            >
        <v-card>
            <v-card-title>
                <h3>Изменить</h3>
            </v-card-title>
            <v-card-text>
                <v-container grid-list-md>
                    <v-layout wrap>
                    <v-flex xs12 sm6 md6>
                        <v-text-field label="id" v-model="id" disabled></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 d-flex>
                        <v-select
                        :hint="`${select.name}, ${select.branchId}`"
                        :items="barches"
                        item-text="name"
                        item-value="id"
                        label="Филиал"
                        v-model="select"
                        persistent-hint
                        return-object
                        single-line
                        ></v-select>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field label="E-mail" v-model="email"></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field label="Телефон" v-model="phone"></v-text-field>
                    </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer/>
                <v-btn @click="toDo('close')" color="primary">Отмена</v-btn>
                <v-btn @click="edit()" color="primary">Изменить</v-btn>         
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog
            v-model="deleteDialog"
            width="250"
            persistent
            >
        <v-card>
            <v-card-text>
                <v-container grid-list-md>
                    <h3>Вы действительно хотите удалить?</h3>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer/>
                <v-btn @click="toDo('close')" color="primary">Отмена</v-btn>
                <v-btn @click="del()" color="primary">Удалить</v-btn>         
            </v-card-actions>
        </v-card>
    </v-dialog>
    </v-flex>
</template>

<script>
    export default {
        name: "employeeList",
        data() {
            return {
                select: { name: '', id: ''},
                clientHeaders: [
                    {text: "ID", value: "id"},
                    {text: "UserId", value: "userId"},
                    {text: "Имя", value: "firstName"},
                    {text: "Фамилия", value: "lastName"},
                    {text: "Дата создания", value: "createTime"},
                    {text: "Id Филиала", value: "branchId"},
                    {text: "E-mail", value: "email"},
                    {text: "Employe Status", value: "employeeState"},
                    {text: "Телефон", value: "phone"},
                ],
                clientsData:[],
                search: "",
                userList: [],
                totalUsers: null,
                pagination: {
                    rowsPerPage: 5,
                },
                currentPage: 0,
                pageCount: 0,
                loading: true,
                detailDialog: false,
                editDialog: false,
                deleteDialog: false,
                userDetail: [],
                id: '',
                userId: '',
                firstName: '',
                lastName: '',
                branchId: '',
                createTime: '',
                employeeState: '',
                email: '',
                phone: '',
                barches: [],
            }
        },
        methods: {
            setNewData(){
                for(var i = 0; i < this.barches.length; i++){
                    if(this.barches[i].id == this.branchId){
                        this.select.name = this.barches[i].name;
                        this.select.id = this.barches[i].id;
                    }
                }
            },
            getBranches(){
                let self = this;
                self.$http.get(self.$store.getters.apiUrl + `/branch/list`)
                    .then(response => {
                        self.barches = response.data.data;
                        //console.log(response.data.data);
                    }, self.handleError);
            },
            del(){
                let self = this;
                self.$http
                    .delete(self.$store.getters.newApiUrl + "/card-employee/"+this.id)
                    .then(() => {
                        self.deleteDialog = false;
                        self.QueryAll();
                    }, self.handleError);
            },
            edit(){
                this.editDialog = false;
                const postData = {
                    id: this.id, 
                    branchId: this.branchId,
                    email: this.email,
                    phone: this.phone,
                };
                let self = this;
                self.$http
                    .post(self.$store.getters.newApiUrl + "/card-employee/edit", postData)
                    .then(() => {
                        self.QueryAll();
                    }, self.handleError);
            },
            toDo(command){
                if(command == 'close'){
                    this.id = '';
                    this.userId = '';
                    this.firstName = '';
                    this.lastName = '';
                    this.branchId = '';
                    this.createTime = '';
                    this.employeeState = '';
                    this.email = '';
                    this.phone = '';
                    this.detailDialog = false;
                    this.editDialog = false;  
                    this.deleteDialog = false;
                }
                if(command == 'edit'){
                    this.setNewData();
                    this.detailDialog = false;
                    this.editDialog = true; 
                }
                if(command == 'delete'){
                    this.detailDialog = false;
                    this.editDialog = false;
                    this.deleteDialog = true; 
                }
            },
            user(data){
                //alert(data.id);
                this.id = data.id;
                this.userId = data.userId;
                this.firstName = data.firstName;
                this.lastName = data.lastName;
                this.branchId = data.branchId;
                this.createTime = data.createTime;
                this.employeeState = data.employeeState;
                this.email = data.email;
                this.phone = data.phone;
                this.detailDialog = true;
                this.setNewData();
            },
            QueryAll(){
                let self = this;
                this.loader = true;
                self.$http.get(self.$store.getters.newApiUrl + `/card-employee/all`)
                    .then(response => {
                        self.clientsData = response.data.data;
                        self.loader = false;
                        //console.log(response.data.data);
                    }, self.handleError);
            },
            getTotalUsers() {
                let self = this;
                self.$http.get(self.$store.getters.apiUrl + '/total-users')
                    .then(response => {
                        self.loader = false;
                        self.totalUsers = response.data.data;
                    }, self.handleError);
            },
            getUserList() {
                let self = this;
                self.$http.get(self.$store.getters.apiUrl + `/user-list?page=${self.currentPage}&size=${self.pagination.rowsPerPage}`)
                    .then(response => {
                        self.loader = false;
                        self.userList = response.data.data;
                        //console.log(response.data.data);
                    }, self.handleError);
            },
            arrowRight() {
                let self = this;
                if (self.currentPage >= self.totalUsers) {
                    this.getUserList();
                } else {
                    self.currentPage++;
                    this.getUserList();
                }
            },
            arrowLeft() {
                let self = this;
                if (self.currentPage <= 0) {
                    this.getUserList();
                } else {
                    self.currentPage--;
                    this.getUserList();
                }
            },
            searchWord(search) {
                let self = this;
                self.$http.get(self.$store.getters.apiUrl + `/user-search?word=${search}`)
                    .then(response => {
                        self.loader = false;
                        self.userList = response.data.data;
                    }, self.handleError);
            },
            phoneFormat(phone) {
                if (phone === '' || phone === null) {
                    return '';
                }
                return phone;
            }
        },
        watch: {
            search(value) {
                this.searchWord(value);
            },
            select: function(){
                this.branchId = this.select.id;
            }
        },
        mounted() {
            this.getTotalUsers();
            this.getUserList();
            this.QueryAll();
            this.getBranches();
        }
    }
</script>

<style scoped>

</style>