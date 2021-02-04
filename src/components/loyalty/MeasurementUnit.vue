<template>
    <div class="main">
        <h1 class="header">Единицы измерения</h1>
        <v-btn @click="addDialog=true">Добавить</v-btn>
        <v-card v-if="measurementUnitsData.length!=0">
            <v-card-title>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Поиск"
                    single-line
                    hide-details
                ></v-text-field>
            </v-card-title>
            <v-data-table                    
                :headers="headers"
                :items="measurementUnitsData"
                :search="search" 
                :pagination.sync="pagination"
            >
                <template slot="items" slot-scope="props">
                    <tr>
                        <td>{{props.item.id}}</td>
                        <td>{{props.item.measurementUnitRu}}</td>
                        <td>{{props.item.descriptionRu}}</td>
                        <td>{{props.item.measurementUnitUz}}</td>
                        <td class="text-xs-left">{{props.item.descriptionUz }}</td>
                        <td>{{props.item.measurementUnitEn }}</td>
                        <td>{{props.item.descriptionEn }}</td>
                        <td>
                            <v-btn icon small
                                @click="openEditBox(props.item)">
                                <v-icon small>mdi-pencil</v-icon>
                            </v-btn>
                            <v-btn icon small @click="openRemoveBox(props.item)">
                                <v-icon small>mdi-delete</v-icon>
                            </v-btn>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </v-card>
        <v-dialog v-model="addDialog" persistent max-width="600px">
            <v-card>
                
                <span class="head-text">Добавление</span>            
                    <v-container>       
                        <v-text-field label="Единица измерения (Ru)" v-model="measurementUnitRu" required></v-text-field>                        
                        <v-textarea
                        label="Описание (Ru)"
                        v-model="descriptionRu"
                        ></v-textarea>             
                        <v-text-field label="Единица измерения (Uz)" v-model="measurementUnitUz" required></v-text-field>                        
                        <v-textarea
                        label="Описание (Uz)"
                        v-model="descriptionUz"
                        ></v-textarea> 
                        <v-text-field label="Единица измерения (En)" v-model="measurementUnitEn" required></v-text-field>  
                        <v-textarea
                        label="Описание (En)"
                        v-model="descriptionEn"
                        ></v-textarea>                       
                    </v-container>
            
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="addMeasurementUnit">Сохранить</v-btn>
                <v-btn text @click="addDialog = false">Отмена</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="editDialog" persistent max-width="600px">
            <v-card>
                
                <span class="head-text">Изменение</span>            
                    <v-container>       
                        <v-text-field label="Единица измерения (Ru)" v-model="measurementUnitRu" required></v-text-field>                        
                        <v-textarea
                        label="Описание (Ru)"
                        v-model="descriptionRu"
                        ></v-textarea>             
                        <v-text-field label="Единица измерения (Uz)" v-model="measurementUnitUz" required></v-text-field>                        
                        <v-textarea
                        label="Описание (Uz)"
                        v-model="descriptionUz"
                        ></v-textarea> 
                        <v-text-field label="Единица измерения (En)" v-model="measurementUnitEn" required></v-text-field>  
                        <v-textarea
                        label="Описание (En)"
                        v-model="descriptionEn"
                        ></v-textarea>                       
                    </v-container>
            
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="updateMeasurementUnit">Сохранить</v-btn>
                <v-btn text @click="editDialog = false">Отмена</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="deleteDialog" persistent max-width="290">
            <v-card>
                <v-card-title class="headline">Вы действительно хотите удалить?</v-card-title>
                <v-card-actions style="text-align: center">
                <v-spacer></v-spacer>
                <v-btn  text @click="deleteMeasurementUnitById">Да</v-btn>
                <v-btn  text @click="deleteDialog = false">Нет</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
