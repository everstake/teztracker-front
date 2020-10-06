<template>
  <b-card no-body>
    <CardHeader>
      <template #left-content class="text">
        <h4 class="tz-title--bold">
          {{ $t('accPage.balInThirtyDays') }}
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
        :y-ticks-callback="$_yTicksCallback"
        :tooltips-label-callback="tooltipsLabelCallback"
      />
    </b-card-body>
  </b-card>
</template>

<script>
  import { mapState } from 'vuex';
  import CardHeader from '../../partials/CardHeader';
  import LineChart from '../../partials/chart-types/LineChart.vue';
  import chartsData from '../../../mixins/charts/chartsData';
  import xtzChartDataType from '../../../mixins/charts/xtzChartDataType';
  import numeral from 'numeral';
  import moment from 'moment';

  export default {
    name: 'ChartBalanceLast30Days',
    components: {
      CardHeader,
      LineChart,
    },
    mixins: [chartsData, xtzChartDataType],
    props: {
      acc: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        xAxesMaxTicksLimit: 28,
      };
    },
    computed: {
      ...mapState('app', ['priceInfo', 'dateFormat']),
      chartDataInitialReformatted() {
        if (!this.chartDataInitial || !this.chartDataInitial.length) {
          return [];
        }

        return this.$_transformInitialDataToChartFormat(
          this.chartDataInitial,
          this.$_dateFormatWithoutTime,
          'balance',
          this.$helpers.formatXtz,
        );
      },
      balanceData() {
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
              const timestampOutOfRange = moment(
                pointObj.x,
                this.dateFormat,
              ).isBefore(moment(date, this.dateFormat));

              if (isFound) {
                lastKnownVal = pointObj.y;
              } else if (timestampOutOfRange && !lastKnownVal) {
                lastKnownVal = this.chartDataInitialReformatted[0].y;
              }
            }) || {
              x: date,
              y: lastKnownVal || 0,
            }
          );
        });
      },
      chartData() {
        return {
          labels: this.$_last30days,
          datasets: [
            {
              label: this.$t('common.balance'),
              data: this.balanceData,
              spanGaps: true,
            },
          ],
        };
      },
    },
    watch: {
      acc: {
        immediate: true,
        handler(val) {
          if (val) {
            this.$_loadChartDataInitial(
              {
                account: this.acc,
                from: this.$_fromTimestamp,
                to: this.$_toTimestamp,
              },
              'getAccountBalance',
            );
          }
        },
      },
    },
    methods: {
      tooltipsLabelCallback(tooltipItem, data) {
        return `${data.datasets[0].label}: ${numeral(tooltipItem.value).format(
          '0,0[.]000000',
        )} XTZ (${this.$helpers.formatUSD(
          tooltipItem.value * this.priceInfo.price,
        )})`;
      },
    },
  };
</script>

<style scoped></style>
