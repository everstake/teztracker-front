<template>
  <b-card no-body>
    <b-card-header>
      <div class="break-word">
        <h3>
          <span class="text">{{ block.level }}</span>
        </h3>
        <span class="subtitle">Block information</span>
      </div>

      <div class="card-divider w-100 mt-3"></div>
    </b-card-header>
    <b-card-body>
      <b-container fluid>
        <b-row>
          <b-col class="p-0" lg="6">
            <b-row class="item-info">
              <b-col lg="4" class="label">Hash</b-col>
              <b-col lg="8" class="text-accent">
                {{ this.block.hash }}
              </b-col>
            </b-row>
            <b-row class="item-info">
              <b-col lg="4" class="label">Timestamp</b-col>
              <b-col lg="8" class="text-accent">
                {{ this.block.timestamp | timeformat(dateFormat) }}
              </b-col>
            </b-row>
            <b-row class="item-info">
              <b-col lg="4" class="label">Baker</b-col>
              <b-col lg="8" class="text-accent">
                <router-link
                  class="baker"
                  :to="{ name: 'baker', params: { baker: block.baker }}"
                >
                  {{ this.block.bakerName || this.block.baker }}
                </router-link>
              </b-col>
            </b-row>
            <b-row class="item-info">
              <b-col lg="4" class="label">Baker fees</b-col>
              <b-col lg="8" class="text-accent">
                {{ this.block.fees | tezos }}
              </b-col>
            </b-row>
            <b-row class="item-info">
              <b-col lg="4" class="label">Baker priority</b-col>
              <b-col lg="8" class="text-accent">
                {{ this.block.priority }}
              </b-col>
            </b-row>
            <b-row class="item-info">
              <b-col lg="4" class="label">Transaction volume</b-col>
              <b-col lg="8" class="text-accent">
                {{ this.block.volume | tezos }}
              </b-col>
            </b-row>
            <b-row class="item-info" v-if="this.block.double_baking_evidence">
              <b-col lg="4" class="label">Double baking evidence</b-col>
              <b-col lg="8" class="text-accent">
                {{ this.block.double_baking_evidence }}
              </b-col>
            </b-row>
            <b-row class="item-info" v-if="this.block.double_endorsement_evidence">
              <b-col lg="4" class="label">Double endorsement evidence</b-col>
              <b-col lg="8" class="text-accent">
                {{ this.block.double_endorsement_evidence }}
              </b-col>
            </b-row>
          </b-col>
  
          <b-col class="p-0 px-lg-3" lg="6">
            <b-row class="item-info">
              <b-col lg="4" class="label">Block time</b-col>
              <b-col lg="8" class="text-accent">
                {{ this.block.blockTime | formatInteger }} sec
              </b-col>
            </b-row>
            <b-row class="item-info">
              <b-col lg="4" class="label">Block fitness</b-col>
              <b-col lg="8" class="text-accent">
                {{ this.block.fitness }}
              </b-col>
            </b-row>
            <b-row class="item-info">
              <b-col lg="4" class="label">Gas used</b-col>
              <b-col lg="8" class="text-accent">
                {{ this.block.consumedGas | formatInteger }}
              </b-col>
            </b-row>
            <b-row class="item-info">
              <b-col lg="4" class="label">Protocol version</b-col>
              <b-col lg="8" class="text-accent">
                {{ this.block.protocol | longhash(9)}}
              </b-col>
            </b-row>
            <b-row class="item-info">
              <b-col lg="4" class="label">Cycle</b-col>
              <b-col lg="8" class="text-accent">
                {{ this.block.metaCycle }}
              </b-col>
            </b-row>
            <b-row class="item-info">
              <b-col lg="4" class="label">Cycle position</b-col>
              <b-col lg="8" class="text-accent">
                {{ this.block.metaCyclePosition }} out of
                <template v-if="currentNetwork === 'mainnet'">
                  {{ $constants.BLOCKS_IN_CYCLE_MAINNET }}
                </template>
                <template v-else>
                  {{ $constants.BLOCKS_IN_CYCLE_TESTNET }}
                </template>
              </b-col>
            </b-row>
            <b-row
              v-if="this.block.originations"
              class="item-info"
            >
              <b-col lg="4" class="label">Originated accounts</b-col>
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
      dateFormat: state => state.dateFormat,
    }),
    ...mapGetters("app", {
      currentNetwork: 'getAppNetwork',
    })
  }
};
</script>
