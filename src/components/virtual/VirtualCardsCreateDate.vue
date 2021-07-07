<template>
    <div>
        <div class="head">
            <h2 class="mt-3">Количество карт: {{totalElements}}</h2> 
            <v-btn small class="excel-btn" @click="getExcel">Скачать Excel</v-btn>
            <download-excel
                    v-show="false"
                    id="excel"
                    name="virtualcards_create_date"
                    :fields="operationExport"
                    :data="excelData">
                <v-btn icon dark color="secondary">
                    <v-icon>mdi-file-excel</v-icon>
                </v-btn>
            </download-excel> 
        </div>
        <span class="count">
            <p class="count-text" v-for="(item,key, index) in countData" :key="index">{{key}}: <span v-if="item.length">{{item[0].count}}</span></p>
        </span>
        <v-data-table
        :headers="headers"
        :items="data"
        :loading="loader"
        :pagination.sync="pagination"
        item-key="id"
        hide-actions
        >
                <template slot="items" slot-scope="props">
                    <tr>
                        <td>{{ props.item.name }}</td>                      
                        <td>{{ props.item.pdate | timestamp-to-date }}</td>
                        <td>{{ props.item.status }}</td>                    
                    </tr>
                </template>                            
            </v-data-table>
                <v-pagination
                v-if="data.length"
                :disabled="loader"
                class="center"
                v-model="page"
                :length="totalPages"
                :total-visible="10"
                ></v-pagination>    
    </div>
</template>
<script>
export default {
    name: 'VirtualCardsCreateDate',  
    props:{
        date: Object, cardProduct: Array
    },
    data(){
        return {
            page: 1,
            totalPages: '',
            data: [],
            loader: false,
            pagination: {
                rowsPerPage: 5
            },
            headers: [
                {text: "Наименование", value: "name", sortable: false},
                {text: "Дата", value: "pdate", sortable: false},
                {text: "Статус", value: "status", sortable: false},
            ],               
            loader: false,     
            excelData: [],   
            totalElements: '',
            countData: {},
            
        }
    },
    computed:{
        operationExport() {
                let self = this, result = {};
                for (let i = 0; i < self.headers.length; i++) {
                    let currentHeader = self.headers[i];                  
                    result[currentHeader.text] = currentHeader.value;
                }
                result['Дата'] = {
                    field: "pdate",
                    callback: value => {
                        let date = new Date(parseInt(value));
                        return date.toLocaleString();
                    }
                };
                return result;
            }
    },
    watch:{
        page(val){
            this.getCreateDate(val)
        },
        date(val){
            if(this.page===1){
                this.getCreateDate(1);
                this.getCount();
            }
            else{
                this.page = 1;  
                this.getCount();
            }
        }
    },
    methods:{
        getExcel(){
            this.loader = true;
            let postData = {
                dateFrom: this.date.fromDate,
                dateTo: this.date.toDate,
                status: ['SUCCESS'],
                cardProduct: this.cardProduct
            }
            if(postData.dateFrom===''&&postData.dateTo===''){
                delete postData.dateFrom;
                delete postData.dateTo;
            }
            if(this.cardProduct.length!=0){
                this.$http.post(this.$store.getters.newApiUrl2+`/report/virtual_card/excel`, postData)
                .then(response=>{
                    this.excelData = response.data.data;  
                    if(this.excelData.length!=0){
                        let elem = document.getElementById('excel');
                        setTimeout(()=>{
                            elem.click();
                        }, 500)
                    }
                    this.loader = false;
                }, this.handleError)
            }
            else{
                this.$store.commit('errorMessage', 'Выберите продукт')
            }
        },
        getCreateDate(page){
            if(this.cardProduct.length!=0){

                this.loader = true;
                let postData = {
                    dateFrom: this.date.fromDate,
                    dateTo: this.date.toDate,
                    status: ['SUCCESS'],
                    cardProduct: this.cardProduct
                }
                if(postData.dateFrom===''&&postData.dateTo===''){
                    delete postData.dateFrom;
                    delete postData.dateTo;
                }

                this.$http.post(this.$store.getters.newApiUrl+`/report/virtual_card?page=${page-1}&size=5`, postData)
                .then(response=>{
                    console.log(response.data.data)
                    this.data = response.data.data.content;
                    this.totalPages = response.data.data.totalPages;
                    this.totalElements = response.data.data.totalElements;
                    this.loader = false;
                }, this.handleError)
            }
            else{
                this.$store.commit('errorMessage', 'Выберите продукт')
            }
        },
        getCount(){
            if(this.cardProduct.length!=0){
                let postData = {
                    dateFrom: this.date.fromDate,
                    dateTo: this.date.toDate,
                    status: ['SUCCESS'],
                    cardProduct: this.cardProduct
                }
                if(postData.dateFrom===''&&postData.dateTo===''){
                    delete postData.dateFrom;
                    delete postData.dateTo;
                }
                this.countData = {};
                this.$http.post(this.$store.getters.newApiUrl2+`/report/virtual_card/count`, postData)
                .then(response=>{
                    this.countData = response.data.data;
                }, this.handleError)
            }
        }
    },
    mounted(){
        this.getCreateDate(1);
        this.getCount();
    }
}
</script>
<style scoped>
    .center{
        display: flex;
        justify-content: center;
        margin: 15px;
        flex-wrap: wrap;
    } 
    .head{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .excel-btn{
        border-radius: 29px;
        background: #3d9c3d !important;
        color: #FFFF !important;
        margin: 20px 10px;
    }    
    .text{
        font-size: 17px;
    }
    .count{
        display: flex;
    }
    .count-text{
        margin-right: 15px;
    }
</style>
