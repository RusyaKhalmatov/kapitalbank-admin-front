<template>
    <div class="main">
        <h1 class="header">Отчет сотрудников колл-центра</h1>
        <chat-data-monitoring></chat-data-monitoring>
        <div class="filter">
            <span class="select">
                <v-select
                    :items="filterTypeData"
                    label="Фильтр"
                    item-text="value"
                    item-value="key"
                    v-model="filterType"
                >            
                </v-select>
            </span>
            <template v-if="filterType==='STAFF_BY_CHATS_AND_STATUS_TYPE'">
                <span class="select">                
                    <v-select                    
                        :items="statusTypeData"
                        label="Фильтр"
                        v-model="statusType"
                    >              
                    </v-select>
                </span>   
                <v-btn @click="getMonitoring">Поиск</v-btn>     
            </template>
        </div>
        <v-data-table
        v-if="content.length!=0"
        :headers="headers"
        :items="content" 
        :pagination.sync="pagination"                                                     
        item-key="id">
            <template slot="items" slot-scope="props">
                <tr>
                    <td>{{ props.item.userId }}</td>
                    <td>{{ props.item.fullName }}</td>
                    <td>{{ props.item.quantity }}</td>               
                </tr>
            </template>                     
        </v-data-table>
        <v-progress-circular style="height:30px; width: 30px;"      
        v-else      
        class="center"
        indeterminate
        color="amber"
        ></v-progress-circular>
    </div>
</template>
<script>
import ChatDataMonitoring from './ChatDataMonitoring'
export default {
    name: 'ChatStaffMonitoring',
    components:{
        ChatDataMonitoring
    },
    data(){
        return {
            filterType: 'STAFF_BY_MESSAGE',
            filterTypeData: [{key: 'STAFF_BY_MESSAGE', value: 'По сообщениям'}, {key: 'STAFF_BY_CHATS_AND_STATUS_TYPE', value: 'По переводу чатов в состояние'}],
            statusType: '',
            statusTypeData: ['ACTIVE', 'WAITING', 'CLOSED'],
            headers: [
                {text: "ID", value: "userId", sortable: false},
                {text: "Полное имя", value: "fullName",sortable: false},
                {text: "Количество", value: "quantity",sortable: false},

            ],
            content: [],
            pagination: {
                rowsPerPage: 10
            },
        }
    },
    watch:{
        filterType(val){
            if(val==='STAFF_BY_MESSAGE')
                this.getMonitoring();
        }
    },
    methods:{
        getMonitoring(){
            let self = this;
            var data = {
                filter_type: this.filterType,
            }
            if(this.filterType === 'STAFF_BY_CHATS_AND_STATUS_TYPE'){
                Object.assign(data, {status_type: this.statusType})
            }
            self.$http.get(self.$store.getters.newApiUrl + '/chat/monitoring/filter/staff',{
                params: data
            })
            .then(response=>{
                console.log(response.data.data);
                self.content = response.data.data;
            }, self.handleError)
        }
    },
    mounted(){
        this.getMonitoring();
    }
}
</script>

<style scoped>
    .header{
        text-align: center;
    }
    .main{
        width: 100%;
    }
    .center{
        margin: 10px auto;
        display: flex;
        justify-content: center;
    }
    .select{
        height: 64px;
        width: 310px;
        margin: 5px;
    }
    .filter{
        display: flex;
        align-items: center;
    }
    
</style>