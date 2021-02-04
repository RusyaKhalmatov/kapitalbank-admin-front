<template>
    <div class="main">
        <h1 class="header">Банковские услуги</h1>
        <v-btn @click="addDialog=true">Добавить</v-btn>
            <v-card v-if="bankServicesData.length!=0">
                <v-data-table                    
                    :headers="headers"
                    :items="bankServicesData"
                    :pagination.sync="pagination"
                    hide-actions
                >
                    <template slot="items" slot-scope="props">
                        <tr>
                            <td @click="getBankServices(1)">{{props.item.bankServiceId}}</td>
                            <td @click="getBankServices(1)">{{props.item.categoryName}}</td>
                            <td @click="getBankServices(1)">{{props.item.cardProductName}}</td>
                            <td @click="getBankServices(1)">{{props.item.cardTypeName}}</td>
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
                            label="Категория сервиса" 
                            v-model="categoryId"
                            :items="categoryData"
                            item-text="categoryNameRu"
                            item-value="id"
                        ></v-select>  
                        <v-select 
                            label="Карта продукта" 
                            v-model="cardProductId"
                            :items="cardProductData"
                            item-text="name"
                            item-value="id"

                        ></v-select>           
                    
                    </v-container>
            
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="createBankService">Сохранить</v-btn>
                <v-btn text @click="addDialog = false">Отмена</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="editDialog" persistent max-width="600px">
            <v-card>              
                <span class="head-text">Изменение</span>            
                    <v-container>       
                        <v-select 
                            label="Категория сервиса" 
                            v-model="categoryId"
                            :items="categoryData"
                            item-text="categoryNameRu"
                            item-value="id"
                        ></v-select>  
                        <v-select 
                            label="Карта продукта" 
                            v-model="cardProductId"
                            :items="cardProductData"
                            item-text="name"
                            item-value="id"

                        ></v-select>           
                    
                    </v-container>
            
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="updateBankService">Сохранить</v-btn>
                <v-btn text @click="editDialog = false">Отмена</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="deleteDialog" persistent max-width="290">
            <v-card>
                <v-card-title class="headline">Вы действительно хотите удалить?</v-card-title>
                <v-card-actions style="text-align: center">
                <v-spacer></v-spacer>
                <v-btn  text @click="deleteBankService">Да</v-btn>
                <v-btn  text @click="deleteDialog = false">Нет</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
export default {
    name: 'LoyaltyBankServices',
    data(){
        return {
            bankServicesData: [],
            totalPages: '',
            page: 1,
            addDialog: false,
            deleteDialog: false,
            editDialog: false,
            cardProductId: '',
            cardProductData: [],
            categoryId: '',
            categoryData: [],
            bankServiceId: 0,
            headers:[
                {text: "ID", value: "bankServiceId", sortable: false},
                {text: "Название категории", value: "categoryName",sortable: false},
                {text: "Название карты продукта", value: "cardProductName",sortable: false},
                {text: "Тип карты продукта", value: "cardTypeName",sortable: false},
                {text: "Действия", value: "",sortable: false},

            ],
            pagination: {
                rowsPerPage: 10
            },

        }
    },
    watch:{
        page(val){
            this.getBankServices(val);
        },
        addDialog(val){
            if(!val){
                this.categoryId = '';
                this.cardProductId = '';
            }
        },
        deleteDialog(val){
            if(!val){
                this.bankServiceId = '';                
            }
        },
        editDialog(val){
            if(!val){
                this.cardProductId = '';
                this.categoryId = '';
                this.bankServiceId = 0;
            }
        }
    },
    methods:{
        updateBankService(){
            var putData = {
                "bankServiceId": this.bankServiceId,
                "cardProductId": this.cardProductId,
                "categoryId": this.categoryId
            }
            let self = this;
            self.$http.put(self.$store.getters.loyaltyUrl + "/loyalty/bank-services/update", putData)
                .then((response) => {
                    self.editDialog = false;
                    self.getBankServices(1);
                }, self.handleError);
        },
        openEditBox(item){

            this.bankServiceId = item.bankServiceId;
            this.categoryId = item.categoryId;
            this.cardProductId = item.cardProductId;
            this.editDialog = true;
        },
        openRemoveBox(item){
            this.deleteDialog = true;
            this.bankServiceId = item.bankServiceId
        },
        deleteBankService(){
            let self = this;
            self.$http.delete(self.$store.getters.loyaltyUrl + `/loyalty/bank-services/delete/${this.bankServiceId}`)
                .then((response) => {
                    self.deleteDialog = false;
                    self.getBankServices(self.page);
                }, self.handleError);
        },
        createBankService(){
            var postData = {
                "bankServiceId": 0,
                "cardProductId": this.cardProductId,
                "categoryId": this.categoryId
            }
            console.log(postData)
            let self = this;
            self.$http.post(self.$store.getters.loyaltyUrl + "/loyalty/bank-services/add", postData)
                .then((response) => {
                    self.addDialog = false;
                    self.getBankServices(1);
                }, self.handleError);
        },
        getBankServices(page){
            let self = this;
            this.page = page;
            this.bankServicesData = [];
            self.$http.get(self.$store.getters.loyaltyUrl + "/loyalty/bank-services/get/all-paged", {
                params:{
                    page: page-1,
                    size: 10,
                }
            })
                .then((response) => {
                    console.log(response.data.data)
                    self.bankServicesData = response.data.data.content;
                    if(page===1){
                        self.totalPages = response.data.data.totalPages;
                    }
                }, self.handleError);
        },
        getAllCategories(){
            let self = this;
            self.$http.get(self.$store.getters.loyaltyUrl + "/loyalty/service-category/get/all")
                .then((response) => {
                    console.log(response.data.data)
                    self.categoryData = response.data.data;
                
                }, self.handleError);
        },
        getAllCardProducts(){
            let self = this;
            self.$http.get(self.$store.getters.newApiUrl + "/card-product/all")
                .then((response) => {
                    console.log(response.data.data)
                    self.cardProductData = response.data.data;
                
                }, self.handleError);
        }
    },
    mounted(){
        this.getAllCategories();
        this.getAllCardProducts();
        this.getBankServices(1);
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