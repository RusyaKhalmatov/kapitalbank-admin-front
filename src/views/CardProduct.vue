<template>
    <div class="main">
		<h1>Карточные продукты</h1>
        <v-btn @click="addDialog=true">Добавить</v-btn>
        <div class="content">
                <v-card :class="['card', {'active-class': activeClass === item.id}]" v-for="(item, index) in cardProductTypeData" :key="index" @click="details(item.id)"> 
                    <img  
                    v-if="item.logoUrl"                  
                    :src="item.logoUrl"
                    aspect-ratio="2.75"
                    alt="logo"
                    class="logo-url"
                    />

                    <v-card-title primary-title >
                    <div>
                        <h3 class="headline mb-0">{{item.name}}</h3>
                        <div>Порядок: {{ item.order }} </div>
                        <!-- <div>ID родителя: {{ item.parentId }} </div> -->
                    </div>
                    </v-card-title>

                    <v-card-actions>
                        <v-btn @click.stop="openEditBox(item)"
                            flat color="orange" icon small>
                            <v-icon small>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn @click.stop="openRemoveBox(item.id)" flat color="orange" icon small>
                            <v-icon small>mdi-delete</v-icon>
                        </v-btn>
                    </v-card-actions>
                </v-card>
                
                <v-dialog v-model="deleteDialog" persistent max-width="290">
                    <v-card>
                        <v-card-title class="headline">Вы действительно хотите удалить?</v-card-title>
                        <v-card-actions style="text-align: center">
                        <v-spacer></v-spacer>
                        <v-btn  text @click="deleteCardProductType">Да</v-btn>
                        <v-btn  text @click="deleteDialog = false">Нет</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="addDialog" persistent max-width="600px">
                    <v-card>
                        
                        <span class="head-text">Создать продукт</span>
                        
                        <v-card-text>
                            <v-container>                                            
                                <v-text-field label="Название" v-model="name" required></v-text-field>                        
                                <!-- <v-text-field label="Логотип" v-model="logoUrl" required></v-text-field>                                                 -->
                                <img :src="logoUrlPreview" height="50px"/>
                                <input class="input-file" accept="image/*" type="file" @change="onFileChange($event)" ref="fileupload">
                                <!-- <v-file-picker
                                        :disabled="loader"
                                        @change="onFileChange($event)" 
                                        accept="image/*"
                                        label="Логотип">
                                </v-file-picker> -->
                                <v-text-field label="Порядок" v-model="order" required></v-text-field>      
                                <v-text-field label="ID родителя"  v-model="parentId" required disabled></v-text-field>                                            

                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text @click="addCardProductType">Сохранить</v-btn>
                        <v-btn text @click="addDialog = false">Отмена</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="editDialog" persistent max-width="600px">
                    <v-card>
                        
                        <span class="head-text">Изменить продукт</span>
                        
                        <v-card-text>
                            <v-container>                                            
                                <v-text-field label="Название" v-model="name" required></v-text-field>                        
                                <!-- <v-text-field label="Логотип" v-model="logoUrl" required></v-text-field> -->
                                <img v-if="logoUrlPreview" :src="logoUrlPreview" height="50px"/>
                                <input class="input-file" accept="image/*" type="file" @change="onFileChange($event)" ref="fileupload">

                                <v-text-field label="Порядок" v-model="order" required></v-text-field>     
                                <v-text-field label="ID родителя" v-model="parentId" required disabled></v-text-field>                                            

                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text @click="editCardProductType">Сохранить</v-btn>
                        <v-btn text @click="editDialog = false">Отмена</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="addItemDialog" persistent max-width="600px">
                    <v-card> 
                        <span class="head-text">Добавить продукт</span>
                        <v-card-text>
                            <v-container>                                            
                                <v-text-field label="Название" v-model="name" required></v-text-field>
                                <v-text-field label="cardTypeId"  v-model="detailId" required disabled></v-text-field>                        
                                <!-- <v-text-field label="Логотип" v-model="logoUrl" required></v-text-field>                                                 -->
                                <!-- <img :src="logoUrlPreview" height="50px"/> -->
                                <!-- <v-text-field label="Description" v-model="Description" required></v-text-field> -->
                                <!-- <v-textarea
                                    name="input-7-1"
                                    label="Описание"
                                    v-model="Description"
                                    ></v-textarea> -->
                                <v-flex xs12 class="quill-container pb-3">
                                    <p class="tariff-text">Описание (Ru)</p>
                                    <quill-editor v-if="addItemDialog" v-model="Description.ru"/>
                                </v-flex>
                                <v-flex xs12 class="quill-container pb-3">
                                    <p class="tariff-text">Описание (Uz)</p>
                                    <quill-editor v-if="addItemDialog" v-model="Description.uz"/>
                                </v-flex>
                                <v-flex xs12 class="quill-container pb-3">
                                    <p class="tariff-text">Описание (En)</p>
                                    <quill-editor v-if="addItemDialog" v-model="Description.en"/>
                                </v-flex>
                                <!-- <v-text-field label="LogoUrl" v-model="LogoUrl" required></v-text-field> -->
                                <p class="logo-upload-text">LogoURL: </p>
                                <img :src="logoUrlPreview" height="50px"/>
                                <input class="input-file" accept="image/*" type="file" @change="onLogoUrlChange($event)" ref="logoupload">

                                <!-- <v-text-field label="ImgUrl" v-model="ImgUrl" required></v-text-field> -->
                                <p class="logo-upload-text">ImageURL: </p>
                                <img :src="imageUrlPreview" height="50px"/>

                                <input class="input-file" accept="image/*" type="file" @change="onImageUrlChange($event)" ref="imageupload">

                                <v-text-field label="EmissionFee" v-model="EmissionFee" required></v-text-field>
                                <!-- <v-text-field label="EmissionCcy" v-model="EmissionCcy" required></v-text-field>   -->
                                <v-select
                                    v-model="EmissionCcy"
                                    :items="currencyArr"
                                    label="EmissionCcy">
                                </v-select>
                                <v-text-field label="DepositAmount" v-model="DepositAmount" required></v-text-field>
                                <!-- <v-text-field label="AccountCcy" v-model="AccountCcy" required></v-text-field>  -->
                                <v-select
                                    v-model="AccountCcy"
                                    :items="currencyArr"
                                    label="AccountCcy">
                                </v-select>
                                <v-text-field label="MaintenanceFee" v-model="MaintenanceFee" required></v-text-field>
                                <v-text-field label="TransactionFee" v-model="TransactionFee" required></v-text-field>
                                <!-- <v-text-field label="TransactionCcy" v-model="TransactionCcy" required></v-text-field>   -->
                                <v-select
                                    v-model="TransactionCcy"
                                    :items="currencyArr"
                                    label="TransactionCcy">
                                </v-select>  
                                <v-text-field label="Период" type="number"  v-model="period" required></v-text-field>  
                                <v-checkbox v-model="reIssueEnabled" label="Перевыпуск карты"></v-checkbox>
                                <template v-if="reIssueEnabled">
                                    <v-text-field label="Сумма перевыпуска" type="number"  v-model="reIssuedAmount" required></v-text-field>                        
                                    <v-text-field label="Префикс номера карты" type="number"  v-model="cardBins" required></v-text-field>                                                            
                                </template>
                                                    

                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text @click="addItemCardProductType">Сохранить</v-btn>
                        <v-btn text @click="addItemDialog = false">Отмена</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="editItemDialog" persistent max-width="600px">
                    <v-card>    
                        <span class="head-text">Изменить продукт</span>
                        <v-card-text>
                            <v-container>                                            
                                <v-text-field label="Название" v-model="name" required></v-text-field>                        
                                <v-text-field label="cardTypeId"  v-model="detailId" required disabled></v-text-field>                        
                                <!-- <v-text-field label="Логотип" v-model="logoUrl" required></v-text-field>                                                 -->
                                <!-- <img :src="logoUrlPreview" height="50px"/> -->
                                <!-- <v-text-field label="Описание" v-model="Description" required></v-text-field> -->
                                <!-- <v-textarea
                                    name="input-7-1"
                                    label="Описание"
                                    v-model="Description"
                                    ></v-textarea> -->
                                <v-flex xs12 class="quill-container pb-3">
                                    <p class="tariff-text">Описание (Ru)</p>
                                    <quill-editor v-if="editItemDialog" v-model="Description.ru"/>
                                </v-flex>
                                <v-flex xs12 class="quill-container pb-3">
                                    <p class="tariff-text">Описание (Uz)</p>
                                    <quill-editor v-if="editItemDialog" v-model="Description.uz"/>
                                </v-flex>
                                <v-flex xs12 class="quill-container pb-3">
                                    <p class="tariff-text">Описание (En)</p>
                                    <quill-editor v-if="editItemDialog" v-model="Description.en"/>
                                </v-flex>
                                <!-- <v-text-field label="LogoUrl" v-model="LogoUrl" required></v-text-field> -->
                                <!-- <v-text-field label="ImgUrl" v-model="ImgUrl" required></v-text-field> -->
                                <p class="logo-upload-text">LogoURL: </p>
                                <img :src="logoUrlPreview" height="50px"/>
                                <input class="input-file" accept="image/*" type="file" @change="onLogoUrlChange($event)" ref="logoupload">

                                <!-- <v-text-field label="ImgUrl" v-model="ImgUrl" required></v-text-field> -->
                                <p class="logo-upload-text">ImageURL: </p>
                                <img :src="imageUrlPreview" height="50px"/>

                                <input class="input-file" accept="image/*" type="file" @change="onImageUrlChange($event)" ref="imageupload">
                                <v-text-field label="EmissionFee" v-model="EmissionFee" required></v-text-field>
                                <!-- <v-text-field label="EmissionCcy" v-model="EmissionCcy" required></v-text-field>   -->
                                <v-select
                                    v-model="EmissionCcy"
                                    :items="currencyArr"
                                label="EmissionCcy">
                                </v-select>
                                <v-text-field label="DepositAmount" v-model="DepositAmount" required></v-text-field>
                                <!-- <v-text-field label="AccountCcy" v-model="AccountCcy" required></v-text-field>  -->
                                <v-select
                                    v-model="AccountCcy"
                                    :items="currencyArr"
                                label="AccountCcy">
                                </v-select>
                                <v-text-field label="MaintenanceFee" v-model="MaintenanceFee" required></v-text-field>
                                <v-text-field label="TransactionFee" v-model="TransactionFee" required></v-text-field>
                                <!-- <v-text-field label="TransactionCcy" v-model="TransactionCcy" required></v-text-field>    -->
                                <v-select
                                    v-model="TransactionCcy"
                                    :items="currencyArr"
                                    label="TransactionCcy">
                                </v-select>     
                                <v-text-field label="Период" type="number"  v-model="period" required></v-text-field>                        
                                <v-checkbox v-model="reIssueEnabled" label="Перевыпуск карты"></v-checkbox>
                                <template v-if="reIssueEnabled">
                                    <v-text-field label="Сумма перевыпуска" type="number"  v-model="reIssuedAmount" required></v-text-field>                        
                                    <v-text-field label="Префикс номера карты" type="number"  v-model="cardBins" required></v-text-field>                                                            
                                </template>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text @click="editItemCardProductType">Сохранить</v-btn>
                        <v-btn text @click="editItemDialog = false">Отмена</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>           
        </div>
        <div class="card-product">
            <v-btn v-if="activeClass" @click="addInCard(detailId)">Создать</v-btn>
            <v-data-table
                v-if="cardItems.length!=0"
                :headers="cardItemsHeader"
                :items="cardItems"
            >
                <template slot="items" slot-scope="props">
                            <tr>
                                <td>{{props.item.id}}</td>
                                <td>{{props.item.name}}</td>
                                <td>{{props.item.descriptionForm.ru}}</td>
                                <td>{{props.item.period}}</td>

                                <td>
                                    <v-btn icon small
                                        @click="editInCard(props.item)">
                                        <v-icon small>mdi-pencil</v-icon>
                                    </v-btn>
                                    <v-btn icon small @click="deleteItemCardProduct(props.item.id)">
                                        <v-icon small>mdi-delete</v-icon>
                                    </v-btn>
                                </td>
                            </tr>
                        </template>
            </v-data-table>
        </div>
        <!-- <v-row>
        <v-card v-if="detailStatus"> 
            <v-card v-for="(item, index) in cardItems" :key="index">
                <h1>Id: {{item.id}} - Name: {{item.name}}<v-btn @click="editInCard(item)">change</v-btn><v-btn @click="deleteItemCardProduct(item.id)">delete</v-btn></h1> 
            </v-card>
            <v-btn @click="addInCard(detailId)">add</v-btn>
        </v-card>
        </v-row> -->
    </div>
