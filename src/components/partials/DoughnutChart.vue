<script>
import { Doughnut } from "vue-chartjs";

export default {
  name: "Bar",
  props: ["options"],
  extends: Doughnut,
	data() {
    return {
      backgroundColors: ["#309282", "#9ea0a5", "#e56968"]
    }
	},
  watch: {
    options: {
      handler() {
        // Overwriting base render method with actual data.
        this.renderChart(
          {
            datasets: [
              {
                data: this.options.data,
	              backgroundColor: this.backgroundColors.slice(0, this.options.data.length)
              }
            ],
            labels: this.options.labels
          },
          {
            cutoutPercentage: 80
          }
        );
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
