<template>
    <v-layout column wrap>
        <v-card min-height="600">
            <v-card-title>
                <h1>Paynet Services</h1>
                <v-spacer></v-spacer>
                <v-btn icon small @click="redirect('PaynetServices')">
                    <v-icon small>mdi-arrow-left</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-layout column wrap align-center>
                            <img class="logo" :src="imagePreview" v-if="imagePreview"/>
                        </v-layout>
                        <!-- <v-file-picker
                                :disabled="loader"
                                v-model="newImage"
                                accept="image/*"
                                label="Изображение">
                        </v-file-picker> -->
                        <input class="input-file" accept="image/*" type="file" @change="onFileChange($event)" ref="fileupload">

                    </v-flex>
                    <v-flex xs12>
                        <v-text-field
                                v-if="serviceFormItems.serviceId"
                                v-model="serviceFormItems.serviceId"
                                label="ID сервиса">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field
                                v-model="serviceFormItems.categoryId"
                                label="ID категории">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field
                                v-model="serviceFormItems.gatewayName"
                                label="Имя Щлюза">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field
                                v-model="serviceFormItems.serviceNameEn"
                                label="Наименование EN">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field
                                v-model="serviceFormItems.serviceNameRu"
                                label="Наименование RU">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field
                                v-model="serviceFormItems.serviceNameUz"
                                label="Наименование UZ">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field
                                v-model="serviceFormItems.eposType"
                                label="Тип epos">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field
                                v-model="serviceFormItems.minAmount"
                                label="Мин. сумма">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field
                                v-model="serviceFormItems.maxAmount"
                                label="Макс. сумма">
                        </v-text-field>
                    </v-flex>                    
                    <v-flex xs12>
                        <v-text-field
                                v-model="serviceFormItems.serviceOrder"
                                label="Позиция">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <div class="d-flex">
                            <span class="fee">
                                <v-text-field
                                        type="number"
                                        v-model="serviceFormItems.uzcardAllFee"
                                        label="Общая комиссия Uzcard">
                                </v-text-field>
                            </span>
                            
                            <span class="fee">
                                <v-text-field
                                        type="number"
                                        v-model="serviceFormItems.uzcardFee"
                                        label="Чистая комиссия Uzcard">
                                </v-text-field>
                            </span>
                        </div>
                    </v-flex>
                    
                    <v-flex xs12>
                        <div class="d-flex">
                            <span class="fee">
                                <v-text-field
                                        type="number"
                                        v-model="serviceFormItems.humoAllFee"
                                        label="Общая комиссия Humo">
                                </v-text-field>
                            </span>
                            <span class="fee">
                                <v-text-field
                                        type="number"
                                        v-model="serviceFormItems.humoFee"
                                        label="Чистая комиссия Humo">
                                </v-text-field>
                            </span>
                        </div>
                    </v-flex>



                        <v-flex xs12>
                            <v-text-field
                                    v-model="serviceFormItems.walletAccountFee"
                                    label="Комиссия Кошелек / Счет">
                            </v-text-field>
                        </v-flex>
                    <v-flex xs12>
                        <v-text-field
                                v-model="serviceFormItems.cashId"
                                label="CashID">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-divider></v-divider>
                    </v-flex>
                    <v-tabs style="width:100%" v-model="tabs">
                        <v-tab>оплата по реквизитам</v-tab>
                        <v-tab>оплата на местах</v-tab>
                        <v-tab-item class="pa-5">
                            <div>
                                <!-- <v-flex xs12>
                                    <p style="margin:10px; width: auto">Поля для оплаты по реквизитам</p>
                                </v-flex> -->
                                <v-flex xs12>
                                    <v-text-field
                                            v-model="serviceFormItems.receiverName"
                                            label="Имя получателя">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field
                                            v-model="serviceFormItems.receiverBankCode"
                                            label="Код банка получателя">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field
                                            v-model="serviceFormItems.receiverAccount"
                                            label="Счет получателя">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-checkbox
                                            v-model="serviceFormItems.requisitePayment"
                                            label="Оплата по реквизитам">
                                    </v-checkbox>
                                </v-flex>                        
                            </div>
                        </v-tab-item>
                        <v-tab-item class="pa-5">
                            <div>
                                <v-flex xs12>
                                    <v-select v-model="localPaymentCategoriesIds" multiple :items="localPaymentsCategories" item-text="nameRu" item-value="id" label="Категории для оплаты на местах"></v-select>
                                </v-flex>                                                
                                <v-flex xs12>
                                    <v-text-field
                                            v-model="serviceFormItems.locationLongitude"
                                            label="Долгота">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field
                                            v-model="serviceFormItems.locationLatitude"
                                            label="Широта">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field
                                            v-model="serviceFormItems.address"
                                            label="Адрес">
                                    </v-text-field>
                                </v-flex>
                                <div  v-if="serviceFormItems.id" style="display:flex; flex-wrap:wrap">
                                    <v-flex xs12>
                                        <div>
                                            <!-- {{contactData}} -->
                                            <h2>Контакты</h2>
                                            <span style="display:flex; align-items:center" v-for="(item,index) in contactData" :key="index">
                                                <p>{{item}}</p>
                                                <v-btn @click="removeContact(index)" icon><v-icon small>cancel</v-icon></v-btn>
                                            </span> 

                                        </div>
                                        <div style="display:flex">
                                            <span style="width:300px">
                                                <v-text-field
                                                        v-model="contact"
                                                        label="Контакт">
                                                </v-text-field>
                                            </span>

                                            <v-btn depressed @click="addContact">Добавить</v-btn>
                                        </div>
                                        
                                        
                                    </v-flex>     
                                    <!-- <v-text-field v-model="contact" label="Контакт"></v-text-field> -->

                                </div>

                                <v-flex xs12 v-if="serviceFormItems.id">
                                    <!-- <v-text-field
                                            v-model="serviceFormItems.workHours"
                                            label="Рабочие часы">
                                    </v-text-field> -->
                                    <work-schedule :is="workSchedule" :serviceId="serviceFormItems.serviceId" :id="serviceFormItems.id"></work-schedule>
                                </v-flex>
                                <v-flex xs12>
                                    <v-checkbox
                                            v-model="serviceFormItems.localPayment"
                                            label="Оплата на местах">
                                    </v-checkbox>
                                </v-flex>
                                
                            </div>
                        </v-tab-item>

                    </v-tabs>
                    
                        <v-flex xs12>
                            <v-divider style="margin: 20px 0px;"></v-divider>
                        </v-flex>

                        <div class="fields-box">
                            <span class="fields-box-header">
                                <h3 class="ma-0">Поля</h3>                                
                                <v-btn v-if="!isAdd" @click="addFields" depressed small color="primary">Добавить</v-btn>                                
                            </span>      
                            <template v-if="isAdd">
                                <h4>fieldAlias - user_id, FIO, invoice_number</h4>
                                <h4>fieldType - N только числы, S строка</h4>
                            </template>
                            <div v-if="isShow" class="paynetServiceFieldsDto">    
                                <span v-if="isAdd&&serviceFormItems.paynetServiceFields.length!=0" class="d-flex fields-header">
                                    <p class="fields-text">nameRu</p>
                                    <p class="fields-text">nameUz</p>
                                    <p class="fields-text">nameEn</p>
                                    <p class="fields-text">fieldType</p>
                                    <p class="fields-text">fieldAlias</p>
                                    <p class="fields-text"></p>
                                    
                                </span>                        
                                <span class="d-flex fields-data" v-for="(item,index) in serviceFormItems.paynetServiceFields" :key="index">
                                    <p class="fields-text">{{item.nameRu}}</p>
                                    <p class="fields-text">{{item.nameUz}}</p>
                                    <p class="fields-text">{{item.nameEn}}</p>
                                    <p class="fields-text">{{item.fieldType}}</p>
                                    <p class="fields-text">{{item.fieldAlias}}</p>
                                    <p>
                                        <v-btn @click="editField(item)" icon small><v-icon small>mdi-pencil</v-icon></v-btn>
                                        <v-btn @click="removeField(item)" icon small><v-icon small>mdi-delete</v-icon></v-btn>
                                    </p>
                                </span>
                            </div>
                            <span v-if="isAdd" class="input-box">                                                            
                                <span class="fields-input">
                                    <v-text-field  v-model="fieldAlias" label="fieldAlias"></v-text-field>                                     
                                </span>
                                <span class="fields-input">
                                    <v-text-field v-model="fieldType" label="fieldType"></v-text-field>                                
                                </span>
                                <span class="fields-input">
                                    <v-text-field v-model="nameRu" label="nameRu"></v-text-field>                                
                                </span>
                                <span class="fields-input">
                                    <v-text-field v-model="nameUz" label="nameUz"></v-text-field>                                
                                </span>
                                <span class="fields-input">
                                    <v-text-field v-model="nameEn" label="nameEn"></v-text-field>                                
                                </span>
                                <span style="padding-top: 10px;" class="d-flex fields-input">
                                    <v-btn @click="saveFieds" small>Сохранить</v-btn>
                                    <v-btn @click="isAdd=false" small>Отмена</v-btn>

                                </span>
                            </span>                      
                            
                        </div>
                    
                    <v-layout column wrap>
                        <v-flex xs12>
                            <v-checkbox
                                    v-model="serviceFormItems.active"
                                    label="Включен">
                            </v-checkbox>
                        </v-flex>
                        <v-flex xs12>
                            <v-checkbox
                                    v-model="serviceFormItems.corp"
                                    label="Corparate">
                            </v-checkbox>
                        </v-flex>
                        <v-flex xs12>
                            <v-checkbox
                                    v-model="serviceFormItems.bonus"
                                    label="Bonus">
                            </v-checkbox>                            
                        </v-flex>
                        <v-flex xs12>
                            <!-- <v-checkbox
                                    v-model="serviceFormItems.serviceBilling"
                                    label="Billing">
                            </v-checkbox>   -->
                            <v-select style="width:300px" v-model="serviceFormItems.serviceBilling" label="Биллинг" :items="billingTypesData"></v-select>                  
                        </v-flex>
                    </v-layout>                    
                    <v-flex xs12>
                        <v-btn dark color="primary" :loading="loader" @click="saveEditedService()">Сохранить</v-btn>
                    </v-flex>
                </v-layout>
            </v-card-text>
        </v-card>
    </v-layout>
