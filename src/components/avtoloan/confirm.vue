<template>
	<div class="text-xs-center">
		<v-dialog
			v-model="dialog"
			width="900"
			persistent
		>
			<v-card>
				<v-card-title
					class="headline grey lighten-2"
					primary-title
				>
					Document
				</v-card-title>
				<v-card-text>
					<v-select
									:items="branches"
									item-text="name"
									item-value="mfo"
									label="Филиал"
									v-model="selectBranch" 
								></v-select>
				</v-card-text>

				<v-divider></v-divider>

				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn
						color="primary"
						flat
						@click="save(1)"
					>
						Изменить филиал
					</v-btn>
					<v-btn
						color="primary"
						flat
						@click="save(0)"
					>
						Отменить изменение
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>
<script>
export default {
	name: 'confirm',
	props: ["confirmStatus"],
	data: function(){
		return{
			branches: [],
			selectBranch: '',
			dialog: false,
		}
	},
	methods:{
		save(val){
			this.dialog = false;
			this.$emit('onchange', {mfo: this.selectBranch, answer: val});
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
	},
	mounted(){
		this.getMFO();
		if(this.confirmStatus == true){
			this.dialog = true;
		}
	},
	
}
</script>