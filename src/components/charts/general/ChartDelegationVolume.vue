<template>
  <b-card no-body>
    <CardHeader>
      <template #left-content class="text">
        <h4 class="tz-title--bold">
          {{ $t('charts.delegationVol') }}
        </h4>
      </template>
    </CardHeader>

    <div class="card-divider"></div>

    <b-card-body>
      <div v-if="isChartDataInitialLoading" class="min-h-400 vote__loading">
        {{ $t('common.loading') }}
      </div>

      <LineChart
        v-else
        :chart-data="chartData"
        :x-axes-max-ticks-limit="xAxesMaxTicksLimit"
        y-axes-type="logarithmic"
        :y-axes-max-ticks-limit="12"
        :y-ticks-callback="$_yTicksCallback"
        :tooltips-label-callback="$_tooltipsLabelCallback"
      />
    </b-card-body>
  </b-card>
</template>

<script>
  import CardHeader from '../../partials/CardHeader';
  import LineChart from '../../partials/chart-types/LineChart.vue';
  import chartsData from '../../../mixins/charts/chartsData';
  import xtzChartDataType from '../../../mixins/charts/xtzChartDataType';

  export default {
    name: 'ChartDelegationVolume',
    components: {
      CardHeader,
      LineChart,
    },
    mixins: [chartsData, xtzChartDataType],
    data() {
      return {
        columns: 'delegation_volume',
        period: 'D',
        xAxesMaxTicksLimit: 28,
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
          'delegationVolume',
          this.$helpers.formatXtz,
        );
      },
      delegationVolumeData() {
        if (
          !this.chartDataInitialReformatted ||
          !this.chartDataInitialReformatted.length
        ) {
          return [];
        }

        let lastKnownVal;
        return this.$_last30days.map((date) => {
          return (
            this.chartDataInitialReformatted.find((pointObj) => {
              const isFound = pointObj.x === date;

              if (isFound) {
                lastKnownVal = pointObj.y;
                return isFound;
              }
            }) || {
              x: date,
              y: lastKnownVal || NaN,
            }
          );
        });
      },
      chartData() {
        return {
          labels: this.$_last30days,
          datasets: [
            {
              label: this.$t('charts.delegationVol'),
              data: this.delegationVolumeData,
              spanGaps: true,
            },
          ],
        };
      },
    },
    created() {
      this.$_loadChartDataInitial({
        columns: this.columns,
        period: this.period,
        from: this.$_fromTimestamp,
        to: this.$_toTimestamp,
      });
    },
  };
</script>