</template>

<script>
    import workSchedule from './WorkSchedule'
    export default {
        name: "PaynetServicesForm",
        components: {
            workSchedule
        },  
        data() {
            return {
                serviceFormItems: {
                    serviceBilling: 'TEOS'
                },
                newImage: "",
                imagePreview: '',
                file: '',
                fieldAlias: '',
                fieldType: '',
                nameEn: '',
                nameRu: '',
                nameUz: '',
                isAdd: false,
                isShow: true,
                fieldId: '',
                isEdit: false,
                oldFieldAlias: '',
                tabs: 0,
                billingTypesData: [],
                localPaymentsCategories: [],
                contactsNumber: 1,
                contact: '',
                contactData: [],
                workSchedule: '',
                localPaymentCategoriesIds: [],
                isCategoryEdit: false,
            }
        },
        methods: {
            removeContact(index){
                this.contactData.splice(index,1)
            },
            addContact(){
                this.contactData.push(this.contact)
                console.log(this.contactData)

                this.contact = '';
                this.contactsNumber++;
            },
            getLocalPaymentCategories(){
                this.loader = true;
                this.$http.get(this.$store.getters.newApiUrl+`/payment/local/categories`)
                    .then(response=>{
                        this.localPaymentsCategories = response.data.data; 
                        
               
                        this.loader = false;                
                    }, this.handleError)
            },
            editField(field){
                this.isAdd = true;
                this.isEdit = true;
                this.oldFieldAlias = field.fieldAlias;
                this.fieldAlias = field.fieldAlias;
                this.fieldType = field.fieldType;
                this.nameRu = field.nameRu;
                this.nameEn = field.nameEn;
                this.nameUz = field.nameUz;
                this.fieldId = field.id;
                
            },
            removeField(field){
                this.isShow = false;
                const item = this.serviceFormItems.paynetServiceFields.find(x => x.fieldAlias  === field);
                this.serviceFormItems.paynetServiceFields.splice(this.serviceFormItems.paynetServiceFields.indexOf(item),1);
                this.isShow = true;
                if(this.serviceFormItems.paynetServiceFields.length===0)
                    this.isAdd = false;
                // console.log(this.serviceFormItems.paynetServiceFields)
            },
            saveFieldByServiceId(){
                if(this.serviceFormItems.serviceId){
                    const putData = {
                        "fieldAlias": this.fieldAlias,
                        "fieldType": this.fieldType,
                        "nameEn": this.nameEn,
                        "nameUz": this.nameUz,
                        "nameRu": this.nameRu
                    }
                    this.$http.put(this.$store.getters.newApiUrl + `/payment-service/${this.serviceFormItems.serviceId}/field/${this.fieldId}`, putData)
                        .then((response) => {                        
                            this.fieldAlias = '';
                            this.fieldType = '';
                            this.nameEn = '';
                            this.nameRu = '';
                            this.nameUz = '';
                            this.isAdd = false;

                            this.$http.get(this.$store.getters.newApiUrl+`/payment-service/${this.serviceFormItems.serviceId}`)
                            .then(response=>{
                                this.serviceFormItems = response.data.data
                                // this.$router.push({name: 'PaynetServicesForm', params: {paynetServices: response.data.data}});
                            })
                        }, this.handleError);
                }
                else{

                }
            },
            getBillingTypes(){
                this.$http.get(this.$store.getters.newApiUrl+`/payment-services/billing-types`)
                .then(response=>{
                    this.billingTypesData = response.data.data
                    // console.log(this.billingTypesData)
                    // this.$router.push({name: 'PaynetServicesForm', params: {paynetServices: response.data.data}});
                })
            },
            saveFieds(){
                this.isShow = false;
                // if(this.serviceFormItems.serviceId){
                //     this.saveFieldByServiceId();
                // }
                // else{
                    if(this.isEdit){
                        const item = this.serviceFormItems.paynetServiceFields.find(x => x.fieldAlias  === this.oldFieldAlias);
                        // console.log(item)
                        // console.log(this.serviceFormItems.paynetServiceFields[this.serviceFormItems.paynetServiceFields.indexOf(item)]);
                        this.serviceFormItems.paynetServiceFields[this.serviceFormItems.paynetServiceFields.indexOf(item)].fieldAlias = this.fieldAlias;
                        this.serviceFormItems.paynetServiceFields[this.serviceFormItems.paynetServiceFields.indexOf(item)].fieldType = this.fieldType;
                        this.serviceFormItems.paynetServiceFields[this.serviceFormItems.paynetServiceFields.indexOf(item)].nameRu = this.nameRu;
                        this.serviceFormItems.paynetServiceFields[this.serviceFormItems.paynetServiceFields.indexOf(item)].nameEn = this.nameEn;
                        this.serviceFormItems.paynetServiceFields[this.serviceFormItems.paynetServiceFields.indexOf(item)].nameUz = this.nameUz;
                        this.isEdit = false;
                    }
                    else{
                        this.serviceFormItems.paynetServiceFields.push({
                            "fieldAlias": this.fieldAlias,
                            "fieldType": this.fieldType,
                            "nameEn": this.nameEn,
                            "nameUz": this.nameUz,
                            "nameRu": this.nameRu
                        })
                    }
                // }
                this.isAdd = false;

                this.isShow = true;
            },
            addFields(){
                this.isAdd = true;
                this.fieldAlias = '';
                this.fieldType = '';
                this.nameRu = '';
                this.nameUz = '';
                this.nameEn = '';
            },  
            saveEditedService() {
                let self = this;
                // console.log(self.serviceFormItems)
                if(this.serviceFormItems.humoFee)
                    this.serviceFormItems.humoFee = parseFloat(this.serviceFormItems.humoFee.toString().replace(',','.'));
                if(this.serviceFormItems.humoAllFee)                
                    this.serviceFormItems.humoAllFee = parseFloat(this.serviceFormItems.humoAllFee.toString().replace(',','.'));
                if(this.serviceFormItems.uzcardFee)                
                    this.serviceFormItems.uzcardFee = parseFloat(this.serviceFormItems.uzcardFee.toString().replace(',','.'));
                if(this.serviceFormItems.uzcardAllFee)                
                    this.serviceFormItems.uzcardAllFee = parseFloat(this.serviceFormItems.uzcardAllFee.toString().replace(',','.'));
                this.serviceFormItems.contact = this.contactData
                if(this.isCategoryEdit)
                    this.serviceFormItems.localPaymentCategoriesIds = this.localPaymentCategoriesIds
                else
                    delete this.serviceFormItems.localPaymentCategoriesIds 
                if(self.serviceFormItems.serviceId){
                    // delete this.serviceFormItems.paynetServiceFields;
                    delete self.serviceFormItems.localPaymentCategories
                    self.$http.put(self.$store.getters.newApiUrl + `/payment-service/${self.serviceFormItems.serviceId}`, self.serviceFormItems)
                    .then((response) => {
                        // self.redirect('PaynetServices');
                        if(self.file)
                            self.saveUrl(response.data.data.serviceId)
                        else{
                            this.redirect('PaynetServices');  
                        }
                    }, self.handleError);
                }
                else{
                    delete self.serviceFormItems.localPaymentCategories

                    self.$http.post(self.$store.getters.newApiUrl + `/payment-service`, self.serviceFormItems)
                    .then((response) => {
                        // self.redirect('PaynetServices'); 
                        if(this.file)                       
                            self.saveUrl(response.data.data.serviceId)
                        else{
                            this.redirect('PaynetServices');  
                        }
                    }, self.handleError);
                }
                    
                
            },
            saveUrl(serviceId){
                let data = new FormData();
                data.append('file', this.file);
                this.$http.post(this.$store.getters.newApiUrl+`/payment-service/${serviceId}/logoUrl`, data, {headers: {'Content-Type': 'multipart/form-data'}})
                .then(response=>{
                    // console.log(response.data.data);
                    this.$store.commit('successMessage', 'Успешно');
                    this.redirect('PaynetServices');  
                }, this.handleError)
            },
            onFileChange(e){
                this.file = e.target.files[0];
                this.imagePreview = URL.createObjectURL(e.target.files[0]);                
            },
        },
        mounted() {
            this.getBillingTypes();
            this.getLocalPaymentCategories();

            if (this.$route.params.paynetServices) {
                this.serviceFormItems = this.$route.params.paynetServices;
                this.localPaymentCategoriesIds = this.serviceFormItems.localPaymentCategories
                setTimeout(()=>{
                    this.isCategoryEdit = false

                }, 500)

                this.contactData = this.serviceFormItems.contact
                
                // console.log('########################')                
                // console.log(this.serviceFormItems)
                // console.log('########################')

                // if(!this.serviceFormItems.billing){
                //     this.serviceFormItems.billing = false;
                // }
                if(this.serviceFormItems.bonus){
                    this.serviceFormItems.bonus = true;
                }
                else{
                    this.serviceFormItems.bonus = false;
                }
                if(this.serviceFormItems.address){
                    this.tabs = 1;
                }
                if(this.serviceFormItems.receiverName){
                    this.tabs = 0;
                }
                this.imagePreview = this.serviceFormItems.logoUrl;
            }
            else{
                if(this.serviceFormItems.serviceId){
                    this.serviceFormItems.paynetServiceFields = [];
                    this.serviceFormItems.contact = [];

                    if(this.serviceFormItems.bonus){
                        this.serviceFormItems.bonus = true;
                    }
                    else{
                        this.serviceFormItems.bonus = false;
                    }
                }
                else
                    this.serviceFormItems.paynetServiceFields = [];
                    // this.serviceFormItems.billing = null;

            }
            // console.log(this.serviceFormItems);
        },
        watch: {
            newImage(image) {
                let self = this;
                if (image.length > 0) {
                    let reader = new FileReader();
                    reader.onload = e => {
                        self.$set(self.serviceFormItems, 'logoUrl', e.target.result);
                    };

                    reader.readAsDataURL(image[0]);
                }
                self.$set(self.serviceFormItems, 'logoUrl', '');
            },
            tabs(val){
                // console.log(val)
                if(val===1){
                    this.workSchedule = 'workSchedule'
                }
                else{
                    this.workSchedule = '';
                }
            },
            localPaymentCategoriesIds(val){
                this.isCategoryEdit = true;
            }
        }
    }
</script>

<style scoped>
    .logo{
        max-width: 200px;
        max-height: 200px;
    }
    .fee{
        width: 220px;
        margin: 5px;
    }
    .fields-box{
        padding: 10px;
        border-radius: 6px;
        border: 1px solid silver;
        width: 100%;
    }
    .fields-box-header{
        display: flex;
        align-items: center;
    }
    .fields-input{
        width: 200px;
        margin: 0 10px;
    }
    .input-box{
        display: flex;
    }
    p{
        text-align: center;
        margin: 0;
        width: 135px;
    }
    .fields-header{
        background: #f1f1f1;
        padding: 5px;
    }
    .fields-data{
        padding: 5px;
    }
    .fields-text{
        /* border: 1px solid; */
    }
</style>