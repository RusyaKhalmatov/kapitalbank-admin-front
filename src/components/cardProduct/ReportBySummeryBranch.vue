<template>
    <div class="statistics">            
       
        <v-data-table
            :headers="headers"
            :items="summeryData"                                                      

            >
            <template slot="items" slot-scope="props">
                <tr>
                    <td>{{ props.item.name }}</td>
                    <td>{{ props.item.WAITING }}</td>
                    <td>{{ props.item.READY }}</td>
                    <td>{{ props.item.SUCCESS}}</td>                                    
                </tr>
            </template>
            <template slot="no-data">
                <vue-content-loading :width="300" :height="50">
                    <rect x="0" y="3" rx="4" ry="4" width="10%" height="7" />
                    <rect x="40" y="3" rx="4" ry="4" width="15%" height="7" />
                    <rect x="110" y="3" rx="4" ry="4" width="35%" height="7" />
                    <rect x="240" y="3" rx="4" ry="4" width="20%" height="7" />

                    <rect x="0" y="13" rx="4" ry="4" width="10%" height="7" />
                    <rect x="40" y="13" rx="4" ry="4" width="15%" height="7" />
                    <rect x="110" y="13" rx="4" ry="4" width="35%" height="7" />
                    <rect x="240" y="13" rx="4" ry="4" width="20%" height="7" />
                    
                    <rect x="0" y="23" rx="4" ry="4" width="10%" height="7" />
                    <rect x="40" y="23" rx="4" ry="4" width="15%" height="7" />
                    <rect x="110" y="23" rx="4" ry="4" width="35%" height="7" />
                    <rect x="240" y="23" rx="4" ry="4" width="20%" height="7" />

                    <rect x="0" y="33" rx="4" ry="4" width="10%" height="7" />
                    <rect x="40" y="33" rx="4" ry="4" width="15%" height="7" />
                    <rect x="110" y="33" rx="4" ry="4" width="35%" height="7" />
                    <rect x="240" y="33" rx="4" ry="4" width="20%" height="7" />

                    <rect x="0" y="43" rx="4" ry="4" width="10%" height="7" />
                    <rect x="40" y="43" rx="4" ry="4" width="15%" height="7" />
                    <rect x="110" y="43" rx="4" ry="4" width="35%" height="7" />
                    <rect x="240" y="43" rx="4" ry="4" width="20%" height="7" />
                </vue-content-loading>                
                <!-- <vcl-table v-if="summeryData" width="100%" :height="355"></vcl-table> -->

            </template>
            <template slot="actions-append">
                <download-excel
                        v-if="isExcelShow"
                        name="branch"
                        :fields="excelHeader"
                        :data="summeryData">
                    <v-btn icon dark color="secondary">
                        <v-icon>mdi-file-excel</v-icon>
                    </v-btn>
                </download-excel> 
            </template>
        </v-data-table>  

    </div> 
</template>
<script>
import {VclTable, VueContentLoading}  from 'vue-content-loading';

export default {
    name: 'ReportBySummeryBranch',
    props:{
        date: Object
    },
    components:{
        VclTable, VueContentLoading
    },
    data(){
        return{
            summeryData: [],
            date1: '',
            date2: '',
            fromDate:'',
            toDate: '',
            branchData: [],
            branchId: '',
            headers: [
                {text: "Филиал", value: "name",sortable: false},
                {text: "В очереди по выпуску", value: "WAITING",sortable: false},
                {text: "Самые старые заявки которые исполняются", value: "READY", sortable: false},
                {text: "Доставлено", value: "SUCCESS",sortable: false},
            ],
            isExcelShow: false,
            excelHeader: {
                "Филиал": "name",
                "В очереди по выпуску": "WAITING",
                "Самые старые заявки которые исполняются": "READY",
                "Доставлено": "SUCCESS",
            },
        }
    },
    watch: {
        date(val){
            this.fromDate = val.fromDate;
            this.toDate = val.toDate;
            this.getSummeryBranch()
        },
    },
    methods:{
        isEmpty(obj){
            for (var i in obj){
                if(obj.hasOwnProperty(i)){
                    return false;
                }                
            }
            return true;
        },
        getSummeryBranch(){
            let self = this;

            this.summeryData = [];
            self.isExcelShow = false;
        
            var data = {
                "dateFrom" : this.fromDate,
                "dateTo": this.toDate,
            };
            self.$http.post(self.$store.getters.newApiUrl2 + "/card-product-order/summery/card-branch", data)
			.then((response) => {
                //console.log(response.data.data);
                // self.summeryData = response.data.data;
                for (var i in response.data.data){
                    response.data.data[i].READY  = self.$options.filters.timestampToDate(response.data.data[i].READY)
                    self.summeryData.push(response.data.data[i]);
                }
                self.isExcelShow = true;
                // console.log(self.summeryData)
			}, self.handleError);
        },
        
    },
    mounted(){
        this.fromDate = this.date.fromDate;
        this.toDate = this.date.toDate;
        this.getSummeryBranch();
    }
}
</script>
<style scoped>
    .top{
        display: flex;
        align-items: center;
    }
    .select{
        width: 300px;
        margin: 0px 10px;
    }
    .statistics{
        padding: 15px;
        background: #FFFF;
        margin: 15px 10px;
        border-radius: 10px;
    }

</style>
