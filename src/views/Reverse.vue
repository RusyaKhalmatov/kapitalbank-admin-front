<template>
    <div class="main">
        <h1>Отмена транзакций</h1>
        <div class="reverse-box">
            <v-text-field
                v-model="operationId"
                class="search-input"
                label="OperationID"
            ></v-text-field>
            <v-select
                v-model="transactionType"
                :items="['DEBIT', 'CREDIT']"
                label="Тип операции"
            ></v-select>
            <v-btn v-if="isShow" @click="reverse">Отменить транзакцию</v-btn>
            <v-btn v-else>
                <v-progress-circular            
                :size="25"
                color="amber"
                indeterminate
                ></v-progress-circular>    
            </v-btn>            
        </div>
    </div>
</template>

<script>
export default {
    name: 'reverse',
    data(){
        return {
            operationId: '',   
            transactionType: '',     
            isShow: true,
        }
    },
    methods:{
        reverse(){
            this.isShow = false;
            let self = this;
            var postData = {
                "operationId": this.operationId,
                "transactionType": this.transactionType
            }
            if(this.operationId&&this.transactionType){
                self.$http.post(self.$store.getters.apiUrl + '/transaction/manual/reverse', postData)
                .then(response => {
                    // console.log(response.data)
                    if(response.status===200){
                        this.$store.commit('successMessage', 'Платеж отменен!');  
                        self.operationId = '';
                        self.transactionType = '';
                    }
                    self.isShow = true;
                })
                .catch(error=>{
                    // console.log(error)
                    self.errorMessage(error.body.errorMessage);
                    self.operationId = '';
                    self.transactionType = '';
                    self.isShow = true;

                })

            }else{
                if(!self.operationId&&!self.transactionType){
                    self.errorMessage('Введите OperationID и выберите OperationType');
                    self.isShow = true;

                }
                else if(!self.operationId){
                    self.errorMessage('Введите OperationID');   
                    self.isShow = true;

                }
                else if(!self.transactionType){
                    self.errorMessage('Выберите OperationType');     
                    self.isShow = true;

                }
            }
        }
    }
}
</script>

<style scoped>
    .reverse-box{
        margin: 20px 0;
        display: flex;
        flex-direction: column;
    }
</style>