<template>
    <div class="main">
        <h1 class="header">Отчет о количестве апельсинов у пользователей</h1>
        <!-- <div class="param-box">
            <span class="row">
                <v-menu
                    v-model="menu1"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                >
                    <template v-slot:activator="{ on }">
                        <v-text-field
                            v-model="date1"
                            label="С"
                            prepend-icon="event"
                            readonly
                            v-on="on"
                        ></v-text-field>
                    </template>
                    <v-date-picker v-model="date1" @input="menu1 = false"></v-date-picker>
                </v-menu>
                <v-menu
                    v-model="menu2"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                >
                    <template v-slot:activator="{ on }">
                    <v-text-field
                        v-model="date2"
                        label="До"
                        prepend-icon="event"
                        readonly
                        v-on="on"
                    ></v-text-field>
                    </template>
                    <v-date-picker v-model="date2" @input="menu2 = false"></v-date-picker>
                </v-menu>
            </span>
            <v-btn class="get-button" :loading="loader" @click="getTransactions">Показать</v-btn>

        </div> -->
        <div class="search-box">
                <p class="search-text">Поиск: </p>
                <span class="select">
                    <v-select :items="['FULL_NAME', 'PHONE', 'NONE']" v-model="filterType"></v-select>
                </span>
                <template v-if="filterType!='NONE'">
                    <the-mask @keyup.enter="getFilterAccount(1)" v-if="filterType==='PHONE'" :mask="['998 9# ###-##-##']" class="phone"  v-model="filterValue" placeholder="998 " @keypress="isNumber($event)" type="text" />
                    <input  @keyup.enter="getFilterAccount(1)" v-if="filterType==='FULL_NAME'" type="text" v-model="filterValue" class="phone">
                    <!-- <v-text-field  v-model="search" label="Поиск"></v-text-field> -->
                    <v-btn @click="getFilterAccount(1)">Найти</v-btn>
                </template>
                <v-progress-circular style="height:30px; width: 30px;"            
                v-if="loader"
                indeterminate
                color="amber"
                ></v-progress-circular>
                <v-spacer></v-spacer>
                <v-btn class="mt-3 excel-btn" :loading="loader" @click="getExcel">Скачать Excel</v-btn>
                <download-excel
                    v-show="false"
                    id="excel"
                    :name="`Количество апельсинов - (${new Date().toLocaleDateString()}).xls`"
                    :fields="operationExport"
                    :data="excelData">
                    <v-btn icon dark color="secondary">
                        <v-icon>mdi-file-excel</v-icon>
                    </v-btn>
                </download-excel> 

        </div>
        <v-data-table
        :headers="headers"
        :items="content"                                                      
        hide-actions
        item-key="id">
            <template slot="items" slot-scope="props">
                <tr>
                    <td>{{ props.item.accountNumber }}</td>
                    <td>{{ props.item.fullName }}</td>
                    <td>{{ props.item.phoneNumber }}</td>
                    <td>{{ props.item.lastEarnedDate | timestamp-to-date }}</td>
                    <td>{{ props.item.totalApelsins}}</td>                    
                </tr>
            </template>                     
        </v-data-table>
        <v-pagination
        v-if="totalPages"
        class="center"
        v-model="page"
        :length="totalPages"
        :total-visible="10"
        ></v-pagination>
    </div>
</template>
<script>

