<template>
  <div class="param-box">
    <p>Период:</p>
    <span class="row">    
      <v-datetime-picker
                    prepend-icon="mdi-clock"
                    v-model="date1"
                    label="от"
                />
      <v-datetime-picker
                    prepend-icon="mdi-clock"
                    v-model="date2"
                    label="до"
                />
    </span>
  </div>
</template>
<script>
export default {
    name: 'date',
    props:{
        fromDate: Number,
        toDate: Number
    },
    data(){
        return{
            date1: this.fromDate,
            date2: this.toDate,
            menu1: false,
            menu2: false,
            dateFrom: '',
            dateTo: '',
        }
    },
    watch:{
        date1(val){          
            var begTime  = new Date(this.date1);
            // console.log(val)
            this.$emit('update:fromDate', begTime.getTime())
        },
        date2(val){
            var endTime  = new Date(this.date2);        
            this.$emit('update:toDate', endTime.getTime())
        }
    },
    mounted(){
      // console.log("FROm: ",this.fromDate)
      // console.log("TO: ",this.toDate)

        // var date = new Date(this.fromDate);
        var firstDay = new Date(this.fromeDate)
        // console.log("From: ",this.fromDate)
        let date = new Date(this.fromDate)
        this.date1 = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() 
        date = new Date(this.toDate)
        this.date2 = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() 

        // this.date1= '2020-11-16, 11:14:00'
        // this.date2 = this.toDate;

        // console.log(new Date(this.date2), '- ', new Date(this.toDate))
        // this.date1 = firstDay.getFullYear()+'-'+('0'+(firstDay.getMonth()+1)).substr(-2)+'-'+('0'+firstDay.getDate()).substr(-2);
        // var endDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
        // this.date2 = date.getFullYear()+'-'+('0'+(date.getMonth()+1)).substr(-2)+'-'+('0'+ date.getDate()).substr(-2);  
        // console.log(this.date2)
        // var tmpTime1 = this.date2.split('-');
        // var endTime  = new Date(tmpTime1[0], tmpTime1[1]-1, tmpTime1[2], 23,59,59);
        // this.dateTo = endTime.getTime();

        // var tmpTime2 = this.date1.split('-');
        // var begTime  = new Date(tmpTime2[0], tmpTime2[1]-1, tmpTime2[2], 0,0,0);
        // this.dateFrom = begTime.getTime();
            // this.$emit('update:fromDate', firstDay.getTime())

            // this.$emit('update:toDate', endTime.getTime())

    }
}
</script>

<style scoped>
    .param-box{
        width: 500px;
        /* margin: 25px auto; */
        background: #FFFF;
        padding: 19px;
        border-radius: 18px;
        display: flex;
        flex-direction: column;
    }
    .row{
        display: flex;
    }
</style>