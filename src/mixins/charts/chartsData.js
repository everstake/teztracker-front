import { mapState } from "vuex";
import moment from "moment";

export default {
  data() {
    return {
      chartDataInitial: [],
      isChartDataInitialLoading: true
    };
  },
  computed: {
    ...mapState("app", {
      dateFormat: state => state.dateFormat
    }),
    $_dateFormatWithoutTime() {
      return this.dateFormat.split(" ")[0];
    },
    $_last30days() {
      return [...new Array(30)]
        .map((i, idx) =>
          moment
            .utc()
            .startOf("day")
            .subtract(idx, "days")
            .format(this.$_dateFormatWithoutTime)
        )
        .reverse();
    },
    $_fromTimestamp() {
      if (!this.$_last30days || !this.$_last30days.length) return null;

      return moment
        .utc(this.$_last30days[0], this.$_dateFormatWithoutTime) // need format?
        .startOf("day")
        .unix();
    },
    $_toTimestamp() {
      if (!this.$_last30days || !this.$_last30days.length) return null;

      return moment
        .utc(
          this.$_last30days[this.$_last30days.length - 1],
          this.$_dateFormatWithoutTime
        ) // need format?
        .endOf("day")
        .unix();
    },
    $_chartDataInitialReformatted() {
      if (!this.chartDataInitial || !this.chartDataInitial.length) {
        return [];
      }

      return this.$_transformInitialDataToChartFormat(
        this.chartDataInitial,
        this.$_dateFormatWithoutTime
      );
    }
  },
  methods: {
    $_transformInitialDataToChartFormat(
      initialArr,
      dateFormat,
      dataEntity,
      dataFormatter
    ) {
      return initialArr.map(dataObj => {
        return {
          x: moment.unix(dataObj.timestamp).format(dateFormat),
          y: dataFormatter
            ? dataFormatter(dataObj[dataEntity])
            : dataObj[dataEntity]
        };
      });
    },
    async $_loadChartDataInitial(opts) {
      try {
        this.isChartDataInitialLoading = true;

        const response = await this.$api.getCharts(opts);
        if (response.status !== this.$constants.STATUS_SUCCESS) {
          return this.$router.replace({
            name: response.status
          });
        }

        this.chartDataInitial = response.data;
      } finally {
        this.isChartDataInitialLoading = false;
      }
    }
  }
};
