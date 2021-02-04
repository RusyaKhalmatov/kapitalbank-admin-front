<template>
  <div>
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Добавить элемент</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                  <v-text-field label="Название*" required v-model="Title"></v-text-field>
                </v-flex>
                <v-flex xs12 sm12>
                  <v-select :items="type" v-model="nodeSelect" label="Тип"></v-select>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="save">Отмена</v-btn>
            <v-btn color="blue darken-1" flat @click="save">Добавить</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>
<script>
export default {
    name: "AddComponent",
    props: ["type", "index", "creat", "id"],
    methods: {
        onAddElement: function(){
            this.dialog = true;
            this.$emit('onaddelement', 1);
        },
        save: function(){
          this.dialog = false;
          this.$emit('onaddelement', [this.Title, this.nodeSelect, this.index, this.id]);
        }
    },
    mounted: function () {
      if(this.creat === 1){
        //alert(this.index+" - "+this.id);
        this.dialog = true;
      }
    },
    data: function(){
      return{
        types: this.type,
        Title: '',
        nodeSelect: "",
        dialog: false,
      }
      
    }
}
</script>