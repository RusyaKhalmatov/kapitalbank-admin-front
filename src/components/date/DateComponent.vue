<template>
    <div class="main">
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
            @click="All()"
            :class="['header-button', {'active-btn': active === 'btn5' }]"
            rounded
            color="primary"
            dark
            >За весь период</v-btn>
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
                <!-- <v-menu
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
                </v-menu> -->
                <v-datetime-picker
                    prepend-icon="mdi-clock"
                    v-model="date1"
                    label="Дата от"
                />
                <v-datetime-picker
                    prepend-icon="mdi-clock"
                    v-model="date2"
                    label="Дата до"
                />
            </span>
            <!-- <v-btn class="set-date" @click="getActiveClients">Получить</v-btn> -->
        </div>
    </div>
</template>
<script>
export default {
    name: 'DateComponent',
    data(){
        return{
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
            // headers: [
            //     {text: "Фамилия", value: "lastName", sortable: false},
            //     {text: "Имя", value: "firstName",sortable: false},
            //     {text: "Номер телефона", value: "phone",sortable: false},
            //     {text: "Статус", value: "status",sortable: false},
            // ],
            // excelHeader: {
            //     "Фамилия": "lastName",
            //     "Имя": "firstName",
            //     "Номер телефона": "phone",
            //     "Статус": "status",
            // },
        }
    },
    watch:{
        date1(val){
            console.log(val)
            // this.getData();
            var date = new Date();
            var begDay = new Date(val);
            var endDay = new Date(this.date2);
            this.fromDate = begDay.getTime();
            this.toDate = endDay.getTime();
            this.getData();

        },
        date2(val){
            var date = new Date();
            var begDay = new Date(this.date1);
            var endDay = new Date(val);
            this.fromDate = begDay.getTime();
            this.toDate = endDay.getTime();
            this.getData();
        }
    },
    methods:{
        Yesterday(){
            this.active = 'btn1';
            this.isDate = true;
            this.isSelect = false;
            var date = new Date();
            var begDay = new Date(date.getFullYear(), date.getMonth(),date.getDate() - 1);
            var endDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1, 23, 59,59);
            this.fromDate = begDay.getTime();
            this.toDate = endDay.getTime();
            // console.log(this.fromDate, ' - ', this.toDate);    
            this.getData() 

            // this.getData();                    
        },
        Today(){
            this.isDate = true;
            this.isSelect = false;
            this.active = 'btn2';
            var date = new Date();
            var begDay = new Date(date.getFullYear(), date.getMonth(),date.getDate());
            var endDay = new Date(date.getFullYear(), date.getMonth(),date.getDate(), 23, 59,59)
            this.fromDate = begDay.getTime();
            this.toDate = endDay.getTime();   
            // this.getData();       
            this.getData() 
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
            this.getData() 

            // this.getData();                                
        },
        Month(){
            this.active = 'btn4';
            this.isDate = true;
            this.isSelect = false;
            var date = new Date();
            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            var endDay = new Date(date.getFullYear(), date.getMonth(),date.getDate(), 23, 59,59)

            this.fromDate = firstDay.getTime();
            this.toDate = endDay.getTime();
            this.getData() 

            // this.getData();        

        },
        All(){
            this.active = 'btn5';
            this.isDate = false;
            this.isSelect = false;
            this.fromDate = '';
            this.toDate = '';
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
        getData(){
            let self = this;
            self.data = [];
            this.$emit('date', {
                    'fromDate': this.fromDate,
                    'toDate': this.toDate
                });
            // self.$http.get(self.$store.getters.apiUrl + '/report/active-clients',{
            //     params:{
            //         dateFrom: this.fromDate,
            //         dateTo: this.toDate,
            //     }
            // })
            // .then((response) => {
            //     // console.log(response.data);
            //     self.data = response.data.data;


            // }, self.handleError);
        }       
    },
    mounted(){
        this.Today();
    }
}
</script>
<style scoped>
    .main{
        display: flex;
        flex-direction: column;
        align-items: center;
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
        margin: 0 5px;
    }
    .date-box{
        display: flex;
        min-width: 300px;
        justify-content: space-between;
        font-size: 17px;
        margin: 18px 0 8px;
        text-align: center;
    }
</style>