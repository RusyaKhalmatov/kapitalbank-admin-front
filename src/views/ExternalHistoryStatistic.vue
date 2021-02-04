<template>
    <div class="main">
        <h1 class="headline">Количество запросов по скорингу</h1>
        <date-select @date="getDate"></date-select>
        <div style="display: flex; justify-content: space-between">
            <span class="type">
                <v-select v-model="type" :items="typeData" label="Тип"></v-select>        
            </span>
            <!-- <p>USERID: {{userId}}</p> -->
            <v-btn class="mt-3 excel-btn" :loading="loader" @click="getExcel">Скачать Excel</v-btn>
            <download-excel
                    v-show="false"
                    id="excel"
                    :name="`Количество запросов по скорингу.xls`"
                    :fields="operationExport"
                    :data="excelData">
                <v-btn icon dark color="secondary">
                    <v-icon>mdi-file-excel</v-icon>
                </v-btn>
            </download-excel> 
        </div>
        <h1 class="headline">Количество запросов по скорингу: {{count | number-format}}</h1>
        <v-data-table
                :headers="headers"
                :items="content"
                v-if="content"
                :loading="loader"                                        
                :pagination.sync="pagination"
                hide-actions
                >
            <template slot="items" slot-scope="props">
                <tr @click="props.expanded = !props.expanded">
                    <!-- <td>{{props.item.userId}}</td> -->
                    <td style="font-size:10px">{{props.item.clientName}}</td>                                            
                    <td>{{props.item.maskedPan}}</td>
                    <td>{{props.item.accountType}}</td>
                    <td>{{props.item.createTime | timestamp-to-date}}</td>                    
                </tr>
            </template>
        </v-data-table>
        <v-pagination
        v-if="content.length!=0"
        :disabled="loader"
        class="center"
        v-model="page"
        :length="totalPages"
        :total-visible="10"
        ></v-pagination>
    </div>
</template>

<script>
import DateSelect from '@/components/date/DateSelect'

export default {
    name: 'ExternalHistoryStatistic',
    props:{
        userId: Number
    },
    components:{
        DateSelect
    },
    data(){
        return{
            // userId: '',
            type: 'Все',
            date: {},
            typeData: ['Все', 'UZCARD', 'HUMO'],
            fromDate:'',
            toDate: '',
            count: '',
            headers:[
                // {text: "ID пользователя", value: "userId"},
                {text: "Имя клиента", value: "clientName", sortable: false},
                {text: "Номер карты", value: "maskedPan", sortable: false},
                {text: "Тип", value: "accountType"},
                {text: "Время создания", value: "createTime", sortable: false},                
            ],
            content: [],
            totalPages: '',
            page: 1,
            pagination: {
                rowsPerPage: 10
            },
            totalElements: '',
            excelData: [],
        }
    },
    computed:{
        operationExport() {
            let self = this, result = {};
            for (let i = 0; i < self.headers.length; i++) {
                let currentHeader = self.headers[i];                  
                result[currentHeader.text] = currentHeader.value;
            }

            result['Время создания'] = {
                field: "createTime",
                callback: value => {
                    let date = new Date(parseInt(value)).toLocaleString();
                    return date;
                }
            };
            return result;
        }
    },
    watch:{
        date(val){
            this.fromDate = val.fromDate;
            this.toDate = val.toDate;
            this.getCount();
            this.getStatistics(1)
        },
        page(val){
            this.getStatistics(val);
        }
    },
    methods:{
        getDate(val){
            this.date = val;
        },
        getStatistics(page){
            const data = {
                // userId: this.userId,
                dateFrom: this.fromDate,
                dateTo: this.toDate,
                type: this.type,
                
            }
            if(this.type==='Все'){
                delete data.type
            }
            this.loader = true;
            // this.content = [];
            this.$http.get(this.$store.getters.apiUrl+`/admin/external-history/statistic/full?page=${page-1}&size=10`, {
                params: data
            })
            .then(response=>{
                console.log(response.data.data)
                this.content = response.data.data.content;
                this.totalPages = response.data.data.totalPages;
                this.totalElements = response.data.data.totalElements;
                this.loader = false;
            }, this.handleError)
        },
        getExcel(){
            const data = {
                // userId: this.userId,
                dateFrom: this.fromDate,
                dateTo: this.toDate,
                type: this.type,
                
            }
            if(this.type==='Все'){
                delete data.type
            }
            this.loader = true;
            this.excelData = [];
            this.$http.get(this.$store.getters.apiUrl+`/admin/external-history/statistic/full?page=0&size=${this.totalElements}`, {
                params: data
            })
            .then(response=>{
                this.loader = false;
                this.excelData = response.data.data.content;  
                if(this.excelData.length!=0){
                    let elem = document.getElementById('excel');
                    setTimeout(()=>{
                        elem.click();
                    }, 500)                
                }          
            }, this.handleError)
        },
        getCount(){
            const data = {
                // userId: this.userId,
                dateFrom: this.fromDate,
                dateTo: this.toDate,
                type: this.type,
                
            }
            if(this.type==='Все'){
                delete data.type
            }
            this.count = '';
            console.log(data)
            this.$http.get(this.$store.getters.apiUrl+`/admin/external-history/statistic`, {
                params: data
            })
            .then(response=>{
                // console.log(response.data.data);
                this.count = response.data.data.count;

            }, this.handleError)
        }
    },
    mounted(){
        if(this.fromDate!=''){
            this.getCount();
            this.getStatistics(1);
        }
        
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
    .type{
        width: 300px;
    }
    .center{
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: center;
            -ms-flex-pack: center;
                justify-content: center;
        margin: 15px;
        -ms-flex-wrap: wrap;
            flex-wrap: wrap;
    } 
    .excel-btn{
        border-radius: 29px;
        background: #3d9c3d !important;
        color: #FFFF !important;
        margin: 20px 0;
    }
</style>