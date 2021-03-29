import { mapState } from 'vuex';
import moment from 'moment';

export default {
  props: {
    propsData: {
      type: Array,
      default: () => [],
    },
    propsLabels: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      chartDataInitial: [],
      isChartDataInitialLoading: true,
    };
  },
  computed: {
    ...mapState('app', {
      dateFormat: (state) => state.dateFormat,
    }),
    $_dateFormatWithoutTime() {
      return this.dateFormat.split(' ')[0];
    },
    $_last30days() {
      return [...new Array(30)]
        .map((i, idx) =>
          moment
            .utc()
            .startOf('day')
            .subtract(idx, 'days')
            .format(this.$_dateFormatWithoutTime),
        )
        .reverse();
    },
    $_fromTimestamp() {
      if (!this.$_last30days || !this.$_last30days.length) return null;

      return moment
        .utc(this.$_last30days[0], this.$_dateFormatWithoutTime) // need format?
        .startOf('day')
        .unix();
    },
    $_toTimestamp() {
      if (!this.$_last30days || !this.$_last30days.length) return null;

      return moment
        .utc(
          this.$_last30days[this.$_last30days.length - 1],
          this.$_dateFormatWithoutTime,
        ) // need format?
        .endOf('day')
        .unix();
    },
  },
  methods: {
    $_transformInitialDataToChartFormat(
      initialArr,
      dateFormat,
      dataEntity,
      dataFormatter,
    ) {
      return initialArr.map((dataObj) => {
        const timestamp = dataObj.timestamp || dataObj.date;
        return {
          x: moment.unix(timestamp).format(dateFormat),
          y: dataFormatter
            ? dataFormatter(dataObj[dataEntity])
            : dataObj[dataEntity],
        };
      });
    },
    async $_loadChartDataInitial(opts, altRequest = null) {
      try {
        this.isChartDataInitialLoading = true;

        // const response = await this.$api.getCharts(opts);
        const response = altRequest
          ? await this.$api[altRequest](opts)
          : await this.$api.getCharts(opts);
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
