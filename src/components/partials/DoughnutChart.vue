<script>
import { Doughnut } from "vue-chartjs";

export default {
  name: "Bar",
  props: ["options", "backgroundColors"],
  extends: Doughnut,
	mounted() {
    this.initChart();
	},
	watch: {
    options() {
      this.initChart();
    }
	},
	methods: {
    initChart() {
      let { data = [], backgroundColors = [] } = this.options;

      if (this.options.data !== undefined) {
        backgroundColors = this.backgroundColors.slice(0, this.options.data.length);
      }

      return this.renderChart(
        {
          datasets: [
            {
              data: data,
              backgroundColor: backgroundColors
            }
          ],
          labels: this.options.labels
        },
        {
          cutoutPercentage: 80,
          legend: {
            position: 'bottom',
	          align: 'start',
            labels: {
              padding: 30,
              usePointStyle: true,
              fontSize: 20,
              fontFamily: 'Montserrat Alternates'
            }
          }
        }
      );
    }
	}
};
</script>

<style lang="scss" scoped></style>
