<template>
    <div class="main">
        <h1 class="headline">История виртуальных карт</h1>
        <span class="box">
            <v-select class="select" dense solo v-model="type" label="Тип" :items="['UZCARD', 'HUMO']"></v-select>
            <v-text-field class="pan" single-line solo label="Номер карты" v-model="pan"></v-text-field>
        </span>
        <date-select description="" @date="getDate"></date-select>
        <div class="content">
            <h2 v-if="data.cardInfo">Balance: {{data.cardInfo.balance / 100 | number-format}} сум</h2>
            <template v-if="data.totalCredit">
                <h2>Total credit: {{data.totalCredit / 100 | number-format}} сум</h2>
                <h2>Total debit: {{data.totalDebit / 100 | number-format}} сум</h2>
            </template>
        </div>
    </div>
</template>

<script>
import DateSelect from '@/components/date/DateSelect'

export default {
    name: 'virtualCardHistory',
    components: {
        DateSelect
    },
    data(){
        return{
            fromDate: '',
            toDate: '',
            date: {},
            pan: '',
            type: '',
            data:{},
        }
    },
    watch:{
        date(val){
            if(this.pan)
                this.getHistory();
        }
    },
    methods: {
        getHistory(){
            this.data = {}
            console.log(this.date)
            this.$http.get(this.$store.getters.prodApiUrl + `/general/admin/virtual-card/history?pan=${this.pan}&type=${this.type}&dateFrom=${this.date.fromDate}&dateTo=${this.date.toDate}`)
            .then(respone=>{
                console.log(respone.data.data);
                this.data = respone.data.data;
            }, this.handleError)
        },
        getDate(val){
            this.date = val;
        }        
    },
    mounted(){
        // this.getHistory();
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
    .pan{
        flex: 3;
    }
    .select{
        flex: 1;
    }
    .box{
        display: flex;
        width: 500px;
        margin: 30px auto 0;
    }
</style>