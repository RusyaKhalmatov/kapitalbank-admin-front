<template>
  <v-flex xs12>
    <v-card min-height="600">
      <v-card-title>
        <h1>Paynet Category</h1>
        <v-spacer/>
        <v-btn small icon @click="redirect('PaynetCategoryForm')">
          <v-icon small>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field
              v-model="search"
              prepend-icon="mdi-magnify"
              label="Поиск">
            </v-text-field>
            <v-data-table
              :headers="categoryHeaders"
              :items="categoryItems"
              :loading="loader"
              :search="search"
              :pagination.sync="pagination"
              :item-key="categoryItems.categoryId">

              <template slot="items" slot-scope="props">
                <tr @click="props.expanded = !props.expanded">
                  <td>{{ props.item.logoUrl }}</td>
                  <td>{{ props.item.categoryId }}</td>
                  <td>{{ props.item.categoryNameEn }}</td>
                  <td>{{ props.item.categoryNameRu }}</td>
                  <td>{{ props.item.categoryNameUz }}</td>
                  <td>
                    <v-checkbox disabled
                                v-model="props.item.subcategory">
                    </v-checkbox>
                  </td>
                  <td>
                    <v-btn :to="{name: 'PaynetCategoryForm', params: {category: props.item}}"
                           icon small>
                      <v-icon small>mdi-pencil</v-icon>
                    </v-btn>

                    <v-btn @click.stop="deletePaynetCategory(props.item.categoryId)" icon small>
                      <v-icon small>mdi-delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
export default {
  name: "PaynetCategory",
  data() {
    return {
      categoryHeaders: [
        {text: "Логотип", value: "logoUrl"},
        {text: "ID категории", value: "categoryId"},
        {text: "Название на английском", value: "categoryNameEn"},
        {text: "Название на русском", value: "categoryNameRu"},
        {text: "Название на узбекском", value: "categoryNameUz"},
        {text: "Для отображения Select Box", value: "subcategory"},
        {text: "Действия", sortable: false}
      ],
      categoryItems: [],
      pagination: {},
      search: ""
    }
  },
  methods: {
    getCategories() {
      let self = this;
      self.$http.get(self.$store.getters.apiUrl + '/payment/categories').then(
        response => {
          self.loader = false;
          self.categoryItems = response.data.data;
        }, self.handleError
      )
    },
    deletePaynetCategory(categoryId) {
      let self = this;
      self.$http.delete(self.$store.getters.apiUrl + '/payment/category', {
        params: {categoryId: categoryId}
      }).then(() => {
        location.reload();
        self.redirect('PaynetCategory');
      }, self.handleError);
    }
  },
  mounted() {
    this.getCategories();
  }
}
</script>

<style scoped>

</style>
