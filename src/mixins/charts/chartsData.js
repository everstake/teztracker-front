import { mapState } from "vuex";
import moment from "moment";

export default {
  data() {
    return {
      chartDataInitial: []
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
        .valueOf();
    },
    $_toTimestamp() {
      if (!this.$_last30days || !this.$_last30days.length) return null;

      return moment
        .utc(
          this.$_last30days[this.$_last30days.length - 1],
          this.$_dateFormatWithoutTime
        ) // need format?
        .endOf("day")
        .valueOf();
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
    $_transformInitialDataToChartFormat(initialArr, dateFormat) {
      return initialArr.map(dataObj => {
        return {
          x: moment(dataObj.timestamp).format(dateFormat),
          y: dataObj.blocks
        };
      });
    },
    async $_loadChartDataInitial(opts) {
      const response = await this.$api.getCharts(opts);
      if (response.status !== this.$constants.STATUS_SUCCESS) {
        return this.$router.replace({
          name: response.status
        });
      }

      this.chartDataInitial = response.data;
    }
  }
};
