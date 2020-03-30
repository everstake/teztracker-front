<template>
  <b-card no-body>
    <b-card-header>
      <div class="break-word">
        <h3>
          <span class="text">{{ block.level }}</span>
        </h3>
        <span class="subtitle">
          {{ $t("infoTypes.blockInfo") }}
        </span>
      </div>

      <div class="card-divider w-100 mt-3"></div>
    </b-card-header>
    <b-card-body>
      <b-container fluid>
        <b-row>
          <b-col class="p-0" lg="6">
            <b-row class="item-info">
              <b-col lg="4" class="label">
                {{ $t("hashTypes.hash") }}
              </b-col>
              <b-col lg="8" class="text-accent">
                {{ this.block.hash }}
              </b-col>
            </b-row>
            <b-row class="item-info">
              <b-col lg="4" class="label">
                {{ $t("common.timestamp") }}
              </b-col>
              <b-col lg="8" class="text-accent">
                {{ this.block.timestamp | timeformat(dateFormat) }}
              </b-col>
            </b-row>
            <b-row class="item-info">
              <b-col lg="4" class="label">
                {{ $tc("common.baker", 1) }}
              </b-col>
              <b-col lg="8" class="text-accent">
                <router-link
                  class="baker"
                  :to="{ name: 'baker', params: { baker: block.baker } }"
                >
                  {{ this.block.bakerName || this.block.baker }}
                </router-link>
              </b-col>
            </b-row>
            <b-row class="item-info">
              <b-col lg="4" class="label">
                {{ $t("blockSingle.bakerFee") }}
              </b-col>
              <b-col lg="8" class="text-accent">
                {{ this.block.fees | tezos }}
              </b-col>
            </b-row>
            <b-row class="item-info">
              <b-col lg="4" class="label">
                {{ $t("blockSingle.bakerPriority") }}
              </b-col>
              <b-col lg="8" class="text-accent">
                {{ this.block.priority }}
              </b-col>
            </b-row>
            <b-row class="item-info">
              <b-col lg="4" class="label">
                {{ $t("blockSingle.txVol") }}
              </b-col>
              <b-col lg="8" class="text-accent">
                {{ this.block.volume | tezos }}
              </b-col>
            </b-row>
            <b-row class="item-info" v-if="this.block.double_baking_evidence">
              <b-col lg="4" class="label">
                {{ $t("blockSingle.dblBakingEvidence") }}
              </b-col>
              <b-col lg="8" class="text-accent">
                {{ this.block.double_baking_evidence }}
              </b-col>
            </b-row>
            <b-row
              class="item-info"
              v-if="this.block.double_endorsement_evidence"
            >
              <b-col lg="4" class="label">
                {{ $t("blockSingle.dblEndorsementEvidence") }}
              </b-col>
              <b-col lg="8" class="text-accent">
                {{ this.block.double_endorsement_evidence }}
              </b-col>
            </b-row>
          </b-col>

          <b-col class="p-0 px-lg-3" lg="6">
            <b-row class="item-info">
              <b-col lg="4" class="label">
                {{ $t("blockSingle.blockTime") }}
              </b-col>
              <b-col lg="8" class="text-accent">
                {{ this.block.blockTime | formatInteger }} sec
              </b-col>
            </b-row>
            <b-row class="item-info">
              <b-col lg="4" class="label">
                {{ $t("blockSingle.blockFitness") }}
              </b-col>
              <b-col lg="8" class="text-accent">
                {{ this.block.fitness }}
              </b-col>
            </b-row>
            <b-row class="item-info">
              <b-col lg="4" class="label">
                {{ $t("blockSingle.gasUsed") }}
              </b-col>
              <b-col lg="8" class="text-accent">
                {{ this.block.consumedGas | formatInteger }}
              </b-col>
            </b-row>
            <b-row class="item-info">
              <b-col lg="4" class="label">
                {{ $t("blockSingle.protocolVersion") }}
              </b-col>
              <b-col lg="8" class="text-accent">
                {{ this.block.protocol | longhash(9) }}
              </b-col>
            </b-row>
            <b-row class="item-info">
              <b-col lg="4" class="label">
                {{ $tc("common.cycle", 1) }}
              </b-col>
              <b-col lg="8" class="text-accent">
                {{ this.block.metaCycle }}
              </b-col>
            </b-row>
            <b-row class="item-info">
              <b-col lg="4" class="label">
                {{ $t("blockSingle.cyclePosition") }}
              </b-col>
              <b-col lg="8" class="text-accent">
                {{ this.block.metaCyclePosition }} {{ $t("blockSingle.outOf") }}
                <template v-if="currentNetwork === 'mainnet'">
                  {{ $constants.BLOCKS_IN_CYCLE_MAINNET }}
                </template>
                <template v-else>
                  {{ $constants.BLOCKS_IN_CYCLE_TESTNET }}
                </template>
              </b-col>
            </b-row>
            <b-row v-if="this.block.originations" class="item-info">
              <b-col lg="4" class="label">
                {{ $t("blockSingle.originatedAccs") }}
              </b-col>
              <b-col lg="8" class="text-accent">
                {{ this.block.originations }}
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-container>
    </b-card-body>
  </b-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  name: "BlockSingle",
  props: {
    block: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState("app", {
      dateFormat: state => state.dateFormat
    }),
    ...mapGetters("app", {
      currentNetwork: "getAppNetwork"
    })
  }
};
</script>
