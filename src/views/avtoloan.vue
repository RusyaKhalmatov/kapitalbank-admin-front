<template>
	<v-layout column wrap>
		<v-flex xs12>
			<v-card min-height="600">
				<v-card-title>
					<h1>Список заявок</h1>
					<v-spacer/>
				</v-card-title>
				<v-card-text>
					<v-layout row wrap>
						<v-flex xs12>
							<v-text-field
								v-model="search"
								prepend-icon="mdi-magnify"
								label="Поиск"
								>
							</v-text-field>
						</v-flex>
					</v-layout>
					<v-layout row wrap v-if="SubAdmin">
						<v-flex xs2>
							<v-select
								:items="statistic"
								item-text="name"
								item-value="name"
								label="Статус"
								v-model="status" 
							></v-select>
						</v-flex>
						<v-flex xs8 class="sub">
							<v-select
								:items="branches"
								item-text="name"
								item-value="mfo"
								label="Филиал"
								v-model="selectBranch" 
							></v-select>
						</v-flex>
						<v-flex xs2>
							<v-btn block color="primary" @click="getLoans()">Все заявки</v-btn>
						</v-flex>
					</v-layout>
					
					<v-data-table
						:headers="loanHeaders"
						:items="loansData"
						:loading="loader"
						:pagination.sync="pagination"
						:search="search"

					>					
						<template slot="items" slot-scope="props">
							<tr>	
								<td>{{props.item.id}}</td>
								<td>{{props.item.createdAt}}</td>
								<td>{{props.item.lastName}}</td>
								<td>{{props.item.firstName}}</td>					
								<td>{{props.item.passportSerial}}</td>
								<td>{{props.item.phone}}</td>
								<td><v-chip class="text-xs-center" :class="props.item.status" style="width: 100%" text-color="white">{{props.item.status}}</v-chip></td>
								<td>
									<v-btn small icon :to="{name: 'detail',params: {user: props.item}}">
										<v-icon small>last_page</v-icon>
									</v-btn>
								</td>
							</tr>
						</template>
					</v-data-table>
				</v-card-text>
				<!-- <v-card-text>
					<v-chip class="text-xs-center" text-color="white" v-for="(item, index) in statistic" :key="index" :class="item.name" @click="getLoansWithParams(item.name)">
						<v-avatar class="Shad">
							{{item.sum}}
						</v-avatar>
						{{item.name}}
					</v-chip>
					<v-divider class="mx-3" inset vertical></v-divider>
				</v-card-text>  -->
				<v-card-text>	
					<v-chip class="text-xs-center" text-color="white" v-for="(item, index) in statistic" :key="index" :class="item.name">
						<v-avatar class="Shad">
							{{item.sum}}
						</v-avatar>
						{{item.name}}
					</v-chip>
					<download-excel name="ReportByAutoloans" :fields="operationExport" :data="loansDataExell" v-if="SubAdmin">
						<v-btn dark color="secondary">
							<v-icon>mdi-file-excel</v-icon>
							Отчет Excel
						</v-btn>
					</download-excel>
				</v-card-text>
			</v-card>
    </v-flex>	
	</v-layout> 
</template>
<script>

