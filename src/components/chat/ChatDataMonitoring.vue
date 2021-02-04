<template>
    <div class="main">
        <div class="select-box">  
            <span class="select">
                <v-select v-model="filterType" :items="filterTypeData" label="Тип фильтра"></v-select>
            </span>  
            <span v-if="filterType==='MONTH_BY_STATUS_TYPE'||filterType==='DAY_BY_STATUS_TYPE'" class="select">
                <v-select v-model="statusType" :items="statusTypeData" label="Тип статуса"></v-select>
            </span>   
            <v-radio-group v-if="filterType==='MONTH_BY_AUTO_CLOSED'||filterType==='DAY_BY_AUTO_CLOSED'" row v-model="radioGroup" label="По автозакрытым чатам:">
                <v-radio
                    :value="true"
                    label="Да"
                ></v-radio>
                <v-radio :value="false" label="Нет"></v-radio>
            </v-radio-group>
        </div>
        <line-chart v-if="isShow" :chartdata="chartddata" :options="chartOptions"/>


    </div>
</template>

<script>
import lineChart from '@/components/chart/LineChart'
export default {
    name: 'ChatDataMonitoring',
    components:{
        lineChart
    },
    data(){
        return{
            filterType: 'MONTH',
            statusType: 'ACTIVE',
            autoClosed: false,
            date: new Date(),
            filterTypeData: ['MONTH', 'MONTH_BY_STATUS_TYPE', 'MONTH_BY_AUTO_CLOSED', 'DAY', 'DAY_BY_STATUS_TYPE', 'DAY_BY_AUTO_CLOSED'],
            statusTypeData: ['ACTIVE', 'CLOSED', 'WAITING'],
            radioGroup: false,
            data: [],
            chartOptions:  {
                responsive: true,
                maintainAspectRatio: false
            },
            chartddata: {
                labels: ['Январь', 'Февраль', '23', '23', '23'],
                datasets: [
                    {
                        label: 'Количество чатов',
                        backgroundColor: '#FFB446',
                        data: [40, 20, 30, 35, 123]
                    }
                ]
            },
            isShow: false,
            
        }
    },
    watch:{
        filterType(val){
            this.getStatistic();
        },
        radioGroup(val){
            this.getStatistic();
        },
        statusType(val){
            this.getStatistic();
        }
    },
    methods:{
        getStatistic(){
            const data = {
                filter_type: this.filterType,
                status_type: this.statusType,
                auto_closed: this.radioGroup,
                date: this.date.getTime(),
            }
            this.isShow = false;
            this.$http.get(this.$store.getters.newApiUrl+`/chat/monitoring/filter/chats`, {
                params: data
            })
            .then(response=>{
                console.log(response.data.data);            
                this.data = response.data.data;                
                this.chartddata.labels = this.data.map(x=>{
                    const date = new Date(x.date)
                    return date.toLocaleString();
                }).reverse();
                this.chartddata.datasets[0].data = this.data.map(x=>x.value).reverse();
                console.log(this.chartddata)
                this.isShow = true;
            }, this.handleError)
        }
    },
    mounted(){
        this.getStatistic();
    }
}
</script>

<style scoped>
    .main{
        width: 100%;
    }
    .select{
        width: 500px;
        margin: 0 10px;
    }
    .select-box{
        display: flex;
    }
</style>