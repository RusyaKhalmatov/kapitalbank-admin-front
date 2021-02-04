<template>
    <div class="main">
        <h1 class="header">Тарифы и Промокоды</h1>
        <v-btn @click="addDialog=true">Добавить</v-btn>
        <v-card v-if="tariffsData.length!=0">
            <v-data-table                    
                :headers="headers"
                :items="tariffsData"
                :pagination.sync="pagination"
                hide-actions
            >
                <template slot="items" slot-scope="props">
                    <tr @click="props.expanded = !props.expanded">
                        <td @click="getPromoCodesByTariffId(props.item.id, 1)">{{props.item.id}}</td>
                        <td v-if="props.item.service" @click="getPromoCodesByTariffId(props.item.id, 1)">{{props.item.service.serviceCategory.categoryNameRu}} - {{props.item.service.serviceNameRu}}</td>
                        <td v-else @click="getPromoCodesByTariffId(props.item.id, 1)">{{getBankServiceName(props.item.bankServiceId)}}</td>

                        <td @click="getPromoCodesByTariffId(props.item.id, 1)">{{props.item.measurementUnit.measurementUnitRu}} - {{props.item.measurementUnit.measurementUnitUz}} - {{props.item.measurementUnit.measurementUnitEn}}</td>
                        <td @click="getPromoCodesByTariffId(props.item.id, 1)">{{props.item.tariffNameRu}}</td>
                        <td @click="getPromoCodesByTariffId(props.item.id, 1)">{{props.item.tariffName }}</td>
                        <!-- <td @click="getPromoCodesByTariffId(props.item.id, 1)">{{props.item.tariffNameEn }}</td> -->
                        <td @click="getPromoCodesByTariffId(props.item.id, 1)">{{props.item.amount }}</td>
                        <td @click="getPromoCodesByTariffId(props.item.id, 1)">{{props.item.priceInApelsin }}</td>
                        <td @click="getPromoCodesByTariffId(props.item.id, 1)"><img class="tariff-image-url" :src="props.item.imageUrl" alt="imageUrl"></td>


                        <td @click="getPromoCodesByTariffId(props.item.id, 1)">{{props.item.active | checkStatus}}</td>
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
                <template slot="expand" slot-scope="props">
                    <v-card flat>
                        <v-card-text>
                            <v-layout row wrap>
                                <v-flex xs12>
                                    <p class="upload-header-text">Загрузить промокоды</p>                                    
                                </v-flex>
                                <span>
                                    <input class="input-file" type="file" @change="onFileChange($event)" ref="fileupload">      
                                    <v-btn @click="uploadPromoCodes">Загрузить</v-btn>  
                                </span>
                            </v-layout>
                        </v-card-text>
                        <v-card-text>
                            <template v-if="promoCodesData.length!=0">
                                <div style="display: flex; align-items: center"> 
                                    <p class="mb-0 upload-header-text">Промокоды</p>   
                                    <v-btn @click="disablePromoCodes" small depressed>Отключить промокоды</v-btn>
                                </div>                                
                                <div class="content-box" @scroll="scrollFunc">
                                    <div class="box" v-for="(item,index) in promoCodesData" :key="index">
                                        <p class="box-text">{{item.promoCode}}</p>
                                        <p class="box-text">{{item.used | checkPromoCode}}</p>

                                    </div>
                                </div>      
                            </template>                                          
                        </v-card-text>
                    </v-card>
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
                            label="Банковские услуги" 
                            v-model="bankServiceId"
                            :items="bankServicesData"
                            item-text="name"
                            item-value="bankServiceId"
                        ></v-select> 
                        <v-select 
                            label="Единицы измерения" 
                            v-model="measurementUnitId"
                            :items="measurementUnitsData"
                            item-text="name"
                            item-value="id"

                        ></v-select>       
                        <p class="tariff-text">Изображение:</p>
                        <img class="image-preview" v-if="imagePreview" :src="imagePreview" alt="image">
                        <input class="input-file" type="file" @change="onTariffFileChange($event)" ref="fileAddUpload">      

                        <v-text-field label="Количество выбранной единицы измерения" v-model="amount" required></v-text-field>    
                        <v-text-field type="number" label="Количество апельсинов" v-model="priceInApelsin" required></v-text-field>      
                        
                        <v-text-field label="Название тарифа (Ru)" v-model="tariffNameRu" required></v-text-field>                          
                            <p class="tariff-text">Описание (Ru)</p>
                            <quill-editor v-if="addDialog" v-model="descriptionRu"/>                 
                        <!-- <v-textarea
                        label="Описание (Ru)"
                        v-model="descriptionRu"
                        ></v-textarea>  -->

                        <v-text-field label="Название тарифа (Uz)" v-model="tariffName" required></v-text-field>      
                        <v-flex xs12 class="quill-container pb-3">
                            <p class="tariff-text">Описание (Uz)</p>
                            <quill-editor v-if="addDialog" v-model="description"/>
                        </v-flex>
                        <!-- <v-textarea
                        label="Описание (Uz)"
                        v-model="description"
                        ></v-textarea> -->

                        <v-text-field label="Название тарифа (En)" v-model="tariffNameEn" required></v-text-field>     
                        <v-flex xs12 class="quill-container pb-3">
                            <p class="tariff-text">Описание (En)</p>
                            <quill-editor v-if="addDialog" v-model="descriptionEn"/>
                        </v-flex> 
                        <!-- <v-textarea
                        label="Описание (En)"
                        v-model="descriptionEn"
                        ></v-textarea> -->
                        <!-- <v-select 
                            label="Порядок" 
                            v-model="order"
                            :items="orderData"
                        ></v-select>   -->
                        <v-text-field label="Порядок" v-model="order" required></v-text-field>
                        <v-checkbox
                            v-model="advert"
                            label="Для объявления"
                        >                        
                        </v-checkbox> 
                        <v-checkbox
                            v-model="active"
                            label="Активный"
                        >                    
                        </v-checkbox> 
                        <v-checkbox
                            v-model="special"
                            label="Для специальных клиентов"
                        ></v-checkbox>
                        <v-text-field v-if="special" label="Код сервиса для специальных клиентов" v-model="specialDetails" required></v-text-field>
                        <!-- <v-select v-model="categoryId" :items="categoryData" item-text="categoryNameRu" item-value="id" label="Категория лояльности"></v-select>  -->
                        <v-text-field label="ID категория лояльности" v-model="categoryId" required></v-text-field>

                        <p class="tariff-text">Логотип провайдера:</p>
                        <img class="image-preview" v-if="providerPreview" :src="providerPreview" alt="image">
                        <input class="input-file" type="file" @change="onProviderFileChange($event)" ref="fileProviderUpload"> 
                        <v-text-field label="Название провайдера (Ru)" v-model="providerNameRu" required></v-text-field>
                        <v-text-field label="Название провайдера (Uz)" v-model="providerNameUz" required></v-text-field>
                        <v-text-field label="Название провайдера (En)" v-model="providerNameEn" required></v-text-field>
                    </v-container>            
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="createTariff">Сохранить</v-btn>
                <v-btn text @click="addDialog = false">Отмена</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="editDialog" persistent max-width="600px">
            <v-card>
                
                <span class="head-text">Изменение</span>            
                    <v-container>       
                        <v-select 
                            label="Поставщик услуг" 
                            v-model="serviceId"
                            :items="loyaltyServicesData"
                            item-text="name"
                            item-value="serviceId"
                        ></v-select>  
                        <v-select 
                            label="Банковские услуги" 
                            v-model="bankServiceId"
                            :items="bankServicesData"
                            item-text="name"
                            item-value="bankServiceId"
                        ></v-select> 
                        <v-select 
                            label="Единицы измерения" 
                            v-model="measurementUnitId"
                            :items="measurementUnitsData"
                            item-text="name"
                            item-value="id"

                        ></v-select>  
                        <p class="tariff-text">Изображение:</p>
                        <img class="image-preview" :src="imagePreview" alt="image">
                        <input class="input-file" type="file" @change="onTariffFileChange($event)" ref="fileEditUpload">               
                        <v-text-field label="Количество выбранной единицы измерения" v-model="amount" required></v-text-field>    
                        <v-text-field type="number" label="Количество апельсинов" v-model="priceInApelsin" required></v-text-field>      
                        
                        <v-text-field label="Название тарифа (Ru)" v-model="tariffNameRu" required></v-text-field> 
                        <v-flex xs12 class="quill-container pb-3">
                            <p class="tariff-text">Описание (Ru)</p>
                            <quill-editor v-if="editDialog" v-model="descriptionRu"/>
                        </v-flex>     
                        <!-- <v-textarea
                        label="Описание (Ru)"
                        v-model="descriptionRu"
                        ></v-textarea>  -->

                        <v-text-field label="Название тарифа (Uz)" v-model="tariffName" required></v-text-field>  
                        <v-flex xs12 class="quill-container pb-3">
                            <p class="tariff-text">Описание (Uz)</p>
                            <quill-editor v-if="editDialog" v-model="description"/>
                        </v-flex> 
                        <!-- <v-textarea
                        label="Описание (Uz)"
                        v-model="description"
                        ></v-textarea> -->

                        <v-text-field label="Название тарифа (En)" v-model="tariffNameEn" required></v-text-field>      
                        <v-flex xs12 class="quill-container pb-3">
                            <p class="tariff-text">Описание (En)</p>
                            <quill-editor v-if="editDialog" v-model="descriptionEn"/>
                        </v-flex> 
                        <!-- <v-textarea
                        label="Описание (En)"
                        v-model="descriptionEn"
                        ></v-textarea> -->
                        
                        <p class="tariff-text">Текущий порядок: {{order}}</p>
                        <!-- <v-select 
                            label="Порядок" 
                            v-model="order"
                            :items="orderData"
                        ></v-select>  -->
                        <v-text-field label="Порядок" v-model="order" required></v-text-field>
                        <v-checkbox
                            v-model="advert"
                            label="Для объявления"
                        >                        
                        </v-checkbox> 
                        <v-checkbox
                            v-model="active"
                            label="Активный"
                        >                        
                        </v-checkbox> 
                        <v-checkbox
                            v-model="special"
                            label="Для специальных клиентов"
                        ></v-checkbox>
                        <v-text-field v-if="special" label="Код сервиса для специальных клиентов" v-model="specialDetails" required></v-text-field>
                        <!-- <v-select v-model="categoryId" :items="categoryData" item-text="categoryNameRu" item-value="id" label="Категория лояльности"></v-select>  -->
                        <v-text-field label="ID категория лояльности" v-model="categoryId" required></v-text-field>

                        <div v-if="categoryId">

                        </div>
                        <p class="tariff-text">Логотип провайдера:</p>
                        <img class="image-preview" v-if="providerPreview" :src="providerPreview" alt="image">
                        <input class="input-file" type="file" @change="onProviderFileChange($event)" ref="fileProviderUpload"> 
                        <v-text-field label="Название провайдера (Ru)" v-model="providerNameRu" required></v-text-field>
                        <v-text-field label="Название провайдера (Uz)" v-model="providerNameUz" required></v-text-field>
                        <v-text-field label="Название провайдера (En)" v-model="providerNameEn" required></v-text-field>
                    </v-container>
            
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="editTariff">Сохранить</v-btn>
                <v-btn text @click="editDialog = false">Отмена</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="deleteDialog" persistent max-width="290">
            <v-card>
                <v-card-title class="headline">Вы действительно хотите удалить?</v-card-title>
                <v-card-actions style="text-align: center">
                <v-spacer></v-spacer>
                <v-btn  text @click="deleteTariff">Да</v-btn>
                <v-btn  text @click="deleteDialog = false">Нет</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    name: 'Tariffs',
    data(){
        return {

            tariffsData: [],
            totalPages: '',
            loyaltyServicesData: [],
            measurementUnitsData: [],
            serviceId: '',
            measurementUnitId: '',
            addDialog: false,
            deleteDialog: false,
            editDialog: false,
            amount: '',
            active: true,
            description: "",
            descriptionEn: "",
            descriptionRu: "",
            id: 0,
            priceInApelsin: "",
            serviceId: 0,
            tariffName: "",
            tariffNameEn: "",
            tariffNameRu: "",
            page: 1,
            pagination: {
                rowsPerPage: 10
            },
            headers:[
                {text: "ID", value: "id", sortable: false},
                {text: "Название сервиса", value: "service.serviceNameRu",sortable: false},
                {text: "Единица измерения", value: "",sortable: false},
                {text: "Название тарифа (Ru)", value: "tariffNameRu",sortable: false},
                {text: "Название тарифа (Uz)", value: "tariffName",sortable: false},
                // {text: "Название тарифа (En)", value: "measurementUnitEn",sortable: false},
                {text: "Кол-во единицы измерения", value: "amount",sortable: false},
                {text: "Кол-во апельсинов", value: "priceInApelsin",sortable: false},
                {text: "Изображение тарифа", value: "imageUrl",sortable: false},
                {text: "Cтатус", value: "active",sortable: false},

                {text: "Действия", value: "",sortable: false},

            ],
            promoCodesTotalPages: '',
            promoCodesData: [],
            file: '',
            tariffId: '',
            curPage: 2,
            tariffFile: '',
            imagePreview:'',
            isChange: false,
            advert: false,
            orderData: [],
            order: '',
            bankServicesData: [],
            bankServiceId: '',
            categoryData: [],
            special: false,
            specialDetails: '',
            categoryId: '',
            providerPreview: '',
            providerFile: '',
            providerNameRu: '',
            providerNameUz: '',
            providerNameEn: '',
            isProviderChange: false,
        }
    },
    watch:{
        addDialog(val){
            if(!val){
                this.serviceId = '';
                this.measurementUnitId = '';
                this.amount = '';
                this.active = true;
                this.description = '';
                this.descriptionEn = '';
                this.descriptionRu = '';
                this.measurementUnitId = '';
                this.priceInApelsin = '';
                this.serviceId = '';
                this.tariffName = '';
                this.tariffNameEn = '';
                this.tariffNameRu = '';
                this.$refs.fileAddUpload.value = null;
                this.$refs.fileProviderUpload.value = null;
                this.providerFile = '';
                this.tariffFile = '';
                this.advert = false;
                this.order = '';
                this.bankServiceId = '';

            }
        },
        editDialog(val){
            if(!val){
                this.serviceId = '';
                this.measurementUnitId = '';
                this.amount = '';
                this.active = true;
                this.description = '';
                this.descriptionEn = '';
                this.descriptionRu = '';
                this.measurementUnitId = '';
                this.priceInApelsin = '';
                this.serviceId = '';
                this.tariffName = '';
                this.tariffNameEn = '';
                this.tariffNameRu = '';
                this.id = '';
                if(this.isChange)
                    this.$refs.fileEditUpload.value = null;
                this.tariffFile = '';
                this.imagePreview = '';
                if(this.isProviderChange)
                    this.$refs.fileProviderUpload.value = null;
                this.isChange = false;
                this.advert = false;
                this.order = '';
                this.bankServiceId = '';
                this.isProviderChange = false;


            }
        },
        deleteDialog(val){
            if(!val){
                this.id = '';
            }
        },
        page(val){
            //console.log(val)
            this.getTariffs(val);
        },
        serviceId(val){
            if(val){
                this.bankServiceId = '';
            }
        },
        bankServiceId(val){
            if(val){
                this.serviceId = '';
            }
        },
        providerFile(val){
            if(!val){
                this.providerPreview = '';
            }
        },

    
    },
    filters:{
        checkStatus(val){
            if(val){
                return 'Активный'
            }
            else{
                return 'Неактивный'
            }
        },
        checkPromoCode(val){
            if(val){
                return "Использован"
            }
            else{
                return "Не использован"
            }
        }
    },
    methods:{
        scrollFunc() {
            if (document.querySelector(".content-box")) {
                const elem = document.querySelector(".content-box"); // overflow-qoygan class
                // elem.scrollTop = elem.scrollHeight;
                if(elem){                    
                    var contentPos = elem.scrollHeight - elem.scrollTop;
                    var contentHeight = elem.clientHeight;
                    //console.log('\n\n*****************************************')
                    //console.log(contentPos, ' - ', contentHeight)
                    // //console.log( elem.scrollHeight - contentHeight)
                    //console.log('*****************************************\n\n')
                    if(contentPos===elem.clientHeight){
                        //console.log('test')
                        // if(this.curPage<=this.totalPages){
                        //     this.getArchiveChat(this.curPage);
                        //     this.curPage++;
                        // }
                        if(this.curPage<=this.promoCodesTotalPages+1){
                            this.getPromoCodesByTariffId(this.tariffId, this.curPage)
                            this.curPage++;
                        }
                    }
                
                }
            }
        }, 
        uploadPromoCodes(){
            let self = this;
            let data = new FormData();
            data.append("file", this.file);
            //console.log(data)
            self.$http.put(self.$store.getters.loyaltyUrl + '/loyalty/promo-codes/upload/'+this.tariffId, data,  {headers: {'Content-Type': 'multipart/form-data'}})
			.then((response) => {
                //console.log(response.data.data);
                self.successMessage("Промокоды успешно добавлены");
                setTimeout(() => {
                    self.getPromoCodesByTariffId(self.tariffId, 1)
                }, 1000);
			}, self.handleError);
        },
        onTariffFileChange(e){
            this.tariffFile = e.target.files[0];
            this.imagePreview = URL.createObjectURL(e.target.files[0]);
            this.isChange = true;
        },
        onProviderFileChange(e){
            this.providerFile = e.target.files[0];
            if(this.providerFile){
                this.providerPreview = URL.createObjectURL(e.target.files[0]);
                this.isProviderChange = true;
            }
        },
        onFileChange(e){
            this.file = e.target.files[0];
        },
        disablePromoCodes(){
            this.$http.put(this.$store.getters.loyaltyUrl + `/loyalty/promo-codes/disable/by/${this.tariffId}`)
            .then(() => {
                // console.log(response.data.data);
                this.successMessage("Успешно")
                this.getPromoCodesByTariffId(this.tariffId, 1);
            }, this.handleError);
        },
        getPromoCodesByTariffId(id, page){
            let self = this;
            // self.$refs.fileupload.value = null;
            if(page===1)
                self.promoCodesData = [];

            this.tariffId = id;
            self.$http.get(self.$store.getters.loyaltyUrl + "/loyalty/promo-codes/get/by-tariff/"+ id ,{
                params:{
                    page: page-1,
                    size: 10,
                }
            })
            .then((response) => {
                // self.promoCodesData = response.data.data.content;
                if(page===1){
                    self.promoCodesTotalPages = response.data.data.totalPages;
                    self.curPage = 2;
                }
                response.data.data.content.forEach((x)=>{
                    self.promoCodesData.push(x);
                })
                //console.log(response.data.data);
            }, self.handleError);
        },
        editTariff(){
            console.log((this.serviceId||this.bankServiceId)&&this.tariffName&&this.description)
            console.log(this.serviceId, ' - ', this.bankServiceId,' - ', this.tariffName, ' - ',this.description)

            if((this.serviceId||this.bankServiceId)&&this.tariffName&&this.description){
                let self = this;
                // var putData = {
                //     "active": this.active,
                //     "amount": this.amount,
                //     "description": this.description,
                //     "descriptionEn": this.descriptionEn,
                //     "descriptionRu": this.descriptionRu,
                //     "id": this.id,
                //     "measurementUnitId": this.measurementUnitId,
                //     "priceInApelsin": this.priceInApelsin,
                //     "serviceId": this.serviceId,
                //     "tariffName": this.tariffName,
                //     "tariffNameEn": this.tariffNameEn,
                //     "tariffNameRu": this.tariffNameRu
                // }
                let data = new FormData();
                if(this.isChange)
                    data.append("image", this.tariffFile);
                data.append("active", this.active);
                data.append("amount", this.amount);
                data.append("description", this.description);
                data.append("descriptionEn", this.descriptionEn);
                data.append("descriptionRu", this.descriptionRu);
                data.append("id", this.id);
                data.append("measurementUnitId", this.measurementUnitId);
                data.append("priceInApelsin", this.priceInApelsin);
                if(this.serviceId)
                    data.append("serviceId", this.serviceId);
                if(this.bankServiceId)
                    data.append("bankServiceId", this.bankServiceId);
                data.append("tariffName", this.tariffName);
                data.append("tariffNameEn", this.tariffNameEn);
                data.append("tariffNameRu", this.tariffNameRu);
                data.append("advert", this.advert);
                data.append("orderType", this.order);
                data.append("special", this.special);
                data.append("specialDetails", this.specialDetails);
                data.append("categoryId", this.categoryId);
                data.append("providerNameRu", this.providerNameRu);
                data.append("providerNameUz", this.providerNameUz);
                data.append("providerNameEn", this.providerNameEn);
                if(this.isProviderChange)
                    data.append("providerLogo ", this.providerFile);
                

                self.$http.put(self.$store.getters.loyaltyUrl + "/loyalty/tariffs/edit", data ,  {headers: {'Content-Type': 'multipart/form-data'}})
                    .then((response) => {
                        // //console.log(response.data.data)
                        self.editDialog = false;
                        self.getTariffs(this.page);
                        
                    }, self.handleError);
            }
            else{
                this.errorMessage('Ошибка: Пустые поля')
            }
        },
        openEditBox(item){
            // this.getOrderTypes();
            this.editDialog = true;
            this.active = item.active;
            this.amount = item.amount;
            this.description = item.description;
            this.descriptionEn = item.descriptionEn;
            this.descriptionRu = item.descriptionRu;
            this.id = item.id;
            this.measurementUnitId = item.measurementUnit.id;
            this.priceInApelsin = item.priceInApelsin;
            if(item.service)
                this.serviceId = item.service.id;
            else
                this.serviceId = '';
            if(item.bankServiceId)
                this.bankServiceId = item.bankServiceId;
            else 
                this.bankServiceId = '';
            this.tariffName = item.tariffName;
            this.tariffNameEn = item.tariffNameEn;
            this.tariffNameRu = item.tariffNameRu;
            this.imagePreview = item.imageUrl;
            this.tariffFile = item.imageUrl;
            this.advert = item.advert;
            this.isChange = false;
            this.order = item.orderType;
            this.special = item.special;
            this.specialDetails = item.specialDetails;
            this.categoryId = item.categoryId;
            this.providerNameRu = item.providerNameRu;
            this.providerNameEn = item.providerNameEn;
            this.providerNameUz = item.providerNameUz;
            this.providerFile = item.providerLogoUrl; 
            this.providerPreview = item.providerLogoUrl
        },
        openRemoveBox(item){
            this.deleteDialog = true;
            this.id = item.id;
        },
        deleteTariff(){
            let self = this;
            self.$http.delete(self.$store.getters.loyaltyUrl + '/loyalty/tariffs/delete/' + self.id)
            .then((response) => {
                self.getTariffs(self.page);
                self.deleteDialog = false;
            }, self.handleError);
        },
        createTariff(){
            console.log((this.serviceId||this.bankServiceId)&&this.tariffName&&this.description)
            console.log(this.serviceId, ' - ', this.bankServiceId,' - ', this.tariffName, ' - ',this.description)
            // if((this.serviceId||this.bankServiceId)&&this.tariffName&&this.description&&this.tariffFile){
                let self = this;
                let data = new FormData();
                data.append("image", this.tariffFile);
                // var postData = {
                //     "active": this.active,
                //     "amount": this.amount,
                //     "description": this.description,
                //     "descriptionEn": this.descriptionEn,
                //     "descriptionRu": this.descriptionRu,
                //     "id": 0,
                //     "measurementUnitId": this.measurementUnitId,
                //     "priceInApelsin": this.priceInApelsin,
                //     "serviceId": this.serviceId,
                //     "tariffName": this.tariffName,
                //     "tariffNameEn": this.tariffNameEn,
                //     "tariffNameRu": this.tariffNameRu
                // }
                data.append("active", this.active);
                data.append("amount", this.amount);
                data.append("description", this.description);
                data.append("descriptionEn", this.descriptionEn);
                data.append("descriptionRu", this.descriptionRu);
                data.append("id", 0);
                data.append("measurementUnitId", this.measurementUnitId);
                data.append("priceInApelsin", this.priceInApelsin);
                if(this.serviceId)
                    data.append("serviceId", this.serviceId);
                if(this.bankServiceId)
                    data.append("bankServiceId", this.bankServiceId);
                data.append("tariffName", this.tariffName);
                data.append("tariffNameEn", this.tariffNameEn);
                data.append("tariffNameRu", this.tariffNameRu);
                data.append("advert", this.advert);
                data.append("orderType", this.order);
                data.append("special", this.special);
                data.append("specialDetails", this.specialDetails);
                data.append("categoryId", this.categoryId);
                data.append("providerNameRu", this.providerNameRu);
                data.append("providerNameUz", this.providerNameUz);
                data.append("providerNameEn", this.providerNameEn);
                if(this.isProviderChange)
                    data.append("providerLogo ", this.providerFile);

                self.$http.post(self.$store.getters.loyaltyUrl + "/loyalty/tariffs/add", data,  {headers: {'Content-Type': 'multipart/form-data'}})
                    .then((response) => {
                        // //console.log(response.data.data)
                        self.addDialog = false;
                        self.getTariffs(this.page);
                        
                    }, self.handleError);
            // }
            // else{
            //     this.errorMessage('Ошибка')
            // }
        },
        getTariffs(page){
            let self = this;
            this.page = page;
            this.tariffsData = [];
            self.$http.get(self.$store.getters.loyaltyUrl + "/loyalty/tariffs/get/paged-tariffs", {
                params:{
                    page: page-1,
                    size: 10,
                }
            })
                .then((response) => {
                    //console.log(response.data.data)
                    self.tariffsData = response.data.data.content;
                    if(page===1){
                        self.totalPages = response.data.data.totalPages;
                    }
                }, self.handleError);
        },
        getMeasurementUnits(){
            this.measurementUnitsData = [];
            let self = this;
            self.$http.get(self.$store.getters.loyaltyUrl + "/loyalty/measurement-unit/get/all")
                .then((response) => {
                    // //console.log(response.data.data)
                    response.data.data.forEach(x => {
                        self.measurementUnitsData.push({id: x.id , name: x.measurementUnitRu + ' - ' + x.measurementUnitUz + ' - ' + x.measurementUnitEn});
                    });
                    //console.log(self.measurementUnitsData);
                }, self.handleError);
        },
        getLoyaltyServices(){
            this.loyaltyServicesData = [];
            let self = this;
            self.$http.get(self.$store.getters.loyaltyUrl + "/loyalty/service-providers/get/loyalty-services")
                .then((response) => {
                    // //console.log(response.data.data)
                    // self.loyaltyServicesData = response.data.data;
                    response.data.data.forEach(x => {
                        self.loyaltyServicesData.push({serviceId: x.id, name: x.serviceCategory.categoryNameRu +' - '+x.serviceNameRu});
                    });
                    //console.log(self.loyaltyServicesData);

                }, self.handleError);
        },
        getBankServices(){
            this.bankServicesData = [];
            let self = this;
            self.$http.get(self.$store.getters.loyaltyUrl + "/loyalty/bank-services/get/all-paged", {
                params:{
                    page: 0,
                    size: 49,
                }
            })
                .then((response) => {
                    console.log(response.data.data)
                    response.data.data.content.forEach(x => {
                        self.bankServicesData.push({bankServiceId: x.bankServiceId, name: x.cardProductName+' - (Категория: ' +x.categoryName+')'});
                    });
                    //console.log(self.loyaltyServicesData);

                }, self.handleError);
        },
        getBankServiceName(id){
            var item = this.bankServicesData.find(x=>x.bankServiceId === id);
            
            console.log(id)
            console.log(this.bankServicesData)
            console.log(item)
            if (item)
                return item.name;
            else{
                return '';
            }
        },
        getOrderTypes(){
            let self = this;
            self.$http.get(self.$store.getters.loyaltyUrl + "/loyalty/tariffs/get/order-types")
                .then((response) => {
                    console.log(response.data.data)
                    self.orderData = response.data.data.emptyOrders;
                    console.log(self.orderData)
                }, self.handleError);
        },
        getCategoryList(page){
            // this.categoryData = [];
            this.$http.get(this.$store.getters.apiUrl+`/loyalty/category/list?page=${page-1}&size=20`)
            .then(response=>{
                console.log(response.data.data);
                response.data.data.content.forEach(x=>{
                    this.categoryData.push(x);
                })
                if(page<response.data.data.totalPages){
                    this.getCategoryList(this.page+1);
                }
            })
        }
    },
    mounted(){
        this.getTariffs(1);
        // this.getOrderTypes();
        this.getLoyaltyServices();
        this.getMeasurementUnits();
        this.getBankServices();
        this.getCategoryList(1);
    }
}
</script>

<style scoped>
    .image-preview{
        max-width: 100px;
        max-height: 100px;
        margin: 10px;
    }
    .tariff-text{
        margin: 5px 0;
    }
    .tariff-image-url{
        max-width: 55px;
        max-height: 55px;
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
    .content-box{
        height: 200px;
        overflow: auto;
    }
    .box{
        display: flex;   
    }
    .box-text{
        margin: 10px;
        width: 125px;
        text-align: center;
    }
    .upload-header-text{
        font-weight: 500;
        font-size: 15px;
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
    .main{
        width: 100%;
    }
    .center{
        margin: 10px;
        display: flex;
        justify-content: center;
    }
</style>