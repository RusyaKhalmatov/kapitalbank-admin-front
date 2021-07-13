<template>
    <v-card class="main">
        <h1 class="headline mt-3">История по счету и кошельку</h1>
            <div class="box">
                <span class="select">
                    <v-select v-model="type" :items="['СЧЕТ', 'КОШЕЛЕК']"></v-select>
                </span>
<!--                <span style="width:300px">
                    <v-text-field v-model="value" :label="type==='СЧЕТ'?'Счет':'Кошелек'"></v-text-field>
                </span>-->
            </div>
            <div class="param-box">
                <span class="row">
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
                <v-btn @click="getData" :loading="loader">Показать</v-btn>                
            </div>
            <div v-if="isWallet">
                <span class="d-flex px-3">
                    <v-text-field :value="userId" label="ID пользователя" readonly=""></v-text-field>
                    <v-text-field :value="userFullName" label="Полное имя" readonly=""></v-text-field>
                    <v-text-field :value="userPhone" label="Номер телефона" readonly=""></v-text-field>
                </span>
                <v-data-table
                    v-if="walletData.length!=0"
                    :headers="walletHeaders"
                    :items="walletData"
                    :loading="loader"
                    :pagination.sync="pagination"
                    >
                        <template slot="items" slot-scope="props">
                            <tr>
                                <td>{{ props.item.amount/100|number-format }}</td>
                                <td>{{ props.item.txnId }}</td>
                                <td>{{ props.item.operationCode }}</td>
                                <td>{{props.item.operationType}}</td>
                                <td>{{ props.item.extId }}</td>
                                <td>{{ props.item.operationId}}</td> 
                                <td>{{ props.item.externalDate | timestamp-to-date}}</td>   
                                <td>{{ props.item.details}}</td>   
                            </tr>
                        </template>
                        <template slot="actions-append">
                            <download-excel
                                    :fields="operationExport"
                                    name="wallet-history"
                                    :data="walletData">
                                <v-btn icon dark color="secondary">
                                    <v-icon>mdi-file-excel</v-icon>
                                </v-btn>
                            </download-excel>
                        </template>
                    </v-data-table>
            </div>
            <div v-if="isAccount">
                <span class="d-flex px-3">
                    <v-text-field :value="userId" label="ID пользователя" readonly=""></v-text-field>
                    <v-text-field :value="userFullName" label="Полное имя" readonly=""></v-text-field>
                    <v-text-field :value="userPhone" label="Номер телефона" readonly=""></v-text-field>
                    <v-text-field :value="nibbdId" label="NibbdID" readonly=""></v-text-field>
                    <v-text-field :value="openBalance" label="open balance" readonly=""></v-text-field>
                </span>
                <v-data-table
                    v-if="accountData.length!=0"
                    :headers="accountHeaders"
                    :items="accountData"
                    :loading="loader"
                    :pagination.sync="pagination"
                    >
                        <template slot="items" slot-scope="props">
                            <tr>
                                <td>{{ props.item.amount/100|number-format }}</td>
                                <td>{{ props.item.currency }}</td>
                                <td>{{ props.item.corr_acct }}</td>
                                <td>{{props.item.corr_bank}}</td>
                                <td>{{ props.item.corr_mfo }}</td>
                                <td>{{ props.item.corr_name}}</td> 
                                <td>{{ props.item.details}}</td>   
                                <td>{{ props.item.doc_no}}</td>   
                                <td>{{ props.item.value_date}}</td>   
                            </tr>
                        </template>
                        <template slot="actions-append">
                            <download-excel
                                    :fields="operationAccountExport"
                                    name="account-history"
                                    :data="accountData">
                                <v-btn icon dark color="secondary">
                                    <v-icon>mdi-file-excel</v-icon>
                                </v-btn>
                            </download-excel>
                        </template>
                    </v-data-table>
            </div>
    </v-card>
</template>

