<template>
  <section class="cycle-counter">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <div class="title text-center">
              <span>Cycle counter</span>
            </div>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-12">
                <div class="progress-labels">
                  <div class="cycle-label float-left">
                    Cycle -
                    <span>{{ head.metaCycle }}</span>
                  </div>
                  <div class="tezos-label float-right">Tezos {{ network }}</div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-12">
                <b-progress
                  :value="cyclePercent"
                  :max="100"
                  class="mb-2"
                ></b-progress>
              </div>
            </div>

            <div class="row">
              <div class="col-12">
                <div class="progress-labels">
                  <div class="percentage float-left">
                    <span>{{ cyclePercent }}%</span>
                  </div>
                  <div class="timer float-right">
                    <span>{{ timeLeft }}</span> - Until cycle end
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";
import { ACTIONS } from "../../store";
import moment from "moment";
export default {
  name: "cycle-counter",
  computed: {
    ...mapState({
      head: state => state.headBlock,
      info: state => state.priceInfo
    }),
    cyclePercent() {
      return parseInt(
        (
          (this.head.metaCyclePosition / this.info.blocks_in_cycle) *
          100
        ).toFixed()
      );
    },
    timeLeft() {
      const d = moment(this.head.timestamp * 1000).add(
        this.info.blocks_in_cycle - this.head.metaCyclePosition,
        "minutes"
      );
      const duration = moment.duration(d.diff(moment()));
      return `${
        duration.days() > 0 ? duration.days() + "d" : ""
      } ${duration.hours()}h ${duration.minutes()}m`;
    },
    network() {
      return this.$route.params.network === "mainnet"
        ? "Mainnet"
        : "Babylonnet";
    }
  },
  async created() {
    await this.$store.dispatch(ACTIONS.BLOCK_GET_HEAD);
    await this.$store.dispatch(ACTIONS.INFO_GET);
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/scss/common";

.cycle-counter {
  padding: 0 5px;
  @include for-phone-only {
    padding: 0;
  }
}
</style>