export default {
    name: 'MeasurementUnit',
    data(){
        return {
            measurementUnitsData: [],
            pagination: {
                rowsPerPage: 10
            },
            search: '',
            addDialog: false,
            deleteDialog: false,
            descriptionEn: '',
            descriptionRu: '',
            descriptionUz: '', 
            measurementUnitEn: '',
            measurementUnitRu: '',
            measurementUnitUz: '',
            headers:[
                {text: "ID", value: "id", sortable: false},
                {text: "Единица измерения (Ru)", value: "measurementUnitRu",sortable: false},
                {text: "Описание (Ru)", value: "descriptionRu",sortable: false},
                {text: "Единица измерения (Uz)", value: "measurementUnitUz",sortable: false},
                {text: "Описание (Uz)", value: "descriptionUz",sortable: false},
                {text: "Единица измерения (En)", value: "measurementUnitEn",sortable: false},
                {text: "Описание (En)", value: "descriptionEn",sortable: false},

                {text: "Действия", value: "",sortable: false},

            ],
            unitId: '2',
            editDialog: false,
        }
    },
    watch: {
        addDialog(val){
            if(!val){
                this.descriptionEn = '';
                this.descriptionRu = '';
                this.descriptionUz = ''; 
                this.measurementUnitEn = '';
                this.measurementUnitRu = '';
                this.measurementUnitUz = '';
            }
        },
        editDialog(val){
            if(!val){
                this.descriptionEn = '';
                this.descriptionRu = '';
                this.descriptionUz = ''; 
                this.measurementUnitEn = '';
                this.measurementUnitRu = '';
                this.measurementUnitUz = '';
                this.unitId = '';
            }
        },
        deleteDialog(val){
            if(!val){
                this.unitId = '';
            }
        }
    },
    methods: {
        updateMeasurementUnit(){
            if(this.measurementUnitUz&&this.descriptionUz){
                let self = this;
                var putData = {
                    "id": this.unitId,
                    "descriptionEn": this.descriptionEn,
                    "descriptionRu": this.descriptionRu,
                    "descriptionUz": this.descriptionUz,
                    "measurementUnitEn": this.measurementUnitEn,
                    "measurementUnitRu": this.measurementUnitRu,
                    "measurementUnitUz": this.measurementUnitUz,
                }
                self.$http.put(self.$store.getters.loyaltyUrl + "/loyalty/measurement-unit/update", putData)
                    .then((response) => {
                        self.getMeasurementUnits();
                        self.editDialog = false;
                    }, self.handleError);
            }
            else{
                this.errorMessage('Заполните пустые поля!')
            }
        },
        openEditBox(item){
            this.editDialog = true;
            this.descriptionEn = item.descriptionEn;
            this.descriptionRu = item.descriptionRu;
            this.descriptionUz = item.descriptionUz; 
            this.measurementUnitEn = item.measurementUnitEn;
            this.measurementUnitRu = item.measurementUnitRu;
            this.measurementUnitUz = item.measurementUnitUz;
            this.unitId = item.id;
        },
        deleteMeasurementUnitById(){
            let self = this;
            console.log(self.unitId)
            self.$http.delete(self.$store.getters.loyaltyUrl + '/loyalty/measurement-unit/delete/' + self.unitId)
            .then((response) => {
                self.getMeasurementUnits();
                self.deleteDialog = false;
            }, self.handleError);
        },
        openRemoveBox(item){
            this.unitId = item.id;
            this.deleteDialog = true;
            console.log(this.unitId);
            
            console.log(item);

        },

        addMeasurementUnit(){
            if(this.measurementUnitUz&&this.descriptionUz){
                let self = this;
                var postData = {
                    "descriptionEn": this.descriptionEn,
                    "descriptionRu": this.descriptionRu,
                    "descriptionUz": this.descriptionUz,
                    "measurementUnitEn": this.measurementUnitEn,
                    "measurementUnitRu": this.measurementUnitRu,
                    "measurementUnitUz": this.measurementUnitUz,
                }
                self.$http.post(self.$store.getters.loyaltyUrl + "/loyalty/measurement-unit/add", postData)
                    .then((response) => {
                        self.getMeasurementUnits();
                        self.addDialog = false;
                    }, self.handleError);
            }
            else{
                this.errorMessage('Заполните пустые поля!')
            }
        },
        getMeasurementUnits(){
            this.measurementUnitsData = [];
            let self = this;
            self.$http.get(self.$store.getters.loyaltyUrl + "/loyalty/measurement-unit/get/all")
                .then((response) => {
                    console.log(response.data.data)
                    self.measurementUnitsData = response.data.data;
                }, self.handleError);
        }
    },
    mounted(){
        this.getMeasurementUnits();
    }
}
</script>

<style scoped>
    .header{
        text-align: center;
    }
    .head-text{
        font-size: 21px !important;
        padding: 9px 25px;
        display: flex;
        font-weight: 600;
    }
    .main{
        width: 100%;
    }
</style>