<template>
  <form-fields
    v-bind="{
      updateItems: data,
      updateId: parseInt($route.params.id)
    }"
  />
</template>

<script>
  import {mapGetters} from "vuex";

  export default {
    name: "update",
    data(){
      return {
        data: {}
      }
    },
    computed: {
      ...mapGetters(['newApiUrl2'])
    },
    components: {
      formFields: () => import('./__fileds')
    },
    methods: {
      getContent(){
        this.$http.get(`${this.newApiUrl2}/background-image/${this.$route.params.id}`)
          .then(response => {
            delete response.body.data.id
            this.data = {
              name: response.body.data.name,
              lang: response.body.data.lang,
              imageUrl: response.body.data.imageUrl
            }
          }, this.handleError);
      }
    },
    mounted(){
      this.getContent()
    }
  }
</script>
