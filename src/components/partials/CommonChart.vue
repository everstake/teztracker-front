<template>
  <b-card no-body xl="6" class="mb-30">
    <CardHeader>
      <template #left-content class="text">
        <h4 class="tz-title--bold">
          {{ title }}
        </h4>
      </template>

      <template #right-content class="text">
        <div class="settings">
          <TimeSelect
            v-if="timeOptions"
            :time-options="timeOptions"
            :initial-value="initialTime"
            @onChange="handleChangeTime"
          />

          <ChartTypeToggler @onChange="handleChangeType" />
        </div>
      </template>
    </CardHeader>

    <div class="card-divider" />

    <b-card-body>
      <div v-if="loading || !chartData" class="min-h-400 vote__loading">
        {{ $t('common.loading') }}
      </div>

      <div v-else>
        <LineChart
          v-if="chartType === chartTypes.line"
          :chart-data="chartData"
          :y-axes-max-ticks-limit="13"
          :x-axes-max-ticks-limit="20"
          :y-axes-begin-at-zero="false"
        />

        <BarChart
          v-if="chartType === chartTypes.histogram"
          :chart-data="chartData"
          :y-axes-max-ticks-limit="13"
          :x-axes-max-ticks-limit="20"
        />
      </div>
    </b-card-body>
  </b-card>
</template>

<script>
  import moment from 'moment';
  import chartWithDateSelect, {
    periodByTime,
  } from '@/mixins/charts/chartWithDateSelect';
  import CardHeader from '@/components/partials/CardHeader';
  import LineChart from '@/components/partials/chart-types/LineChart';
  import TimeSelect from '@/components/partials/TimeSelect';
  import ChartTypeToggler from '@/components/partials/ChartTypeToggler';
  import BarChart from '@/components/partials/chart-types/BarChart';

  const chartTypes = {
    line: 'line',
    histogram: 'histogram',
  };

  export default {
    name: 'CommonChart',
    components: {
      CardHeader,
      LineChart,
      TimeSelect,
      ChartTypeToggler,
      BarChart,
    },
    mixins: [chartWithDateSelect],
    props: {
      loading: {
        type: Boolean,
        default: false,
      },
      title: {
        type: String,
        required: true,
      },
      label: {
        type: String,
        default: '',
      },
      data: {
        type: Array,
        required: false,
        default: null,
      },
      datePoints: {
        type: Array,
        required: false,
        default: null,
      },
      timeOptions: {
        type: Array,
        required: false,
        default: null,
      },
    },
    data() {
      return {
        chartType: chartTypes.line,
        chartTypes,
      };
    },
    computed: {
      chartData() {
        if (!(this.datePoints || this.data)) {
          return null;
        }

        return {
          labels: this.datePoints.map((point) =>
            moment.unix(point).format(this.labelsFormat),
          ),
          datasets: [
            {
              label: this.label,
              data:
                this.chartType === this.chartTypes.line
                  ? this.data
                  : this.data.map((point) => point.y),
              spanGaps: true,
              backgroundColor: 'rgba(48, 146, 130, 0.3)',
            },
          ],
        };
      },
    },
    methods: {
      handleChangeTime(event) {
        this.timeType = event.type;

        this.$emit('onChangeOptions', {
          ...event.payload,
          period: periodByTime[event.type],
        });
      },
      handleChangeType(type) {
        this.chartType = type;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .settings {
    display: flex;
    gap: 19px;
  }
</style>
