<template>
    <div>
        <v-btn icon dark :color="value ? 'warning' : 'primary'" @click.native="toggleChart">
            <v-icon>mdi-chart-bar</v-icon>
        </v-btn>
    </div>
</template>

<script>
    export default {
        props: ['value'],
        name: "ShowChart",
        methods: {
            toggleChart() {
                this.$emit("input", !this.value);
            }
        }
    }
</script>

<style scoped>

</style>