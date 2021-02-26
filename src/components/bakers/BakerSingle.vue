<template>
  <div class="baker-single">
    <b-row>
      <b-col lg="12">
        <b-card no-body>
          <b-card-header>
            <div class="card__heading">
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
                <a v-if="bakerInfo.name" class="ml-2" target="_blank" :href="`https://t.me/TezosNotifierBot?start=teztracker_${hash}_${subscribeBakerName}`">
                  <i class="fas fa-bell"></i>
                </a>
              </h3>
            </div>
            <div class="subtitle mb-2">
              {{ $t('infoTypes.bakerInfo') }}
            </div>
            <div>
              <BakerSocials :media="bakerInfo.media" />
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
                      <b-skeleton v-if="loading"></b-skeleton>
                      <span v-else class="hash">
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
                      <b-skeleton v-if="loading"></b-skeleton>
                      <span v-else>{{ bakerInfo.fee | addPercent }}</span>
                    </b-col>
                  </b-row>
                  <b-row class="item-info">
                    <b-col lg="4" class="label">
                      {{ $t('common.bakingSince') }}
                    </b-col>
                    <b-col lg="8" class="text-accent">
                      <b-skeleton v-if="loading"></b-skeleton>
                      <span v-else>{{
                        bakerInfo.bakingSince | timeformat(dateFormat)
                      }}</span>
                    </b-col>
                  </b-row>
                  <b-row class="item-info">
                    <b-col lg="4" class="label">
                      {{ $t('common.rolls') }}
                    </b-col>
                    <b-col lg="8" class="text-accent">
                      <b-skeleton v-if="loading"></b-skeleton>
                      <span v-else>{{ bakerInfo.rolls }}</span>
                    </b-col>
                  </b-row>
                  <b-row class="item-info">
                    <b-col lg="4" class="label">
                      {{ $t('bakerSingle.blocksBaked') }}
                    </b-col>
                    <b-col lg="8" class="text-accent">
                      <b-skeleton v-if="loading"></b-skeleton>
                      <span v-else>{{ bakerInfo.blocks }}</span>
                    </b-col>
                  </b-row>
                  <b-row class="item-info">
                    <b-col lg="4" class="label">
                      {{ $t('numberOf.#OfDelegators') }}
                    </b-col>
                    <b-col lg="8" class="text-accent">
                      <b-skeleton v-if="loading"></b-skeleton>
                      <span v-else>{{ bakerInfo.activeDelegators }}</span>
                    </b-col>
                  </b-row>
                  <b-row class="item-info">
                    <b-col lg="4" class="label">
                      {{ $t('numberOf.#OfEndorsements') }}
                    </b-col>
                    <b-col lg="8" class="text-accent">
                      <b-skeleton v-if="loading"></b-skeleton>
                      <span v-else>{{ bakerInfo.endorsements }}</span>
                    </b-col>
                  </b-row>
                  <b-row class="item-info">
                    <b-col lg="4" class="label">
                      {{ $t('common.capacityAvailable') }}
                    </b-col>
                    <b-col lg="8" class="text-accent">
                      <b-skeleton v-if="loading"></b-skeleton>
                      <span v-else>
                        {{
                          (bakerInfo.stakingCapacity -
                            bakerInfo.stakingBalance)
                            | denominate
                        }}
                      </span>
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
                      <b-skeleton v-if="loading"></b-skeleton>
                      <span v-else>{{
                        bakerInfo.evaluatedBalance | denominate
                      }}</span>
                    </b-col>
                  </b-row>
                  <b-row class="item-info">
                    <b-col lg="4" class="label">
                      {{ $t('bakerSingle.liquidBal') }}
                    </b-col>
                    <b-col lg="8" class="text-accent">
                      <b-skeleton v-if="loading"></b-skeleton>
                      <span v-else>{{ account.balance | denominate }}</span>
                    </b-col>
                  </b-row>
                  <b-row class="item-info">
                    <b-col lg="4" class="label">
                      {{ $t('common.delegatedBal') }}
                    </b-col>
                    <b-col lg="8" class="text-accent">
                      <b-skeleton v-if="loading"></b-skeleton>
                      <span v-else>{{
                        bakerInfo.stakingBalance | denominate
                      }}</span>
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
                      <b-skeleton v-if="loading"></b-skeleton>
                      <span v-else>{{
                        bakerInfo.bakingDeposits | denominate
                      }}</span>
                    </b-col>
                  </b-row>
                  <b-row class="item-info">
                    <b-col lg="4" class="label">
                      {{ $t('bakerSingle.endorsement') }}
                    </b-col>
                    <b-col lg="8" class="text-accent">
                      <b-skeleton v-if="loading"></b-skeleton>
                      <span v-else>{{
                        bakerInfo.endorsementDeposits | denominate
                      }}</span>
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
                      <b-skeleton v-if="loading"></b-skeleton>
                      <span v-else>{{
                        bakerInfo.bakingRewards | denominate
                      }}</span>
                    </b-col>
                  </b-row>
                  <b-row class="item-info">
                    <b-col lg="4" class="label">
                      {{ $t('bakerSingle.endorsement') }}
                    </b-col>
                    <b-col lg="8" class="text-accent">
                      <b-skeleton v-if="loading"></b-skeleton>
                      <span v-else>{{
                        bakerInfo.endorsementRewards | denominate
                      }}</span>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
            </b-container>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import IdentIcon from '@/components/accounts/IdentIcon';
  import BtnCopy from '@/components/partials/BtnCopy';
  import BakerSocials from '@/components/bakers/BakerSocials';
  import convert from '../../mixins/convert';
  import uuid from '@/mixins/uuid';

  export default {
    name: 'BakerSingle',
    components: {
      IdentIcon,
      BtnCopy,
      BakerSocials,
    },
    mixins: [convert, uuid],
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
        loading: false,
      };
    },
    computed: {
      ...mapState('app', {
        info: (state) => state.priceInfo,
        dateFormat: (state) => state.dateFormat,
      }),
      subscribeBakerName() {
        return this.bakerInfo.name.replace(/[^a-zA-Z0-9]/gi, '');
      },
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
        this.loading = true;
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
        this.loading = false;
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

  .card__heading {
    display: flex;
    justify-content: space-between;
  }

  .card__button {
    max-height: 35px;
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
