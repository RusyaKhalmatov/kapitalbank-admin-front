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
      ...mapGetters(['newApiUrl'])
    },
    components: {
      formFields: () => import('./__fileds')
    },
    methods: {
      getContent(){
        this.$http.get(`${this.newApiUrl}/loan-type/${this.$route.params.id}`)
          .then(response => {
            delete response.body.data.id
            this.data = response.body.data
          }, this.handleError);
      }
    },
    mounted(){
      this.getContent()
    }
  }
</script>
