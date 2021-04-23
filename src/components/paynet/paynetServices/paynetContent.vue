<template>
    <div class="main">
        <v-text-field v-model.trim="data.cashId" label="CASHID"></v-text-field>
        <div class="d-flex flex-wrap">
            <v-text-field
                class="mr-3"
                v-model.trim="data.serviceNameRu"
                label="Наименование RU"
            ></v-text-field>
            <v-text-field
                class="mr-3"
                v-model.trim="data.serviceNameUz"
                label="Наименование UZ"
            ></v-text-field>
            <v-text-field
                v-model.trim="data.serviceNameEn"
                label="Наименование EN"
            ></v-text-field>
        </div>
        <div class="d-flex flex-wrap">
            <v-text-field class="mr-2" v-model.trim="data.categoryId" label="ID категории"></v-text-field>
            <v-text-field class="ml-2" v-model.trim="data.gatewayName" label="Имя Щлюза"></v-text-field>
        </div>
        <div class="d-flex flex-wrap">
            <span style="width:190px;">            
                <v-select clearable class="mr-2" v-model.trim="data.eposType" no-data-text="Не найдено" label="Тип epos" :items="tmpEposData" item-text="eposType" item-value="eposType">
                    <template v-slot:prepend-item>
                        <v-list-tile ripple >
                            <v-list-tile-content>
                                <v-text-field style="width:100%" dense v-model.trim="search" label="Поиск" hide-details></v-text-field>
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-divider class="mt-2"></v-divider>
                    </template>
                </v-select>
            </span>
            <v-text-field class="ml-2" v-model.trim="data.serviceOrder" label="Позиция"></v-text-field>
        </div>
        <div class="d-flex flex-wrap">
            <v-text-field class="mr-2" v-model.trim="data.minAmount" label="Мин. сумма"></v-text-field>
            <v-text-field class="ml-2" v-model.trim="data.maxAmount" label="Макс. сумма"></v-text-field>
        </div>
        <div class="d-flex">
            <div class="mr-2">
                <v-text-field
                    type="number"
                    v-model.trim="data.uzcardAllFee"
                    label="Общая комиссия Uzcard">
                </v-text-field>
                <v-text-field
                    type="number"
                    v-model.trim="data.uzcardFee"
                    label="Чистая комиссия Uzcard">
                </v-text-field>
            </div>
            <div class="ml-2">
                <v-text-field
                    type="number"
                    v-model.trim="data.humoAllFee"
                    label="Общая комиссия Humo">
                </v-text-field>
                <v-text-field
                    type="number"
                    v-model.trim="data.humoFee"
                    label="Чистая комиссия Humo">
                </v-text-field>
            </div>
        </div>
        <div class="d-flex">
            <v-text-field
                type="number"
                class="mr-2"
                v-model.trim="data.walletAccountFee"
                label="Комиссия Кошелек / Счет">
            </v-text-field>
            <v-text-field class="ml-2" disabled></v-text-field>
        </div>
        <v-divider class="mt-2"></v-divider>
        <v-expansion-panel style="box-shadow: none" focusable>
            <v-expansion-panel-content>
                <template v-slot:header>
                    <div style="font-weight:500">ОПЛАТА ПО РЕКВИЗИТАМ</div>
                </template>
                <v-card class="pa-5">
                    <div>
                        <v-flex xs12>
                            <v-text-field
                                    v-model.trim="data.receiverName"
                                    label="Имя получателя">
                            </v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field
                                    v-model.trim="data.receiverBankCode"
                                    label="Код банка получателя">
                            </v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field
                                    v-model.trim="data.receiverAccount"
                                    label="Счет получателя">
                            </v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-checkbox
                                    v-model.trim="data.requisitePayment"
                                    label="Оплата по реквизитам">
                            </v-checkbox>
                        </v-flex>                        
                    </div>
                </v-card>
            </v-expansion-panel-content>
            <v-expansion-panel-content>
                <template v-slot:header>
                    <div style="font-weight:500">ОПЛАТА НА МЕСТАХ</div>
                </template>
                <v-card class="pa-5">
                    <div>
                        <v-flex xs12>
                            <v-select v-model.trim="localPaymentCategoriesIds" multiple :items="localPaymentsCategories" item-text="nameRu" item-value="id" label="Категории для оплаты на местах"></v-select>
                        </v-flex>                                                
                        <v-flex xs12>
                            <v-text-field
                                    v-model.trim="data.locationLongitude"
                                    label="Долгота">
                            </v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field
                                    v-model.trim="data.locationLatitude"
                                    label="Широта">
                            </v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field
                                    v-model.trim="data.address"
                                    label="Адрес">
                            </v-text-field>
                        </v-flex>  
                        <template v-if="data.id">

                            <v-divider class="my-3"></v-divider>    
                                <div style="display:flex; flex-wrap:wrap">
                                        <div style="width:100%">
                                            <h3 class="mb-0 mt-2">Контакты</h3>
                                            <div class="mb-2" style="display:flex">
                                                <span style="width:300px">
                                                    <v-text-field
                                                            v-model="contact"
                                                            hide-details
                                                            label="Контакт">
                                                    </v-text-field>
                                                </span>

                                                <v-btn round depressed @click="addContact">Добавить</v-btn>
                                            </div>            
                                            <v-data-table no-data-text="Нет контактов" :items="data.contact" hide-headers rows-per-page-text="Количество страниц" :pagination.sync="pagination">
                                                <template v-slot:items="props">
                                                    <td>{{ props.item }}</td>
                                                    <td>
                                                        <v-btn @click="removeContact(index)" icon><v-icon small>cancel</v-icon></v-btn>
                                                    </td>
                                                </template>
                                            </v-data-table>
                                        </div>                                                                                           
                                </div>
                            <work-schedule :serviceId="data.serviceId" :id="data.id"></work-schedule>
                        </template>
                        <v-checkbox
                                v-model.trim="data.localPayment"
                                label="Оплата на местах">
                        </v-checkbox>

                    </div>
                </v-card>
            </v-expansion-panel-content>
            <v-expansion-panel-content>
                <template v-slot:header>
                    <div style="font-weight:500">ДАННЫЕ ДЛЯ АВТО СЧЕТ-ФАКТУРЫ</div>
                </template>
                <v-card class="pa-3">
                    <paynet-auto-invoice :invoiceData.sync="invoiceData" :serviceFormItems="serviceItems"></paynet-auto-invoice>
                </v-card>
            </v-expansion-panel-content>
            <v-expansion-panel-content>
                <template v-slot:header>
                    <div style="font-weight:500">ИТОГОВЫЙ ОТЧЕТ (BETA)</div>
                </template>
                <v-card class="pa-3">
                    <summery-report-generate></summery-report-generate>
                </v-card>
            </v-expansion-panel-content>
        </v-expansion-panel>
    </div>
