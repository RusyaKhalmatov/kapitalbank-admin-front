<template>
    <div class="main">
        <h1>Сверка епосов</h1>
        <div class="header">
            <v-btn
            @click="Yesterday()"
            :class="[{'active-btn': active === 'btn1' },'header-button']"
            rounded
            color="primary"
            dark
            >За вчера</v-btn>
            <v-btn
            @click="Today()"
            :class="[{'active-btn': active === 'btn2' },'header-button']"
            rounded
            color="primary"
            dark
            >За сегодня</v-btn>
            <v-btn
            @click="LastMonth()"
            :class="[{'active-btn': active === 'btn3' },'header-button']"
            rounded
            color="primary"
            dark
            >За прошлый месяц</v-btn>
            <v-btn
            @click="Month()"
            :class="['header-button', {'active-btn': active === 'btn4' }]"
            rounded
            color="primary"
            dark
            >За текущий месяц</v-btn>
            <v-btn
            @click="getSettings"
            :class="['header-button', {'active-btn': active === 'btn6' }]"
            rounded
            color="primary"
            dark
            >Настройка</v-btn>
        </div>
        <div class="date-box" v-if="isDate">
            <p class="date-text">С {{ fromDate | timestamp-to-date}}</p>
            <p class="date-text">До {{ toDate | timestamp-to-date}}</p>
        </div>
        <div class="select-date-box" v-if="isSelect">
            <span class="select-date-box-child">
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
            <v-btn class="set-date" @click="getData">Получить</v-btn>
        </div>
        <div class="content-box">
            <div v-if="reportSumData.count" class="content-header">
                <h2>Количество - {{reportSumData.count}}</h2>
                <h2>Сумма - {{reportSumData.sum / 100 | number-format}}</h2>
            </div>
            <v-progress-circular
            v-else
            :size="50"
            color="amber"
            indeterminate
            ></v-progress-circular>

            <div class="excel-box">
                <download-excel
                v-if="reportDetailData.length!=0"
                :fields="headers"
                :data="reportDetailData">
                    <v-btn class=" header-button" dark color="secondary">
                        Скачать Excel файл
                    </v-btn>
                </download-excel>
                <v-progress-circular
                v-else
                :size="50"
                color="amber"
                indeterminate
                ></v-progress-circular>
            </div>
            
            
        </div>
    </div>
</template>

