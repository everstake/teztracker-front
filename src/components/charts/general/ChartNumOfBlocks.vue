<template>
  <b-card no-body>
    <CardHeader>
      <template #left-content class="text">
        <h4 class="tz-title--bold">
          {{ $t("charts.numOfBlocks") }}
        </h4>
      </template>
    </CardHeader>

    <div class="card-divider"></div>

    <b-card-body>
      <LineChart :chart-data="numOfBlocks" />
    </b-card-body>
  </b-card>
</template>

<script>
import CardHeader from "../../partials/CardHeader";
import LineChart from "../../partials/chart-types/LineChart.vue";

export default {
  name: "ChartNumOfBlocks",
  components: {
    CardHeader,
    LineChart
  },
  data() {
    return {
      numOfBlocks: {
        labels: [0, 1, 2, 3, 4, 5, 6],
        datasets: [
          {
            label: this.$t("charts.numOfBlocks"),
            data: [
              { x: 0, y: 2 },
              { x: 1, y: 4 },
              { x: 2, y: 6 },
              { x: 3, y: 3 }
            ]
          }
        ]
      }
    };
  }
};
</script>

<style scoped></style>