</template>
<script>
import workSchedule from '../WorkSchedule'
import paynetAutoInvoice from './paynetAutoInvoice'
import summeryReportGenerate from './SummeryReportGenerate'
export default {
    name: 'paynetContent',
    components:{
        workSchedule, paynetAutoInvoice, summeryReportGenerate
    },
    props:{
        serviceItems: Object,
        paymentCategories: Array,
        localPaymentsCategories: Array,
        eposData: Array,
    },
    data(){
        return {
            data: {},
            // eposData: [],
            tmpEposData: this.eposData,
            search: '',
            tabs: 0,
            loader: false,
            // localPaymentsCategories: [],
            localPaymentCategoriesIds: [],
            contact: '',
            pagination: {
                rowsPerPage: 10
            },
            invoiceData: {},
        }
    },
    watch:{
        invoiceData(val){
            Object.assign(this.data, val);
        },
        data:{
            handler(newValue) {
                this.$emit('update:serviceItems', newValue)
            },
            deep: true
        },
        search(val){
            if (!['[', '?', '\\'].includes(val.slice(-1))) {
                var tmp = new RegExp(val, 'i')            
                this.tmpEposData = this.eposData.filter(item=>tmp.test(item.eposType))
            }
            if(!val){
                this.tmpEposData = this.eposData
            }
        },
        'data.eposType'(val){
            if(val){
                this.search = '';
            }
        },
        localPaymentCategoriesIds(val){
            this.$emit('update:paymentCategories', val)
        }
    },
    methods:{
        addContact(){
            this.data.contact.push(this.contact);
            this.contact = '';
        },
        removeContact(index){
            this.data.contact.splice(index,1)
        },
        getLocalPaymentCategories(){
            this.loader = true;
            this.$http.get(this.$store.getters.newApiUrl+`/payment/local/categories`)
                .then(response=>{
                    this.localPaymentsCategories = response.data.data;
                    this.loader = false;                
                }, this.handleError)
        },
        getEpos(){
            this.$http.get(this.$store.getters.apiUrl+`/epos`)
            .then(response=>{
                this.eposData = response.data.data;
                this.tmpEposData = this.eposData;
            }, this.handleError)
            
        },

    },
    mounted(){

        this.data = this.serviceItems;
        this.localPaymentCategoriesIds = this.data.localPaymentCategories
        // this.getEpos();
        // this.getLocalPaymentCategories();
    }

}
</script>
<style scoped>
    .main{
        width: 100%;
        background:#ffff;
        padding: 15px;
        border-radius: 10px;
    }
    >>>.v-expansion-panel__container--active{
        background: #f9ca03 !important;
    }
</style>