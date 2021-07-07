<template>
    <div class="main">
        <h1>Отчеты по активности клиентов</h1>
        <date-component @date="getDate"></date-component>
        <div class="d-flex flex-wrap checkbox">
            <v-checkbox v-for="(item,index) in statusData" :key="index" v-model="status" :label="item.value" :value="item.key"></v-checkbox>
        </div>
        <div class="button-box">
            <v-btn dark color="primary" class="get-btn" @click="load" :loading="loader">Получить</v-btn>
            <v-btn class="mt-3 excel-btn" :loading="loader" @click="getExcel">Скачать Excel</v-btn>
                <download-excel
                        v-show="false"
                        id="excel"
                        name="active-clients.xls"
                        :fields="operationExport"
                        :data="excelData">
                    <v-btn icon dark color="secondary">
                        <v-icon>mdi-file-excel</v-icon>
                    </v-btn>
                </download-excel> 
        </div> 
        <div class="amount-box">
            <div class="amount-box-child" v-for="(item, index) in amountData" :key="index">
                <div>
                    <p class="mb-0">{{item.status}}: <strong>{{item.amount | number-format}}</strong></p>
                </div>
            </div>
        </div>
        <div style="width:100%" class="search" v-if="data.length!=0">
            <span style="width:500px">
                <v-text-field @keyup.enter="load" v-model="search" label="Поиск"></v-text-field>
            </span>
            <v-btn @click="load" depressed>Поиск</v-btn>
            <v-spacer></v-spacer>
            <p class="mb-0" v-if="totalElements">Общее количество: <strong>{{totalElements|number-format}}</strong></p>
        </div>
        <div class="content">
            <v-data-table
                    v-if="isClick"
                    :headers="headers"
                    :loading="loader"
                    :items="data"       
                    hide-actions                                                                   
                    item-key="id">
                <template slot="items" slot-scope="props">
                    <tr @click="props.expanded = !props.expanded">
                        <td>{{ props.item.lastName }}</td>
                        <td>{{ props.item.firstName }}</td>
                        <td>{{ props.item.phone }}</td>
                        <td>{{ props.item.status }}</td>
                    </tr>
                </template>  
                <template slot="actions-append">
                    <download-excel
                            name="reportByActiveClients"
                            :fields="headers"
                            :data="data">
                        <v-btn icon dark color="secondary">
                            <v-icon>mdi-file-excel</v-icon>
                        </v-btn>
                    </download-excel>
                </template>                         
            </v-data-table>
            <v-pagination
            v-if="isClick&&totalPages"
            :disabled="loader"
            class="center"
            v-model="page"
            :length="totalPages"
            :total-visible="10"
            ></v-pagination> 
        </div>
    </div>
</template>

<script>
import DateComponent from '@/components/date/DateComponent'

