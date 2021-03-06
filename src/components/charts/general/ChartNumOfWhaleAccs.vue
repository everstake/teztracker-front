<template>
  <b-card no-body>
    <CardHeader>
      <template #left-content class="text">
        <h4 class="tz-title--bold">{{ $t('numberOf.#OfWhaleAccs') }} <br /></h4>
        <p class="fs-14 mb-0">
          {{ $t('charts.accsWith500k') }}
        </p>
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
        :y-axes-begin-at-zero="false"
        :x-axes-max-ticks-limit="xAxesMaxTicksLimit"
      />
    </b-card-body>
  </b-card>
</template>

<script>
  import CardHeader from '../../partials/CardHeader';
  import LineChart from '../../partials/chart-types/LineChart.vue';
  import chartsData from '../../../mixins/charts/chartsData';

  export default {
    name: 'ChartNumOfWhaleAccs',
    components: {
      CardHeader,
      LineChart,
    },
    mixins: [chartsData],
    data() {
      return {
        columns: 'whale_accounts',
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
          'whale_accounts',
        );
      },
      numOfWhaleAccsData() {
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
              label: this.$t('numberOf.#OfWhaleAccs'),
              data: this.numOfWhaleAccsData,
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
