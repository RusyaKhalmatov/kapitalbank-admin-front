<template>
    <div class="main">
        <h1 class="header">Уровни лояльности</h1>
        <v-btn @click="addDialog=true">Добавить</v-btn>
        <div class="content">
                <v-data-table
                    v-if="levelData.length!=0"
                    :headers="headers"
                    :items="levelData"                                                      
                    hide-actions
                    item-key="id">
                    <template slot="items" slot-scope="props">
                        <tr>
                            <td>{{ props.item.id }}</td>
                            <td>{{ props.item.levelName}}</td>
                            <td>{{ props.item.apelsinAmount}}</td>
                            <td>{{ props.item.levelCode}}</td>                            
                            <td>{{ props.item.description}}</td>
                            <td >{{ checkStatus(props.item.active)}}</td>
                            <td>
                                <v-btn @click.stop="openEditBox(props.item)"
                                        icon small>
                                    <v-icon small>mdi-pencil</v-icon>
                                </v-btn>

                                <v-btn @click.stop="openRemoveBox(props.item.id)" icon small>
                                    <v-icon small>mdi-delete</v-icon>
                                </v-btn>
                            </td>
                        </tr>
                    </template> 
                </v-data-table>
        </div>
        <v-dialog v-model="deleteDialog" persistent max-width="290">
            <v-card>
                <v-card-title class="headline">Вы действительно хотите удалить?</v-card-title>
                <v-card-actions style="text-align: center">
                <v-spacer></v-spacer>
                <v-btn  text @click="deleteLevel">Да</v-btn>
                <v-btn  text @click="deleteDialog = false">Нет</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="addDialog" persistent max-width="600px">
            <v-card>
                
                <span class="head-text">Создать</span>
                
                <v-card-text>
                    <v-container>                                       
                        <v-text-field label="Название" v-model="levelName" required></v-text-field>                        
                        <v-text-field type="number" label="Количество апельсинов" v-model="apelsinAmount" required></v-text-field>                                            
                        <v-select 
                            label="Код" 
                            v-model="levelCode"
                            :items="levelCodesData"
                        ></v-select>                                                
                        <v-textarea label="Описание" v-model="description" required></v-textarea>   
                        <v-checkbox
                            v-model="active"
                            label="Активный"
                        >                        
                        </v-checkbox>                                                            
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="addLevel">Сохранить</v-btn>
                    <v-btn text @click="addDialog = false">Отмена</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="editDialog" persistent max-width="600px">
            <v-card>
                
                <span class="head-text">Изменить</span>
                
                <v-card-text>
                    <v-container>                                       
                        <v-text-field label="Название" v-model="levelName" required></v-text-field>                        
                        <v-text-field  type="number" label="Количество апельсинов" v-model="apelsinAmount" required></v-text-field>                                            
                        <v-select 
                            label="Код" 
                            v-model="levelCode"
                            :items="levelCodesData"
                        ></v-select>                                                   
                        <v-textarea label="Описание" v-model="description" required></v-textarea>   
                        <v-checkbox
                            v-model="active"
                            label="Активный"
                        >                        
                        </v-checkbox>                                                            
                    </v-container>
                </v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="editLevel">Сохранить</v-btn>
                <v-btn text @click="editDialog = false">Отмена</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    name: 'LoyaltyLevels',
    data(){
        return{
            levelData: [],
            headers: [
                {text: "ID", value: "id", sortable: false},
                {text: "Название", value: "levelName", sortable: false},
                {text: "Количество апельсинов", value: "apelsinAmount", sortable: false},
                {text: "Код", value: "levelCode", sortable: false},
                {text: "Описание", value: "description", sortable: false},
                {text: "Статус", value: "active", sortable: false},
                {text: "Действия", value: "", sortable: false},
            ],
            deleteDialog: false,
            addDialog: false,
            editDialog: false,
            selectedId: '',
            levelName: '',
            apelsinAmount: '',
            levelCode: '',
            description: '',
            active: false,
            levelCodesData: [],
        }
    },
    watch:{
        addDialog(val){
            if(!val){
                this.selectedId = '';
                this.levelName = '';
                this.apelsinAmount = '';
                this.levelCode = '';
                this.description = '';
                this.active = false;        
            }
        },
        editDialog(val){
            if(!val){
                this.selectedId = '';
                this.levelName = '';
                this.apelsinAmount = '';
                this.levelCode = '';
                this.description = '';
                this.active = false;        
            }
        }
    },
    methods:{        
        getAllLevelCodes(){
            let self = this;
            self.$http.get(self.$store.getters.loyaltyUrl + '/loyalty/levels')
            .then(response => {
                // console.log(response.data);
                self.levelCodesData = response.data.data;
            }, self.handleError);
        },
        getLevels(){
            let self = this;
            self.$http.get(self.$store.getters.loyaltyUrl + '/loyalty/levels/get/all')
            .then(response => {
                // console.log(response.data);
                self.levelData = response.data.data;
            }, self.handleError);
        },
        deleteLevel(){
            this.deleteDialog = false;
            let self = this;
            self.$http.delete(self.$store.getters.loyaltyUrl + '/loyalty/levels/delete/'+this.selectedId)
            .then(response => {
                self.getLevels();
            }, self.handleError);
        },
        openRemoveBox(id){
            this.deleteDialog = true;
            this.selectedId = id;
        },
        editLevel(){
            let self = this;
            var putData = {
                "id": this.selectedId,
                "levelName": this.levelName,
                "apelsinAmount": parseInt(this.apelsinAmount),
                "levelCode": this.levelCode,
                "description" : this.description,
                "active": this.active,
            }
			self.$http.put(self.$store.getters.loyaltyUrl + "/loyalty/levels/edit", putData)
			.then((response) => {
                self.editDialog = false;
                self.getLevels();
			}, self.handleError);
        },
        addLevel(){
            let self = this;
            var postData = {
                "levelName": this.levelName,
                "apelsinAmount": parseInt(this.apelsinAmount),
                "levelCode": this.levelCode,
                "description" : this.description,
                "active": this.active,
                "id": 0
            }
			self.$http.post(self.$store.getters.loyaltyUrl + "/loyalty/levels/add", postData )
			.then((response) => {
                self.addDialog = false;
                self.getLevels();
			}, self.handleError);
        },
        openEditBox(val){
            this.editDialog = true;
            this.selectedId = val.id
            this.levelName = val.levelName;
            this.apelsinAmount = val.apelsinAmount;
            this.levelCode = val.levelCode;
            this.description = val.description;
            this.active = val.active;     
        },
        checkStatus(val){
            if(val){
                return 'Активный';
            }
            else{
                return 'Неактивный';
            }
        }
    },
    mounted(){
        this.getLevels();
        this.getAllLevelCodes();
    }
}
</script>

<style scoped>
    .main{
        width: 100%;
    }
    .header{
        text-align: center;
    }
    .head-text{
        padding: 10px 30px;
        display: flex;
        font-size: 23px;
    }
</style>