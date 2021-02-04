<template>
  <v-flex xs12>
		<v-card min-height="600">
			<v-card-title>
				<h1>Данные по заявке</h1>
				<v-spacer/>
				<v-btn icon small @click="redirect('avtoloan')">
					<v-icon small>mdi-arrow-left</v-icon>
				</v-btn>
			</v-card-title>
			<v-card-text>
				<v-layout row wrap>
					<v-flex xs8>
						<v-layout row wrap>
							<v-flex xs12 class="Items">
								<h3>Клиент</h3>
							</v-flex>
							<v-flex xs6 class="Items">
								<v-text-field disabled v-model="fullName" prepend-icon="person" label="Полное имя"/>
							</v-flex>
							<v-flex xs6 class="Items">
								<v-text-field disabled :value="detail.dateOfBirth | timestamp-to-date" prepend-icon="person" label="Дата рождения"/>
							</v-flex>
							<v-flex xs6 class="Items">
								<v-text-field disabled v-model="detail.phone" prepend-icon="phone" :mask="'### ## ### ## ##'" label="Номер телефона"/>
							</v-flex>
							<v-flex xs6 class="Items">
								<v-text-field disabled v-model="detail.passportSerial" prepend-icon="book"  label="Серия паспорта"/>
							</v-flex>
							<v-flex xs6 class="Items">
								<v-text-field disabled :value="detail.createdAt" prepend-icon="add" label="Создание"/>
							</v-flex>
							<v-flex xs6 class="Items">
								<v-text-field disabled :value="detail.updatedAt" prepend-icon="refresh" label="Обновлен"/>
							</v-flex>
							<v-flex xs6 class="Items">
								<v-text-field disabled :value="detail.branch" prepend-icon="refresh" label="Филиал"/>
							</v-flex>
						</v-layout>
						<v-layout row wrap>
							<v-flex xs12 class="Items">
								<h3>Продукт</h3>
							</v-flex>
							<v-flex xs6 class="Items">
								<v-text-field disabled v-model="product" prepend-icon="label" label="Наименовние"/>
							</v-flex>
							<v-flex xs6 class="Items">
								<v-text-field disabled v-model="amount" prepend-icon="label" :mask="maskItem" label="Стоимость"/>
							</v-flex>
							<v-flex xs6 class="Items">
								<v-text-field disabled v-model="rate" prepend-icon="label" label="Минимальная процентная ставка"/>
							</v-flex>
						</v-layout>
						<v-layout row wrap>
							<v-flex xs12 class="Items">
								<h3>Документы</h3>
							</v-flex>
						<v-flex xs6 class="Items">
							<v-btn block dark color="danger" @click="dial(selectDoc)" v-if="imgButton">
								<v-icon class="open">photo_size_select_actual</v-icon>
								Соглашение с автосалоном
							</v-btn>
							<v-btn block dark color="danger" @click="sel(selectDoc)" v-if="pdfButton">
								<v-icon class="open">picture_as_pdf</v-icon>
								Соглашение с автосалоном
							</v-btn>
							<v-btn block dark color="danger" class="DRAFT" v-if="nullDoc">
								Договора нет
							</v-btn>
						</v-flex>
						<v-flex xs6 class="Items">
							<v-btn block dark color="danger" @click="dial(selectDocSalary)" v-if="imgButtonSalary">
								<v-icon class="open">photo_size_select_actual</v-icon>
								ИНПС
							</v-btn>
							<v-btn block dark color="danger" @click="sel(selectDocSalary)" v-if="pdfButtonSalary">
								<v-icon class="open">picture_as_pdf</v-icon>
								ИНПС
							</v-btn>
						</v-flex>
						</v-layout>
					</v-flex>
					<v-flex xs4>
						<h2>Паспортные данные</h2>
						<v-layout>
							<v-flex xs12 sm12 offset-sm3 class="beforePhoto">
								<v-card flat class="Photo">
									<v-container grid-list-sm fluid>
										<v-layout row wrap>
											<v-flex
												v-for="(item, index) in Photos"
												:key="index"
												xs6
												d-flex
											>
												<v-card flat tile class="d-flex">
													<v-img
														:src="item"
														@click="dial(item)"
														aspect-ratio="1"
														class="grey lighten-2"
													>
														<template v-slot:placeholder>
															<v-layout
																fill-height
																align-center
																justify-center
																ma-0
															>
																<v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
															</v-layout>
														</template>
													</v-img>
												</v-card>
											</v-flex>
										</v-layout>
										<v-layout row wrap>
											<v-flex
												v-for="(item, index) in PhotosPdf"
												:key="index"
												xs6
												d-flex
											>
												<v-card flat tile class="d-flex">
													<v-img
														:src="item"
														@click="sel(item)"
														aspect-ratio="1"
														class="grey lighten-2"
													>
														<template v-slot:placeholder>
															<v-layout
																fill-height
																align-center
																justify-center
																ma-0
															>
																<v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
															</v-layout>
														</template>
													</v-img>
												</v-card>
											</v-flex>
										</v-layout>
									</v-container>
								</v-card>
							</v-flex>
						</v-layout>
						<v-divider class="divid"/>
						<v-layout>
							<v-flex xs6 class="btnOver">
								<v-btn block dark color="danger" @click="preVerdict(detail.id, false)" v-if="btnStatus">Отклонить</v-btn>
							</v-flex>
							<v-flex xs6 class="btnOver">
								<v-btn block dark color="green" @click="verdict(detail.id, true)" v-if="btnStatus">Одобрить</v-btn>
							</v-flex>
						</v-layout>
						<v-layout>
							<v-flex xs12 class="sub">
								<v-chip class="text-xs-center" :class="detail.status" style="width: 100%" text-color="white" v-if="StatusActive">{{detail.status}}</v-chip>
								<v-btn block color="primary" @click="revert(detail.id)" v-if="StatusActive && $store.getters.employeeAutoloan == 'ADMIN'">Отменить вердикт</v-btn>
							</v-flex>
						</v-layout>
						<v-divider class="divid"/>
						<v-layout>
							
							<v-flex xs12 class="sub">
								<v-btn block color="primary" @click="confirm()" v-if="$store.getters.employeeAutoloan == 'ADMIN'">Изменить филиал</v-btn>
							</v-flex>
						</v-layout>
					</v-flex>
				</v-layout>			
      </v-card-text>
		</v-card>
		
		<template>
			<div class="text-xs-center">
				<v-dialog
					v-model="dialog"
					width="900"
				>
					<v-card>
						<v-card-title
							class="headline grey lighten-2"
							primary-title
						>
							Document
						</v-card-title>
						<v-card-text>
							<img :src="selImg" class="imgBig" alt="photo">
						</v-card-text>

						<v-divider></v-divider>

						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn
								color="primary"
								flat
								@click="dialog = false"
							>
								Закрыть
							</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>
			</div>
		</template>
		<confirm v-if="confirmStatus" :confirmStatus="confirmStatus" v-on:onchange="changeMfo"></confirm>
		<deleteConfirm v-if="deleteStatus" :deleteStatus="deleteStatus" v-on:onReject="Reject"></deleteConfirm>
  </v-flex>
