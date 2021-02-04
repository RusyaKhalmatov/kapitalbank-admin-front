<template>
    <v-layout row wrap>
        <v-flex xs12 sm12 md6 lg6 xl6 v-if="advancedMode">
            <v-datetime-picker
                    prepend-icon="mdi-clock"
                    v-model="dateStart"
                    label="Дата от"
            />
        </v-flex>
        <v-flex xs12 sm12 md6 lg6 xl6 v-if="advancedMode">
            <v-datetime-picker
                    v-model="dateEnd"
                    label="Дата до"
            />
        </v-flex>
        <v-flex xs12 sm12 md12 lg12 xl12 class="first-btn-without-margin-left">
            <slot></slot>
            <v-btn-toggle v-model="selectedButton" v-if="!advancedMode">
                <v-btn dark color="secondary" @click="setYesterday">
                    <span class="white--text">За вчера</span>
                </v-btn>
                <v-btn dark color="secondary" @click="setToday">
                    <span class="white--text">За сегодня</span>
                </v-btn>
                <v-btn dark color="secondary" @click="setPreviousMonth">
                    <span class="white--text">За предыдущий месяц</span>
                </v-btn>
                <v-btn dark color="secondary" @click="setThisMonth">
                    <span class="white--text">За месяц</span>
                </v-btn>
                <v-btn dark color="secondary" @click="setThisYear">
                    <span class="white--text">За год</span>
                </v-btn>
                <v-btn v-if="type==='registeredUsers'" dark color="secondary" @click="setAllYear">
                    <span class="white--text">Весь период</span>
                </v-btn>
            </v-btn-toggle>
            <v-btn dark color="accent" @click="advancedMode = !advancedMode">
                <span v-if="!advancedMode">Расширенный режим</span>
                <span v-if="advancedMode">Простой режим</span>
            </v-btn>
        </v-flex>
    </v-layout>
</template>

<script>
    export default {
        name: "ReportDateTimePicker",
        props: {
            dateTimeStart: {
                type: String,
                required: false,
                default: null
            },
            dateTimeEnd: {
                type: String,
                required: false,
                default: null
            },
            type:  {
                type: String,
                required: false,
                default: null, 
            },
        },
        data() {
            return {
                dateStart: null,
                dateEnd: null,
                advancedMode: false,
                selectedButton: null,
            };
        },
        methods: {
            setYesterday() {
                let self = this,
                    yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);

                // let startDate = new Date(yesterday.getFullYear(), yesterday.getMonth() - 1, yesterday.getDate(), 0, 0, 0);
                self.setDateStart(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0);
                // let endDate = new Date(yesterday.getFullYear(), yesterday.getMonth() - 1, yesterday.getDate(), 23, 59, 59);
                self.setDateEnd(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59);
            },

            setToday() {
                let self = this,
                    today = new Date();

                // let startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
                self.setDateStart(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
                // let endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
                self.setDateEnd(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
            },

            setThisMonth() {
                let self = this,
                    today = new Date();

                // let startDate = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);
                self.setDateStart(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);
                // let endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
                self.setDateEnd(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
            },

            setPreviousMonth() {
                let self = this,
                    today = new Date();

                // let startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1, 0, 0, 0);
                // self.setDateStart(startDate);
                self.setDateStart(today.getFullYear(), today.getMonth() - 1, 1, 0, 0, 0);
                // let dateEnd = new Date(today.getFullYear(), today.getMonth() - 1, self.getLastDateInMonth(today.getMonth()), 23, 59, 59);
                // self.setDateEnd(dateEnd);
                self.setDateEnd(today.getFullYear(), today.getMonth() - 1, self.getLastDateInMonth(today.getMonth() - 1), 23, 59, 59);
            },

            setThisYear() {
                let self = this,
                    today = new Date();

                // let startDate = new Date(today.getFullYear(), 0, 1, 0, 0, 0);
                self.setDateStart(today.getFullYear(), 0, 1, 0, 0, 0);
                // let endDate = new Date(today.getFullYear(), 11, 31, 23, 59, 59);
                self.setDateEnd(today.getFullYear(), 11, 31, 23, 59, 59);
            },
            setAllYear(){
                let self  = this,
                today = new Date();
                self.setDateStart(2019, 9, 1, 0, 0, 0);
                self.setDateEnd(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);


            },

            getFullNumber(number) {
                return number >= 0 && number < 10 ? `0${number}` : number.toString();
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
                this.dateStart = this.getFormatted(year, month, day, hours, minutes, seconds);
            },

            setDateEnd(year, month, day, hours, minutes, seconds) {
                this.dateEnd = this.getFormatted(year, month, day, hours, minutes, seconds);
            },

            getFormatted(year, month, day, hours, minutes, seconds) {
                if (month === -1) {
                    return `${year - 1}-12-${this.getFullNumber(day)}` + " " +
                        `${this.getFullNumber(hours)}:${this.getFullNumber(minutes)}:${this.getFullNumber(seconds)}`;
                }
                return `${year}-${this.getFullNumber(month + 1)}-${this.getFullNumber(day)}` + " " +
                    `${this.getFullNumber(hours)}:${this.getFullNumber(minutes)}:${this.getFullNumber(seconds)}`;
            },

            // getFormat(time) {
            //     if (!time) {
            //         return '';
            //     }
            //     var date = new Date(time);
            //
            //     //var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            //     var year = date.getFullYear();
            //     //var month = months[date.getMonth()];
            //     var month = "0" + (parseFloat(date.getMonth()) + 1);
            //     var hours = "0" + date.getHours();
            //     var minutes = "0" + date.getMinutes();
            //     var seconds = "0" + date.getSeconds();
            //     date = "0" + date.getDate();
            //
            //     return year + '-' + month.substr(-2) + '-' + date.substr(-2) + ' ' + hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
            // },

            getLastDateInMonth(month) {
                let days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                if (month === -1) {
                    return days[11];
                }
                return days[month];
            }
        },
        watch: {
            dateStart(date) {
                this.$emit("update:dateTimeStart", date);
            },

            dateEnd(date) {
                this.$emit("update:dateTimeEnd", date);
            }
        }
    }
</script>

<style scoped>
    .first-btn-without-margin-left > button:first-child,
    .first-btn-without-margin-left > .v-btn:first-child {
        margin-left: 0 !important;
    }
    @media only screen and (max-width: 820px){
        .v-btn-toggle{
            flex-wrap: wrap !important;
            -webkit-box-shadow: none;
            box-shadow: none;
        }
        .v-btn, .secondary{
            margin: 5px 10px 5px 0px !important;
        }
    }
</style>