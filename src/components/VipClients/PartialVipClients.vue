<template>
    <div class="main">
        <h1>Частичные VIP-клиенты</h1>       
        <v-text-field
                v-model="search"
                prepend-icon="mdi-magnify"
                label="Поиск">
        </v-text-field>
        <v-data-table
            :headers="headers"
            :items="content"
            :loading="loader"
            :search="search"
            :pagination.sync="pagination"
            item-key="id">
            <template slot="items" slot-scope="props">
                <tr @click="props.expanded = !props.expanded">
                    <td>{{ props.item.userId }}</td>
                    <td>{{ props.item.userFullName }}</td>
                    <td>{{ props.item.operationCode }}</td>
                    <td>{{ props.item.receiver }}</td>

                    <td>{{ props.item.minAmount / 100 | number-format }} {{props.item.currency}}</td>
                    <td>{{ props.item.maxAmount / 100 | number-format }} {{props.item.currency}}</td>
                    <td>{{ props.item.validTill | timestamp-to-date}}</td>
                    <td>{{ props.item.details}}</td>
                    <td>
                        <v-btn @click="openEditBox(props.item)"
                                icon small>
                            <v-icon small>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon small @click.native="openDeleteBox(props.item)">
                            <v-icon small>mdi-delete</v-icon>
                        </v-btn>
                    </td>
                </tr>
            </template>
        </v-data-table>
        <v-dialog v-model="editDialog" persistent max-width="560">
            <v-card>
                <v-card-title class="headline">Изменение</v-card-title>
                <v-card-text style="height: 300px; overflow: auto">       
                    <!-- <v-text-field v-model="operationCode"></v-text-field> -->
                    <v-select :items="operationCodeData" v-model="operationCode" item-text="operationCode" item-value="operationCode"></v-select>
                    <v-select :items="['UZS', 'USD']" v-model="currency" label="Валюта"></v-select>
                    <v-text-field v-model="minAmount" label="Минимальная сумма"></v-text-field>
                    <v-text-field v-model="maxAmount" label="Максимальная сумма"></v-text-field>
                    <v-checkbox v-model="receiver" label="Лимит для получателя"></v-checkbox>
                    <v-text-field v-model="details" label="Детали"></v-text-field>
                    <v-datetime-picker
                        prepend-icon="mdi-clock"
                        v-model="validTill"
                        label="Срок действия"
                    />
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-grey" :loading="loader" style="color: #FFFF;" text @click="edit">Подтвердить</v-btn>
                    <v-btn color="blue-grey" style="color: #FFFF;" text @click="editDialog = false">Отмена</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="deleteDialog" persistent max-width="560">
            <v-card>
                <v-card-title class="headline">Вы действительно хотите удалить?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-grey" :loading="loader" style="color: #FFFF;" text @click="remove">Подтвердить</v-btn>
                    <v-btn color="blue-grey" style="color: #FFFF;" text @click="deleteDialog = false">Отмена</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
export default {
    name: 'PartialVipClients',
    data(){
        return {
            loader: false,
            pagination: {
                rowsPerPage: 10
            },
            headers: [
                {text: "ID", value: "userId", sortable: false},
                {text: "Полное имя", value: "userFullName",sortable: false},
                {text: "Код операции", value: "operationCode",sortable: false},
                {text: "Лимит для получателя", value: "receiver",sortable: false},
                {text: "Минимальная сумма", value: "minAmount",sortable: false},
                {text: "Максимальная сумма", value: "maxAmount",sortable: false},
                {text: "Срок действия", value: "validTill",sortable: false},
                {text: "Детали", value: "details",sortable: false},
                {text: "Действия", value: "",sortable: false},

            ],
            content: [],  
            search: '',  
            editDialog: false,     
            deleteDialog: false,   
            operationCode:'',
            operationCodeData: [],
            currency: "",
            maxAmount: '',
            minAmount: '',            
            receiver: '',
            details:"",
            id: '',
            userId: '',
            validTill: '',
        }
    },
    watch: {
        editDialog(val){
            if(!val){
                this.operationCode = '';
                this.minAmount = '';
                this.maxAmount = '';
                this.currency = '';
                this.details = '';
                this.receiver = '';
                this.userId = '';
                this.validTill = '';
            }
        },
        deleteDialog(val){
            if(!val){
                this.id = '';
            }
        }
    },
    methods:{
        remove(){
            let self = this;
            self.$http.delete(self.$store.getters.loyaltyUrl + '/limit/partialVip/'+this.id)
			.then(() => {
                self.deleteDialog = false;
                self.getPartialVipClients();                
			}, self.handleError);
        },
        getOperationCode(){
            let self = this;
            self.$http.get(self.$store.getters.loyaltyUrl + '/operationCode')
			.then((response) => {
                // console.log(response.data.data);
                self.operationCodeData = response.data.data;
			}, self.handleError);
        },
        openEditBox(item){
            this.editDialog = true;
            this.operationCode = item.operationCode;
            this.minAmount = item.minAmount/100;
            this.maxAmount = item.maxAmount/100;
            this.currency = item.currency;
            this.details = item.details;
            this.receiver = item.receiver;
            this.userId = item.userId;
            let date;
            if(item.validTill)
                date = new Date(item.validTill)
            else 
                date = new Date()
            this.validTill = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.toLocaleTimeString();
            this.id = item.id;
        },
        openDeleteBox(item){
            this.deleteDialog = true;
            this.id = item.id;

        },
        getPartialVipClients(){
            let self = this;
            self.$http.get(self.$store.getters.loyaltyUrl + '/limit/partialVip')
			.then((response) => {
                console.log(response.data.data);
                self.content = response.data.data;
                self.loader = false;
			}, self.handleError);
        },
        edit(){
            let self = this;
            this.loader = true;
            var putData = {
                "currency": this.currency,
                "maxAmount": this.maxAmount * 100,
                "minAmount": this.minAmount * 100,
                "userId": this.userId,
                "operationCode": this.operationCode,
                "receiver": this.receiver, 
                "details": this.details,
                "validTill": new Date(this.validTill).getTime(),
                "id": this.id
            }
            self.$http.put(self.$store.getters.loyaltyUrl + '/limit/partialVip', putData)
			.then((response) => {
                // console.log(response.data.data);
                self.loader = false;
                self.editDialog = false;
                self.getPartialVipClients();
			}, self.handleError);
        }
    },
    mounted(){
        this.getOperationCode();
        this.getPartialVipClients();
    }
}
</script>
<style scoped>
    .main{
        width: 100%;
    }
</style>