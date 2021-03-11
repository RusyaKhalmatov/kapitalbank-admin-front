<template>
  <a-card
    class="idev-page-card"
    :loading="tableLoading"
  >
    <template slot="title">
      <h1>{{ tableTitle }}</h1>
    </template>
    <template slot="extra">
      <a-button
        v-for="(v, i) in actions"
        :key="`act_${i}`"
        type="primary"
        @click="$router.push(v.to)"
        :icon="typeof v.icon !== 'undefined' ? v.icon : false"
      >{{ v.title }}</a-button>
    </template>
    <a-table
      :columns="tableColumns"
      :data-source="tableData"
      rowKey="id"
      class="idev-page-table"
    >
      <template slot="allow" slot-scope="allow">
        <a-tag :color="allow ? '#52ce71' : '#f83535'">
          {{ allow ? 'Разрешен' : 'Заблокирован' }}
        </a-tag>
      </template>
      <template
        slot="action"
        slot-scope="item"
      >
        <a-button
          type="primary"
          shape="circle"
          icon="edit"
          @click="$router.push({name: updateRouteName, params: {id: item.id}})"
        />
        <a-popconfirm
          title="Вы действительно хотите удалить？"
          ok-text="Удалить"
          cancel-text="Отменить"
          @confirm="confirmDeleteContent(item.id)"
          placement="topLeft"
        >
          <a-button
            type="danger"
            shape="circle"
            icon="delete"
          />
        </a-popconfirm>
      </template>
    </a-table>
  </a-card>
</template>

<script>
  import {
    Table, Tag, Divider, Icon,
    Card, Button, Popconfirm
  } from 'ant-design-vue'
  export default {
    name: "idev-table",
    data: () => ({
      tableLoading: false,
      tableData: []
    }),
    props: {
      tableColumns: Array,
      tableTitle: String,
      getList: Function,
      deleteContent: Function,
      updateRouteName: String,
      actions: Object
    },
    components: {
      [Table.name]: Table,
      [Tag.name]: Tag,
      [Divider.name]: Divider,
      [Icon.name]: Icon,
      [Button.name]: Button,
      [Popconfirm.name]: Popconfirm,
      [Card.name]: Card
    },
    methods: {
      updateContent(){
        this.tableLoading = true
        this.getList()
          .then(res => {
            this.tableData = []
            for (let i in res.data) {
              this.tableData.push({
                index: parseInt(i) + 1,
                ...res.data[i]
              })
            }
            this.tableLoading = false
          })
          .catch(err => {
            console.error(err)
            this.tableLoading = false
          })
      },
      confirmDeleteContent(id){
        this.deleteContent(id)
          .then(() => this.updateContent())
      }
    },
    mounted() {
      this.updateContent()
    }
  }
</script>

<style>
  .table-actions{
    text-align: right;
  }
  .table-actions .ant-table-header-column{
    float: right;
  }
  td.table-actions .ant-btn + .ant-btn,
  .ant-card-extra .ant-btn + .ant-btn{
    margin-left: 12px;
  }
</style>