<script>
export default {
    name: "eposRevise",
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
            isShow: false,

            reportSumData: {},
            reportDetailData: [],
            headers: {
                "ID" : "id",
                "USERNAME" : "username",
                "REFNUM" : "refNum",
                "EXT" : "ext",
                // "PAN" : "pan",
                // "EXPIRY" : "expiry",
                "TRANSTYPE" : "tranType",
                "DATE12": "date12",
                "AMOUNT" : "amount",
                "STAN" : "stan",
                "MERCHANTID" : "merchantId",
                "TERMINALID" : "terminalId",
                "RESP": "resp",
                "RESPTEXT": "respText",
                "RESPSV": "respSV",
                "STATUS" : "status",

            },
        }
    },
    watch:{
        date1(){
            var tmpTime2 = this.date1.split('-');
            var begTime  = new Date(tmpTime2[0], tmpTime2[1]-1, tmpTime2[2], 0,0,0);
            this.fromDate = begTime.getTime();
        },
        date2(){
            var tmpTime1 = this.date2.split('-');
            var endTime  = new Date(tmpTime1[0], tmpTime1[1]-1, tmpTime1[2], 23,59,59);
            this.toDate = endTime.getTime();
        }
    },
    methods:{
        reportSum(){
            let self = this;
            self.reportSumData = {}
            self.$http.get(self.$store.getters.apiUrl + '/uzcard/report-sum', {
                params:{
                    dateFrom: this.fromDate,
                    dateTo: this.toDate,
                }
            })
            .then(response => {
                console.log(response.data);
                self.reportSumData = response.data.data;
            }, self.handleError);
        },
        reportDetail(){
            let self = this;
            self.reportDetailData = []
            self.$http.get(self.$store.getters.apiUrl + '/uzcard/report-detail', {
                params:{
                    dateFrom: this.fromDate,
                    dateTo: this.toDate,
                }
            })
            .then(response => {
                console.log(response.data);
                
                self.reportDetailData = response.data.data.trans
            
                console.log(self.reportDetailData)
            }, self.handleError)

        },
        getData(){
            this.reportSum();
            this.reportDetail();
        },
        Yesterday(){
            this.active = 'btn1';
            this.isDate = true;
            this.isSelect = false;
            var date = new Date();
            var begDay = new Date(date.getFullYear(), date.getMonth(),date.getDate() - 1);
            var endDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1, 23, 59,59);
            this.fromDate = begDay.getTime();
            this.toDate = endDay.getTime();
            console.log(this.fromDate, ' - ', this.toDate);        
            this.getData();                    
        },
        Today(){
            this.isDate = true;
            this.isSelect = false;
            this.active = 'btn2';
            var date = new Date();
            var begDay = new Date(date.getFullYear(), date.getMonth(),date.getDate());
            this.fromDate = begDay.getTime();
            this.toDate = date.getTime();   
            this.getData();        
        },
        LastMonth(){
            this.active = 'btn3';
            this.isDate = true;
            this.isSelect = false;
            var date = new Date();
            var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
            this.fromDate = firstDay.getTime();
            var endDay = new Date(date.getFullYear(), date.getMonth(), 0, 23, 59, 59);
            this.toDate = endDay.getTime();
            this.getData();                                
        },
        Month(){
            this.active = 'btn4';
            this.isDate = true;
            this.isSelect = false;
            var date = new Date();
            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            this.fromDate = firstDay.getTime();
            this.toDate = date.getTime();

            this.getData();        

        },
        getSettings(){
            this.active = 'btn6';
            this.isDate = false;
            this.isSelect = true;

            var tmpTime1 = this.date2.split('-');
            var endTime  = new Date(tmpTime1[0], tmpTime1[1]-1, tmpTime1[2], 23,59,59);
            var tmpTime2 = this.date1.split('-');
            var begTime  = new Date(tmpTime2[0], tmpTime2[1]-1, tmpTime2[2], 0,0,0);
            this.fromDate = begTime.getTime();
            this.toDate = endTime.getTime();
            console.log(this.date2, ' - ', this.date1)
        },        
    },
    mounted(){
        this.Today();
    }

}
</script>

<style scoped>
    .excel-box{
        margin: 35px;   
    }
    .content-box{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .select-box-image{
        width: 25px;
        height: 25px;
        margin: 0 5px;
        border-radius: 5px;
    }
    .select-type-btn{
        border-radius: 25px;
        width: 175px;
        /* height: 42px; */
    }
    .content-header{
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 10px;
    }
    .select-type-box{
        margin: 10px 0px 5px;
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
    .main{
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
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
    .child{
        padding: 12px 23px 0 0 !important;
    }
    .deposit-box-header-left{
        flex: 1 !important;
        text-align: center;
        /* margin: auto; */
        padding: 15px 0;
        border-right: 1px solid silver;
        display: flex;
        align-items: center;
        justify-content: center
    }
    .v-expansion-panel__header {
        padding: 12px 0 !important;
    }
    .deposit-box-header-right{  
        flex:1;
    }
    .deposit-box-header-right-top{
        text-align: center;
        padding: 10px 0;
    }
    
    .deposit-box-header-right-bottom{
        display: flex;
        flex:1 !important;        
    }
    .border-right{
        border-right: 1px solid silver;
    }
    .select-panel{
        background: #f9ca03bd !important;
    }
    .panel{
        background: whitesmoke !important;
    }
    .child-panel{
        background: #FFFF !important;
    }
    .border-bt{
        border-bottom: 1px solid silver;
    }
    .child-open-deposit{
        display: flex;
    }
    .open-deposit{
        display: flex;
        /* padding: 15px 0; */
        border: 1px solid silver;
        /* background: #FFFF; */
    }
    .v-expansion-panel__container--active {
        background: #f9ca03bd !important;

    }

    .select-deposit{
        cursor: pointer;
    }
    /* .select-deposit:hover{
        background: #575b7561;
    } */
    .border-none{
        border: 0 !important;
    }
    .v-expansion-panel{
        margin: 0 !important;
    }
    .right-padding{
        padding: 10px !important
    }
    .deposit-sum{
        flex: 1;
        text-align: center;
        padding: 15px 0;
        border-right: 1px solid silver;
    }
    p{
        margin: 0;
    }
</style>