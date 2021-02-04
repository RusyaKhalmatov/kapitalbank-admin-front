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
					Причина отклонения
				</v-card-title>
				<v-card-text>
					<v-text-field label="Причина*" required v-model="Title"></v-text-field>
				</v-card-text>

				<v-divider></v-divider>

				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn
						color="red"
						flat
						@click="save(1)"
						:disabled="btnStatus"
					>
						Отклонить
					</v-btn>
					<v-btn
						color="primary"
						flat
						@click="save(0)"
					>
						Отменить вердикт
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>
<script>
export default {
	name: 'deleteConfirm',
	props: ["deleteStatus"],
	data: function(){
		return{
			Title: '',
			dialog: false,
			btnStatus: true,
		}
	},
	methods:{
		save(val){
			this.dialog = false;
			this.$emit('onReject', {title: this.Title, answer: val});
		},
	},
	mounted(){
		if(this.deleteStatus == true){
			this.dialog = true;
		}
	},
	watch:{
		Title(){
			if(this.Title == ""){
				this.btnStatus = true;
			}else{
				this.btnStatus = false;
			}
		}
	}
	
}
</script>