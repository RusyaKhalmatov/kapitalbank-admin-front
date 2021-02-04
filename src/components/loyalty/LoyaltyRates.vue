<template>
    <div class="main">
        <h1 class="header">Ставки апельсинов</h1>
        <v-btn @click="addDialog=true">Добавить</v-btn>
        <v-card v-if="ratesData.length!=0">
            <v-data-table                    
                :headers="headers"
                :items="ratesData"
                :pagination.sync="pagination"
                hide-actions
            >
                <template slot="items" slot-scope="props">
                    <tr>
                        <td>{{props.item.rate_id}}</td>
                        <td>{{props.item.provider.serviceNameRu}}</td>
                        <td>{{props.item.level.levelName}}</td>
                        <td>{{props.item.price_per_apelsin / 100 | number-format}}</td>
                        <td>{{props.item.currency.name }}</td>
                        <td>{{props.item.is_active | checkStatus}}</td>
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
            <v-pagination
            class="center"
            v-model="page"
            :length="totalPages"
            :total-visible="6"
            ></v-pagination>
        </v-card>
        <v-dialog v-model="addDialog" persistent max-width="600px">
            <v-card>                    
                <span class="head-text">Добавление</span>            
                    <v-container>       
                        <v-select 
                            label="Поставщик услуг" 
                            v-model="serviceId"
                            :items="loyaltyServicesData"
                            item-text="name"
                            item-value="serviceId"
                        ></v-select>  
                        <v-select 
                            label="Уровни лояльности" 
                            v-model="levelId"
                            :items="loyaltyLevelsData"
                            item-text="name"
                            item-value="id"
                        ></v-select>           
                        <v-text-field type="number" label="Сумма за одного апельсина" v-model="pricePerApelsin" required></v-text-field>    
                        <v-text-field  label="Валюта" v-model="currency.name" required disabled></v-text-field>      
                    
                        <v-checkbox
                            v-model="active"
                            label="Активный"
                        >                        
                        </v-checkbox> 
                    </v-container>                
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="addApelsinRates">Сохранить</v-btn>
                <v-btn text @click="addDialog = false">Отмена</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="editDialog" persistent max-width="600px">
            <v-card>                    
                <span class="head-text">Добавление</span>            
                    <v-container>       
                        <v-select 
                            label="Поставщик услуг" 
                            v-model="serviceId"
                            :items="loyaltyServicesData"
                            item-text="name"
                            item-value="serviceId"
                        ></v-select>  
                        <v-select 
                            label="Уровни лояльности" 
                            v-model="levelId"
                            :items="loyaltyLevelsData"
                            item-text="name"
                            item-value="id"
                        ></v-select>           
                        <v-text-field type="number" label="Сумма за одного апельсина" v-model="pricePerApelsin" required></v-text-field>    
                        <v-text-field  label="Валюта" v-model="currency.name" required disabled></v-text-field>      
                    
                        <v-checkbox
                            v-model="active"
                            label="Активный"
                        >                        
                        </v-checkbox> 
                    </v-container>                
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="updateApelsinRate">Сохранить</v-btn>
                <v-btn text @click="editDialog = false">Отмена</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="deleteDialog" persistent max-width="290">
            <v-card>
                <v-card-title class="headline">Вы действительно хотите удалить?</v-card-title>
                <v-card-actions style="text-align: center">
                <v-spacer></v-spacer>
                <v-btn  text @click="deleteRate">Да</v-btn>
                <v-btn  text @click="deleteDialog = false">Нет</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    name: 'LoyaltyRates',
    data(){
        return{
            page: '',
            totalPages: '',
            ratesData: [],
            loyaltyServicesData: [],
            loyaltyLevelsData: [],
            addDialog: false,
            editDialog: false,
            deleteDialog: false,
            serviceId: '',
            pricePerApelsin: '',
            pagination: {
                rowsPerPage: 10
            },
            currency: {
                "name": "UZS",
                "scale": 0
            },
            active: true,
            levelId: '',
            headers:[
                {text: "ID", value: "rate_id", sortable: false},
                {text: "Название сервиса", value: "provider.serviceNameRu",sortable: false},
                {text: "Уровень лояльности", value: "level.levelName",sortable: false},
                {text: "Сумма за одного апельсина", value: "price_per_apelsin",sortable: false},
                {text: "Валюта", value: "currency.name",sortable: false},
                {text: "Cтатус", value: "is_active",sortable: false},

                {text: "Действия", value: "",sortable: false},

            ],
            rateId: '',
        }
    },
    filters:{
        checkStatus(val){
            if(val){
                return 'Активный'
            }
            else{
                return 'Неактивный'
            }
        }
    },
    watch: {
        addDialog(val){
            if(!val){                
                this.serviceId = '';
                this.pricePerApelsin = '';
                this.active = true;
                this.levelId = '';
            }
        },
        editDialog(val){
            if(!val){
                this.active = '';
                this.levelId = '';
                this.pricePerApelsin = '';
                this.rateId = '';
                this.serviceId = '';
            }
        },
        deleteDialog(val){
            if(!val){
                this.rateId = '';
            }
        },
        page(val){
            console.log(val)
            this.getApelsinRates(val);
        }
    },
    methods:{
        openEditBox(item){
            this.editDialog = true;
            this.active = item.is_active
            this.levelId = item.level.id;
            this.pricePerApelsin = item.price_per_apelsin / 100;
            this.rateId =  item.rate_id;
            this.serviceId = item.provider.id;
        },
        updateApelsinRate(){
            if(this.serviceId&&this.pricePerApelsin&&this.levelId){
                let self = this;
                var putData = {
                    "active": this.active,
                    "currency": this.currency,
                    "levelId": this.levelId,
                    "pricePerApelsin": this.pricePerApelsin*100,
                    "rateId": this.rateId,
                    "serviceId": this.serviceId,
                }
                self.$http.put(self.$store.getters.loyaltyUrl + "/loyalty/apelsin-rates/update", putData)
                    .then((response) => {
                        // console.log(response.data.data)
                        self.editDialog = false;
                        self.getApelsinRates(1);
                        
                    }, self.handleError);
            }
            else{
                this.errorMessage('Ошибка')
            }
        },
        deleteRate(){
            let self = this;
            self.$http.delete(self.$store.getters.loyaltyUrl + '/loyalty/apelsin-rates/delete/' + self.rateId)
            .then((response) => {
                self.getApelsinRates(1);
                self.deleteDialog = false;
            }, self.handleError);
        },
        openRemoveBox(item){
            this.deleteDialog = true;
            this.rateId = item.rate_id;
        },
        addApelsinRates(){
            if(this.serviceId&&this.pricePerApelsin&&this.levelId){
                let self = this;
                var postData = {
                    "active": this.active,
                    "currency": this.currency,
                    "levelId": this.levelId,
                    "pricePerApelsin": this.pricePerApelsin*100,
                    "rateId": 0,
                    "serviceId": this.serviceId,
                }
                self.$http.post(self.$store.getters.loyaltyUrl + "/loyalty/apelsin-rates/add", postData)
                    .then((response) => {
                        // console.log(response.data.data)
                        self.addDialog = false;
                        self.getApelsinRates(1);
                        
                    }, self.handleError);
            }
            else{
                this.errorMessage('Ошибка')
            }
        },
        getApelsinRates(page){
            let self = this;
            this.page = page;
            this.ratesData = [];
            self.$http.get(self.$store.getters.loyaltyUrl + "/loyalty/apelsin-rates/get/paged/rates", {
                params:{
                    page: page-1,
                    size: 10,
                }
            })
            .then((response) => {
                console.log(response.data.data)
                self.ratesData = response.data.data.content;
                if(page===1){
                    self.totalPages = response.data.data.totalPages;
                }
            }, self.handleError);
        },
        getLoyaltyServices(){
            this.loyaltyServicesData = [];
            let self = this;
            self.$http.get(self.$store.getters.loyaltyUrl + "/loyalty/service-providers/get/loyalty-services")
                .then((response) => {
                    response.data.data.forEach(x => {
                        self.loyaltyServicesData.push({serviceId: x.id, name: x.serviceNameRu});
                    });
                    console.log(self.loyaltyServicesData);

                }, self.handleError);
        },
        getLevels(){
            this.loyaltyLevelsData = [];
            let self = this;
            self.$http.get(self.$store.getters.loyaltyUrl + "/loyalty/levels/get/all")
                .then((response) => {
                    response.data.data.forEach(x => {
                        self.loyaltyLevelsData.push({id: x.id, name: x.levelName});
                    });
                    console.log(self.loyaltyLevelsData)

                }, self.handleError);
        }
    },
    mounted(){
        this.getLoyaltyServices();
        this.getLevels();
        this.getApelsinRates(1);
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
        font-size: 21px !important;
        padding: 9px 25px;
        display: flex;
        font-weight: 600;
    }
    .center{
        margin: 10px;
        display: flex;
        justify-content: center;
    }
</style>