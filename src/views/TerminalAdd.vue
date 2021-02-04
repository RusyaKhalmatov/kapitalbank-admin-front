<template>
    <div class="main">
        <h1 class="header">Активация епосов Uzcard</h1>
        <div class="content">
            <v-text-field
                v-model="merchantId"
                @keypress="isNumber($event)" 
                label="MerchantID"
            ></v-text-field>
            <v-text-field
                v-model="terminalId"
                @keypress="isNumber($event)" 
                label="TerminalID"
            ></v-text-field>
            <v-text-field
                v-model="port"
                @keypress="isNumber($event)" 
                label="Port"
            ></v-text-field>
            <v-text-field
                v-model="name"
                label="Name"
            ></v-text-field>
            <v-select
                :items="type"
                v-model="typeId"
                label="Type"
                item-text="value"
                item-value="item"
            >
            </v-select>
            <v-btn :loading="loader" @click="add">Активация</v-btn>
        </div>
    </div>
</template>
<script>
export default {
    name: 'terminalAdd',
    data(){
        return{
            merchantId: '',
            terminalId: '',
            type: [
                {item: 1, value: "Debit"},
                {item: 2, value: "Credit"},
                {item: 3, value: "P2P"},
            ],
            typeId: '',
            name: '',
            port: '',
            loader: false,
        }
    },
    methods:{
        isNumber: function(evt) {
            evt = (evt) ? evt : window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                evt.preventDefault();
            } else {
                return true;
            }
        },
        add(){
            let self = this;
            this.loader = true;
            var postData = {
                merchantId : this.merchantId,
                terminalId: this.terminalId, 
                port: this.port,
                name: this.name,
                type: this.typeId
            }
            self.$http.post(self.$store.getters.apiUrl + '/uzcard/terminal-add', postData)
			.then((response) => {
                self.loader = false;
                self.merchantId = '';
                self.terminalId = '';
                self.typeId = '';
                self.name = '';
                self.port = '';
                self.loader = false;
                self.successMessage("Успешно");
                
			}, self.handleError);
        }
    },
    watch: {
        typeId(val){
            console.log(val)
        }
    }
}
</script>
<style scoped>
    .header{
        text-align: center;
    }
    .head-text{
        font-size: 21px !important;
        padding: 9px 25px;
        display: flex;
        font-weight: 600;
    }
    .main{
        width: 100%;
    }
    .content{
        width: 610px;
        margin: auto;
        padding: 10px;
        background: #FFFF;
        border-radius: 13px;
        display: flex;
        flex-direction: column;
    }
</style>