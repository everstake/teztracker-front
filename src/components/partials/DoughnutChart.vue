<script>
import { Doughnut } from "vue-chartjs";

export default {
  name: "Bar",
	props: ['data'],
  extends: Doughnut,
  mounted() {
    // Overwriting base render method with actual data.
    this.renderChart({
      datasets: [
        {
          data: this.data,
          backgroundColor: ["#309282", "#9ea0a5", "#e56968"],
        }
      ]
    });
  }
};
</script>

<style lang="scss" scoped></style>
