<template>
    <div>
        <template>
            <v-layout row justify-center>
                <v-dialog v-model="dialog" persistent max-width="290">
                <v-card>
                    <v-card-title class="headline">Удалить?</v-card-title>
                    <v-card-text>Вы действительно хотите удалить данные безвозвратно?</v-card-text>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" flat @click="save(0)">Нет</v-btn>
                    <v-btn color="green darken-1" flat @click="save(1)">Да</v-btn>
                    </v-card-actions>
                </v-card>
                </v-dialog>
            </v-layout>
        </template>
    </div>
</template>

<script>
export default {
    name: "RemComponent",
    props: ["rem", "index", "id"],
    mounted: function(){
        if(this.rem === 1){
            //alert(this.index+" - "+this.id);
            this.dialog = true;
        }
    },
    data: function(){
      return{
        dialog: false,
        status: 0,
      }   
    },
    methods: {
        save: function(tmp){
            if(tmp === 1){
                this.status = 1;
            }
            this.dialog = false;
            this.$emit('onremelement', [this.index, tmp, this.id]);
            this.status = 0;
        }
    }
}
</script>