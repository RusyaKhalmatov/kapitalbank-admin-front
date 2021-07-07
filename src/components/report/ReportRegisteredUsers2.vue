<template>
    <v-flex xs12>
        <v-card min-height="600">
            <v-card-title>
                <h1 class="mb-0">Отчет по зарегистрированным клиентам</h1>         
                <v-progress-circular style="height:30px; width: 30px;"      
                v-if="!isShow&&isClick"      
                class="center ml-2"
                indeterminate
                color="amber"
                ></v-progress-circular>
                <v-spacer/>
                <v-btn icon small @click="redirect('report')">
                    <v-icon small>mdi-arrow-left</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <!-- {{graphicDatas}} -->
                <v-layout row wrap>
                    <template v-if="isShow">
                        <div class="mb-3 d-flex align-center">
                            <h3 class="mb-0">Количество зарегистрированных клиентов</h3>
                            <v-btn depressed small @click="isChartShow=!isChartShow">{{chartBtnShow}}</v-btn>
                        </div>
                        <div v-if="isChartShow" style="width:100%">
                            <line-chart :chartdata="chartdata" :options="chartOptions"/>
                        </div>
                    </template>
                    <v-flex xs12>
                        <report-date-time-picker type="registeredUsers" :date-time-start.sync="dateStart" :date-time-end.sync="dateEnd">
                            <v-btn dark color="primary" @click="loadReports" :loading="loader">Получить</v-btn>
                        </report-date-time-picker>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field
                                v-model="search"
                                prepend-icon="mdi-magnify"
                                label="Поиск"/>
                    </v-flex>
                    <v-flex xs12>
                        <v-data-table
                                :headers="usersHeaders"
                                :items="result"
                                :loading="loader"
                                :search="search"
                                :pagination.sync="pagination"
                                item-key="result.users.registeredDate">
                            <template slot="items" slot-scope="props">
                                <tr @click="props.expanded = !props.expanded">
                                    <td>{{props.item.fullName}}</td>
                                    <td>{{props.item.phone.split(":")[0]}}
                                        {{phoneFormat(props.item.phone.split(":")[1]) | timestamp-to-date}}
                                    </td>
                                    <div v-if="props.item.customerId">
                                        <template v-if="props.item.customerId.split(':')[0]!='null'">
                                            <td v-if="props.item.customerId!=''">{{props.item.customerId}}</td>
                                            <td v-else>Не клиент</td>
                                        </template>
                                        <td v-else>Удален</td>
                                    </div>
                                    <div v-else>Не клиент</div>
                                    <td>{{props.item.state}}</td>
                                    <td>{{props.item.type}}</td>
                                    <td>{{props.item.lastUse | timestamp-to-date}}</td>
                                    <td>{{props.item.registeredDate | timestamp-to-date}}</td>
                                    <td>{{props.item.device}}</td>
                                    <td>{{props.item.appVersion}}</td>
                                </tr>
                            </template>
                            <template slot="actions-append">
                                <download-excel
                                        :fields="registeredUsersExport"
                                        name="ReportRegisteredUsers"
                                        :data="result">
                                    <v-btn icon dark color="secondary">
                                        <v-icon>mdi-file-excel</v-icon>
                                    </v-btn>
                                </download-excel>
                            </template>
                        </v-data-table>
                    </v-flex>
                </v-layout>
            </v-card-text>
        </v-card>
    </v-flex>
</template>

