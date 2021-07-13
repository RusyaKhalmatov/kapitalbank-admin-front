<template>
  <idev-table
    v-bind="{
      tableColumns: columns,
      tableData: data,
      tableTitle: 'Список пользователей',
      getList: getList,
      listSearch: true,
      // updateRouteName: 'clientsUpdate',
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
          /*birthday: "1997-06-24T19:00:00.000+0000"
          customerId: "99059709"
          email: null
          firstName: "NOZIMA"
          fullName: "NOZIMA OQILOVA"
          id: 362
          lastName: "OQILOVA"
          lastUse: 1626167729842
          phone: "998900024411"
          platform: ""
          registeredDate: 1626159341583
          userRole: "USER"
          userState: "ACTIVE"
          userType: "CLIENT"
          version: "Av1.0.0 (40)"*/
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
            page = (params.pagination.current - 1)
          }
          if (this.hasItem(params, 'word')) {
            word = params.word
          }
          this.$http.post(`${this.apiUrl}/user-search/v2?page=${page}&size=${size}&word=${word}`, {
            id: "",
            firstName: "",
            lastName: "",
            phone: "",
            clientId: "",
            status: "",
            userType: "",
            ...params.sort
          })
            .then(response => {
              if (response.ok) {
                const data = response.body.data
                resolve({
                  list: data.dtoList,
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
      }
    }
  }
</script>

