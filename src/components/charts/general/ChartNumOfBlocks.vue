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
      <LineChart :chart-data="numOfBlocks" />
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
    return {};
  },
  computed: {
    ...mapState("app", {
      dateFormat: state => state.dateFormat
    }),
    last30days() {
      return [...new Array(30)]
        .map((i, idx) =>
          moment()
            .utc()
            .startOf("day")
            .subtract(idx, "days")
            .format("DD/MM/YYYY")
        )
        .reverse();
    },
    numOfBlocks() {
      return {
        labels: this.last30days,
        datasets: [
          {
            label: this.$t("charts.numOfBlocks"),
            data: [
              { x: "17/03/2020", y: 2 },
              { x: "18/03/2020", y: 3 },
              { x: "22/03/2020", y: 6 },
              { x: "23/03/2020", y: 3 }
            ]
          }
        ]
      };
    }
  }
};
</script>

<style scoped></style>
