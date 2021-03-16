<template>
  <idev-table
    v-bind="{
      tableColumns: columns,
      tableData: data,
      tableTitle: 'Фоновое изображение',
      getList: getList,
      deleteContent: deleteContent,
      updateRouteName: 'backgroundImageUpdate',
      actions: {
        create: { to: {name: 'backgroundImageAdd'}, title: 'Добавить новый', icon: 'plus'}
      }
    }"
  />
</template>

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
            title: 'name',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: 'Фото',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            scopedSlots: { customRender: 'image' },
          },
          {
            title: 'Язык',
            dataIndex: 'lang',
            key: 'lang',
            scopedSlots: { customRender: 'tag' },
          },
          {
            title: 'Дата',
            dataIndex: 'createdAt',
            key: 'createdAt'
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
      ...mapGetters(['newApiUrl2'])
    },
    methods: {
      getList() {
        return new Promise((resolve, reject) => {
          this.$http.get(`${this.newApiUrl2}/background-image`)
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
          this.$http.delete(`${this.newApiUrl2}/background-image/delete/${id}`)
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

