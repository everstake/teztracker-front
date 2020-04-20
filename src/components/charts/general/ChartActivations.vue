<template>
  <b-card no-body>
    <CardHeader>
      <template #left-content class="text">
        <h4 class="tz-title--bold">
          {{ $tc("opTypes.activation", 2) }}
        </h4>
      </template>
    </CardHeader>

    <div class="card-divider"></div>

    <b-card-body>
      <LineChart
        :chart-data="chartData"
        :x-axes-max-ticks-limit="xAxesMaxTicksLimit"
      />
    </b-card-body>
  </b-card>
</template>

<script>
import CardHeader from "../../partials/CardHeader";
import LineChart from "../../partials/chart-types/LineChart.vue";
import chartsData from "../../../mixins/charts/chartsData";

export default {
  name: "ChartActivations",
  components: {
    CardHeader,
    LineChart
  },
  mixins: [chartsData],
  data() {
    return {
      columns: "activations",
      period: "day",
      xAxesMaxTicksLimit: 28
    };
  },
  computed: {
    numOfBlocksData() {
      if (
        !this.$_chartDataInitialReformatted ||
        !this.$_chartDataInitialReformatted.length
      ) {
        return [];
      }

      let lastKnownVal;
      return this.$_last30days.map(date => {
        return (
          this.$_chartDataInitialReformatted.find(pointObj => {
            const isFound = pointObj.x === date;

            if (isFound) {
              lastKnownVal = pointObj.y;
              return isFound;
            }
          }) || {
            x: date,
            y: lastKnownVal || 0
          }
        );
      });
    },
    chartData() {
      return {
        labels: this.$_last30days,
        datasets: [
          {
            label: this.$tc("opTypes.activation", 2),
            data: this.numOfBlocksData,
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
  }
};
</script>
