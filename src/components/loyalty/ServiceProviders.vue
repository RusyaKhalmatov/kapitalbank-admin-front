<template>
    <div class="main">
        <h1 class="header">Поставщики услуг</h1>
        <v-btn @click="addDialog=true">Добавить</v-btn>
        <div class="loyalty-service-box">
            <v-card v-if="loyaltyServicesData.length!=0">
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
                    :items="loyaltyServicesData"
                    :search="search" 
                    :pagination.sync="pagination"
                >
                    <template slot="items" slot-scope="props">
                                <tr>
                                    <td>{{props.item.serviceId}}</td>
                                    <td>{{props.item.serviceCategory.categoryNameRu}} - {{props.item.serviceNameRu}}</td>
                                    <!-- <td><img class="service-loyalty-logo" :src="props.item.logoUrl" alt="logo"></td> -->
                                    <td>{{props.item.serviceEndpoint}}</td>
                                    <td>{{props.item.usesLoyalty | checkStatus}}</td>
                                    <td>{{props.item.usesPromoCode | checkStatus}}</td>
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
        </div>
        <v-dialog v-model="addDialog" persistent max-width="600px">
            <v-card>
                
                <span class="head-text">Добавление</span>
                <p class="service-header">Выберите сервис:</p>
                <div class="content">
                    <!-- <div class="content-header">
                        <p class="content-header-text none-border mdwidth">ID сервиса</p>
                        <p class="content-header-text none-border">Название сервиса</p>
                    </div> -->
                    <v-text-field class="search-service" label="Поиск" v-model="searchService"></v-text-field>
                    <div class="content-box" @scroll="scrollFunc">
                        <div :class="['box', {'active-class': active===item.serviceId}]" v-for="(item,index) in serviceProvidersData" :key="index" @click="setActiveService(item)">
                            <!-- <p class="content-header-text left-brd mdwidth">{{item.serviceId}}</p> -->
                            <p class="content-header-text">{{item.serviceCategory.categoryNameRu}} - {{item.serviceNameRu}}</p>
                        </div>
                    </div>
                </div>
                <p class="service-header" v-if="serviceName">Cервис: {{serviceName}}</p>            
                    <v-container>                                            
                        <v-text-field label="EndPoint сервиса" v-model="serviceEndpoint" required></v-text-field>                        
                        <v-checkbox v-model="usesLoyalty" label="Лояльность"></v-checkbox>
                        <v-checkbox v-model="usesPromoCode" label="Промокод"></v-checkbox>                                       
                    </v-container>
            
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="addServiceProvider">Сохранить</v-btn>
                <v-btn text @click="addDialog = false">Отмена</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="editDialog" persistent max-width="600px">
            <v-card>
                
                <span class="head-text">Изменение</span>
                <p class="service-header">Выберите сервис:</p>
                <div class="content">
                    <!-- <div class="content-header">
                        <p class="content-header-text none-border mdwidth">ID сервиса</p>
                        <p class="content-header-text none-border">Название сервиса</p>
                    </div> -->
                    <v-text-field class="search-service" label="Поиск" v-model="searchService"></v-text-field>
                    <div class="content-edit-box" @scroll="scrollEditFunc">
                        <div :class="['box', {'active-class': active===item.serviceId}]" v-for="(item,index) in serviceProvidersData" :key="index" @click="setActiveService(item)">
                            <!-- <p class="content-header-text left-brd mdwidth">{{item.serviceId}}</p> -->
                            <p class="content-header-text">{{item.serviceCategory.categoryNameRu}} - {{item.serviceNameRu}}</p>
                        </div>
                    </div>
                </div>
                <p class="service-header" v-if="serviceName">Cервис: {{serviceName}}</p>
            
                    <v-container>                                            
                        <v-text-field label="EndPoint сервиса" v-model="serviceEndpoint" required></v-text-field>                        
                        <v-checkbox v-model="usesLoyalty" label="Лояльность"></v-checkbox>
                        <v-checkbox v-model="usesPromoCode" label="Промокод"></v-checkbox>                                       

                    </v-container>
            
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="editServiceProvider">Сохранить</v-btn>
                <v-btn text @click="editDialog = false">Отмена</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="deleteDialog" persistent max-width="290">
            <v-card>
                <v-card-title class="headline">Вы действительно хотите удалить?</v-card-title>
                <v-card-actions style="text-align: center">
                <v-spacer></v-spacer>
                <v-btn  text @click="deleteServiceProvider">Да</v-btn>
                <v-btn  text @click="deleteDialog = false">Нет</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    name: 'ServiceProviders',
    data(){
        return {
            headers:[
                {text: "ID сервиса", value: "serviceId", sortable: false},
                {text: "Название", value: "serviceNameRu",sortable: false},
                // {text: "Логотип", value: "logoUrl",sortable: false},
                {text: "EndPoint сервиса", value: "serviceEndpoint",sortable: false},
                {text: "Лояльность", value: "usesLoyalty",sortable: false},
                {text: "Промокод", value: "usesPromoCode",sortable: false},
                {text: "Действия", value: "",sortable: false},

            ],
            serviceCategoryData: [],
            serviceProvidersCount: '',
            serviceProvidersData: [],
            curPage: 0,
            addDialog: false,
            deleteDialog: false,
            editDialog: false,
            serviceEndpoint: '',
            usesLoyalty: false,
            usesPromoCode: false,
            serviceId: '',
            active: '',
            loyaltyServicesData: [],
            serviceName: '',
            search: '',
            pagination: {
                rowsPerPage: 10
            },
            id: '',
            searchService: '',

        }
    },
    filters:{
        checkStatus(val){
            if(val){
                return 'Да'
            }
            else{
                return 'Нет'
            }
        }
    },
    watch:{
        addDialog(val){
            if(!val){
                this.serviceEndpoint = '';
                this.usesLoyalty = false;
                this.usesPromoCode = false;
                this.serviceId = '';
                this.active = '';
                this.serviceName = '';
                this.searchService = '';
            }
        },
        editDialog(val){
            if(!val){
                this.serviceEndpoint = '';
                this.usesLoyalty = false;
                this.usesPromoCode = false;
                this.serviceId = '';
                this.active = '';
                this.serviceName = '';
                this.id = '';
                this.searchService = '';

            }
        },
        deleteDialog(val){
            if(!val){
                this.serviceId = '';
            }
        },
        searchService(val){
            if(val.length>2){
                this.searchServiceProviders(0, val);
            }
            else if(!val){
                this.getAllServiceProviders(0);
            }
        }

    },
    methods:{
        searchServiceProviders(skip, val){            
            let self = this;
            if(skip===0){
                self.serviceProvidersData = [];
                self.curPage = 0;
                self.serviceProvidersCount = '';
            }
            self.$http.get(self.$store.getters.loyaltyUrl + "/loyalty/service-providers/get/by/service-name?skip="+skip+"&take=50&serviceName="+val)
            .then((response) => {
                // self.getLoyaltyServices();
                self.serviceProvidersCount = response.data.data.count;
                response.data.data.response.forEach((x)=>{
                    self.serviceProvidersData.push(x);
                })
                self.deleteDialog = false;
            }, self.handleError);
        }, 
        openEditBox(item){
                this.editDialog = true;
                this.serviceEndpoint = item.serviceEndpoint;
                this.usesLoyalty = item.usesLoyalty;
                this.usesPromoCode = item.usesPromoCode;
                this.serviceId = item.serviceId;
                this.active = item.serviceId;
                this.serviceName = item.serviceCategory.categoryNameRu + ' - ' + item.serviceNameRu;
                this.id = item.id;
        },  
        deleteServiceProvider(){
            let self = this;
            self.$http.delete(self.$store.getters.loyaltyUrl + `/loyalty/service-providers/delete/${this.serviceId}`)
            .then((response) => {
                console.log(response.data.data);
                // self.getLoyaltyServices();
                let item = self.loyaltyServicesData.find(x=> x.id===self.serviceId);
                self.loyaltyServicesData.splice(self.loyaltyServicesData.indexOf(item),1);
                console.log(item);
                self.deleteDialog = false;
            }, self.handleError);
        },
        openRemoveBox(item){
            this.serviceId = item.id;
            this.deleteDialog = true;
        },  
        setActiveService(val){
            this.active = val.serviceId;
            this.serviceId = val.id;
            this.serviceName = val.serviceCategory.categoryNameRu + ' - ' + val.serviceNameRu;
        },
        scrollEditFunc(){
            if (document.querySelector(".content-edit-box")) {
                const elem = document.querySelector(".content-edit-box"); // overflow-qoygan class
                // elem.scrollTop = elem.scrollHeight;
                if(elem){                    
                    var contentPos = elem.scrollHeight - elem.scrollTop;
                    var contentHeight = elem.clientHeight;
                    console.log('\n\n*****************************************')
                    console.log(contentPos, ' - ', contentHeight)
                    // console.log( elem.scrollHeight - contentHeight)
                    console.log('*****************************************\n\n')
                    if(contentPos===elem.clientHeight){
                        console.log('test')
                        // if(this.curPage<=this.totalPages){
                        //     this.getArchiveChat(this.curPage);
                        //     this.curPage++;
                        // }
                        if(this.curPage<=this.serviceProvidersCount){
                            if(this.searchService)
                                this.searchServiceProviders(this.curPage+50, this.serviceName)
                            else
                                this.getAllServiceProviders(this.curPage+50);
                            this.curPage += 50;
                        }
                    }
                
                }
            }
        },
        scrollFunc() {
            if (document.querySelector(".content-box")) {
                const elem = document.querySelector(".content-box"); // overflow-qoygan class
                // elem.scrollTop = elem.scrollHeight;
                if(elem){                    
                    var contentPos = elem.scrollHeight - elem.scrollTop;
                    var contentHeight = elem.clientHeight;
                    console.log('\n\n*****************************************')
                    console.log(contentPos, ' - ', contentHeight)
                    // console.log( elem.scrollHeight - contentHeight)
                    console.log('*****************************************\n\n')
                    if(contentPos===elem.clientHeight){
                        console.log('test')
                        // if(this.curPage<=this.totalPages){
                        //     this.getArchiveChat(this.curPage);
                        //     this.curPage++;
                        // }
                        if(this.curPage<=this.serviceProvidersCount){
                            if(this.searchService)
                                this.searchServiceProviders(this.curPage+50, this.serviceName)
                            else
                                this.getAllServiceProviders(this.curPage+50);
                            this.curPage += 50;
                        }
                    }
                
                }
            }
        }, 
        addServiceProvider(){
            let self = this;
            var postData = {
                "serviceEndpoint": this.serviceEndpoint,
                "serviceId": this.serviceId,
                "usesLoyalty": this.usesLoyalty,
                "usesPromoCode": this.usesPromoCode
            }
            self.$http.post(self.$store.getters.loyaltyUrl + "/loyalty/service-providers/add", postData)
                .then((response) => {
                    console.log(response.data.data);
                    self.getLoyaltyServices();
                    self.addDialog = false;
                }, self.handleError);
        },
        editServiceProvider(){
            let self = this;
            var putData = {
                "serviceEndpoint": this.serviceEndpoint,
                "serviceId": this.serviceId,
                "usesLoyalty": this.usesLoyalty,
                "usesPromoCode": this.usesPromoCode,
                "id": this.id
            }
            self.$http.put(self.$store.getters.loyaltyUrl + "/loyalty/service-providers/update", putData)
                .then((response) => {
                    console.log(response.data.data);
                    self.getLoyaltyServices();
                    self.editDialog = false;
                }, self.handleError);
        },
        getAllServiceProviders(skip){
            let self = this;
            if(skip===0){
                self.serviceProvidersData = [];
                self.serviceProvidersCount = '';
            }
            self.$http.get(self.$store.getters.loyaltyUrl + "/loyalty/service-providers/get/all?skip="+skip+'&take=50')
                .then((response) => {
                    console.log(response.data.data);
                    self.serviceProvidersCount = response.data.data.count;
                    response.data.data.response.forEach((x)=>{
                        self.serviceProvidersData.push(x);
                    })
                    
                }, self.handleError);
        },
        getUsesPromo(){
            let self = this;
            self.$http.get(self.$store.getters.loyaltyUrl + "/loyalty/service-providers/get/loyalty-services/uses-promo")
                .then((response) => {
                    console.log(response.data.data);
                }, self.handleError);
        },
        getServiceCategory(){
            let self = this;
            self.$http.get(self.$store.getters.loyaltyUrl + "/loyalty/service-category/get/all")
                .then((response) => {
                    self.serviceCategoryData = response.data.data;
                    
                }, self.handleError);
        },
        getLoyaltyServices(){
            this.loyaltyServicesData = [];
            let self = this;
            self.$http.get(self.$store.getters.loyaltyUrl + "/loyalty/service-providers/get/loyalty-services")
                .then((response) => {
                    console.log(response.data.data)
                    self.loyaltyServicesData = response.data.data;
                }, self.handleError);
        }
    },
    mounted(){
        this.getLoyaltyServices();
        this.getServiceCategory();
        this.getAllServiceProviders(0);
        this.getUsesPromo();
    }
}
</script>

