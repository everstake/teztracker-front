<template>
  <section class="cycle-counter container-fluid">
    <b-row>
      <b-col>
        <b-card no-body>
          <b-card-header>
            <div class="title text-center">
              {{ $t('counters.icoPercent') }}
            </div>
          </b-card-header>

          <b-card-body>
            <b-row>
              <b-col>
                <div class="progress-labels">
                  <div class="tezos-label">Tezos {{ $_network }}</div>
                </div>
              </b-col>
            </b-row>

            <b-row>
              <b-col>
                <b-progress
                  :value="percent"
                  :max="100"
                  class="mb-2"
                />
              </b-col>
            </b-row>

            <b-row>
              <b-col>
                <div class="progress-labels">
                  <div class="percentage">
                    {{ percent }}%
                  </div>
                </div>
              </b-col>
            </b-row>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </section>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { GET_BLOCK_HEAD } from "@/store/actions.types";
import network from "../../../mixins/network";

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
