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
                  <div class="tezos-label float-right">Tezos {{ $_network }}</div>
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
import moment from "moment";
import network from "../../mixins/network";

export default {
  name: "CycleCounter",
  mixins: [network],
  computed: {
    ...mapState('app', {
      info: state => state.priceInfo
    }),
    ...mapState('blocks', {
      head: state => state.headBlock
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
      const d = moment(
        this.head.timestamp * this.$constants.THOUSAND_MILLISECONDS
      ).add(this.info.blocks_in_cycle - this.head.metaCyclePosition, "minutes");
      const duration = moment.duration(d.diff(moment()));
      return `${
        duration.days() > 0 ? duration.days() + "d" : ""
      } ${duration.hours()}h ${duration.minutes()}m`;
    }
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