<style scoped>
    .search-service{
        margin: 0 27px;
    }
    .header{
        text-align: center;
    }
    .main{
        width: 100%;
    }
    .content{
        width: 100%;
    }
    .content-header{
        display: flex;
        background: #f8ca02;
        padding-right: 17px;
    }
    .left-brd{
        border-left: 1px solid silver;
    }
    .service-loyalty-logo{
        width: 50px;
        height: 50px;
    }
    .content-header-text{
        padding: 10px;
        width: 100%;
        border-right: 1px solid silver;
        border-bottom: 1px solid silver;
        text-align: center;
        margin: 0;
    }
    .content-box{
        height: 175px;
        overflow: auto;
    }
    .content-edit-box{
        height: 175px;
        overflow: auto;
    }
    .box{
        display: flex;
    }
    .box:hover{
        background: silver;
        /* border-radius: 10px; */
        padding: 3px 10px;
        cursor: pointer;
    }
    .active-class{
        background: silver;
        /* border-radius: 10px; */
        padding: 3px 10px;
    }
    .none-border{
        border: 0 !important;
    }
    .head-text{
        font-size: 21px !important;
        padding: 9px 25px;
        display: flex;
        font-weight: 600;
    }
    .service-header{
        padding: 10px 25px 5px;
        margin: 0;
    }
    ::-webkit-scrollbar {
        -webkit-appearance: none;
        width: 5px;
        background: #eaeaea;
    }

    ::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background-color: rgba(0, 0, 0, 0.5);
        -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
        box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
    }
    .mdwidth{
        width: 115px !important;
    }
</style>