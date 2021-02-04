<template>
    <div>
        <v-text-field
                :label="label"
                :prepend-icon="prependIcon"
                :append-icon="appendIcon"
                :disabled="disabled"
                :loading="loading ? 'primary' : loading"
                :value="value"
                :rules="rules"
                :placeholder="placeholder"
                clearable
                @click:clear="clear"
                @click.native="dialog = true">
        </v-text-field>
        <v-dialog v-model="dialog" max-width="400">
            <v-card>
                <v-card-title primary-title>{{ label }}</v-card-title>
                <v-card-text class="pa-0">
                    <v-tabs v-model="activeTab">
                        <v-tab key="date-activator">Дата</v-tab>
                        <v-tab key="time-activator">Время</v-tab>

                        <v-tab-item key="date-activator" class="pt-1">
                            <v-date-picker v-model="date" full-width/>
                        </v-tab-item>
                        <v-tab-item key="time-activator" class="pt-1">
                            <v-time-picker v-model="time" format="24hr" full-width/>
                        </v-tab-item>
                    </v-tabs>
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn color="primary" :disabled="!availableClose" :loading="loading"
                           @click.native="dialog = false">
                        Закрыть
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    export default {
        props: {
            value: {
                type: null,
                required: true,
            },
            prependIcon: {
                type: String,
                required: false,
                default: "",
            },
            appendIcon: {
                type: String,
                required: false,
                default: "",
            },
            loading: {
                type: [Boolean, String],
                required: false,
                default: false,
            },
            disabled: {
                type: Boolean,
                default: false,
            },
            label: {
                type: String,
                required: false,
                default: "",
            },
            rules: {
                type: Array,
                required: false,
                default: () => [],
            },
            placeholder: {
                type: String,
                required: false,
                default: ""
            }
        },
        name: "VDatetimePicker",
        data() {
            return {
                dialog: false,
                activeTab: null,
                parsedDate: [],
                parsedTime: [],
                date: null,
                time: null,
            };
        },
        methods: {
            parse(value) {
                if (!value) return;

                let dateTimeArr = value.toString().replace(/[T ]/gi, "-").replace(/:/gi, "-").split("-");
                if (dateTimeArr.length === 6) {
                    let year = dateTimeArr[0],
                        month = dateTimeArr[1],
                        date = dateTimeArr[2],
                        hours = dateTimeArr[3],
                        minutes = dateTimeArr[4],
                        seconds = dateTimeArr[5];

                    this.setDate(year, month, date);
                    this.setTime(hours, minutes, seconds);
                } else {
                    let today = new Date();
                    this.setDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
                    this.setTime(today.getHours(), today.getMinutes());
                }

                this.date = this.parsedDate.join("-");
                this.time = this.parsedTime.join(":");
            },

            setDate(year, month, date) {
                let today = new Date();

                year = !isNaN(parseInt(year)) ? parseInt(year) : today.getFullYear();
                month = !isNaN(parseInt(month)) ? parseInt(month) : today.getMonth() + 1;
                date = !isNaN(parseInt(date)) ? parseInt(date) : today.getDate();

                this.parsedDate = [
                    year,
                    (month < 10 ? `0${month}` : month),
                    (date < 10 ? `0${date}` : date)
                ];
            },

            setTime(hours, minutes, seconds = "0") {
                let today = new Date();

                hours = !isNaN(parseInt(hours)) ? parseInt(hours) : today.getHours();
                minutes = !isNaN(parseInt(minutes)) ? parseInt(minutes) : today.getMinutes();
                seconds = !isNaN(parseInt(seconds)) ? parseInt(seconds) : today.getSeconds();

                this.parsedTime = [];
                this.parsedTime = [
                    (hours < 10 ? `0${hours}` : hours),
                    (minutes < 10 ? `0${minutes}` : minutes),
                    (seconds < 10 ? `0${seconds}` : seconds)
                ];
            },

            handleDate(value) {
                if (value === null) return;

                let dateArr = value.toString().split("-");
                if (dateArr.length === 3) {
                    this.setDate(dateArr[0], dateArr[1], dateArr[2]);
                    this.activeTab = 1;
                    this.emitUpdate();
                }
            },

            handleTime(value) {
                if (value === null) return;

                let timeArr = value.toString().split(":");
                if (timeArr.length === 2) {
                    this.setTime(timeArr[0], timeArr[1]);
                    this.emitUpdate();
                }
            },

            clear() {
                this.date = null;
                this.time = null;
                this.parsedDate = [];
                this.parsedTime = [];
                this.emitUpdate(null);
            },

            emitUpdate(value) {
                if (!value) {
                    if (this.parsedDate.length === 0) {
                        this.setDate();
                    }

                    if (this.parsedTime.length === 0) {
                        this.setTime();
                    }


                    value = `${this.parsedDate.join("-")} ${this.parsedTime.join(":")}`;
                }

                this.$emit("input", value);
            }
        },
        mounted() {
            this.parse(this.value);
        },
        watch: {
            value(value) {
                this.parse(value);
            },

            date(value) {
                this.handleDate(value);
            },

            time(value) {
                this.handleTime(value);
            }
        },
        computed: {
            availableClose() {
                return this.date === null && this.time === null ||
                    this.parsedDate.length === 3 && this.parsedTime.length === 3;
            }
        }
    }
</script>

<style scoped>

</style>