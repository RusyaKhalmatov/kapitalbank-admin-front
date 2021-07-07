<template>
    <div class="statistics">            

        <template>
            <div class="top">
                <!-- <h4 class="stat-text">По продуктам</h4>  -->
                <span class="select">
                    <v-select :items="branchData" label="Филиал" item-text="name" item-value="branchId" v-model="branchId"></v-select>
                </span>
                <download-excel
                        v-if="isShow"
                        name="cards"

                        :data="excelData">
                    <v-btn icon dark color="secondary">
                        <v-icon>mdi-file-excel</v-icon>
                    </v-btn>
                </download-excel> 
            </div>
            <div class="card-products" v-if="!isEmpty(summeryData)">
                <span :class="['card-products-child', { 'visa-classic' : index===0, 'visa-infinite': index===1, 'visa-platinum': index===2, 'visa-gold': index===3, 'uzcard': index===4, 'humo': index===6}]" text-color="white" v-for="(value, name, index) in summeryData" :key="index">
                    <span :class="['card-products-child-value', {'visa-infinite-value': index===1||index===2||index===5}]">                    
                        {{value.toLocaleString('us', {minimumFractionDigits: 0, maximumFractionDigits: 2})}}
                    </span>                                       
                    <span class="card-products-child-name">{{name}}</span>
                </span>
            </div>        
            <vue-content-loading v-else :width="300" :height="10">
                <rect x="0" y="3" rx="4" ry="4" width="70%" height="7" />
                <!-- <rect x="0" y="15" rx="4" ry="4" width="100%" height="7" />
                <rect x="0" y="25" rx="4" ry="4" width="10%" height="7" /> -->
            </vue-content-loading>
            <!-- <h4 class="stat-text">По статусу</h4>
            <div class="statuses">
                
                <span :class="['card-products-child', {'under-writer': index===1, 'ready': index===0||index===6, 'cancelled': index===2||index===4||index===9||index===7}]" text-color="white" v-for="(value, name, index) in summeryData.statuses" :key="index">
                    <span class="card-products-child-value">                    
                        {{value.toLocaleString('us', {minimumFractionDigits: 0, maximumFractionDigits: 2})}}
                    </span>
                    <span class="card-products-child-name">{{name}}</span>
                </span>
            </div> -->
        </template>
        
    </div> 
</template>
<script>
import VueContentLoading  from 'vue-content-loading';

export default {
    name: 'ReportBySummeryCard',
    props:{
        date: Object
    },
    components:{
        VueContentLoading
    },
    data(){
        return{
            summeryData: {},
            date1: '',
            date2: '',
            fromDate:'',
            toDate: '',
            branchData: [],
            branchId: '',
            amount: 0,
            isShow: false,
            excelData: [],
        }
    },
    watch: {
        date(val){
            this.fromDate = val.fromDate;
            this.toDate = val.toDate;
            this.getSummery()
        },
        branchId(val){
            this.getSummery();
        }
    },
    methods:{
        isEmpty(obj){
            for (var i in obj){
                if(obj.hasOwnProperty(i)){
                    return false;
                }                
            }
            return true;
        },
        getSummery(){
            let self = this;

            this.summeryData = {};
            this.excelData = [];
            this.isShow = false;
            self.amount = 0;
            var data = {
                "dateFrom" : this.fromDate,
                "dateTo": this.toDate,
                "branchId": this.branchId   
            };
            self.$http.post(self.$store.getters.newApiUrl2 + "/card-product-order/summery/card", data)
			.then((response) => {
                //console.log(response.data.data);
                self.summeryData = response.data.data;
                for (var i in self.summeryData){
                    self.amount+=self.summeryData[i];
                }
                self.isShow = true;
                Object.assign(self.summeryData, {'Всего': self.amount})
                self.excelData.push(self.summeryData)


			}, self.Error);
        },
        getBranchList(){
            let self = this;
            self.$http.get(self.$store.getters.prodApiUrl + "/branch/list")
			.then((response) => {
                //console.log(response.data.data);       
                self.branchData = response.data.data;   
                self.branchData.unshift({branchId: '', name: 'Все филиалы'})  
			}, self.handleError);
        },
    },
    mounted(){
        this.fromDate = this.date.fromDate;
        this.toDate = this.date.toDate;
        this.getSummery();
        this.getBranchList();
    }
}
</script>
<style scoped>
    .top{
        display: flex;
        align-items: center;
    }
    .select{
        width: 300px;
        margin: 0px 10px;
    }
    .statistics{
        padding: 15px;
        background: #FFFF;
        margin: 15px 10px;
        border-radius: 10px;
    }
    .stat-text{
        margin: 0;
        /* font-style: italic; */
    }
    .stat-header{
        margin: 0 5px;
        text-align: center;
    }
    .card-products-child-value{
        background: #29292936;
        color: #FFFF;
        padding: 6px;
        border-radius: 15px;
        margin: 0 5px 0 0;
        min-width: 50px;
        text-align: center;
    }
    .card-products-child-name{
        font-style: italic;
    }
    .card-products-child{
        margin: 5px;
        padding: 0px 10px 0px 0;
        background: #bbbbbb;
        border-radius: 15px;
        color: #FFFF;
        display: flex;
        align-items: center;
    }
    .card-products{
        display: flex;
        flex-wrap: wrap;
    }    
    .statuses{
        display: flex;
        flex-wrap: wrap;
    }    
    .humo{
        background: #1d3446 !important;
    }
    .uzcard{
        background: #f8ca02 !important;
    }
    .visa-gold{
        background: #c7a64e !important;
    }
    .visa-platinum{
        background: #17232f !important;
    }
    .visa-classic{
        background: #c4d4e2 !important;
        color: #2a376d !important;
    }
    .visa-infinite{
        background: #151a1b !important;
    }
    .visa-infinite-value{
        background: #71717185 !important;
    }
</style>
