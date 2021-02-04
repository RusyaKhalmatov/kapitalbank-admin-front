<template>
    <div>
        <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Изменить элемент</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                  <v-text-field label="Название*" required v-model="Title"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field label="Родитель*" v-model="parId"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-select :items="type" v-model="currentType" label="Тип"></v-select>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="save(0)">Отмена</v-btn>
            <v-btn color="blue darken-1" flat @click="save(1)">Изменить</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    </div>
</template>

<script>
export default {
    name: "ChangeComponent",
    props: ["type", "index", "change", "name", "nodeSelect", "id", "parentId"],
    methods: {
        onAddElement: function(){
            this.dialog = true;
            this.$emit('onaddelement', 1);
        },
        save(tmp){
            this.tmp = tmp;
            this.$emit('onchangeelement', [this.Title, this.currentType, this.index, this.tmp, this.id, this.parId]);
            this.dialog = false;    
        }
    },
    mounted: function () {
      if(this.change === 1){
        this.dialog = true;
        //alert(this.id+" - "+this.parentId+" - "+this.name+" - "+this.nodeSelect)
      }
    },
    data: function(){
      return{
        types: this.type,
        Title: this.name,
        currentType: this.nodeSelect,
        dialog: false,
        tmp: 0,
        parId: this.parentId,
      }
      
    }
}
</script>