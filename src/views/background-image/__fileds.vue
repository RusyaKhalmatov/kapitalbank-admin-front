<template>
  <idev-form
    v-bind="{
      formTitle: !!updateId ? 'Редактировать' : 'Добавить новый',
      backRouteName: 'backgroundImageList',
      formFields: formFields,
      updateFields: updateItems,
      formColumns: formColumns,
      setContent: setContent
    }"
  />
</template>

<script>
  import { mapGetters, mapState } from 'vuex'

  export default {
    data(){
      return {
        formFields: {
          imageUrl: null,
          lang: null,
          name: null
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
      ...mapGetters(['newApiUrl2']),
      ...mapState(['languageList']),
      formColumns(){
        return {
          name: {
            type: 'text',
            rules: [this.formRules.required]
          },
          lang: {
            type: 'select',
            list: this.languageList,
            defaultValue: "UZ",
            rules: [this.formRules.required]
          },
          imageUrl: {
            type: 'image',
            uploadUrl: `${this.newApiUrl2}/background-image/imageUrl`
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
            this.$http.put(`${this.newApiUrl2}/background-image/${this.updateId}`, {...fields})
              .then(response => {
                if (response.ok) {
                  resolve()
                } else {
                  reject()
                }
              }, this.handleError);
          } else {
            this.$http.post(`${this.newApiUrl2}/background-image`, {...fields})
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
