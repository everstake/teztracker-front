<template>
  <b-card no-body>
    <CardHeader>
      <template #left-content class="text">
        <h4 class="tz-title--bold">
          {{ $t("charts.numOfBlocks") }}
        </h4>
      </template>
    </CardHeader>

    <div class="card-divider"></div>

    <b-card-body>
      <LineChart
        :chart-data="chartData"
        :x-axes-max-ticks-limit="xAxesMaxTicksLimit"
      />
    </b-card-body>
  </b-card>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";
import CardHeader from "../../partials/CardHeader";
import LineChart from "../../partials/chart-types/LineChart.vue";

export default {
  name: "ChartNumOfBlocks",
  components: {
    CardHeader,
    LineChart
  },
  data() {
    return {
      numOfBlocksInitial: [],
      columns: "blocks",
      period: "day",
      xAxesMaxTicksLimit: 28
    };
  },
  computed: {
    ...mapState("app", {
      dateFormat: state => state.dateFormat
    }),
    dateFormatWithoutTime() {
      return this.dateFormat.split(" ")[0];
    },
    last30days() {
      return [...new Array(30)]
        .map((i, idx) =>
          moment
            .utc()
            .startOf("day")
            .subtract(idx, "days")
            .format(this.dateFormatWithoutTime)
        )
        .reverse();
    },
    fromTimestamp() {
      if (!this.last30days || !this.last30days.length) return null;

      return moment
        .utc(this.last30days[0], this.dateFormatWithoutTime) // need format?
        .startOf("day")
        .valueOf();
    },
    toTimestamp() {
      if (!this.last30days || !this.last30days.length) return null;

      return moment
        .utc(
          this.last30days[this.last30days.length - 1],
          this.dateFormatWithoutTime
        ) // need format?
        .endOf("day")
        .valueOf();
    },
    numOfBlocksReformatted() {
      if (!this.numOfBlocksInitial || !this.numOfBlocksInitial.length) {
        return [];
      }

      return this.transformInitialDataToChartFormat(
        this.numOfBlocksInitial,
        this.dateFormatWithoutTime
      );
    },
    numOfBlocksData() {
      if (!this.numOfBlocksReformatted || !this.numOfBlocksReformatted.length) {
        return [];
      }

      let lastKnownVal;
      return this.last30days.map(date => {
        return (
          this.numOfBlocksReformatted.find(pointObj => {
            const isFound = pointObj.x === date;

            if (isFound) {
              lastKnownVal = pointObj.y;
              return isFound;
            }
          }) || {
            x: date,
            y: lastKnownVal || 0
          }
        );
      });
    },
    chartData() {
      return {
        labels: this.last30days,
        datasets: [
          {
            label: this.$t("charts.numOfBlocks"),
            data: this.numOfBlocksData,
            spanGaps: true
          }
        ]
      };
    }
  },
  created() {
    this.reload({
      columns: this.columns,
      period: this.period,
      from: this.fromTimestamp,
      to: this.toTimestamp
    });
  },
  methods: {
    transformInitialDataToChartFormat(initialArr, dateFormat) {
      return initialArr.map(dataObj => {
        return {
          x: moment(dataObj.timestamp).format(dateFormat),
          y: dataObj.blocks
        };
      });
    },
    async reload(opts) {
      const response = await this.$api.getCharts(opts);
      if (response.status !== this.$constants.STATUS_SUCCESS) {
        return this.$router.replace({
          name: response.status
        });
      }

      this.numOfBlocksInitial = response.data;
    }
  }
};
</script>
