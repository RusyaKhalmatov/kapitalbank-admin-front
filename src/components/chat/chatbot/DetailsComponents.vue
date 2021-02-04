<template>
    <div>
        <div class="text-xs-center">
            <v-dialog
            v-model="dialog" persistent
            width="500"
            >

            <v-card>
                <v-card-title
                class="headline grey lighten-2"
                primary-title
                v-model="name"
                >
                Тип: {{type}}
                </v-card-title>

                <v-card-text>
                {{ name }}
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    flat
                    @click="close"
                >
                    Закрыть
                </v-btn>
                </v-card-actions>
            </v-card>
            </v-dialog>
        </div>
    </div>
</template>

<script>
export default {
    name: "DetComponent",
    props: ["det", "name", "type", "id"],
    data: function(){
        return{
            dialog: false,
            status: this.status,
        }
    },
    mounted: function () {
      if(this.det === 1){
        this.dialog = true;
      }
    },
    methods: {
        close(){
            this.dialog = false;
            this.status = 0;
            this.$emit('ondetelement', this.status);
        }
    }
}
</script>