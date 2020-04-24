<template>
  <b-card no-body>
    <CardHeader>
      <template #left-content class="text">
        <h4 class="tz-title--bold">
          {{ $t("charts.avgBlockDelay") }}
        </h4>
      </template>
    </CardHeader>

    <div class="card-divider"></div>

    <b-card-body>
      <div v-if="isChartDataInitialLoading" class="min-h-400 vote__loading">
        {{ $t("common.loading") }}
      </div>

      <LineChart
        v-else
        :chart-data="chartData"
        :x-axes-max-ticks-limit="xAxesMaxTicksLimit"
        :y-axes-begin-at-zero="false"
        :y-ticks-callback="formatSeconds"
        :tooltips-label-callback="this.tooltipsLabelCallback"
      />
    </b-card-body>
  </b-card>
</template>

<script>
import CardHeader from "../../partials/CardHeader";
import LineChart from "../../partials/chart-types/LineChart.vue";
import chartsData from "../../../mixins/charts/chartsData";

export default {
  name: "ChartAvgBlockDelay",
  components: {
    CardHeader,
    LineChart
  },
  mixins: [chartsData],
  data() {
    return {
      columns: "avg_block_delay",
      period: "D",
      xAxesMaxTicksLimit: 28
    };
  },
  computed: {
    chartDataInitialReformatted() {
      if (!this.chartDataInitial || !this.chartDataInitial.length) {
        return [];
      }

      return this.$_transformInitialDataToChartFormat(
        this.chartDataInitial,
        this.$_dateFormatWithoutTime,
        "averageDelay"
      );
    },
    avgBlockDelayData() {
      if (
        !this.chartDataInitialReformatted ||
        !this.chartDataInitialReformatted.length
      ) {
        return [];
      }

      let lastKnownVal;
      return this.$_last30days.map(date => {
        return (
          this.chartDataInitialReformatted.find(pointObj => {
            const isFound = pointObj.x === date;

            if (isFound) {
              lastKnownVal = pointObj.y;
              return isFound;
            }
          }) || {
            x: date,
            y: lastKnownVal || NaN
          }
        );
      });
    },
    chartData() {
      return {
        labels: this.$_last30days,
        datasets: [
          {
            label: this.$t("charts.avgBlockDelay"),
            data: this.avgBlockDelayData,
            spanGaps: true
          }
        ]
      };
    }
  },
  created() {
    this.$_loadChartDataInitial({
      columns: this.columns,
      period: this.period,
      from: this.$_fromTimestamp,
      to: this.$_toTimestamp
    });
  },
  methods: {
    formatSeconds(seconds) {
      const date = new Date(0);
      date.setMilliseconds(seconds * 1000); // specify value for MILLISECONDS here
      // less than a second
      if (seconds < 1) {
        return `${date.getMilliseconds()} ms`;
      }
      // more than a minute
      if (seconds > 59) {
        return `${date.getMinutes()} m ${date.getSeconds()} s ${date.getMilliseconds()} ms`;
      }
      // more than an hour
      if (seconds > 86399) {
        return `${date.getHours()} h ${date.getMinutes()} m ${date.getSeconds()} s ${date.getMilliseconds()} ms`;
      }

      // just seconds
      return `${date.getSeconds()} s ${date.getMilliseconds()} ms`;
    },
    tooltipsLabelCallback(tooltipItem, data) {
      return `${data.datasets[0].label}: ${this.formatSeconds(
        tooltipItem.value
      )}`;
    }
  }
};
</script>
