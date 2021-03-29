<template>
  <b-card class="baker-holding" no-body>
    <p class="baker-holding__title">
      Amount of bakers holding
      <span class="color-accent">{{ amountPercent }}%</span> of
      stake + the amount of
      <span class="color-accent">{{ amountHolding | tezos }}</span> that
      constitute for {{ 100 - amountPercent }} of the network.
      <span class="color-accent">{{
        amountCount === 1
          ? `${amountCount} baker`
          : `${amountCount} bakers`
      }}</span
      >.
    </p>

    <b-card-body>
      <div v-if="isChartDataInitialLoading" class="min-h-400 vote__loading">
        {{ $t('common.loading') }}
      </div>

      <DoughnutChart
        v-else
        class="rolls-chart-container"
        v-bind="$attrs"
        :background-colors="['#309282']"
        :options="getDoughnutOptions"
        :labelCallback="labelCallback"
        :props-data="propsData"
      />
    </b-card-body>
  </b-card>
</template>

<script>
  import DoughnutChart from '@/components/partials/DoughnutChart';
  import chartsData from '@/mixins/charts/chartsData';
  import numeral from 'numeral';
  import Vue from 'vue';

  export default {
    name: 'BakerHoldingAmount',
    components: {
      DoughnutChart,
    },
    inheritAttrs: false,
    props: {
      labelCallback: { type: Function },
    },
    mixins: [chartsData],
    data() {
      return {
        chartDataInitial: [],
        isChartDataInitialLoading: true,
        palette: [
          '#0B6E4B',
          '#178E64',
          '#339B76',
          '#51B08F',
          '#83CFB4',
          '#0A6858',
          '#168774',
          '#309282',
          '#4DA798',
          '#7FCABE',
          '#0B5C64',
          '#167881',
          '#2F848C',
          '#4C9AA1',
          '#7EC0C7',
          '#0F4B68',
          '#1B6386',
          '#357392',
          '#528BA7',
          '#83B3CA',
          '#09312A',
          '#17443D',
          '#274E48',
          '#3C6A63',
          '#5A837C',
        ],
      };
    },
    computed: {
      amountPercent() {
        if (!this.propsData[0]) {
          return 0;
        }

        return this.propsData[0].percent * 100;
      },
      amountHolding() {
        if (!this.propsData[0]) {
          return 0;
        }
        return this.propsData[0].amount;
      },
      amountCount() {
        if (!this.propsData[0]) {
          return 0;
        }
        return this.propsData[0].count;
      },
      getDoughnutOptions() {
        const options = {};

        if (this.propsData.length) {
          const percent = this.propsData[0].percent * 100;
          const amount = numeral(
            this.propsData[0].amount / Vue.prototype.$constants.XTZ,
          ).format('0,0[.]00');
          options.data = [percent, 100 - percent];
          options.labels = [`${percent}%: ${amount} ꜩ`];
        } else {
          options.data = [...this.chartDataInitial.map(({ amount }) => amount)];

          options.labels = [
            ...this.chartDataInitial.map(({ percent }) => `${percent * 100}%`),
          ];
        }

        return options;
      },
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

          const response = await this.$api.getBakersHolding(opts);
          if (response.status !== this.$constants.STATUS_SUCCESS) {
            return this.$router.replace({
              name: response.status,
            });
          }

          this.chartDataInitial = response.data;
        } finally {
          this.isChartDataInitialLoading = false;
        }
      },
    },
  };
</script>

<style lang="scss">
  .rolls-chart-container {
    min-height: auto;
    max-height: 400px;

    @media (max-width: 575px) {
      max-height: 100%;
      min-height: 590px;
    }
  }

  .baker-holding {
    &__title {
      padding: 10px;
      font-weight: bold;
      font-size: 16px;
    }
  }
</style>
