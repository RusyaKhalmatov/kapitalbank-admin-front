<script>
    import { Bar } from 'vue-chartjs'
    export default {
        name: "BarChart",
        extends: Bar,
        props: ['chartdata', 'options'],
        data() {
            return {
                chart: null,
            };
        },
        methods: {
            render() {
                let handleClick = this.options.onClick ? this.options.onClick : this.click;
                this.chart = this.renderChart(
                    this.chartdata,
                    {
                        ...this.options,
                        responsive: true,
                        onClick: handleClick
                    });
            },

            click(evt) {
                let currentElt = this.$data._chart.getElementsAtEvent(evt);
                currentElt = currentElt.length > 0 ? currentElt[0] : null;
                if (currentElt) {
                    this.$emit("click:index", currentElt._index);
                }
            }
        },
        mounted() {
            this.render();
        },
        watch: {
            chartdata(val) {
                this.render();
            }
        }
    }
</script>

<style scoped>

</style>