<script>
    import ReportDateTimePicker from "./ReportDateTimePicker";
    import lineChart from '@/components/chart/LineChart'

    export default {
        name: "ReportRegisteredUsers",
        components: {ReportDateTimePicker, lineChart},
        data() {
            return {
                usersHeaders: [
                    {text: "Ф.И.О.", value: "fullName"},
                    {text: "Номер телефона", value: "phone"},
                    {text: "ID клиента", value: "customerId"},
                    {text: "Статус", value: "state"},
                    {text: "Тип", value: "type"},
                    {text: "Последнее использование", value: "lastUse"},
                    {text: "Дата регистрации", value: "registeredDate"},
                    {text: "ОС", value: "device"},
                    {text: "Версия приложения", value: "appVersion"},
                ],
                dateStart: null,
                dateEnd: (new Date).toLocaleString(),
                search: '',
                result: [],
                pagination: {},
                deviceOS: '',
                appVersion: '',
                phoneNumber: [],
                showCharts: false,
                dateStart: '',
                dateEnd: '',
                graphicData: [],
                chartOptions:  {
                    responsive: true,
                    maintainAspectRatio: false
                },
                chartdata: {
                    labels: ['Январь', 'Февраль', '23', '23', '23'],
                    datasets: [
                        {
                            label: 'Количество зарегистрированных клиентов',
                            backgroundColor: '#FFB446',
                            data: [40, 20, 30, 35, 123]
                        }
                    ]
                },
                isShow: false,
                isChartShow: true,
                isClick: false
            }
        },
        methods: {
            diffDates(date1, date2){
                // return Math.abs((date1-date2)/(60*60*24*1000))
                return Math.ceil(Math.abs(date2 - date1) / (1000 * 3600 * 24));
            },
            loadReports() {
                let self = this;
                self.loader = true;
                this.isClick = true;
                // this.getChartsData();
                this.isShow = false;
                self.$http.get(self.$store.getters.newApiUrl2 + '/report/registeredUsers', {
                    params: {
                        dateStart: self.dateStart,
                        dateEnd: self.dateEnd
                    }
                }).then(response => {
                    self.result = response.data.data.users;
                    // console.log('Count: ',self.result.length);
                    self.loader = false;
                    this.graphicData = response.data.data.users;
                    // console.log('FF: ', this.diffDates(new Date(this.dateStart.split('+')[0]), new Date(this.dateEnd.split('+')[0])))
                    // console.log(new Date(this.dateStart.split('+')[0]), ' - ', new Date(this.dateEnd.split('+')[0]))
                    let diffDate = this.diffDates(new Date(this.dateStart.split('+')[0]), new Date(this.dateEnd.split('+')[0]))
                    if(diffDate===1){
                        let date = new Date()
                        let dayInMonth = 23;  
                        // console.log(dayInMonth)
                        // console.log('start')
                        let selectedDay;
                        let array = [];
                        let arrayDate = [];
                        let i;
                        
                        for(i = 0; i <=dayInMonth; i++){
                            // console.log(i, ' - ', dayInMonth)
                            let curDate = new Date(this.dateStart.split('+')[0]);
                            selectedDay = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), i, 0,0).getTime();
                            let endDay = new Date(date.getFullYear(), curDate.getMonth(), curDate.getDate(), i,59,59).getTime();
                            arrayDate.push(new Date(selectedDay).toLocaleDateString()+' ('+new Date(selectedDay).toLocaleTimeString()+' - '+new Date(endDay).toLocaleTimeString()+')')
                            array.push(this.graphicData.filter(x=>(selectedDay<=x.registeredDate)&&(endDay>=x.registeredDate)).length)
                            // console.log('result: ', array)
                        }
                        this.chartdata.labels = arrayDate;
                        this.chartdata.datasets[0].data = array;
                        this.isShow = true;
                        // console.log(array)
                        // console.log(arrayDate);
                    }
                    else if(diffDate<=30||diffDate<=31){
                        let date = new Date()
                        let dayInMonth = 33 - new Date(date.getFullYear(), date.getMonth(), 33).getDate();  
                        // console.log(dayInMonth)
                        // console.log('start')
                        let selectedDay;
                        let array = [];
                        let arrayDate = [];
                        let i;
                        
                        for(i = 1; i <=dayInMonth; i++){
                            // console.log(i, ' - ', dayInMonth)
                            let curDate = new Date(this.dateStart.split('+')[0]);
                            let endCurDate = new Date(this.dateEnd.split('+')[0]);
                            selectedDay = new Date(curDate.getFullYear(), curDate.getMonth(), i).getTime();
                            let endDay = new Date(endCurDate.getFullYear(), endCurDate.getMonth(), i, 23,59,59).getTime();
                            arrayDate.push(new Date(selectedDay).toLocaleDateString())
                            array.push(this.graphicData.filter(x=>(selectedDay<=x.registeredDate)&&(endDay>=x.registeredDate)).length)
                            // console.log('result: ', array)
                        }
                        this.chartdata.labels = arrayDate;
                        this.chartdata.datasets[0].data = array;
                        this.isShow = true;
                        // console.log(array)
                        // console.log(arrayDate);
                    }
                    else{
                        this.isClick = false
                    }

                }, self.handleError);
            },
            getChartsData() {
                let self = this;
                this.isShow = false;
                self.$http.get(self.$store.getters.newApiUrl2 + '/report/registeredUsers', {
                    params: {
                        dateStart: self.dateStart,
                        dateEnd: self.dateEnd
                    }
                }).then(response => {
                    this.graphicData = response.data.data.users;
                    let date = new Date()
                    let dayInMonth = 33 - new Date(date.getFullYear(), date.getMonth(), 33).getDate();  
                    // console.log(dayInMonth)
                    // console.log('start')
                    let selectedDay;
                    let array = [];
                    let arrayDate = [];
                    let i;
                    
                    for(i = 1; i <=dayInMonth; i++){
                        // console.log(i, ' - ', dayInMonth)
                        let curDate = new Date(this.dateStart.split('+')[0]);
                        selectedDay = new Date(curDate.getFullYear(), curDate.getMonth(), i).getTime();
                        let endDay = new Date(date.getFullYear(), curDate.getMonth(), i, 23,59,59).getTime();
                        arrayDate.push(new Date(selectedDay).toLocaleDateString())
                        array.push(this.graphicData.filter(x=>(selectedDay<=x.registeredDate)&&(endDay>=x.registeredDate)).length)
                        // console.log('result: ', array)
                    }
                    this.chartdata.labels = arrayDate;
                    this.chartdata.datasets[0].data = array;
                    this.isShow = true;
                    console.log(array)
                    console.log(arrayDate);
                }, self.handleError);
            },
            phoneFormat(phone) {
                if (phone === '' || phone === null) {
                    return '';
                }
                return phone;
            },
            setThisMonth() {
                let self = this,
                    today = new Date();

                // let startDate = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);
                self.setDateStart(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);
                // let endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
                self.setDateEnd(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
                
            },
            setDateStart(date) {
                this.setDateStart(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
                // this.dateStart = this.getFormat(date);
            },

            setDateEnd(date) {
                this.setDateEnd(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
                // this.dateEnd = this.getFormat(date);
            },
            setDateStart(year, month, day, hours, minutes, seconds) {
                this.dateStart2 = this.getFormatted(year, month, day, hours, minutes, seconds);
            },

            setDateEnd(year, month, day, hours, minutes, seconds) {
                this.dateEnd2 = this.getFormatted(year, month, day, hours, minutes, seconds);
            },
            getFormatted(year, month, day, hours, minutes, seconds) {
                if (month === -1) {
                    return `${year - 1}-12-${this.getFullNumber(day)}` + " " +
                        `${this.getFullNumber(hours)}:${this.getFullNumber(minutes)}:${this.getFullNumber(seconds)}`;
                }
                return `${year}-${this.getFullNumber(month + 1)}-${this.getFullNumber(day)}` + " " +
                    `${this.getFullNumber(hours)}:${this.getFullNumber(minutes)}:${this.getFullNumber(seconds)}`;
            },
            getFullNumber(number) {
                return number >= 0 && number < 10 ? `0${number}` : number.toString();
            },
        },
        computed: {
            registeredUsersExport() {
                let self = this,
                    result = {};

                for (let i = 0; i < self.usersHeaders.length; i++) {
                    let currentHeader = self.usersHeaders[i];
                    result[currentHeader.text] = currentHeader.value;
                }

                result['Дата регистрации'] = {
                    field: "registeredDate",
                    callback: value => {
                        let date = new Date(value);
                        return date.toLocaleString();
                    }
                };
                result['Последнее использование'] = {
                    field: "lastUse",
                    callback: value => {
                        let date = new Date(value);
                        return date.toLocaleString();
                    }
                };
                return result;
            },
            chartBtnShow(){
                return this.isChartShow ? 'Скрыть' : 'Показать'
            },
        },
        mounted(){                
            this.setThisMonth()            
            // this.getChartsData()
            // console.log(this.dateStart2, ' - ', this.dateEnd2)
        }
    }
</script>

<style scoped>

</style>
