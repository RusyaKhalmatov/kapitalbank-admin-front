<template>
  <idev-table
    v-bind="{
      tableColumns: columns,
      tableData: data,
      tableTitle: 'Типы кредитов',
      getList: getList,
      autoUploadList: true,
      deleteContent: deleteContent,
      updateRouteName: 'loanTypeUpdate',
      actions: {
        create: { to: {name: 'loanTypeAdd'}, title: 'Добавить новый', icon: 'plus'}
      }
    }"
  />
</template>
userWhiteList
userWhiteList
<script>
  import { mapGetters } from 'vuex'
  export default {
    name: "index",
    data() {
      return {
        columns: [
          {
            title: '#',
            dataIndex: 'index',
            key: 'index'
          },
          {
            title: 'Фото',
            dataIndex: 'iconUrl',
            key: 'iconUrl',
            scopedSlots: { customRender: 'image' },
          },
          {
            title: 'name',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: 'Action',
            className: 'table-actions',
            key: 'action',
            scopedSlots: { customRender: 'action' },
          }
        ],
        data: []
      }
    },
    components: {
      idevTable: () => import('@/helpers/idev-table')
    },
    computed: {
      ...mapGetters(['newApiUrl'])
    },
    methods: {
      getList() {
        return new Promise((resolve, reject) => {
          this.$http.get(`${this.newApiUrl}/loan-type/all`)
            .then(response => {
              if (response.ok) {
                resolve(response.body)
              } else {
                reject(response.body)
              }
            }, this.handleError);
        })
      },
      deleteContent(id) {
        return new Promise((resolve, reject) => {
          this.$http.delete(`${this.newApiUrl}/loan-type/${id}`)
            .then(response => {
              if (response.ok) {
                resolve()
              } else {
                reject()
              }
            }, this.handleError);
        })
      }
    }
  }
</script>

