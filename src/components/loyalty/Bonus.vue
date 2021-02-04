<template>
    <div class="main">
        <h1 class="headline">Начисление баллов</h1>
        <div class="content">
            <v-text-field type="number" width="300px" v-model="bonusItem" label="Количество баллов"></v-text-field>
            <p class="mb-1">Список пользователей:</p>
            <input class="file" type="file"  accept="text/plain" @change="onFileChange($event)" ref="fileupload">
            <v-btn style="width:250px; margin:0" class="mt-4" :loading="loader" color="#facb00" depressed @click="bonus"> Отправить</v-btn>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Bonus',
    data(){
        return{
            bonusItem: '',
            file: '',
            loader: false,
        }
    },
    methods:{
        onFileChange(e) {

            const files = e.target.files || e.dataTransfer.files
            if (!files.length){
                this.$refs.fileupload.value = null;
                this.file = '';
            }
            else
                this.file = files[0];
            // this.sendFile(files[0]);
        },
        bonus(){
            this.loader = true
            if(this.bonusItem){
                console.log(this.file);
                let data = new FormData();
                data.append("file", this.file);
                this.$http.put(this.$store.getters.apiUrl + `/apelsin/account/bonus/${this.bonusItem}`, data,  {headers: {'Content-Type': 'multipart/form-data'}})
                .then((response) => {
                    //console.log(response.data.data);
                    this.successMessage("Успешно");                        
                    setTimeout(() => {
                        this.$refs.fileupload.value = null;
                        this.file = '';
                        this.bonusItem = '';
                    }, 500);
                    this.loader = false;

                }, this.handleError);
            }
            else{
                this.$store.commit('errorMessage', 'Введите количество апельсинов')
                this.loader = false;
            }
        },
    }
}
</script>
<style scoped>
.main{
    width:100%
}
.headline{
    text-align: center;
}
.content{
    width: 250px;
    /* margin: auto; */
}
</style>