</template>
<script>
import confirm from './confirm.vue';
import deleteConfirm from './deleteConfirm.vue';
export default {
	name: 'detail',
	components:{
		confirm,
		deleteConfirm,
	},
	data: function(){
		return{
			detail: [],
			fullName: '',
			dialog: false,
			selImg: '',
			dateCre: '',
			Photos: [],
			PhotosPdf: [],
			imgButton: false,
			pdfButton: false,
			imgButtonSalary: false,
			pdfButtonSalary: false,
			selectDoc: '',
			selectDocSalary: '',
			btnStatus: false,
			StatusActive: true,
			product: '',
			amount: '',
			rate:'',
			passport: '',
			nullDoc: false,
			maskItem: '### ### ###,##',
			branches: [],
			selectBranch: '',
			confirmStatus: false,
			deleteStatus: false,
			confirmStat: '',
			title: '',
		}
	},
	methods: {
		Reject(val){
			this.deleteStatus = false
			if(val.answer == 1){
				this.title = val.title;
				this.verdict(this.detail.id, false)
			}
		},
		changeMfo(val){
			this.confirmStatus = false;
			//console.log(val);
			if(val.answer == 1){
				var credentials = btoa(this.$store.getters.uname + ':' + this.$store.getters.pass);
				var basicAuth = 'Basic ' + credentials;
				const postData = {
					mfo: val.mfo, 
				};
				let self = this;
				self.$http
					.post(self.$store.getters.avtoApiUrl + "/loan-application/"+this.detail.id+"/branch", postData, {headers: {'Authorization':basicAuth}})
					.then(response => {
						if(response.data.data){
							this.selectBranch = '';
							self.getData();
						}
					}, self.handleError);
			}
			if(val.answer == 0){
				this.selectBranch = '';
			}
		},
		confirm(){
			this.confirmStatus = true;
			//alert(this.confirmStatus)
		},
		getPic(val) {
      return require(val);
		},
		dial(val){
			this.dialog = true;
			this.selImg = val;
		},
		preVerdict(id, stat){
			this.deleteStatus = true;
		},
		verdict(id, stat){
			var credentials = btoa(this.$store.getters.uname + ':' + this.$store.getters.pass);
			var basicAuth = 'Basic ' + credentials;
			const postData = {
				approved: stat,
				rejectReason: this.title, 
			};
			let self = this;
			self.$http
				.post(self.$store.getters.avtoApiUrl + "/loan-application/"+id+"/verdict", postData, {headers: {'Authorization':basicAuth}})
				.then(() => {
					self.getData();
				}, self.handleError);
		},
		revert(){
			var credentials = btoa(this.$store.getters.uname + ':' + this.$store.getters.pass);
			var basicAuth = 'Basic ' + credentials;
			const postData = {
				approved: "", 
			};
			let self = this;
			self.$http
				//.post(self.$store.getters.avtoApiUrl + "/loan-application/"+Number(this.detail.id)+"/revert", {headers: {'Authorization':basicAuth}})
				.post(self.$store.getters.avtoApiUrl + "/loan-application/"+this.detail.id+"/revert", postData, {headers: {'Authorization':basicAuth}})
				.then(response => {
					if(response.data.data){
						self.getData();
					}
				}, self.handleError);
		},
		getMFO(){
			var credentials = btoa(this.$store.getters.uname + ':' + this.$store.getters.pass);
			var basicAuth = 'Basic ' + credentials;
			let self = this;
			self.$http.get(self.$store.getters.avtoApiUrl + `/branch/all`, {headers: {'Authorization':basicAuth}})
				.then(response => {
					self.branches = response.data.data;
				}, self.handleError);
		},
		changeBranch(){
			var credentials = btoa(this.$store.getters.uname + ':' + this.$store.getters.pass);
			var basicAuth = 'Basic ' + credentials;
			const postData = {
				mfo: this.selectMfo, 
			};
			let self = this;
			self.$http
				//.post(self.$store.getters.avtoApiUrl + "/loan-application/"+Number(this.detail.id)+"/revert", {headers: {'Authorization':basicAuth}})
				.post(self.$store.getters.avtoApiUrl + "/loan-application/"+this.detail.id+"/branch", postData, {headers: {'Authorization':basicAuth}})
				.then(response => {
					if(response.data.data){
						self.getData();
					}
				}, self.handleError);
		},
		getData(){
			// var uname = 'AVtO_L0aN_8f234_Ssmeiq';
			// var pass = '&*sk92jf8.1521aydd3810bx742n54kiygh2';
			var credentials = btoa(this.$store.getters.uname + ':' + this.$store.getters.pass);
			var basicAuth = 'Basic ' + credentials;
			let self = this;
				this.loader = true;
				self.$http.get(self.$store.getters.avtoApiUrl + `/loan-application/`+this.detail.id, {headers: {'Authorization':basicAuth}})
					.then(response => {
						self.detail = response.data.data;
						//console.log(response.data.data);
						self.detail.createdAt = self.$options.filters.timestampToDate(self.detail.createdAt);
						self.detail.updatedAt = self.$options.filters.timestampToDate(self.detail.updatedAt);
						if(self.detail.status == 'UNDER_WRITER'){
							this.btnStatus = true;
							this.StatusActive = false;
						}else{
							this.btnStatus = false;
							this.StatusActive = true;
						}
					}, self.handleError);
		},
		sel(val){
			window.open(val);
		},
		putInPhotos(item){
			var tmp = item;
				tmp = tmp.split("").reverse().join("");			
				var res = tmp.substring(0, 3);
				if(res !== "fdp"){
					this.Photos.push('https://dev.kapitalbank.uz/download/'+item)
				}else{	
					this.PhotosPdf.push('https://dev.kapitalbank.uz/download/'+item)
				}
		}
	},
	mounted() {
		this.getMFO();
		if (this.$route.params.user) {
			this.detail = this.$route.params.user;
			//console.log(this.detail);
			//console.log(this.detail.passportSerial);
			//this.passport = this.detail.passportSerial
			//alert(this.detail.passportSerial);
			this.fullName = this.$route.params.user.lastName+ " " +this.$route.params.user.firstName + " " + this.$route.params.user.middleName;
			if(this.detail.passportResidencyUrl){
				//this.Photos.push('https://dev.kapitalbank.uz/download/'+this.detail.passportResidencyUrl)
				this.putInPhotos(this.detail.passportResidencyUrl);
			}
			if(this.detail.passportSelfieUrl){
				//this.Photos.push('https://dev.kapitalbank.uz/download/'+this.detail.passportSelfieUrl)
				this.putInPhotos(this.detail.passportSelfieUrl);
			}
			if(this.detail.passportUrl){
				//this.Photos.push('https://dev.kapitalbank.uz/download/'+this.detail.passportUrl)
				this.putInPhotos(this.detail.passportUrl);
			}
			
			//console.log(this.detail.carShopAgreement);
			if(this.detail.carShopAgreement){				
				var tmp = this.detail.carShopAgreement;
				tmp = tmp.split("").reverse().join("");			
				var res = tmp.substring(0, 3);
				if(res !== "fdp"){
					this.imgButton = true;
					this.selectDoc = 'https://dev.kapitalbank.uz/download/'+this.detail.carShopAgreement;
				}else{	
					this.pdfButton = true;
					this.selectDoc = 'https://dev.kapitalbank.uz/download/'+this.detail.carShopAgreement;
				}
			}
			if(this.detail.salaryDocument){				
				var tmp = this.detail.salaryDocument;
				tmp = tmp.split("").reverse().join("");			
				var res = tmp.substring(0, 3);
				if(res !== "fdp"){
					this.imgButtonSalary = true;
					this.selectDocSalary = 'https://dev.kapitalbank.uz/download/'+this.detail.salaryDocument;
				}else{	
					this.pdfButtonSalary = true;
					this.selectDocSalary = 'https://dev.kapitalbank.uz/download/'+this.detail.salaryDocument;
				}
			}
			if(this.detail.status == 'UNDER_WRITER'){
				this.btnStatus = true;
				this.StatusActive = false;
			}
			if(this.detail.productId){
				var credentials = btoa(this.$store.getters.uname + ':' + this.$store.getters.pass);
				var basicAuth = 'Basic ' + credentials;
				let self = this;
				self.$http.get(self.$store.getters.avtoApiUrl + `/loan-product/one?productId=`+this.detail.productId, {headers: {'Authorization':basicAuth}})
					.then(response => {
						//console.log(response.data.data);
						self.product = response.data.data.name;
						self.amount = response.data.data.amount;
						self.rate = response.data.data.rate;
					}, self.handleError);
			}
			if(this.detail.carShopAgreement == null){
				this.nullDoc = true;
			}	
		}
	},
	watch:{
		// selectBranch: function(){
		// 	alert(this.selectBranch);
		// },
		amount(){
			if(this.amount){
				if(this.amount.toString().length == 11){
					this.maskItem = "### ### ###,##"
				}
				if(this.amount.toString().length == 10){
					this.maskItem = "## ### ###,##"
				}
			}
		}
	}
}
</script>

<style scoped>
img{
	width: 100%;
	height: 200px;
	overflow: hidden;
	border-radius: 10px;
}
.imgBig{
	width: 100%;
	height: auto;
}
.imgs{
	padding: 20px;
}
.photos{
	background: #dadada;
	border-radius: 10px;
}
.Items{
	padding-left: 20px;
	padding-right: 20px;
}
.theme--light.v-sheet{
	border-radius: 15px;
}
.Photo{
	border-radius: 15px;
	background: #fafafa !important;
}
.beforePhoto{
	margin-left: 0px !important;
}
.open{
	margin-right: 16px; 
}
.btnOver{
	padding-left: 10px ;
	padding-right: 10px ;
}
.divid{
	margin-top: 20px !important;
	margin-bottom: 20px;
}

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

</style>