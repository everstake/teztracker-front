<script>
// import VueCharts from 'vue-chartjs'
// import { Doughnut } from 'vue-chartjs';
import VueCharts from "vue-chartjs";

import { Doughnut } from "vue-chartjs";

export default {
  name: "Bar",
  extends: Doughnut,
  mounted() {
    // Overwriting base render method with actual data.
    this.renderChart({
      datasets: [
        {
          data: [75, 25],
          backgroundColor: ["#309282", "#9ea0a5"],
          borderWidth: 0,
          cutoutPercentage: 70,
          responsive: false,
        }
      ],
      labels: ["Carthage (PtCarthav)", "Carthage 1.0"]
    });
  }
};
</script>

<style lang="scss" scoped></style>
