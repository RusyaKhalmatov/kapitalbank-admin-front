<template>
    <v-text-field :value="formattedAmount"
                  @input="enteredAmount"
                  :prefix="prefix"
                  :label="label"
                  :hint="hint"
                  :placeholder="placeholder"
                  :autofocus="autofocus"
                  @keydown="validateNumber"/>
</template>
<script>
    export default {
        name: 'MoneyFormat',
        props: {
            value: {
                type: Number,
                default: 0,
                required: false
            },
            prefix: {
                type: String,
                default: '',
                required: false
            },
            label: {
                type: String,
                default: '',
                required: false
            },
            placeholder: {
                type: String,
                default: '',
                required: false
            },
            hint: {
                type: String,
                default: '',
                required: false
            },
            autofocus: {
                type: Boolean,
                default: false,
                required: false
            }
        },
        data() {
            return {
                amount: ''
            }
        },
        methods: {
            enteredAmount(amount) {
                let tmp = amount,
                    tmpArr = tmp.toString().split(".");
                this.amount = tmpArr[0].split(" ").join('') + (tmpArr[1] ? ("." + tmpArr[1].toString().substr(0, 2)) : "");
                this.$emit('input', Number(this.amount));
            },
            validateNumber(event) {
                if (event.key.toString().match(/[0-9.]/) || event.key.toString().match(/(Backspace|Arrow|Delete|Tab)/g)) {
                    if (event.key.toString().match(/[0-9.]/)) {
                        let currentAmount = (this.value + event.key).split(".");
                        if (currentAmount.length > 2 || currentAmount[1] && currentAmount[1].length > 2) {
                            event.preventDefault();
                            return false;
                        }
                    }
                    return true;
                }
                event.preventDefault();
                return false;
            }
        },
        computed: {
            formattedAmount() {
                let amt = this.amount.toString(),
                    amtArr = amt.split(".");
                return amtArr[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + (amtArr[1] ? "." + amtArr[1].toString().substr(0, 2) : "");
            }
        }
    }
</script>