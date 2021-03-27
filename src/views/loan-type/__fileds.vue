<template>
  <idev-form
    v-bind="{
      formTitle: !!updateId ? 'Редактировать' : 'Добавить новый',
      backRouteName: 'loanTypeList',
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
          name: null,
          description: null,
          iconUrl: null
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
          name: {
            type: 'text',
            rules: [this.formRules.required]
          },
          description: {
            type: 'text',
            rules: [this.formRules.required]
          },
          iconUrl: {
            type: 'image',
            uploadUrl: `${this.newApiUrl}/loan-type/iconUrl`
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
            this.$http.put(`${this.newApiUrl}/loan-type/${this.updateId}`, {...fields})
              .then(response => {
                if (response.ok) {
                  resolve()
                } else {
                  reject()
                }
              }, this.handleError);
          } else {
            this.$http.post(`${this.newApiUrl}/loan-type`, {...fields})
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
