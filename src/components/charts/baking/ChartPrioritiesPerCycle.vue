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
      <div v-if="isChartDataInitialLoading" class="min-h-400 vote__loading">
        {{ $t("common.loading") }}
      </div>

      <BarChart
        v-else
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
      chartDataInitial: [],
      isChartDataInitialLoading: true,
      cyclesLimit: 10,
      yAxesMaxTicksLimit: 14,
    };
  },
  computed: {
    cycles() {
      if (!this.chartDataInitial || !this.chartDataInitial.length) {
        return [];
      }

      return this.chartDataInitial
        .map(cycleObj => `${this.$tc("common.cycle", 1)} ${cycleObj.cycle}`)
        .reverse();
    },
    priorities() {
      if (!this.chartDataInitial || !this.chartDataInitial.length) {
        return [];
      }

      return this.chartDataInitial.reduce(
        (acc, cycleObj, index) => {
          acc.zeroPriority.push(
            ((cycleObj.zeroPriority / cycleObj.blocks) * 100).toFixed(6)
          );
          acc.firstPriority.push(
            ((cycleObj.firstPriority / cycleObj.blocks) * 100).toFixed(6)
          );
          acc.secondPriority.push(
            ((cycleObj.secondPriority / cycleObj.blocks) * 100).toFixed(6)
          );
          acc.thirdPriority.push(
            ((cycleObj.thirdPriority / cycleObj.blocks) * 100).toFixed(6)
          );

          if (index === this.chartDataInitial.length - 1) {
            acc.zeroPriority.reverse();
            acc.firstPriority.reverse();
            acc.secondPriority.reverse();
            acc.thirdPriority.reverse();
          }

          return acc;
        },
        {
          zeroPriority: [],
          firstPriority: [],
          secondPriority: [],
          thirdPriority: []
        }
      );
    },
    chartData() {
      return {
        labels: this.cycles,
        datasets: [
          {
            label: `${this.$t("common.priority")} 0`,
            backgroundColor: "#0A6858",
            data: this.priorities.zeroPriority
          },
          {
            label: `${this.$t("common.priority")} 1`,
            backgroundColor: "#309282",
            data: this.priorities.firstPriority
          },
          {
            label: `${this.$t("common.priority")} 2`,
            backgroundColor: "#7FCABE",
            data: this.priorities.secondPriority
          },
          {
            label: `${this.$t("common.priority")} 3 ${this.$t(
              "charts.andHigher"
            )}`,
            backgroundColor: "#83CFB4",
            data: this.priorities.thirdPriority
          }
        ]
      };
    }
  },
  created() {
    this.loadChartDataInitial({
      limit: this.cyclesLimit
    });
  },
  methods: {
    yTicksCallback(label) {
      return `${label}%`;
    },
    tooltipsLabelCallback(tooltipItem, data) {
      return `${data.datasets[tooltipItem.datasetIndex].label}: ${tooltipItem.value}%`;
    },
    async loadChartDataInitial(opts) {
      try {
        this.isChartDataInitialLoading = true;

        const response = await this.$api.getBlocksPriorityChart(opts);
        if (response.status !== this.$constants.STATUS_SUCCESS) {
          return this.$router.replace({
            name: response.status
          });
        }

        this.chartDataInitial = response.data;
      } finally {
        this.isChartDataInitialLoading = false;
      }
    }
  }
};
</script>

<style scoped></style>
