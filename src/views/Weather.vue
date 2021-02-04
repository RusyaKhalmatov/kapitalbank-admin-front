<template>
    <div class="main">
        <h1 class="headline">Управление погодой</h1>
        <div class="box">
            <p>Текущая погода:</p>
            <p v-if="!isChange" class="ml-2">{{curWeather.value}}</p>
            <span class="ml-2" v-if="isChange" style="width:150px" >
                <v-select v-model="weather" label="" item-text="value" item-value="key" :items="typesData"></v-select>
            </span>
            <template v-if="curWeather.key">
                <v-btn v-if="!isChange" small depressed @click="isChange=true">Изменить</v-btn>
                <div v-else>
                    <v-btn small depressed :loading="loader" @click="save">Сохранить</v-btn>
                    <v-btn small depressed @click="isChange=false">Отмена</v-btn>
                </div>
            </template>
            
        </div>
        <!-- {{curWeather}} -->
    </div>
</template>
<script>
export default {
    name: 'Weather',
    data(){
        return{
            loader: false,
            curWeather: {},
            isChange: false,
            typesData: [],
            weather: ''
        }
    },
    watch:{
        isChange(val){
            if(val){
                this.weather = this.curWeather.key;
            }
            else{
                this.weather = '';
            }
        }
    },
    methods:{
        save(){
            this.loader = true;
            this.$http.put(this.$store.getters.newApiUrl+`/weather`, {
                "weather": this.weather
            })
            .then(response=>{
                console.log(response.data.data)
                this.clearCache();
                this.getWeather();
                this.isChange = false;
                this.loader = false;
            }, this.handleError)
        },
        getWeather(){
            this.loader = true;
            this.$http.get(this.$store.getters.newApiUrl+`/weather`)
            .then(response=>{
                console.log(response.data.data)
                this.curWeather = response.data.data
                this.loader = false;
            }, this.handleError)
        },
        getTypes(){
            this.$http.get(this.$store.getters.newApiUrl+`/weather/types`)
            .then(response=>{
                console.log(response.data.data)
                this.typesData = response.data.data
            }, this.handleError)
        },
        clearCache(){
            console.log( this.$store.getters.cacheToken);
            this.$http.post(this.$store.getters.apiUrl+`/cacheClear/weather`,{'token':this.$store.getters.cacheToken})
            .then(response=>{               
                this.$store.commit('successMessage', 'Успешно')
            }, this.handleError)
        }
    },
    mounted(){
        this.getTypes();
        this.getWeather();
    }


}
</script>
<style scoped>
    .main{
        width: 100%;
    }
    .headline{
        text-align: center;
    }
    p{
        font-size: 20px;
        margin: 0;
    }
    .box{
        display: flex;
        align-items: center;
    }
</style>