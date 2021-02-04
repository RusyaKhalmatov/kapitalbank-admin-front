<template>
    <div class="main">
        <div class="param-box">
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
            <v-btn @click="start">Показать</v-btn>
            <!-- <v-btn class="get-button" :loading="loader" @click="getTransactions">Показать</v-btn> -->

        </div>
            <h2 class="stat-header">{{description}} с {{fromDate | timestamp-to-date}} по {{toDate | timestamp-to-date}}</h2>
    </div>
</template>

<script>
export default {
    name: 'DateSelect',
    props:{
        description: String
    },
    
    data(){
        return{
            date1: '',
            date2: '',
            menu1: false,
            menu2: false,
            fromDate: '',
            toDate: '',
            step: false,
            loader: false,
        }
    },
    watch:{
        date1(val){
            var tmpTime2 = this.date1.split('-');
            var begTime  = new Date(tmpTime2[0], tmpTime2[1]-1, tmpTime2[2], 0,0,0);
            this.fromDate = begTime.getTime();
            // this.getSummery();
        },
        date2(val){
            //console.log(this.date2)
            var tmpTime1 = this.date2.split('-');
            var endTime  = new Date(tmpTime1[0], tmpTime1[1]-1, tmpTime1[2], 23,59,59);
            this.toDate = endTime.getTime();
            

        }
    },
    methods:{
        start(){
            
                this.$emit('date', {
                    'fromDate': this.fromDate,
                    'toDate': this.toDate
                });

            console.log({
                    'fromDate': this.fromDate,
                    'toDate': this.toDate
                })
        }
    },
    created(){
            var date = new Date();
            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
            this.date1 = firstDay.getFullYear()+'-'+('0'+(firstDay.getMonth()+1)).substr(-2)+'-'+('0'+1).substr(-2);
            var endDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
            this.date2 = date.getFullYear()+'-'+('0'+(date.getMonth()+1)).substr(-2)+'-'+('0'+ date.getDate()).substr(-2);  
            console.log(this.date2)
            var tmpTime1 = this.date2.split('-');
            var endTime  = new Date(tmpTime1[0], tmpTime1[1]-1, tmpTime1[2], 23,59,59);
            this.toDate = endTime.getTime();

            var tmpTime2 = this.date1.split('-');
            var begTime  = new Date(tmpTime2[0], tmpTime2[1]-1, tmpTime2[2], 0,0,0);
            this.fromDate = begTime.getTime();
    },
    mounted(){
        this.start();
        setTimeout(()=>{
            this.step = true;
        }, 2000)
    }
    
}
</script>
<style scoped>
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
    .stat-header{
        text-align: center;
    }
</style>