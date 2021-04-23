<template>
    <div class="main">
        <v-divider class="my-3"></v-divider>
        <div style="display:flex; align-items:center">
            <h3 class="mb-0">Рабочие часы</h3>
            <v-btn depressed small @click="dialog=true">Добавить</v-btn>
        </div>
        <v-data-table
            rows-per-page-text="Количество страниц" 
            :pagination.sync="pagination"
            v-if="data.length!=0"
            :headers="headers"
            :items="data"
        >
            <template v-slot:items="props">
                <td>{{ props.item.hours }}</td>
                <td>{{ props.item.workDay ? props.item.workDay.dayRu:''  }}</td>
                <td>
                    <v-btn @click="openEditBox(props.item)" icon><v-icon small>mdi-pencil</v-icon></v-btn>
                    <v-btn @click="openRemoveBox(props.item)" icon><v-icon small>delete</v-icon></v-btn>

                </td>
            </template>
        </v-data-table>
        <v-dialog v-model="dialog" persistent max-width="400">
            <v-card>
                <v-card-title class="headline">
                    <v-text-field v-model.trim="putData.hours" label="Рабочие часы"></v-text-field>
                    <v-select v-model="putData.workDay" :items="workDayData" label="День недели"></v-select>
                </v-card-title>
                <v-card-actions style="text-align: center">
                <v-spacer></v-spacer>
                <template>
                    <v-btn v-if="!isEdit" :loading="loader" small depressed text @click="addPaymentServices">Сохранить</v-btn>
                    <v-btn v-else small :loading="loader" depressed text @click="editPaymentServices">Изменить</v-btn>
                    <v-btn small depressed text @click="dialog = false">закрыть</v-btn>
                </template>                
                </v-card-actions>
            </v-card>
        </v-dialog> 
        <v-dialog v-model="deleteDialog" persistent max-width="400">
            <v-card>
                <v-card-title class="headline">Вы действительно хотите удалить?</v-card-title>
                <v-card-actions style="text-align: center">
                <v-spacer></v-spacer>
                <template>
                    <v-btn :loading="loader" small depressed text @click="removeWorkHours">Да</v-btn>
                    <v-btn small depressed text @click="deleteDialog = false">Нет</v-btn>
                </template>                
                </v-card-actions>
            </v-card>
        </v-dialog> 
    </div>
</template>
<script>
export default {
    name: 'WorkSchedule',
    props:{
        id: Number,
        serviceId: Number,
    },
    watch:{
        dialog(val){
            if(!val){
                this.putData = {};
                this.isEdit = false
            }
        },
        deleteDialog(val){
            if(!val){
                this.deleteId = '';
            }
        }
    },
    data(){
        return {
            data: [],
            headers: [
                {text:"Рабочие часы", value: "hours", sortable: false},
                {text:"День недели", value: "workDay", sortable: false},
                {text:"", value: "", sortable: false},
            ],
            dialog: false,
            workDayData: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
            putData: {},
            loader: false,
            isEdit: false,
            deleteDialog: false,
            deleteId: '',
            pagination: {
                rowsPerPage: 10
            },
        }
    },
    methods:{
        openRemoveBox(item){
            this.deleteId = item.id;
            this.deleteDialog = true;

        },
        getWorkScheduleData(id){
            this.$http.get(this.$store.getters.newApiUrl+`/payment-service/work-schedule-data/service/${id}`)
            .then(response=>{
                // console.log(response.data.data);
                this.data = response.data.data
            })
        },
        openEditBox(item){
            this.putData.hours = item.hours;
            this.putData.id = item.id
            this.putData.workDay = item.workDay.dayEn.toUpperCase();
            this.isEdit = true
            this.dialog = true
        },
        addPaymentServices(){
            if(Object.keys(this.putData).length != 0){
                this.loader = true;
                let putData = {
                    serviceId: this.serviceId,
                    workScheduleDataDto: [
                        {
                            hours: this.putData.hours,
                            workDay: this.putData.workDay
                        }
                    ]
                }
                this.$http.put(this.$store.getters.newApiUrl+`/payment-service/${this.serviceId}`, putData)
                .then(response=>{
                    // console.log(response.data.data)
                    this.loader = false;
                    this.dialog = false;
                    this.getWorkScheduleData(this.id);
                }, this.handleError)
            }
            else{
                this.errorMessage('Пустые поля')
            }
        },
        removeWorkHours(){
            this.loader =true;
            this.$http.delete(this.$store.getters.newApiUrl+`/payment-service/work-schedule-data/${this.deleteId}`)
            .then(response=>{
                // console.log(response.data.data)
                this.loader = false;
                this.deleteDialog = false;
                this.getWorkScheduleData(this.id);
            }, this.handleError)
        },
        editPaymentServices(){
            this.loader = true;
            let putData = {
                id: this.putData.id,
                serviceId: this.id,
                hours: this.putData.hours,
                workDay: this.putData.workDay
            }
            this.$http.put(this.$store.getters.newApiUrl+`/payment-service/work-schedule-data/${this.putData.id}`, putData)
            .then(response=>{
                // console.log(response.data.data)
                this.loader = false;
                this.dialog = false;
                this.getWorkScheduleData(this.id);
            }, this.handleError)
        }
    },
    mounted(){
        if(this.id){
            this.getWorkScheduleData(this.id);
        }
        // console.log('workSchedule - ', this.id)
    }
}
</script>