<template>
  <b-card no-body>
    <b-card-header>
      <div class="card__block-nav">
        <div
          :disabled="Number($route.params.level) === 0"
          @click="onNavigation('prev', Number($route.params.level) === 0)"
          :class="{
            'card__block-prev--disabled': Number($route.params.level) === 0,
          }"
          class="card__block-prev"
        >
          <font-awesome-icon icon="chevron-left" class="ml-1" />
        </div>
        <div class="break-word">
          <h3>
            <span class="text">{{ block.level }}</span>
          </h3>
          <span class="subtitle">{{ $t('infoTypes.blockInfo') }}</span>
        </div>
        <div
          :disabled="Number(head.level) === Number($route.params.level)"
          @click="
            onNavigation(
              'next',
              Number(head.level) === Number($route.params.level),
            )
          "
          :class="{
            'card__block-next--disabled':
              Number(head.level) === Number($route.params.level),
          }"
          class="card__block-next"
        >
          <font-awesome-icon icon="chevron-right" class="mr-1" />
        </div>
      </div>

      <div class="card-divider w-100 mt-3"></div>
    </b-card-header>
    <b-card-body>
      <b-container fluid>
        <b-row>
          <b-col class="p-0" lg="6">
            <b-row class="item-info">
              <b-col lg="4" class="label">
                {{ $t('hashTypes.hash') }}
              </b-col>
              <b-col lg="8" class="text-accent">
                <span class="hash">{{ block.hash }}</span>
                <BtnCopy :text-to-copy="block.hash" />
              </b-col>
            </b-row>
            <b-row class="item-info">
              <b-col lg="4" class="label">
                {{ $t('common.timestamp') }}
              </b-col>
              <b-col lg="8" class="text-accent">
                {{ this.block.timestamp | timeformat(dateFormat) }}
              </b-col>
            </b-row>
            <b-row class="item-info">
              <b-col lg="4" class="label">
                {{ $tc('common.baker', 1) }}
              </b-col>
              <b-col lg="8" class="text-accent">
                <span>
                  <IdentIcon :seed="this.block.baker" />

                  <router-link
                    class="baker"
                    :to="{ name: 'baker', params: { baker: block.baker } }"
                  >
                    {{ this.block.bakerName || this.block.baker }}
                  </router-link>
                </span>
              </b-col>
            </b-row>
            <b-row class="item-info">
              <b-col lg="4" class="label">
                {{ $t('blockSingle.bakerFee') }}
              </b-col>
              <b-col lg="8" class="text-accent">
                {{ this.block.fees | denominate }}
              </b-col>
            </b-row>
            <b-row class="item-info">
              <b-col lg="4" class="label">
                {{ $t('blockSingle.bakerPriority') }}
              </b-col>
              <b-col lg="8" class="text-accent">
                {{ this.block.priority }}
              </b-col>
            </b-row>
            <b-row class="item-info">
              <b-col lg="4" class="label">
                {{ $t('common.txVol') }}
              </b-col>
              <b-col lg="8" class="text-accent">
                {{ this.block.volume | denominate }}
              </b-col>
            </b-row>
            <b-row class="item-info" v-if="this.block.double_baking_evidence">
              <b-col lg="4" class="label">
                {{ $t('blockSingle.dblBakingEvidence') }}
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
                {{ $t('blockSingle.dblEndorsementEvidence') }}
              </b-col>
              <b-col lg="8" class="text-accent">
                {{ this.block.double_endorsement_evidence }}
              </b-col>
            </b-row>
          </b-col>

          <b-col class="p-0 px-lg-3" lg="6">
            <b-row class="item-info">
              <b-col lg="4" class="label">
                {{ $t('blockSingle.blockTime') }}
              </b-col>
              <b-col lg="8" class="text-accent">
                {{ this.block.blockTime | formatInteger }} sec
              </b-col>
            </b-row>
            <b-row class="item-info">
              <b-col lg="4" class="label">
                {{ $t('blockSingle.blockFitness') }}
              </b-col>
              <b-col lg="8" class="text-accent">
                {{ this.block.fitness }}
              </b-col>
            </b-row>
            <b-row class="item-info">
              <b-col lg="4" class="label">
                {{ $t('blockSingle.gasUsed') }}
              </b-col>
              <b-col lg="8" class="text-accent">
                {{ this.block.consumedGas | formatInteger }}
              </b-col>
            </b-row>
            <b-row class="item-info">
              <b-col lg="4" class="label">
                {{ $t('blockSingle.protocolVersion') }}
              </b-col>
              <b-col lg="8" class="text-accent">
                {{ this.block.protocol | longhash }}
              </b-col>
            </b-row>
            <b-row class="item-info">
              <b-col lg="4" class="label">
                {{ $tc('common.cycle', 1) }}
              </b-col>
              <b-col lg="8" class="text-accent">
                {{ this.block.metaCycle }}
              </b-col>
            </b-row>
            <b-row class="item-info">
              <b-col lg="4" class="label">
                {{ $t('blockSingle.cyclePosition') }}
              </b-col>
              <b-col lg="8" class="text-accent">
                {{ this.block.metaCyclePosition }} {{ $t('blockSingle.outOf') }}
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
                {{ $t('blockSingle.originatedAccs') }}
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
  import IdentIcon from '@/components/accounts/IdentIcon';
  import BtnCopy from '@/components/partials/BtnCopy';
  import { mapState, mapGetters, mapActions } from 'vuex';
  import { GET_BLOCK_HEAD } from '@/store/actions.types';

  export default {
    name: 'BlockSingle',
    components: {
      IdentIcon,
      BtnCopy,
    },
    props: {
      block: {
        type: Object,
        required: true,
      },
    },
    computed: {
      ...mapState('app', {
        dateFormat: (state) => state.dateFormat,
      }),
      ...mapState('blocks', {
        head: (state) => state.headBlock,
      }),
      ...mapGetters('app', {
        currentNetwork: 'getAppNetwork',
      }),
    },
    async created() {
      await this[GET_BLOCK_HEAD]();
    },
    methods: {
      ...mapActions('blocks', [GET_BLOCK_HEAD]),
      onNavigation(position, disabled) {
        if (disabled) {
          return false;
        }

        const { currentNetwork } = this;
        const level = this.$route.params.level;

        if (position === 'prev') {
          this.$router.push({
            name: this.$route.name,
            params: {
              network: currentNetwork,
              level: level > 0 ? level - 1 : 0,
            },
          });
        }

        if (position === 'next') {
          this.$router.push({
            name: this.$route.name,
            params: { network: currentNetwork, level: Number(level) + 1 },
          });
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .text {
    position: relative;
    cursor: pointer;
  }

  .text-accent {
    font-weight: 600 !important;
  }

  .icon-primary {
    color: $color-brand;
  }

  .icon {
    position: absolute;
    top: 0;
    right: auto;
    margin-left: 10px;
    font-size: 12px;
    color: #309282;
  }

  .hash {
    display: inline-block;
    max-width: 300px;

    @media (max-width: 992px) {
      display: initial;
      max-width: none;
    }
  }
</style>