<script>
import DateSelect from '@/components/date/DateSelect'
export default {
    name: 'AccountWalletHistory',
    components:{
        DateSelect
    },
    data(){
        return {
            date1: new Date().toISOString().substr(0, 10),
            date2: new Date().toISOString().substr(0, 10),
            menu1: false,
            menu2: false,
            fromDate: '',
            toDate: '',
            loader: false,
            type: 'СЧЕТ',
            value: '',
            isWallet: false,
            isAccount: false,
            walletData: [],
            userFullName: '',
            userId: '',
            userPhone: '',
            pagination: {
                rowsPerPage: 10
            }, 
            walletHeaders: [
                {text: "Сумма", value: "amount", sortable: false},
                {text: "txnId", value: "txnId", sortable: false},
                {text: "Код операции", value: "operationCode", sortable: false},
                {text: "Тип операции", value: "operationType", sortable: false},
                {text: "extId", value: "extId", sortable: false},
                {text: "operationId", value: "operationId", sortable: false},
                {text: "externalDate", value: "externalDate", sortable: false},
                {text: "Детали", value: "details", sortable: false},
            ],
            accountHeaders:[
                {text: "Сумма", value: "amount", sortable: false},
                {text: "currency", value: "currency", sortable: false},
                {text: "corr_acct", value: "corr_acct", sortable: false},
                {text: "corr_bank", value: "corr_bank", sortable: false},
                {text: "corr_mfo", value: "corr_mfo", sortable: false},
                {text: "corr_name", value: "corr_name", sortable: false},
                {text: "details", value: "details", sortable: false},
                {text: "doc_no", value: "doc_no", sortable: false},
                {text: "value_date", value: "value_date", sortable: false},
            ],
            accountData: [],
            nibbdId:'',
            openBalance:'',
        }
    },
    computed:{
        operationExport() {
            let self = this, result = {};
            for (let i = 0; i < self.walletHeaders.length; i++) {
                let currentHeader = self.walletHeaders[i];          
                result[currentHeader.text] = currentHeader.value;                    
                
            }
            result['Сумма'] = {
                field: "amount",
                callback: value => {
                    return (parseInt(value) / 100).toString().replace('.',',');
                }
            };   
            result['externalDate'] = {
                field: "externalDate",
                callback: value => {
                    let date = new Date(parseInt(value)).toLocaleString();
                    return date;
                }
            };           
            
            return result;
        },
        operationAccountExport(){
            let self = this, result = {};
            for (let i = 0; i < self.accountHeaders.length; i++) {
                let currentHeader = self.accountHeaders[i];          
                result[currentHeader.text] = currentHeader.value;                    
                
            }
            result['Сумма'] = {
                field: "amount",
                callback: value => {
                    return (parseInt(value) / 100).toString().replace('.',',');
                }
            };   
            return result;

        }
    },
    methods:{
        getData(){
            this.fromDate = new Date(this.date1.split(' ')[0] + 'T' + this.date1.split(' ')[1] ).getTime();
            this.toDate = new Date(this.date2.split(' ')[0] + 'T' + this.date2.split(' ')[1]).getTime();

            if(this.type==='СЧЕТ')
                this.getAccountHistory();
            else
                this.getWalletHistory();
        },
        getAccountHistory(){
            if(this.value){
                this.loader = true;
                this.isWallet = false;
                this.$http.get(this.$store.getters.newApiUrl+`/account/admin/statement?account=${this.value}&startDate=${this.fromDate}&endDate=${this.toDate}`)
                .then(response=>{
                    console.log(response.data.data);
                    this.userFullName = response.data.data.userFullName;
                    this.nibbdId = response.data.data.history.nibbd_id;
                    this.openBalance = response.data.data.history.open_balance;
                    this.userId = response.data.data.userId;
                    this.userPhone = response.data.data.userPhone;
                    this.accountData = response.data.data.history.documents
                    this.loader = false;
                    this.isAccount = true;
                }, this.handleError)
            }
            else{
                this.$store.commit('errorMessage', 'Empty data');
            }
        },
        getWalletHistory(){
            if(this.value){
                this.loader = true;
                this.isAccount = false;
                this.$http.get(this.$store.getters.apiUrl+`/wallet/admin/history?wallet=${this.value}&startDate=${this.fromDate}&endDate=${this.toDate}`)
                .then(response=>{
                    console.log(response.data.data);
                    this.walletData = response.data.data.history;
                    this.userFullName = response.data.data.userFullName;
                    this.userId = response.data.data.userId;
                    this.userPhone = response.data.data.userPhone;
                    this.loader = false;
                    this.isWallet = true;
                }, this.handleError)
            }
            else{
                this.$store.commit('errorMessage', 'Empty data');
            }
        }
    }
}
</script>

<style scoped>
.main{
    width: 100%;
}
.headline{
    text-align: center;
}
.param-box{
    width: 500px;
    margin: 0 auto 25px auto;
    /* background: #FFFF; */
    padding: 19px;
    border-radius: 18px;
    display: flex;
    flex-direction: column;
}
.row{
    display: flex;
}
.select{
    width: 150px;

}
.box{
    display: flex;
    justify-content: center;
}
</style>
