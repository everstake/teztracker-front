<template>
  <section class="cycle-counter">
    <div class="row">
      <div class="col-12">
        <div class="card ml-2 mr-2">
          <div class="card-header">
            <div class="title text-center">
              <span>Percentage of ICO addresses activated</span>
            </div>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-12">
                <div class="progress-labels">
                  <div class="tezos-label float-right">Tezos {{ network }}</div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-12">
                <b-progress
                  :value="percent"
                  :max="100"
                  class="mb-2"
                ></b-progress>
              </div>
            </div>

            <div class="row">
              <div class="col-12">
                <div class="progress-labels">
                  <div class="percentage float-left">
                    <span>{{ percent }}%</span>
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
export default {
  name: "ico-cycle-counter",
  props: ["percent"],
  computed: {
    ...mapState({
      head: state => state.headBlock
    }),
    network() {
      return this.$route.params.network === "mainnet"
        ? "Mainnet"
        : "Babylonnet";
    }
  },
  async created() {
    await this.$store.dispatch(ACTIONS.BLOCK_GET_HEAD);
  }
};
</script>
