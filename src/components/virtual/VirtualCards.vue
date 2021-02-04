<template>
    <div class="main">
        <h1 class="headline">Отчет по виртуальной карте</h1>
        <date-component @date="getDate"></date-component>
        <line-chart v-if="isShow" :chartdata="chartddata" :options="chartOptions"/>
        <v-select
            label="Продукт"
            :items="cardsData"
            v-model="cardProduct"
            placeholder="Выберите продукт"
            item-text="value"
            item-value="key"
            attach
            chips
            multiple>
            <template v-slot:prepend-item>
                <v-list-tile ripple @click="toggle">
                    <v-list-tile-action>
                        <v-icon :color="cardProduct.length > 0 ? 'primary' : ''">{{ icon }}</v-icon> 
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Выбрать все</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-divider class="mt-2"></v-divider>
            </template>
                
        </v-select>
        <v-btn dark color="primary" class="get-btn" @click="getData" :loading="loader">Получить</v-btn>
        <virtual-cards-create-date :is="component" :date="date" :cardProduct="cardProduct"></virtual-cards-create-date>
        <virtal-cards-debit :is="componentDebit" :date="date" :cardProduct="cardProduct"></virtal-cards-debit>
        <virtal-cards-credit :is="componentCredit" :date="date" :cardProduct="cardProduct"></virtal-cards-credit>

    </div>
</template>

<script>
import lineChart from '@/components/chart/LineChart'
import DateComponent from '@/components/date/DateComponent'
import VirtualCardsCreateDate from './VirtualCardsCreateDate'
import VirtualCardsDebit from './VirtualCardsDebit'
import VirtualCardsCredit from './VirtualCardsCredit'
export default {
    name: 'VisaVirtual',
    data(){
        return{
            chartOptions:  {
                responsive: true,
                maintainAspectRatio: false
            },
            chartddata: {
                labels: ['Январь', 'Февраль', '23', '23', '23'],
                datasets: [
                    {
                        label: 'Количество виртуальных карт',
                        backgroundColor: '#FFB446',
                        data: [40, 20, 30, 35, 123]
                    }
                ]
            },

            isShow: false,
            cardsData: [],
            cardProduct: [],
            loader: false,
            date: {},
            component: '',
            componentDebit: '',     
            componentCredit: '',       
            cardsInfo: [],
        }
    },
    components:{
        lineChart, DateComponent, VirtualCardsCreateDate, VirtualCardsDebit, VirtualCardsCredit
    },
    watch: {
        cardProduct(val){
            this.component = '';
            this.componentDebit = '';
            this.componentCredit = '';
        }
    },
    computed:{
        likesAllFruit(){
            return this.cardProduct.length === this.cardsData.length
        },
        likesSomeFruit(){
            return this.cardProduct.length > 0 && !this.likesAllFruit
        },
        icon(){
            if(this.likesAllFruit) return 'mdi-close-box'
            if(this.likesSomeFruit) return 'mdi-minus-box'
            return 'mdi-checkbox-blank-outline'
        },
    },  
    methods: {
        getData(){
            this.component = 'VirtualCardsCreateDate'
            this.componentDebit = 'VirtualCardsDebit'
            this.componentCredit = 'VirtualCardsCredit'
        },
        getDate(val){
            this.date = val;
            this.transactions = [];
            this.totalPages = '';
            this.amountData = [];
            this.show = false;
            this.component = '';
            this.componentDebit = '';
            this.componentCredit = '';
            // console.log(this.date)
            // console.log(this.date)
            // if(this.page===1)
            //     this.getRequisite(this.page);
            // else
            //     this.page = 1;
        },
        getCountByDate(){
            this.isShow = false;
            this.$http.get(this.$store.getters.newApiUrl+`/report/visa_virtual/count_by_date`)
            .then(response=>{
                console.log(response.data.data);
                this.data = response.data.data;                
                this.chartddata.labels = this.data.map(x=>{
                    const date = new Date(x.date)
                    return date.toLocaleString();
                });
                this.chartddata.datasets[0].data = this.data.map(x=>x.count);
                console.log(this.chartddata)
                this.isShow = true;
            }, this.handleError)
        },
        getSumByDate(){
            this.$http.get(this.$store.getters.newApiUrl+`/report/visa_virtual/sum_by_date`)
            .then(response=>{
                console.log(response.data.data);
            }, this.handleError)            
        },
        getCardProductList(){
            this.cardsData = [];
            this.$http.get(this.$store.getters.newApiUrl+`/report/virtual_card/card_product`)
            .then(response=>{
                // console.log(response.data.data);
                this.cardsData = response.data.data;
                this.cardsInfo = response.data.data.map(x=>x.key);
                this.cardProduct = this.cardsData.map(x=>x.key)
            }, this.handleError)
        },
        toggle(){
            this.$nextTick(() => {
                if(this.likesAllFruit){
                    this.cardProduct = [];
                }else{
                    this.cardProduct = this.cardsInfo;
                }
            })
        },


    },
    mounted(){
        // this.getCountByDate();
        // this.getSumByDate();
        this.getCardProductList();
    }
    
}
</script>
<style scoped>
    .main{
        width: 100%;
    }
    h1{
        text-align: center;
    }
    .get-btn{
        border-radius: 20px;
    }    
</style>