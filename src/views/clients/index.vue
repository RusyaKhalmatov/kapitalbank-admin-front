<template>
  <idev-table
    v-bind="{
      tableColumns: columns,
      tableData: data,
      tableTitle: 'Список пользователей',
      tableActions: [
        {
          key: 'info',
          icon: 'info-circle',
          method: this.tableCustomActions,
          title: 'Информация'
        },
      ],
      getList: getList,
      autoUploadList: false,
      listSearch: true,
      actions: {
        create: { to: {name: 'clientForm'}, title: 'Добавить новый', icon: 'plus'}
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
            title: 'ID',
            dataIndex: 'customerId',
            key: 'customerId',
          },
          {
            title: 'Имя',
            dataIndex: 'firstName',
            key: 'firstName',
            sorter: true
          },
          {
            title: 'Фамилия',
            dataIndex: 'lastName',
            key: 'lastName',
            sorter: true
          },
          {
            title: 'Телефон',
            dataIndex: 'phone',
            key: 'phone',
            sorter: true
          },
          {
            title: 'Тип',
            dataIndex: 'userType',
            key: 'userType',
            sorter: true
          },
          {
            title: 'Статус',
            dataIndex: 'userState',
            key: 'userState',
            scopedSlots: { customRender: 'status' },
            sorter: true
          },
          {
            title: 'Action',
            className: 'table-actions',
            key: 'action',
            scopedSlots: { customRender: 'action' },
          }
        ],
        data: [],
        totalUsers: 0
      }
    },
    components: {
      idevTable: () => import('@/helpers/idev-table')
    },
    computed: {
      ...mapGetters({
        apiUrl: 'newApiUrl2'
      })
    },
    methods: {
      getList(params = {}) {
        return new Promise((resolve, reject) => {
          let page = 0, size = 10, word = '';
          if (this.hasItem(params, 'pagination')) {
            page = (params.pagination.current - 1);
          }
          if (this.hasItem(params, 'word')) {
            word = params.word;
          }
          this.$http.post(`${this.apiUrl}/user/search?page=${page}&size=${size}&query=${word}`, {
            clientId: "",
            firstName: "",
            lastName: "",
            phone: "",
            userType: "",
            status: "",
            ...params.sort
          })
            .then(response => {
              if (response.ok) {
                const data = response.body.data
                resolve({
                  list: data.users,
                  pagination: {
                    total: data.totalElements,
                    pageSize: data.size
                  },
                })
              } else {
                reject(response.body)
              }
            }, this.handleError);
        })
      },
      deleteContent(id) {
        return new Promise((resolve, reject) => {
          this.$http.delete(`${this.newApiUrl}/registration-white-user/delete/${id}`)
            .then(response => {
              if (response.ok) {
                resolve()
              } else {
                reject()
              }
            }, this.handleError);
        })
      },
      tableCustomActions(key, item){
        switch (key) {
          case 'info':
            this.$router.push({
              name: 'clientCredential',
              params: {
                user: item
              }
            })
            break
        }
      }
    }
  }
</script>

