<template>
  <b-card no-body>
    <CardHeader>
      <template #left-content class="text">
        <h4 class="tz-title--bold">
          {{ $t("charts.prioritiesPerCycle") }}
        </h4>
      </template>
    </CardHeader>

    <div class="card-divider"></div>

    <b-card-body>
      <BarChart
        :chart-data="chartData"
        y-axes-type="logarithmic"
        :y-axes-max-ticks-limit="yAxesMaxTicksLimit"
        :y-ticks-callback="yTicksCallback"
        :tooltips-label-callback="tooltipsLabelCallback"
      />
    </b-card-body>
  </b-card>
</template>

<script>
import CardHeader from "../../partials/CardHeader";
import BarChart from "../../partials/chart-types/BarChart.vue";

export default {
  name: "ChartPrioritiesPerCycle",
  components: {
    CardHeader,
    BarChart
  },
  data() {
    return {
      yAxesMaxTicksLimit: 14
    };
  },
  computed: {
    chartData() {
      return {
        labels: [
          "Cycle 0",
          "Cycle 1",
          "Cycle 2",
          "Cycle 3",
          "Cycle 4",
          "Cycle 5",
          "Cycle 6",
          "Cycle 7",
          "Cycle 8",
          "Cycle 9"
        ],
        datasets: [
          {
            label: "Priority 0",
            backgroundColor: "#0A6858",
            data: [90, 80, 85, 75, 95, 90, 83, 78, 87, 92]
          },
          {
            label: "Priority 1",
            backgroundColor: "#309282",
            data: [18, 13, 21, 20, 4, 6, 15, 19, 12, 7]
          },
          {
            label: "Priority 2",
            backgroundColor: "#7FCABE",
            data: [2, 7, 4, 10, 1, 4, 2, 3, 2, 1]
          },
          {
            label: "Priority 3 and higher",
            backgroundColor: "#83CFB4",
            data: [0.06, 0.05, 0.02, 0.004, 0.005, 0.02, 0.009, 0.0045, 0.02, 0.007]
          }
        ]
      };
    }
  },
  methods: {
    yTicksCallback(label) {
      return `${label}%`;
    },
    tooltipsLabelCallback(tooltipItem, data) {
      return `${data.datasets[0].label}: ${tooltipItem.value}%`;
    }
  }
};
</script>

<style scoped></style>
