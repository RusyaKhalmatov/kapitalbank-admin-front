<template>
    <div class="main">
        <h1 class="header">Мониторинг тарифов программы лояльности</h1>
        <div class="search-box">
                <p class="search-text">Поиск: </p>
                <span class="select">
                    <v-select :items="['TARIFF_NAME', 'NONE']" v-model="filterType"></v-select>
                </span>
                <template v-if="filterType!='NONE'">
                    <v-text-field @keyup.enter="getFilterTariffs(1)" v-if="filterType==='TARIFF_NAME'" class="search" v-model="filterValue" label="Поиск"></v-text-field>
                    <v-btn @click="getFilterTariffs(1)">Найти</v-btn>
                </template>
                <v-progress-circular style="height:30px; width: 30px;"            
                v-if="loader"
                indeterminate
                color="amber"
                ></v-progress-circular>

        </div>
        <v-data-table
        :headers="headers"
        :items="content"                                                      
        hide-actions
        >
            <template slot="items" slot-scope="props">
                <tr :style="[{'background' : checkColor(props.item.alarming)}]">
                    <td>{{ props.item.tariffId }}</td>
                    <td v-if="props.item.imageUrl"><img class="logo" :src="props.item.imageUrl" alt="logo"></td>
                    <td v-else>{{ props.item.imageUrl }}</td>
                    <td>{{ props.item.priceInApelsin }}</td>
                    <td>{{ props.item.tariffName }}</td>
                    <!-- <td>{{ props.item.alarming }}</td> -->
                    <td>{{ props.item.totalPromoCodes}}</td>                    
                    <td>{{ props.item.activePromoCodes}}</td>                    
                    <td>{{ props.item.usedPromoCodes}}</td>                    

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
    name: 'LoyaltyFilterTariffs',
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
                {text: "ID тарифа", value: "tariffId", sortable: false},
                {text: "Лого", value: "imageUrl",sortable: false},
                {text: "Кол-во апельсинов", value: "priceInApelsin",sortable: false},
                {text: "Название тарифа", value: "tariffName",sortable: false},
                {text: "Количество", value: "totalPromoCodes",sortable: false},
                {text: "Активные", value: "activePromoCodes",sortable: false},
                {text: "Использованные", value: "usedPromoCodes",sortable: false},

            ],
            loader: true,
            activeColor: {
                background:  '#fd7272',
            }
        }
    },
    watch:{
        page(val){
            this.getFilterTariffs(val);
        },
        filterType(val){
            if(val==='NONE'){
                this.getFilterTariffs(this.page);
            }
            this.filterValue = '';
        }
    },
    methods:{
        checkColor(val){
            if(val){
                return '#fd7272'
            }
            else{
                return 'none';
            }
        },
        isNumber: function(evt) {
            evt = (evt) ? evt : window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                evt.preventDefault();
            } else {
                return true;
            }
        },
        getFilterTariffs(page){
            let self = this;
            if(page===1){
                this.page = 1;  
            }
            this.loader = true;

            // this.content = [];
            var data = {
                page: (page-1),
                size: 10,
                filter_type: this.filterType,
            }
            if(this.filterType!='NONE'){
                Object.assign(data, {filter_value: this.filterValue});
            }
            self.$http.get(self.$store.getters.newApiUrl + '/dashboard/loyalty/filter/tariffs',{
                params: data
            })
            .then(response=>{
                // console.log(response.data.data);
                self.totalPages = response.data.data.totalPages;
                self.content = response.data.data.content;
                self.loader = false;
            }, self.handleError)
        }
        
    },
    mounted(){
        this.getFilterTariffs(1);
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
    .logo{
        max-width: 50px;
        max-height: 50px;
    }
    .alarm{
        background: #fd7272 !important;
    }
    .search{
        margin: 5px;
        height: 55px;
    }
</style>