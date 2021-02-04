<template>
    <div class="main">
        <h1 class="headline">Список виртуальных карт</h1>
        <div class="content">
            <h3 v-for="(item,index) in data" :key="index">{{item}}</h3>
        </div>
    </div>  
</template>

<script>
export default {
    name: 'VirtualCardAccountType',
    data(){
        return {
            data: [],
        }
    },
    methods:{
        getVirtualCards(){
            this.$http.get(this.$store.getters.apiUrl+`/epos/virtual-cards?accountType=UZCARD`)
            .then(response=>{
                console.log(response.data.data);
                this.data = response.data.data;
            })
        }
    },
    mounted(){
        this.getVirtualCards();
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
</style>