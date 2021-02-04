<template>
    <div></div>
</template>
<script>
export default {
    name: 'ClientRating',
    props: {
        userId: Number,
    },
    methods:{
        getRating(){
            this.$http
            .get(this.$store.getters.apiUrl + `/rating?userId=${this.userId}`)
            .then((response) => {
                console.log(response.data.data);
            }, this.handleError);
        }
    },
    mounted(){
        this.getRating();
    }
}
</script>