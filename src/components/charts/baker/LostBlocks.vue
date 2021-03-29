<template>
  <b-card no-body>
    <CardHeader>
      <template #left-content class="text">
        <h4 class="tz-title--bold">
          Lost blocks
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
        v-bind="$attrs"
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
    name: 'LostBlocks',
    components: {
      CardHeader,
      LineChart,
    },
    mixins: [chartsData],
    inheritAttrs: false,
    data() {
      return {
        columns: 'value',
        period: 'day',
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
          this.columns,
        );
      },
      numOfBlocksData() {
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
              label: 'Lost blocks',
              data: this.numOfBlocksData,
              spanGaps: true,
            },
          ],
        };
      },
    },
    created() {
      this.$_loadChartDataInitial(
        {
          period: this.period,
          from: this.$_fromTimestamp,
          to: this.$_toTimestamp,
        },
        'getLostBlocks',
      );
    },
  };
</script>
