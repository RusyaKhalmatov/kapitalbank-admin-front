<template>
    <div class="main">
        <h1 class="head">Paynet Services</h1>
        <h3 v-if="$route.query.id">ID сервиса: {{$route.query.id}}</h3>   
        <div class="content">
            <paynet-image-component :logoUrl="serviceItems.logoUrl" :file.sync="file" :key="key+1"></paynet-image-component>
            <v-divider class="mx-4" vertical></v-divider>
            <paynet-content :localPaymentsCategories="localPaymentsCategories" :eposData="eposData" :serviceItems.sync="serviceItems" :paymentCategories.sync="localPaymentCategoriesIds" :billingData="billingTypesData" :key="key"></paynet-content>
        </div>
        <paynet-service-fields :serviceId="serviceId" :paynetServiceFields.sync="paynetServiceFields" :serviceItems="serviceItems" :key="key"></paynet-service-fields>
        <div class="checkbox">
            <span class="checkbox-child">
                <v-checkbox                
                        v-model="serviceItems.active"
                        label="Включен">
                </v-checkbox>                
            </span>
            <span class="checkbox-child">
                <v-checkbox
                        v-model="serviceItems.corp"
                        label="Corparate">
                </v-checkbox>
            </span>
            <span class="checkbox-child">
                <v-checkbox
                        v-model="serviceItems.bonus"
                        label="Bonus">
                </v-checkbox>   
            </span>
            <span style="width:200px">
                <v-select v-model="serviceItems.serviceBilling" label="Биллинг" :items="billingTypesData" hide-details></v-select>                                  
            </span>
            <v-btn class="ma-2" round depressed color="#f9ca03" :disabled="!serviceItems.serviceBilling" :loading="loader" @click="savePaymentServices">Сохранить</v-btn>
        </div>
    </div>
</template>
<script>
import PaynetImageComponent from './paynetServices/paynetImageComponent'
import PaynetContent from './paynetServices/paynetContent'
import PaynetServiceFields from './paynetServices/paynetServiceFields'
export default {
    name: 'PaynetServicesInfo',
    components:{
        PaynetImageComponent, PaynetContent, PaynetServiceFields
    },
    data(){
        return{
            serviceItems: {
                serviceBilling: '',
                bonus: false,
                active: false
            },
            file: null,
            key: 0,
            billingTypesData: [],
            paynetServiceFields: [],
            localPaymentCategoriesIds: [],
            loader: false,
            serviceId: null,
            localPaymentsCategories: [],
            eposData: [],

        }
    },
    watch:{

        paynetServiceFields(val){
            this.serviceItems.paynetServiceFields = val;
        },
        localPaymentCategoriesIds(val){
            this.serviceItems.localPaymentCategoriesIds = val;
            // console.log(this.serviceItems)
        }
    },
    methods:{
        logoUpload(serviceId){
            let data = new FormData();
            data.append('file', this.file);
            this.$http.post(this.$store.getters.newApiUrl+`/payment-service/${serviceId}/logoUrl`, data, {headers: {'Content-Type': 'multipart/form-data'}})
            .then((response)=>{
                // console.log(response.data.data);
                this.$store.commit('successMessage', 'Логотип успешно сохранен');
                if(this.$route.query.id)
                    this.getPaymentServiceInfo();
                else 
                    this.$router.push(`/paynetServicesInfo?id=${response.data.data.serviceId}`)

                // this.redirect('PaynetServices');  
            }, this.handleError)
        },
        savePaymentServices(){
            if(this.$route.query.id){
                this.loader = true;
                if(this.serviceItems.locationLongitude)
                    this.serviceItems.locationLongitude = this.serviceItems.locationLongitude.replace(',','.').toString();
                if( this.serviceItems.locationLatitude)
                    this.serviceItems.locationLatitude = this.serviceItems.locationLatitude.replace(',','.').toString();
                if(this.serviceItems.bonus){
                    this.serviceItems.bonus = true;
                }
                else{
                    this.serviceItems.bonus = false;
                }
                this.serviceItems.localPaymentCategories = []
                this.serviceItems.localPaymentCategoriesIds = [];
                this.$http.put(this.$store.getters.newApiUrl + `/payment-service/${this.serviceItems.serviceId}`, this.serviceItems)
                .then((response) => {
                    if(this.file)
                        this.logoUpload(response.data.data.serviceId);
                    else{
                        this.getPaymentServiceInfo();
                    }
                    this.loader = false;
                })
            }
            else{
                if(this.serviceItems.locationLongitude)
                    this.serviceItems.locationLongitude = parseFloat(this.serviceItems.locationLongitude.replace(',','.'))
                if( this.serviceItems.locationLatitude)
                    this.serviceItems.locationLatitude = parseFloat(this.serviceItems.locationLatitude.replace(',','.'))
                this.loader = true;
                this.$http.post(this.$store.getters.newApiUrl + `/payment-service`, this.serviceItems)
                .then((response) => {
                    if(this.file)
                        this.logoUpload(response.data.data.serviceId);
                    else{
                        this.$router.push(`/paynetServicesInfo?id=${response.data.data.serviceId}`)
                    }
                    this.loader = false;
                })
            }
        },
        getPaymentServiceInfo(){
            this.$http.get(this.$store.getters.newApiUrl+`/payment-service/${this.$route.query.id}`)
                .then(response=>{
                    this.serviceItems = response.data.data;
                    this.loader = false;
                    this.key+=1;
                }, this.handleError)
        },
        getBillingTypes(){
            return this.$http.get(this.$store.getters.newApiUrl+`/payment-services/billing-types`);
        },
        getLocalPaymentCategories(){
            // this.loader = true;
            this.$http.get(this.$store.getters.newApiUrl+`/payment/local/categories`)
                .then(response=>{
                    this.localPaymentsCategories = response.data.data;
                    // this.loader = false;                
                }, this.handleError)
        },
        getEpos(){
            return new Promise(resolve=>{
                this.$http.get(this.$store.getters.apiUrl+`/epos`)
                .then(response=>{
                    this.eposData = response.data.data;                    
                    resolve('success');
                }, this.handleError)    
            })        
        },
    },
    async mounted(){
        await this.getEpos();
        this.getLocalPaymentCategories();
        this.getBillingTypes()
        .then(response=>{
            this.billingTypesData = response.data.data
        })
        if(this.$route.query.id){
            this.$route.query.id.toString();
            this.getPaymentServiceInfo();
        }
        else{
            this.key+=1;
        }
    }
}
</script>
<style scoped>
    .content{
        display: flex;
        /* flex-wrap: wrap; */
    }
    .checkbox-child{
        width: 300px;
    }
    .checkbox{
        display: flex;
        background: #FFFF;
        padding: 10px 20px;
        border-radius: 10px;
        margin: 10px 0;
        justify-content: space-between;
        align-items: center;
    }
    @media all and (max-width: 1000px){
        .content{
            flex-direction: column;
            align-items: center;
        }
    }
</style>