</template>

<script>
export default {
	name: 'CardProduct',
	data(){
		return{
            cardItems: [],
            cardProductTypeData: [],
            headers:[
                {text: "ID", value: "id", sortable: false},
                {text: "Название", value: "name",sortable: false},
                {text: "ID родителя", value: "parentId",sortable: false},
                {text: "Логотип", value: "logoUrl",sortable: false},
                {text: "Порядок", value: "order",sortable: false},
                {text: "Действия", value: "",sortable: false},
            ],
            cardProductHeaders:[
                {text: "ID", value: "id", sortable: false},
                {text: "Название", value: "name",sortable: false},
                {text: "emissionFee", value: "emissionFee",sortable: false},
            ],
            cardItemsHeader:[
                {text: "ID", value: "id", sortable: false},
                {text: "Название", value: "name", sortable: false},
                {text: "Описание", value: "description", sortable: false},
                {text: "Период", value: "period", sortable: false},
                {text: "Действия", value: "", sortable: false},
            ],
            detailStatus: false,
            detailId: '',
            deleteDialog: false,
            selectedId: '',
            name: '',
            parentId: '',
            logoUrl: '',
            order: '',
            addDialog: false,
            editDialog: false,
            id: '',
            cardProductData: [],
            newImage: null,
            logoUrlPreview:'',
            imageUrlPreview:'',
            isChangeFile: false,
            isChangeImage: false,
            isChangeLogo: false,
            addItemDialog: false,
            editItemDialog: false,
            editedId: '',

            /* -----Данные необходимые для dialog------*/
            currencyArr: ['UZS', 'USD'],
            LogoUrl: '',
            ImgUrl: '',
            Description: {
                ru: '',
                uz: '',
                en: ''
            },
            EmissionFee: '',
            EmissionCcy: '',
            DepositAmount: '',
            AccountCcy: '',
            MaintenanceFee: '',
            TransactionFee: '',
            TransactionCcy: '',
            activeClass: '',
            period: '',
            reIssueEnabled: false,
            reIssuedAmount: '',
            cardBins: '',
		}
    },
    watch:{
        
        addDialog(val){
            if(!val){
                this.name = '';
                this.order = '';
                this.logoUrl = '';
                this.parentId = '';
                this.logoUrl = '';
                this.newImage = '';
                this.logoUrlPreview = '';
                this.isChangeFile = false;
                this.$refs.fileupload.value = null;
                
            }
        },
        editDialog(val){
            if(!val){
                this.name = '';
                this.order = '';
                this.logoUrl = '';
                this.parentId = '';
                this.logoUrlPreview = '';
                this.isChangeFile = false;
                this.$refs.fileupload.value = null;

            }
        },
        editItemDialog(val){
            if(!val){
                this.freeDatas();
                this.$refs.logoupload.value = null;
                this.$refs.imageupload.value = null;
            }
        },
        addItemDialog(val){
            if(!val){
                this.freeDatas()
                this.$refs.logoupload.value = null;
                this.$refs.imageupload.value = null;

            }
        },
        newImage(image) {
            let self = this;
            if (image.length > 0) {
                let reader = new FileReader();
                reader.onload = e => {
                    self.logoUrl = e.target.result;
                };
            
                reader.readAsDataURL(image[0]);
            }
            else{
                self.logoUrl = '';  
            }
        },
        isChangeFile(val){
            console.log(val)
        }
    },
	methods: {
        freeDatas(){
            this.name = '';
            this.LogoUrl = '';
            this.ImgUrl = '';
            this.Description = {
                ru: '',
                uz: '',
                en: '',
            };
            this.EmissionFee = '';
            this.EmissionCcy = '';
            this.DepositAmount = '';
            this.AccountCcy = '';
            this.MaintenanceFee = '';
            this.TransactionFee = '';
            this.TransactionCcy = '';
            this.isChangeFile = false;
            this.$refs.fileupload.value = null;
            this.isChangeImage = false;
            this.isChangeLogo = false;
            this.imageUrlPreview = '';
            this.logoUrlPreview = '';
            this.period = '';
            this.reIssueEnabled = false;
            this.reIssuedAmount = '';
            this.cardBins = '';
        },
        cancelCommand(){
            this.addItemDialog = false;
            this.editItemDialog = false;
            this.freeDatas();
        },
        addItemCardProductType(){
            let self = this;
            var postData = {
                "name": this.name,
                "cardTypeId": this.detailId,
                "logoUrl": '',
                "imageUrl": '',
                "descriptionForm":{
                    ru: this.Description.ru,
                    uz: this.Description.uz,
                    en: this.Description.en,    
                },
                "emissionFee": this.EmissionFee*100,
                "emissionCcy": this.EmissionCcy,
                "depositAmount": this.DepositAmount*100,
                "accountCcy": this.AccountCcy,
                "maintenanceFee": this.MaintenanceFee*100,
                "transactionFee": this.TransactionFee*100,
                "transactionCcy": this.TransactionCcy,
                "period": this.period,
                reIssueEnabled: this.reIssueEnabled,
                reIssuedAmount: this.reIssuedAmount,
                cardBins: this.cardBins

            }
			self.$http.post(self.$store.getters.newApiUrl + "/card-product", postData)
			.then((response) => {
                self.addItemDialog = false;
                console.log(response.data);                
                if(self.isChangeLogo)
                    self.uploadImage(response.data.data.id, 'logoUrl', self.LogoUrl)
                if(self.isChangeImage)
                    self.uploadImage(response.data.data.id, 'imageUrl', self.ImgUrl)
                self.details(this.detailId);
                self.freeDatas();
			}, self.handleError);
        },
        getCurrencyRate(){
            let self = this;
            self.$http.get(self.$store.getters.apiUrl + "/b2/currency-rate")
			.then((response) => {
                
			}, self.handleError);
        },
        editItemCardProductType(){
            let self = this;
            var putData = {
                "name": this.name,
                "cardTypeId": this.detailId,
                "descriptionForm": {
                    ru: this.Description.ru,
                    uz: this.Description.uz,
                    en: this.Description.en
                },
                "emissionFee": this.EmissionFee*100,
                "emissionCcy": this.EmissionCcy,
                "depositAmount": this.DepositAmount*100,
                "accountCcy": this.AccountCcy,
                "maintenanceFee": this.MaintenanceFee*100,
                "transactionFee": this.TransactionFee*100,
                "transactionCcy": this.TransactionCcy,
                "logoUrl" : this.LogoUrl,
                "imageUrl" : this.ImgUrl,
                "period": this.period,
                reIssueEnabled: this.reIssueEnabled,
                reIssuedAmount: this.reIssuedAmount*100,
                cardBins: this.cardBins

            }
            if(self.isChangeLogo){
                delete putData.logoUrl;
            }
            if(self.isChangeImage){
                delete putData.imageUrl;                
            }
			self.$http.put(self.$store.getters.newApiUrl + "/card-product/"+this.editedId, putData)
			.then((response) => {
                console.log(response.data);
                self.editItemDialog = false;
                if(self.isChangeLogo)
                    self.uploadImage(response.data.data.id, 'logoUrl', self.LogoUrl)
                if(self.isChangeImage)
                    self.uploadImage(response.data.data.id, 'imageUrl', self.ImgUrl)
                self.details(this.detailId);
                self.freeDatas();
			}, self.handleError);
        },
        deleteItemCardProduct(id){
            let self = this;
			self.$http.delete(self.$store.getters.newApiUrl + "/card-product/"+id)
			.then((response) => {
                console.log(response.data);
                self.details(this.detailId);
			}, self.handleError);
        },
        uploadImage(id, xUrl, val){
            let self = this;
            let data = new FormData();
            data.append('file', val);
            self.$http.post(self.$store.getters.newApiUrl + "/card-product/"+xUrl+"/"+id, data,  {headers: {'Content-Type': 'multipart/form-data'}})
			.then((response) => {
                self.addItemDialog = false;
                self.editItemDialog = false;
                // self.freeDatas();
                // self.details(this.detailId);
                self.details(this.detailId);
			}, self.handleError);
        },
        uploadLogo(id){
            let self = this;
            let data = new FormData();
            data.append('file', this.logoUrl);
            self.$http.post(self.$store.getters.newApiUrl + "/card-product-type/logoUrl/"+id, data,  {headers: {'Content-Type': 'multipart/form-data'}})
			.then((response) => {
                self.addDialog = false;
                self.editDialog = false;
                self.getCardProductType();
                self.details(this.detailId);

			}, self.handleError);
        },
        addInCard(id){
            this.addItemDialog = true;
        },
        editInCard(item){
            this.name = item.name;
            this.editedId = item.id;   
            this.logoUrlPreview = item.logoUrl;
            this.imageUrlPreview = item.imageUrl;
            this.LogoUrl = item.logoUrl;
            this.ImgUrl = item.imageUrl;
            this.Description = item.descriptionForm;
            this.EmissionFee = item.emissionFee/100;
            this.EmissionCcy = item.emissionCcy;
            this.DepositAmount = item.depositAmount/100;
            this.AccountCcy = item.accountCcy;
            this.MaintenanceFee = item.maintenanceFee/100;
            this.TransactionFee = item.transactionFee/100;
            this.TransactionCcy = item.transactionCcy;
            this.editItemDialog = true;
            this.period = item.period;
            this.reIssueEnabled = item.reIssueEnabled;
            this.reIssuedAmount = item.reIssuedAmount/100;
            this.cardBins = item.cardBins
        },
        details(typeId){
            let self = this;
            this.cardItems = [];
            this.activeClass = typeId;
			self.$http.get(self.$store.getters.newApiUrl + "/card-product/type/"+typeId)
			.then((response) => {
                self.cardItems = response.data.data;
                self.detailStatus = true;
                self.detailId = typeId;
                console.log(response.data);
			}, self.handleError);
        },
        getCardProduct(id){
            let self = this;
            self.cardProductData = [];
			self.$http.get(self.$store.getters.newApiUrl + "/card-product/"+id)
			.then((response) => {
                self.cardProductData.push(response.data.data);
                console.log(response.data);
			}, self.handleError);
        },
		getCardProductType(){
            let self = this;
            self.cardProductTypeData = [];
			self.$http.get(self.$store.getters.newApiUrl + "/card-product-type")
			.then((response) => {
                console.log(response.data);
                self.cardProductTypeData = response.data.data
			}, self.handleError);
        },
        deleteCardProductType(){
            this.deleteDialog = false;
            let self = this;
            console.log(this.selectedId)
			self.$http.delete(self.$store.getters.newApiUrl + "/card-product-type/"+this.selectedId)
			.then((response) => {
                console.log(response.data);
                self.getCardProductType();
			}, self.handleError);
        },
        openRemoveBox(val){
            this.deleteDialog = true;
            this.selectedId = val;
        },
        onLogoUrlChange(e){
            this.LogoUrl = e.target.files[0];
            this.logoUrlPreview = URL.createObjectURL(e.target.files[0]);
            this.isChangeLogo = true;
        },
        onImageUrlChange(e){
            this.ImgUrl = e.target.files[0];
            this.imageUrlPreview = URL.createObjectURL(e.target.files[0]);
            this.isChangeImage = true;
        },
        onFileChange(e){
            this.logoUrl = e.target.files[0];
            this.logoUrlPreview = URL.createObjectURL(e.target.files[0]);
            this.isChangeFile = true;
        },
        addCardProductType(){
            let self = this;
            var postData = {
                "id": "",
                "name": this.name,
                "parentId": this.parentId,
                "logoUrl": '',
                "order" : this.order,
            }
			self.$http.post(self.$store.getters.newApiUrl + "/card-product-type", postData)
			.then((response) => {
                console.log(response.data);
                if(self.isChangeFile)
                    self.uploadLogo(response.data.data.id)
                else{
                    self.addDialog = false;
                    self.getCardProductType();
                }
			}, self.handleError);
        },
        uploadLogo(id){
            let self = this;
            let data = new FormData();
            data.append('file', this.logoUrl);
            self.$http.post(self.$store.getters.newApiUrl + "/card-product-type/logoUrl/"+id, data,  {headers: {'Content-Type': 'multipart/form-data'}})
			.then((response) => {
                self.addDialog = false;
                self.editDialog = false;

                self.getCardProductType();
			}, self.handleError);
        },
        editCardProductType(){
            let self = this;
            if(this.isChangeFile){
                var putData = {
                    "id": this.id,
                    "name": this.name,
                    "parentId": this.parentId,
                    "order" : this.order,
                }
            }
            else{
                var putData = {
                    "id": this.id,
                    "name": this.name,
                    "parentId": this.parentId,
                    "order" : this.order,
                    "logoUrl": this.logoUrl
                }
            }
			self.$http.put(self.$store.getters.newApiUrl + "/card-product-type/"+this.id, putData)
			.then((response) => {
                console.log(response.data);
                if(self.isChangeFile)
                    self.uploadLogo(response.data.data.id)
                else{
                    self.editDialog = false;
                    self.getCardProductType();
                }

			}, self.handleError);
        },
        openEditBox(val){
            this.editDialog = true;
            this.name = val.name;
            this.parentId = val.parentId;
            this.order = val.order;
            this.logoUrl = val.logoUrl;
            this.logoUrlPreview = val.logoUrl;
            this.id = val.id;
        }

        
	},
	mounted(){
        this.getCardProductType();
	}

}
</script>
<style scoped>
    .input-file{
        margin: 10px;
    }
    .card-product{
        margin: 10px;
    }
	.main{
        width: 100%;
    }
    .head-text{
        font-size: 21px;
        padding: 9px 25px;
        display: flex;
    }
    .logo-url{
        width: 100%;
        max-height: 200px;
    }
    .card{
        margin: 10px;
        width: 300px;
        cursor: pointer;
    }
    .content{
        display: -webkit-box;
        overflow: auto;
    }
    .active-class{
        background: #e6e6e6 !important;
    }
    .logo-upload-text{
        margin: 15px 0 5px;
    }
    .visa-classic{
        background: rgb(158,190,221);
        background: linear-gradient(172deg, rgba(158,190,221,1) 12%, rgba(197,211,226,1) 43%, rgba(224,186,143,1) 100%);
    }
</style>