export default {
	name: 'avtoloan',
	data: function(){
		return{
			showCharts: false,
			loanHeaders: [		
				{text: "id", value: "id"},
				{text: "Дата создания", value: "createdAt"},
				{text: "Фамилия", value: "lastName"},
				{text: "Имя", value: "firstName"},
				{text: "Паспорт", value: "passportSerial"},
				{text: "Телефон", value: "phone"},
				{text: "Статус", value: "status"},
				{text: "", value: ""},
				// {text: "cardShopAgreement", value: "cardShopAgreement"},
				// {text: "createdAt", value: "createdAt"},
				// {text: "dateOfBirth", value: "dateOfBirth"},	
				// {text: "loanProduct", value: "loanProduct"},
				// {text: "middleName", value: "middleName"},
				// {text: "passportResidencyUrl", value: "passportResidencyUrl"},
				// {text: "passportSelfieUrl", value: "passportSelfieUrl"},
				// {text: "passportUrl", value: "passportUrl"},
				// {text: "productId", value: "productId"},
				// {text: "smsCode", value: "smsCode"},
				// {text: "updatedAt", value: "updatedAt"},
			],
			loansData: [],
			// loansData: [
			// 	{branch: 'main', 
			// 	carShopAgreement: "http://www.orimi.com/pdf-test.pdf", createdAt: '02.04.2020', dateOfBirth: '26.02.1996', firstName: 'Murad', id: '1', 
			// 	lastName: 'Fazylov', loanProduct: 8, middleName: 9, passportResidencyUrl: "https://s10.stc.all.kpcdn.net/share/i/12/7156655/inx960x640.jpg", passportSelfieUrl: "http://images.vfl.ru/ii/1576981021/ca54cad9/28987025_m.jpg", passportSerial: 'AA1234567', 
			// 	passportUrl: '', phone: '998933973326', productId: 15, smsCode: 16, status: 'ACTIVE', updatedAt: 18,}
			// ],
			loansDataExell: [],
			search: "",
			pagination: {
				rowsPerPage: 5,
			},
			statistic: [
				{name: 'DRAFT', sum: '0'},
				{name: 'SMS_PENDING', sum: '0'},
				{name: 'APPROVED', sum: '0'},
				{name: 'REJECT', sum: '0'},
				{name: 'UNDER_WRITER', sum: '0'},
			],
			branch: this.$store.getters.branchAutoloan,
			MFO: this.$store.getters.branchAutoloan,
			status: this.$store.getters.statusAutoloan,
			branches: [],
			selectBranch: this.$store.getters.branchAutoloan,
			SubAdmin: false,
			operationsHeaders: [
				{text: "ID", value: "id"},
				{text: "Дата создания", value: "createdAt"},
				{text: "Фамилия", value: "lastName"},
				{text: "Имя", value: "firstName"},
				{text: "Паспорт", value: "passportSerial"},
				{text: "Телефон", value: "phone"},
				{text: "Филиал", value: "branch"},
				{text: "Статус изменен", value: "updatedAt"},
				{text: "Статус", value: "status"},
				{text: "Причина", value: "prichina"},
				{text: "Наличие договора", value: "shopAgreement"},
				{text: "Марка автомобиля", value: "product"},
				{text: "Сумма", value: "amount"},
				{text: "Первоначальный взнос", value: "prepayRate"},
				{text: "Причина отказа", value: "rejectReason"},
			],
			tmpData:[],
			products: [],
			prepayRate: '',
		}
	},
  methods: {
		counterDatas(){
			this.statistic[0].sum = this.statistic[1].sum = this.statistic[2].sum = this.statistic[3].sum = this.statistic[4].sum = 0;
			for(var i  = 0; i < this.loansData.length; i++){
				if(this.loansData[i].status == 'DRAFT'){
					this.statistic[0].sum++;
				}
				if(this.loansData[i].status == 'SMS_PENDING'){
					this.statistic[1].sum++;
				}
				if(this.loansData[i].status == 'APPROVED'){
					this.statistic[2].sum++;
				}
				if(this.loansData[i].status == 'REJECT'){
					this.statistic[3].sum++;
				}
				if(this.loansData[i].status == 'UNDER_WRITER'){
					this.statistic[4].sum++;
				}
			}
		},
		getUser(){
			let self = this;
			self.$http.get(self.$store.getters.apiUrl + `/user`)
				.then(response => {
					if(response.data.data.userId == 79472 || response.data.data.userId == 90473 || localStorage.getItem('roles') === '"ADMIN"'){
						this.$store.commit('employeeAutoloan', 'ADMIN');
						this.SubAdmin = true;
						this.getBranches();
						if(this.status){
							this.getLoansWithParams(this.status);
						}else if(this.branch){
							this.getLoansForUser();
						}
						else
							this.getLoans();		
					}
					else{
						this.getUserBranch(response.data.data.userId);
					}
				}, self.handleError);
		},
		getUserBranch(id){
			let self = this;
			self.$http.get(self.$store.getters.newApiUrl + `/card-employee/all`)
				.then(response => {
					var n = response.data.data.length;
					for(var i = 0; i < n; i++){
						if(response.data.data[i].userId == id){
							this.getBrach(response.data.data[i].branchId);
						}
					}
				}, self.handleError);
		},
		getBrach(userBrachId){
			let self = this;
			self.$http.get(self.$store.getters.apiUrl + `/branch/list`)
				.then(response => {
					var n = response.data.data.length;
					for(var i = 0; i < n; i++){
						if(response.data.data[i].id == userBrachId){
							this.branch = response.data.data[i].branchId;
							this.getMFO();
						}
					}
				}, self.handleError);
		},
		getMFO(){
			var credentials = btoa(this.$store.getters.uname + ':' + this.$store.getters.pass);
			var basicAuth = 'Basic ' + credentials;
			let self = this;
			self.$http.get(self.$store.getters.avtoApiUrl + `/branch/all`, {headers: {'Authorization':basicAuth}})
				.then(response => {
					var n = response.data.data.length;
					for(var i = 0; i < n; i++){
						if(response.data.data[i].branch_id == this.branch){
							self.MFO = response.data.data[i].mfo;
						}
					}
					this.getLoansForUser();
				}, self.handleError);
		},
		getLoansForUser(){
			var credentials = btoa(this.$store.getters.uname + ':' + this.$store.getters.pass);
			var basicAuth = 'Basic ' + credentials;
			let self = this;
				this.loader = true;
				self.$http.get(self.$store.getters.avtoApiUrl + `/loan-application/branch/`+this.MFO, {headers: {'Authorization':basicAuth}})
					.then(response => {
						self.loansData = response.data.data;
						self.dataForExcell();
						this.loader = false;
						this.counterDatas();
					}, self.handleError);
		},
	  getLoans(){
			this.selectBranch = "";
			this.status = "";
			this.selectBranch='';
			var credentials = btoa(this.$store.getters.uname + ':' + this.$store.getters.pass);
			var basicAuth = 'Basic ' + credentials;
			let self = this;
				this.loader = true;
				self.$http.get(self.$store.getters.avtoApiUrl + `/loan-application/`, {headers: {'Authorization':basicAuth}})
					.then(response => {
						self.loansData = response.data.data;
						this.loader = false;
						this.counterDatas();
						this.dataForExcell();
					}, self.handleError);
		},
		getLoansWithParams(status){
			var credentials = btoa(this.$store.getters.uname + ':' + this.$store.getters.pass);
			var basicAuth = 'Basic ' + credentials;
			let self = this;
				this.loader = true;
				self.$http.get(self.$store.getters.avtoApiUrl + `/loan-application/filter?status=`+status, {headers: {'Authorization':basicAuth}})
					.then(response => {
						self.loansData = response.data.data;
						self.dataForExcell();
						this.loader = false;
					}, self.handleError);
		},
		// searchWord(search) {
		// 	var credentials = btoa(this.$store.getters.uname + ':' + this.$store.getters.pass);
		// 	var basicAuth = 'Basic ' + credentials;
		// 	let self = this;
		// 	self.$http.get(self.$store.getters.apiUrl + `/user-search?word=${search}`, {headers: {'Authorization':basicAuth}})
		// 		.then(response => {
		// 			self.loader = false;
		// 			self.userList = response.data.data;
		// 			self.dataForExcell(self.userList);
		// 		}, self.handleError);
		// },
		test(){
			var credentials = btoa(this.$store.getters.uname + ':' + this.$store.getters.pass);
			var basicAuth = 'Basic ' + credentials;
			let self = this;
				this.loader = true;
				self.$http.get(self.$store.getters.avtoApiUrl + `/branch/all`, {headers: {'Authorization':basicAuth}})
					.then(response => {
					}, self.handleError);
		},
		getProducts(){
			var credentials = btoa(this.$store.getters.uname + ':' + this.$store.getters.pass);
			var basicAuth = 'Basic ' + credentials;
			let self = this;
				this.loader = true;
				self.$http.get(self.$store.getters.avtoApiUrl + `/loan-product/all`, {headers: {'Authorization':basicAuth}})
					.then(response => {
						self.products = response.data.data;
						//console.log(self.products);
					}, self.handleError);
		},
		// beforeStart(){
		// 	if(localStorage.getItem('roles') === '"ADMIN"'){
		// 		this.getBranches();
		// 		this.SubAdmin = true;
		// 		if(this.status){
		// 			this.getLoansWithParams(this.status);
		// 		}else if(this.branch){
		// 			this.getLoansForUser();
		// 		}
		// 		else
		// 			this.getLoans();
				
		// 	}else{
		// 		this.getUser();
		// 	}
		// },
		getBranches(){
			var credentials = btoa(this.$store.getters.uname + ':' + this.$store.getters.pass);
			var basicAuth = 'Basic ' + credentials;
			let self = this;
				this.loader = true;
				self.$http.get(self.$store.getters.avtoApiUrl + `/branch/all`, {headers: {'Authorization':basicAuth}})
					.then(response => {
						self.branches = response.data.data;
					}, self.handleError);
		},
		dataForExcell(){
			let self = this;
			self.loansDataExell = [];
			this.loansData.forEach((x)=>{
				if(x.firstName==null || x.lastName==null || x.middleName == null){
					x.prichina = 'Клиент остановился на этапе Ввода пасспортных данных';
				}else if(x.passportResidencyUrl==null && x.passportSelfieUrl==null && x.passportUrl == null){
					x.prichina = 'Клиент остановился на этапе загрузки фото и селфи паспорта';
				}else if (x.branch==null){
					x.prichina = 'Клиент остановился на этапе выбора филиала для получения кредита';
				}else if(x.salaryDocument==null){
					x.prichina = 'Клиент остановился на этапе загрузке справки о доходах';
				}else if(x.status=="SMS_PENDING"){
					x.prichina = 'Клиент остановился на этапе ввода кода подтверждения';
				}
				if(x.carShopAgreement == null){
					x.shopAgreement = 'Договора нет'
				}else{
					x.shopAgreement = 'Договор имеется'
				}
				for(var i = 0; i < this.products.length; i++){
					if(this.products[i]["0"].productId == x.productId){
						x.product = this.products[i]["0"].name;
						x.amount = this.products[i]["0"].amount/100;
						x.prepayRate = this.products[i]["0"].prepayRate;
						break;
					}
					if(this.products[i]["1"].productId == x.productId){
						x.product = this.products[i]["1"].name;
						x.amount = this.products[i]["1"].amount/100;
						x.prepayRate = this.products[i]["1"].prepayRate;
						break;
					}
				}
				x.id = x.id;
				x.firstName = x.firstName;
				x.lastName = x.lastName;
				x.branch = "'"+x.branch;
				x.phone = "'"+x.phone;
				x.createdAt = self.$options.filters.timestampToDate(x.createdAt);
				x.updatedAt = self.$options.filters.timestampToDate(x.updatedAt);
				self.loansDataExell.push(x);
			});
		},
	},
	mounted() {
		//this.test()
		this.getProducts();
		this.getUser();
		//this.getLoans();
		//this.beforeStart();
	},
	watch: {
		// search(value) {
		// 	this.$store.commit('statusAutoloan', value);
		// 	this.searchWord(value)	
		// },
		selectBranch(){
			if(this.selectBranch){
				this.MFO = this.selectBranch;
				this.$store.commit('statusAutoloan', '');
				this.$store.commit('branchAutoloan', this.selectBranch);
				this.status = "";
				this.getLoansForUser();
				this.counterDatas();
			}
			if(this.selectBranch == ""){
				this.$store.commit('branchAutoloan', this.status);
			}
		},
		status(){
			if(this.status){
				this.$store.commit('branchAutoloan', '');
				this.$store.commit('statusAutoloan', this.status);
				this.getLoansWithParams(this.status);
				this.selectBranch = "";
				this.counterDatas();
			}
			if(this.status == ""){
				this.$store.commit('statusAutoloan', this.status);
			}
		},
	},
	computed: {
		operationExport() {
			let self = this, result = {};
			for (let i = 0; i < self.operationsHeaders.length; i++) {
				let currentHeader = self.operationsHeaders[i];
				result[currentHeader.text] = currentHeader.value;
			}
			return result;
		},
	}
}
</script>
<style scoped>
.DRAFT{
	background: rgb(139, 139, 139) !important;
}
.SMS_PENDING{
	background: rgb(255, 152, 0) !important;
}
.APPROVED{
	background: rgb(0, 150, 136) !important;
}
.REJECT{
	background: rgb(244, 67, 54) !important;
}
.UNDER_WRITER{
	background: rgb(24, 103, 192) !important;
}
.Shad{
	background: rgba(0, 0, 0, 0.5) !important;
}
.v-chip .v-avatar{
	width: 50px !important;
}
.v-chip__content .v-avatar {
	width: 50px !important;
	border-radius: 28px !important;
}
.sub{
	padding: 0px 10px !important;
}
</style>