export default {
    name: 'ReportByActiveClients',
    components:{
        DateComponent
    },
    data(){
        return {
            active: '',
            tmp :'',
            fromDate: '',
            toDate: '',
            date1: new Date().toISOString().substr(0, 10),
            date2: new Date().toISOString().substr(0, 10),
            menu1: false,
            menu2: false,
            isSelect: false,
            isDate: false,
            isActive: '',
            data: [],
            headers: [
                {text: "Фамилия", value: "lastName", sortable: false},
                {text: "Имя", value: "firstName",sortable: false},
                {text: "Номер телефона", value: "phone",sortable: false},
                {text: "Статус", value: "status",sortable: false},
            ],
            excelHeader: {
                "Фамилия": "lastName",
                "Имя": "firstName",
                "Номер телефона": "phone",
                "Статус": "status",
            },
            statusData: [],
            status: [],
            totalPages: '',
            page:1,
            date:{},
            excelData: [],
            isClick: false,
            search: '',
            totalElements: '',
            amountData: [],
        }
    },
    watch:{
        page(val){
            this.getActiveClients(val)
            this.getAmount();
        },
        status(val){
            this.data = [];

            this.totalPages = '';
            this.isClick = false;
            this.search = '';
        },
        search(val){
            if(!val){
                this.load();
            }
        }
    },
    computed:{
        operationExport() {
            let self = this, result = {};
            for (let i = 0; i < self.headers.length; i++) {
                let currentHeader = self.headers[i];                  
                result[currentHeader.text] = currentHeader.value;
            }
            return result;
        }
    },
    methods:{
        getDate(val){
            this.date = val;
            this.transactions = [];
            this.totalPages = '';
            this.amountData = [];
            this.operationAmount = {}
            this.data = [];
            this.isClick = false
            this.search = '';

            // console.log(this.date)
            // if(this.page===1)
            //     this.getRequisite(this.page);
            // else
            //     this.page = 1;
        },
        load(){
            this.isClick=true
            if(this.page===1){
                this.getActiveClients(1);
            }
            else{
                this.page=1
            }            
            this.getAmount();
        },
        getExcel(){
            let postData = {
                dateFrom : this.date.fromDate,
                dateTo: this.date.toDate,
                status: this.status,
                search: this.search.trim()
            }
            if(this.date.fromDate==="")
                delete postData.dateFrom
            if(this.date.toDate==="")
                delete postData.dateTo
            
            this.loader = true;
            this.$http.post(this.$store.getters.newApiUrl2 + `/report/active-clients/v2/excel?search=${this.search}`, postData)
            .then(response => {
                this.loader = false;
                this.excelData = response.data.data;  
                if(this.excelData.length!=0){
                    let elem = document.getElementById('excel');
                    setTimeout(()=>{
                        elem.click();
                    }, 500)
                
                }          
            }, this.handleError);
        },
        getStatus(){
            this.$http.get(this.$store.getters.newApiUrl2 + '/report/active-clients/v2/status')
            .then((response) => {
                this.statusData = response.data.data;
                this.status = this.statusData.map(x=>x.key)
            }, this.handleError);
        },
        getAmount(){
            let postData = {
                dateFrom: this.date.fromDate,
                dateTo: this.date.toDate,
                status: this.status,
                search: this.search.trim()
            }            
            if(this.date.fromDate==="")
                delete postData.dateFrom
            if(this.date.toDate==="")
                delete postData.dateTo
            
            this.$http.post(this.$store.getters.newApiUrl2 + `/report/active-clients/v2/amount`, postData)
            .then((response) => {
                // console.log(response.data);    
                this.amountData = response.data.data;
            }, self.handleError);
        },
        getActiveClients(page){
            let self = this;
            // self.data = [];
            this.loader = true;
            let postData = {
                dateFrom: this.date.fromDate,
                dateTo: this.date.toDate,
                status: this.status,
                search: this.search.trim()
            }
            if(this.date.fromDate===''&&this.date.toDate===''){
                delete postData.dateFrom
                delete postData.dateTo
            }
            self.$http.post(self.$store.getters.newApiUrl2 + `/report/active-clients/v2?page=${page-1}&size=10`, postData)
            .then((response) => {
                // console.log(response.data);
                self.data = response.data.data.content;
                this.totalElements = response.data.data.totalElements;
                this.loader = false
                this.totalPages = response.data.data.totalPages;
            }, self.handleError);
        }       
    },
    mounted() {
        this.getStatus();
    },
}
</script>

<style scoped>
    .amount-box{
        margin: 10px;
        padding: 10px;
        width: 100%;
        display: flex;
        justify-content: center;
        
    }
    .amount-box-child{
        margin: 10px;
        font-size: 18px;
    }
    .search{
        display: flex;
        align-items: center;
        width: 500px;
    }
    .get-btn{
        border-radius: 20px;
    }
    .excel-btn{
        border-radius: 29px;
        background: #3d9c3d !important;
        color: #FFFF !important;
        margin: 20px 0;
    }
    .button-box{
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        align-items: center;
        margin: 10px;
    }
    .center{
        margin: 10px;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;

    }
    .main{
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }
    .checkbox{
        background: #fff;
        padding: 0 10px;
        border-radius: 15px;
        margin: 15px 0;
        flex-wrap: wrap;
        width: 100%;
    }   
    .select-date-box{
        background: #ffffff;
        padding: 10px;
        width: 415px;
        border-radius: 10px;
        margin: 25px 0px;
        display: flex;
        flex-direction: column;
    }
    .set-date{
        background-color: #fbc100 !important;
        color: #FFFF !important;
        border-radius: 8px;
    }
    .select-date-box-child{
        display: flex;
    }
    .header-button {
        background: #4e4e4e !important;
        border-radius: 28px;
    }
    .active-btn {
        background: #fbc100 !important;
    }
    .active-select-btn{
        background:#f3d559 !important;
        color: #000 !important;
    }
    .date-text{
        margin: 0;
    }
    .date-box{
        display: flex;
        width: 380px;
        justify-content: space-between;
        font-size: 17px;
        margin: 18px 0 8px;
    }
    .deposit-box{
        padding: 10px;
        width: 100%;
        display: flex;
        flex-direction: column;
    }
    .deposit-box-header{
        display: flex;
        color: #FFF;
        background: #4e4e4ee0;
        padding-right: 24px;
    }
    .content{
        width: 100%;
        margin: 20px;
    }
</style>
