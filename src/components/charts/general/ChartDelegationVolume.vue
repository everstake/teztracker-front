<template>
  <b-card no-body>
    <CardHeader>
      <template #left-content class="text">
        <h4 class="tz-title--bold">
          {{ $t("charts.delegationVol") }}
        </h4>
      </template>
    </CardHeader>

    <div class="card-divider"></div>

    <b-card-body>
      <LineChart
        :chart-data="chartData"
        :x-axes-max-ticks-limit="xAxesMaxTicksLimit"
        :y-ticks-callback="$_yTicksCallback"
        :tooltips-label-callback="$_tooltipsLabelCallback"
      />
    </b-card-body>
  </b-card>
</template>

<script>
import CardHeader from "../../partials/CardHeader";
import LineChart from "../../partials/chart-types/LineChart.vue";
import chartsData from "../../../mixins/charts/chartsData";
import xtzChartDataType from "../../../mixins/charts/xtzChartDataType";

export default {
  name: "ChartDelegationVolume",
  components: {
    CardHeader,
    LineChart
  },
  mixins: [chartsData, xtzChartDataType],
  data() {
    return {
      columns: "delegation_volume",
      period: "day",
      xAxesMaxTicksLimit: 28
    };
  },
  computed: {
    delegationVolumeData() {
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
            label: this.$t("charts.delegationVol"),
            data: this.delegationVolumeData,
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
