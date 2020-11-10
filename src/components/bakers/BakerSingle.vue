<template>
  <b-row>
    <b-col lg="12">
      <b-card no-body>
        <b-card-header>
          <h3 class="card__title text-accent">
            <IdentIcon :seed="hash" />

            <template v-if="bakerInfo.name">
              {{ bakerInfo.name }}
            </template>
            <template v-else>
              <span class="text-break">
                {{ hash }}
                <BtnCopy :text-to-copy="hash" />
              </span>
            </template>
          </h3>
          <div class="subtitle mb-2">
            {{ $t('infoTypes.bakerInfo') }}
          </div>
          <div>
            <BakerSocials :baker-address="hash" />
          </div>
        </b-card-header>

        <div class="card-divider"></div>

        <b-card-body>
          <b-container fluid>
            <b-row>
              <b-col class="card__no-padding" lg="6">
                <span class="text-accent">
                  {{ $t('infoTypes.generalInfo') }}
                </span>

                <b-row class="item-info">
                  <b-col lg="4" class="label">
                    {{ $t('bakerSingle.address') }}
                  </b-col>
                  <b-col lg="8" class="text-accent">
                    <span class="hash">
                      {{ hash }}
                      <BtnCopy :text-to-copy="hash" />
                    </span>
                  </b-col>
                </b-row>
                <b-row v-if="bakerInfo.name" class="item-info">
                  <b-col lg="4" class="label">
                    {{ $t('common.fee') }}
                  </b-col>
                  <b-col lg="8" class="text-accent">
                    {{ bakerInfo.fee | addPercent }}
                  </b-col>
                </b-row>
                <b-row class="item-info">
                  <b-col lg="4" class="label">
                    {{ $t('common.bakingSince') }}
                  </b-col>
                  <b-col lg="8" class="text-accent">
                    {{ bakerInfo.bakingSince | timeformat(dateFormat) }}
                  </b-col>
                </b-row>
                <b-row class="item-info">
                  <b-col lg="4" class="label">
                    {{ $t('common.rolls') }}
                  </b-col>
                  <b-col lg="8" class="text-accent">
                    {{ bakerInfo.rolls }}
                  </b-col>
                </b-row>
                <b-row class="item-info">
                  <b-col lg="4" class="label">
                    {{ $t('bakerSingle.blocksBaked') }}
                  </b-col>
                  <b-col lg="8" class="text-accent">
                    {{ bakerInfo.blocks }}
                  </b-col>
                </b-row>
                <b-row class="item-info">
                  <b-col lg="4" class="label">
                    {{ $t('numberOf.#OfDelegators') }}
                  </b-col>
                  <b-col lg="8" class="text-accent">
                    {{ bakerInfo.activeDelegators }}
                  </b-col>
                </b-row>
                <b-row class="item-info">
                  <b-col lg="4" class="label">
                    {{ $t('numberOf.#OfEndorsements') }}
                  </b-col>
                  <b-col lg="8" class="text-accent">
                    {{ bakerInfo.endorsements }}
                  </b-col>
                </b-row>
                <b-row class="item-info">
                  <b-col lg="4" class="label">
                    {{ $t('common.capacityAvailable') }}
                  </b-col>
                  <b-col lg="8" class="text-accent">
                    {{
                      (bakerInfo.stakingCapacity - bakerInfo.stakingBalance)
                        | denominate
                    }}
                  </b-col>
                </b-row>
              </b-col>

              <b-col class="p-0 px-lg-3" lg="6">
                <span class="text-accent">
                  {{ $t('bakerSingle.balances') }}
                </span>

                <b-row class="item-info">
                  <b-col lg="4" class="label">
                    {{ $t('bakerSingle.totalBal') }}
                  </b-col>
                  <b-col lg="6" class="text-accent">
                    {{ bakerInfo.evaluatedBalance | denominate }}
                  </b-col>
                </b-row>
                <b-row class="item-info">
                  <b-col lg="4" class="label">
                    {{ $t('bakerSingle.liquidBal') }}
                  </b-col>
                  <b-col lg="8" class="text-accent">
                    {{ account.balance | denominate }}
                  </b-col>
                </b-row>
                <b-row class="item-info">
                  <b-col lg="4" class="label">
                    {{ $t('common.delegatedBal') }}
                  </b-col>
                  <b-col lg="8" class="text-accent">
                    {{ bakerInfo.stakingBalance | denominate }}
                  </b-col>
                </b-row>

                <span class="text-accent">
                  {{ $t('bakerSingle.currDeposits') }}
                </span>

                <b-row class="item-info">
                  <b-col lg="4" class="label">
                    {{ $t('common.baking') }}
                  </b-col>
                  <b-col lg="8" class="text-accent">
                    {{ bakerInfo.bakingDeposits | denominate }}
                  </b-col>
                </b-row>
                <b-row class="item-info">
                  <b-col lg="4" class="label">
                    {{ $t('bakerSingle.endorsement') }}
                  </b-col>
                  <b-col lg="8" class="text-accent">
                    {{ bakerInfo.endorsementDeposits | denominate }}
                  </b-col>
                </b-row>

                <span class="text-accent">
                  {{ $t('bakerSingle.pendingRewards') }}
                </span>

                <b-row class="item-info">
                  <b-col lg="4" class="label">
                    {{ $t('common.baking') }}
                  </b-col>
                  <b-col lg="8" class="text-accent">
                    {{ bakerInfo.bakingRewards | denominate }}
                  </b-col>
                </b-row>
                <b-row class="item-info">
                  <b-col lg="4" class="label">
                    {{ $t('bakerSingle.endorsement') }}
                  </b-col>
                  <b-col lg="8" class="text-accent">
                    {{ bakerInfo.endorsementRewards | denominate }}
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
          </b-container>
        </b-card-body>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
  import { mapState } from 'vuex';
  import IdentIcon from '@/components/accounts/IdentIcon';
  import BtnCopy from '@/components/partials/BtnCopy';
  import BakerSocials from '@/components/bakers/BakerSocials';
  import convert from '../../mixins/convert';

  export default {
    name: 'BakerSingle',
    components: {
      IdentIcon,
      BtnCopy,
      BakerSocials,
    },
    mixins: [convert],
    props: {
      hash: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        bakerInfo: {},
        account: {},
      };
    },
    computed: {
      ...mapState('app', {
        info: (state) => state.priceInfo,
        dateFormat: (state) => state.dateFormat,
      }),
    },
    watch: {
      hash: {
        async handler(value) {
          await this.reload(value);
        },
      },
    },
    async created() {
      await this.reload(this.hash);
    },
    methods: {
      async reload(acc) {
        const result = await this.$api.getAccount({ account: acc });
        if (result.status !== this.$constants.STATUS_SUCCESS) {
          return this.$router.replace({
            name: result.status,
          });
        }
        this.account = result.data;
        if (result.data.bakerInfo) {
          this.bakerInfo = result.data.bakerInfo;
          this.baker = true;
        } else {
          this.baker = false;
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .card-header .title {
    word-break: break-word;
  }

  .card__title {
    display: inline-flex;
    align-items: center;
    padding-right: 0 !important; /* outweigh selector cascade from public styles */
  }

  .icon-primary {
    color: $color-brand;
  }

  .hash {
    position: relative;
  }

  .icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: -15px;
    margin-left: 10px;
    font-size: 12px;
    color: #309282;
  }

  .label {
    font-size: 13px;
    font-weight: 600;
    line-height: 16px;
    color: #9ea0a5;
  }

  .stats-row {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
</style>
