<template>
  <b-card no-body>
    <CardHeader>
      <template #left-content class="text">
        <h4 class="tz-title--bold">
          {{ $t("charts.rollsDist") }}
        </h4>
      </template>
    </CardHeader>

    <div class="card-divider"></div>

    <b-card-body>
      <div v-if="isChartDataInitialLoading" class="min-h-400 vote__loading">
        {{ $t("common.loading") }}
      </div>

      <PieChart
        v-else
        :chart-data="chartData"
        :tooltips-label-callback="tooltipsLabelCallback"
      />
    </b-card-body>
  </b-card>
</template>

<script>
import CardHeader from "../../partials/CardHeader";
import PieChart from "../../partials/chart-types/PieChart.vue";

export default {
  name: "ChartRollsDistribution",
  components: {
    CardHeader,
    PieChart
  },
  data() {
    return {
      chartDataInitial: [],
      isChartDataInitialLoading: true,
      palette: [
        "#0B6E4B",
        "#178E64",
        "#339B76",
        "#51B08F",
        "#83CFB4",
        "#0A6858",
        "#168774",
        "#309282",
        "#4DA798",
        "#7FCABE",
        "#0B5C64",
        "#167881",
        "#2F848C",
        "#4C9AA1",
        "#7EC0C7",
        "#0F4B68",
        "#1B6386",
        "#357392",
        "#528BA7",
        "#83B3CA",
        "#09312A",
        "#17443D",
        "#274E48",
        "#3C6A63",
        "#5A837C"
      ]
    };
  },
  computed: {
    bakersData() {
      if (!this.chartDataInitial || !this.chartDataInitial.length) {
        return [];
      }

      return this.chartDataInitial.map(baker => {
        return baker.percent.toFixed(6);
      });
    },
    bakersLabels() {
      if (!this.chartDataInitial || !this.chartDataInitial.length) {
        return [];
      }

      return this.chartDataInitial.map(
        baker => baker.baker_name || baker.baker
      );
    },
    chartData() {
      return {
        datasets: [
          {
            data: this.bakersData,
            backgroundColor: this.palette,
            borderWidth: 1
          }
        ],
        labels: this.bakersLabels
      };
    }
  },
  created() {
    this.loadChartDataInitial();
  },
  methods: {
    tooltipsLabelCallback(tooltipItem, data) {
      return `${data.labels[tooltipItem.index]}: ${
        data.datasets[0].data[tooltipItem.index]
      }%`;
    },
    async loadChartDataInitial(opts) {
      try {
        this.isChartDataInitialLoading = true;

        const response = await this.$api.getBakersRollsChart(opts);
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
