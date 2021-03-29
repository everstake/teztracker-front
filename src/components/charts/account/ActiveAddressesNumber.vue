<template>
  <b-card no-body>
    <CardHeader>
      <template #left-content class="text">
        <h4 class="tz-title--bold">
          Number of active addresses
        </h4>
      </template>
    </CardHeader>

    <div class="card-divider"></div>

    <b-card-body>
      <div v-if="isChartDataInitialLoading" class="min-h-400 vote__loading">
        {{ $t('common.loading') }}
      </div>

      <LineChart
        v-bind="$attrs"
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
    name: 'ActriveAddressesNumber',
    components: {
      CardHeader,
      LineChart,
    },
    inheritAttrs: false,
    mixins: [chartsData],
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

        if (!this.propsData.length) {
          return this.$_transformInitialDataToChartFormat(
              this.chartDataInitial,
              this.$_dateFormatWithoutTime,
              this.columns,
          );
        }

        return this.$_transformInitialDataToChartFormat(
            this.propsData,
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
              label: 'Number of active addresses',
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
        'getActiveAddressesNumber',
      );
    },
  };
</script>
