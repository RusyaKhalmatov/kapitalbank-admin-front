<template>
  <a-card
    class="idev-page-card"
    :loading="tableLoading"
  >
    <template slot="title">
      <h1>{{ tableTitle }}</h1>
      <template v-if="!!listSearch">
        <a-input-search
          placeholder="Поиск..."
          style="width: 200px; margin-left: 24px;"
          @search="onSearchContent"
          enter-button
        />
      </template>
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
      :pagination="pagination"
      rowKey="id"
      class="idev-page-table"
      @change="onTableChange"
    >
      <template slot="allow" slot-scope="allow">
        <a-tag :color="allow ? '#52ce71' : '#f83535'">
          {{ allow ? 'Разрешен' : 'Заблокирован' }}
        </a-tag>
      </template>
      <template slot="status" slot-scope="status">
        <a-tag :color="status === 'ACTIVE' ? '#52ce71' : '#f83535'">
          {{ status }}
        </a-tag>
      </template>
      <template slot="tag" slot-scope="text">
        <a-tag :color="'#012354'">
          {{ text }}
        </a-tag>
      </template>
      <template slot="image" slot-scope="src">
        <img :src="src" width="80"/>
      </template>
      <template
        slot="action"
        slot-scope="item"
      >
        <a-button
          v-if="!!updateRouteName"
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
            v-if="!!deleteContent"
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
    Card, Button, Popconfirm, Input,
  } from 'ant-design-vue'
  export default {
    name: "idev-table",
    data: () => ({
      tableLoading: false,
      tableData: [],
      pagination: {
        current: 1
      },
      sortData: {}
    }),
    props: {
      tableColumns: Array,
      tableTitle: String,
      getList: Function,
      listSearch: Boolean,
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
      [Card.name]: Card,
      [Input.Search.name]: Input.Search,
    },
    methods: {
      updateContent(params = {}){
        this.tableLoading = true
        this.getList({
          pagination: {...this.pagination},
          sort: this.sortData,
          ...params
        })
          .then(res => {
            let list = this.hasItem(res, 'list') ? res.list : res.data
            if (this.hasItem(res, 'pagination')) {
              this.pagination = {...this.pagination, ...res.pagination}
            }
            this.tableData = []
            for (let i in list) {
              this.tableData.push({
                index: parseInt(i) + 1,
                ...list[i]
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
      },
      onSearchContent(val){
        this.updateContent({
          word: !!val ? val : ''
        })
      },
      onTableChange(pagination, filters, sorter) {
        // console.log("pagination: ", pagination);
        // console.log("filters: ", filters);
        if (pagination.current !== this.pagination.current) {
          this.$set(this.pagination, 'current', pagination.current)
          this.updateContent()
        }
        if (this.hasItem(sorter, 'columnKey')) {
          let index = this.tableColumns.findIndex(x => x.key === sorter.columnKey)
          let old = this.tableColumns.findIndex(x => typeof x.sortOrder !== 'undefined')
          if (old > 0 && index !== old && this.tableColumns[old].key !== sorter.columnKey) {
            delete this.tableColumns[old].sortOrder
            this.$set(this.sortData, this.tableColumns[old].key, null)
          }
          let s = this.hasItem(this.tableColumns[index], 'sortOrder') ? this.tableColumns[index].sortOrder : null
          let order = this.hasItem(sorter, 'order') ? sorter.order : null

          console.log(`${s} => ${order}`)
          this.$set(this.tableColumns[index], 'sortOrder', order)
          if (!!order) {
            order = order === 'ascend' ? 'asc' : 'desc'
          }
          this.$set(this.sortData, sorter.columnKey, order)
          this.updateContent()
        }
      },
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
