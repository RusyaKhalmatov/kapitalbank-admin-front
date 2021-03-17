<template>
  <idev-form
    v-bind="{
      formTitle: !!updateId ? 'Update' : 'Create',
      backRouteName: 'userWhiteList',
      formFields: formFields,
      updateFields: updateItems,
      formColumns: formColumns,
      setContent: setContent
    }"
  />
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    data(){
      return {
        formFields: {
          login: null,
          username: null,
          allow: true
        }
      }
    },
    props: {
      updateId: {
        type: Number,
        default: null
      },
      updateItems: {
        type: Object,
        default: () => {}
      }
    },
    computed: {
      ...mapGetters(['newApiUrl']),
      formColumns(){
        return {
          login: {
            type: 'text',
            rules: [
              { required: true, message: 'Please input your note!' }
            ]
          },
          username: {
            type: 'text',
            rules: [
              { required: true, message: 'Please input your note!' }
            ]
          },
          allow: {
            type: 'radio',
            list: [
              { text: "Allow", value: true },
              { text: "Disallow", value: false }
            ]
          }
        }
      }
    },
    components: {
      idevForm: () => import('@/helpers/idev-form')
    },
    methods: {
      setContent(fields){
        return new Promise((resolve, reject) => {
          if (!!this.updateId) {
            this.$http.put(`${this.newApiUrl}/registration-white-user/update/${this.updateId}`, {...fields})
              .then(response => {
                if (response.ok) {
                  resolve()
                } else {
                  reject()
                }
              }, this.handleError);
          } else {
            this.$http.post(`${this.newApiUrl}/registration-white-user/create`, {...fields})
              .then(response => {
                if (response.ok) {
                  resolve()
                } else {
                  reject()
                }
              }, this.handleError);
          }
        })
      }
    }
  }
</script>
