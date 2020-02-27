<template>
  <section class="cycle-counter container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card ">
          <div class="card-header">
            <div class="title text-center">
              <span>Percentage of ICO addresses activated</span>
            </div>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-12">
                <div class="progress-labels">
                  <div class="tezos-label float-right">Tezos {{ $_network }}</div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-12">
                <b-progress
                  :value="percent"
                  :max="100"
                  class="mb-2"
                />
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
import { mapState, mapActions } from "vuex";
import { GET_BLOCK_HEAD } from "@/store/actions.types";
import network from "../../mixins/network";

export default {
  name: "ICOCycleCounter",
  mixins: [network],
  props: ["percent"],
  computed: {
    ...mapState('blocks', {
      head: state => state.headBlock
    })
  },
  methods: {
    ...mapActions('blocks', [GET_BLOCK_HEAD])
  },
  async created() {
    await this[GET_BLOCK_HEAD]();
  }
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
}
</style>