export default {
    name: 'LoyaltyFilterAccount',
    data(){
        return {
            date1: '',
            date2: new Date().toISOString().substr(0, 10),
            menu1: false,
            menu2: false,
            loader: false,
            search: '',
            filterType: 'NONE',
            filterValue: '',
            page: 1,
            totalPages: '',
            content: [],
            headers: [
                {text: "Номер аккаунта", value: "accountNumber", sortable: false},
                {text: "Полное имя", value: "fullName",sortable: false},
                {text: "Номер телефона  ", value: "phoneNumber",sortable: false},
                {text: "Дата последнего заработка", value: "lastEarnedDate",sortable: false},
                {text: "Количество апельсинов", value: "totalApelsins",sortable: false},
            ],
            loader: true,
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
            result['Дата последнего заработка'] = {
                field: "lastEarnedDate",
                callback: value => {
                    let date = new Date(parseInt(value)).toLocaleString();
                    return date;
                }
            };
            return result;
        }
    },
    watch:{
        page(val){
            this.getFilterAccount(val);
        },
        filterType(val){
            if(val==='NONE'){
                this.filterValue = '';            
                this.getFilterAccount(this.page);
            }
            else{
                this.filterValue = '';            
            }

        }
    },
    methods:{
        isNumber: function(evt) {
            evt = (evt) ? evt : window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                evt.preventDefault();
            } else {
                return true;
            }
        },
        getFilterAccount(page){
            let self = this;
            if(page===1){
                this.page = 1;  
            }
            this.loader = true;

            // this.content = [];
                // console.log(this.filterValue, ' - ', '9989'+this.filterValue)
                if(this.filterType==='PHONE'&&this.filterValue.length===12&&this.filterValue.substr(0,4)==='9989'){
                    return '';
                }

                if(this.filterType==='PHONE'&&this.filterValue.length===8){
                    this.filterValue = '9989'+this.filterValue;
                }

                var data = {
                    page: (page-1),
                    size: 10,
                    filter_type: this.filterType,
                }
                if(this.filterType!='NONE'){
                    Object.assign(data, {filter_value: this.filterValue});
                }
                self.$http.get(self.$store.getters.newApiUrl2 + '/dashboard/loyalty/filter/account',{
                    params: data
                })
                .then(response=>{
                    // console.log(response.data.data);
                    self.totalPages = response.data.data.totalPages;
                    self.totalElements = response.data.data.totalElements;
                    self.content = response.data.data.content;
                    self.loader = false;
                }, self.handleError)
            
        },
        getExcel(){
            let self = this;
            this.loader = true;

            // this.content = [];
                if(this.filterType==='PHONE'&&this.filterValue.length===12&&this.filterValue.substr(0,4)==='9989'){
                    return '';
                }

                if(this.filterType==='PHONE'&&this.filterValue.length===8){
                    this.filterValue = '9989'+this.filterValue;
                }

                var data = {
                    page: 0,
                    size: this.totalElements,
                    filter_type: this.filterType,
                }
                if(this.filterType!='NONE'){
                    Object.assign(data, {filter_value: this.filterValue});
                }
                self.$http.get(self.$store.getters.newApiUrl2 + '/dashboard/loyalty/filter/account',{
                    params: data
                })
                .then(response=>{
                    self.excelData = response.data.data.content;
                    self.loader = false;

                    if(this.excelData.length!=0){
                        let elem = document.getElementById('excel');
                        setTimeout(()=>{
                            elem.click();
                        }, 500)
                    }
                }, self.handleError)
        }
        
    },
    mounted(){
        this.getFilterAccount(1);
    }
    // created(){
    //     var date = new Date();
    //     var firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
    //     this.date1 = firstDay.getFullYear()+'-'+('0'+(firstDay.getMonth()+1)).substr(-2)+'-'+('0'+1).substr(-2);
    // },
}
</script>

<style scoped>
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
    .excel-btn{
        border-radius: 29px;
        background: #3d9c3d !important;
        color: #FFFF !important;
        margin: 20px 0;
    }
    .param-box{
        width: 500px;
        margin: 25px auto;
        background: #FFFF;
        padding: 19px;
        border-radius: 18px;
        display: flex;
        flex-direction: column;
    }
    .row{
        display: flex;
    }
    .get-button{
        margin: auto;
        width: 240px;
    }
    .search-box{
        display: flex;
        align-items: center;
    }
    .filter{
        /* width: 175px; */
    }
    .phone{
        height: 37px;
        border: 1px solid silver;
        padding: 10px;
        border-radius: 5px;
        width: 20%;
        margin: 5px;
    }
    .select{
        height: 64px;
        width: 200px;
    }
    .search-text{
        margin: 5px;
        font-size: 18px;
    }

</style>
