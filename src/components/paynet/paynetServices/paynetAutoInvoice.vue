<template>
    <div :class="['my-3', 'pa-3', {'success': isSuccess}]">
        <!-- <v-btn @click="dialog=true" depressed>Данные для авто счет-фактуры</v-btn>
        <v-dialog persistent v-model="dialog" scrollable max-width="600px">
            {{dialogData}} -->
            <!-- <v-card> -->
                <!-- <v-card-title>Данные для авто счет-фактуры</v-card-title> -->
                <!-- <v-divider></v-divider> -->
                <!-- <v-card-text style="height: 600px;"> -->
                    <v-text-field v-model="dialogData.invTin" label="ИНН предприятия"></v-text-field>
                    <v-text-field v-model="dialogData.invLegalName" label="Наименование"></v-text-field>
                    <v-text-field v-model="dialogData.invLegalAddress" label="Адрес"></v-text-field>
                    <v-text-field v-model="dialogData.invVatCode" label="Код плательщика НДС"></v-text-field>
                    <v-text-field v-model="dialogData.invPaymentAccount" label="РС"></v-text-field>
                    <v-text-field v-model="dialogData.invMfo" label="МФО"></v-text-field>
                    <v-text-field v-model="dialogData.invDirector" label="Директор"></v-text-field>
                    <v-text-field v-model="dialogData.invChiefAccountant" label="Гл.бух"></v-text-field>
                    <v-text-field v-model="dialogData.invResponsibleFace" label="Ответсвенное лицо"></v-text-field>
                    <v-text-field v-model="dialogData.invNumber" label="Номер счет фактуры"></v-text-field>
                    <v-datetime-picker
                        prepend-icon="mdi-clock"
                        v-model="invTimestamp"
                        label="Дата счет фактуры"
                    />
                    <v-text-field v-model="dialogData.invAttorneyInformation" label="Данные по доверенности"></v-text-field>
                    <v-text-field v-model="dialogData.invInvoiceProducts" label="наим-е товаров-услуг, код по ИКПУ, ед.измер-я, кол-во, цена, стоимость поставки, ндс, всего"></v-text-field>


                <!-- </v-card-text> -->
                <!-- <v-divider></v-divider> -->
                <!-- <v-card-actions> -->
                <!-- <v-spacer></v-spacer> -->
                <v-btn color="blue darken-1" :disabled="isSuccess" flat :loading="loader" @click="add">Подтвердить</v-btn>
                <!-- <v-btn color="blue darken-1" flat @click="dialog = false">Закрыть</v-btn> -->
                <!-- </v-card-actions> -->
            <!-- </v-card> -->
            <!-- </v-dialog> -->
    </div>
</template>
<script>
export default {
    name: 'PaynetAutoInvoice',
    props:{
        serviceFormItems: Object
    },
    data(){
        return {
            dialog: false,
            dialogData:{},
            invTimestamp: null,
            loader: false,
            isSuccess: false,
        }
    },
    watch:{
        invTimestamp(val){
            this.dialogData.invTimestamp = new Date(val).getTime();
            this.isSuccess = false;
        },
        dialogData:{
            deep: true,
            handler(val){
                // console.log(val)
                this.isSuccess = false;
            }
        }
    },
    mounted(){
        // setTimeout(()=>{
            this.$nextTick(()=>{
                this.dialogData = this.serviceFormItems;
                let date
                if(this.serviceFormItems.invTimestamp){
                    date = new Date(this.serviceFormItems.invTimestamp)
                    this.invTimestamp = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() 
                }
                    
            })

        // },1000)
    },
    methods:{
        add(){
            this.loader = true;
            this.$emit('update:invoiceData', this.dialogData)
            // this.dialog = false;
            this.isSuccess = true;
            this.loader = false;
        }
    }
}
</script>
<style scoped>
    .success{
        background: #dfffdf !important;
    }
</style>