<template>
  <div class="dashboard">
    <b-container fluid>
      <section class="promo-section">
        <b-row class="promo-top justify-content-md-center align-items-center">
          <b-col lg="6" xl="6" class="promo-search">
            <div class="search">
              <Search />
            </div>
          </b-col>
          <b-col lg="6" xl="4" class="promo-image">
            <img
              class="promo-image__src"
              src="../assets/img/promo-img.svg"
              height="270px"
              alt
            />
          </b-col>
        </b-row>

        <CycleCounter />

        <div class="tz-row promo-tiles">
          <div class="tz-row__item text-center">
            <div class="tile">
              <div class="tile-icon text-center">
                <font-awesome-icon :icon="['far', 'lightbulb']" />
              </div>
              <span class="counter">{{ stakingRatio }}%</span>
              <div v-if="info.staking_ratio > 0">
                <span class="percentage green">
                  <font-awesome-icon icon="caret-up" />
                </span>
              </div>
              <div v-else>
                <span class="percentage red">
                  <font-awesome-icon icon="caret-down" />
                </span>
              </div>
              <span class="tile-name">
                {{ $t('index.stakingRatio') }}
              </span>
            </div>
          </div>

          <div class="tz-row__item text-center">
            <div class="tile">
              <div class="tile-icon text-center">
                <font-awesome-icon :icon="['far', 'star']" />
              </div>
              <div class="voting-progress">
                <b-progress
                  :value="votingProgressPercent"
                  :max="100"
                ></b-progress>
                <div class="progress-labels">
                  <div class="voting-percentage percentage green">
                    {{ votingProgressPercent }}%
                  </div>
                  <div class="tile-name">
                    {{ timeLeftTillVotingPeriodEnd }} -
                    {{ $t('index.untilVotingEnd') }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="tz-row__item text-center">
            <div class="tile">
              <div class="tile-icon text-center">
                <font-awesome-icon :icon="['far', 'folder']" />
              </div>
              <span class="counter">{{ head.level | bignum }}</span>
              <span class="percentage"></span>
              <span class="tile-name">
                {{ $t('index.blockHeight') }}
              </span>
            </div>
          </div>

          <div class="tz-row__item text-center">
            <div class="tile">
              <div class="tile-icon text-center">
                <font-awesome-icon :icon="['far', 'user']" />
              </div>

              <span class="counter">
                <router-link
                  v-if="head.bakerName || head.baker"
                  class="baker"
                  :to="{ name: 'baker', params: { baker: head.baker } }"
                >
                  <span v-if="head.bakerName"> {{ head.bakerName }}</span>
                  <span v-else>
                    {{ head.baker | longhash }}
                  </span>
                </router-link>
              </span>
              <span class="percentage"></span>
              <span class="tile-name">
                {{ $t('index.latestBaker') }}
              </span>
            </div>
          </div>
        </div>

        <div class="tz-row promo-tiles">
          <div class="tz-row__item text-center">
            <div class="tile">
              <div class="tile-icon text-center">
                <font-awesome-icon :icon="['far', 'chart-bar']" />
              </div>
              <span class="counter">${{ info.price }}</span>
              <div v-if="info.price_24h_change > 0">
                <span class="percentage green">
                  <font-awesome-icon icon="caret-up" />
                  {{ priceChange }}%
                </span>
              </div>
              <div v-else>
                <span class="percentage red">
                  <font-awesome-icon icon="caret-down" />
                  {{ priceChange }}%
                </span>
              </div>

              <span class="tile-name">
                {{ $t('index.price') }}
              </span>
            </div>
          </div>

          <div class="tz-row__item text-center">
            <div class="tile">
              <div class="tile-icon text-center">
                <font-awesome-icon :icon="['far', 'bookmark']" />
              </div>
              <span class="counter">${{ info.volume_24h | bignum(',') }}</span>
              <span class="percentage"></span>
              <span class="tile-name">
                {{ $t('index.tradingVol') }}
              </span>
            </div>
          </div>

          <div class="tz-row__item text-center">
            <div class="tile">
              <div class="tile-icon text-center">
                <font-awesome-icon :icon="['far', 'gem']" />
              </div>
              <span class="counter">${{ info.market_cap | bignum(',') }}</span>
              <span class="percentage"></span>
              <span class="tile-name">
                {{ $t('index.marketCap') }}
              </span>
            </div>
          </div>

          <div class="tz-row__item text-center">
            <div class="tile">
              <div class="tile-icon text-center">
                <font-awesome-icon :icon="['far', 'hourglass']" />
              </div>
              <span class="counter">
                {{
                  (info.circulating_supply > 0
                    ? info.circulating_supply.toFixed()
                    : 0) | bignum(',')
                }}
              </span>
              <span class="percentage"></span>
              <span class="tile-name">
                {{ $t('index.circulatingSupply') }}
              </span>
            </div>
          </div>
        </div>
      </section>
    </b-container>

    <section class="dashboard__cards">
      <b-container fluid>
        <b-row>
          <b-col lg="12" xl="6" class="mb-3 mb-xl-0 dashboard__card">
            <BlocksCard :show-per-page-filter="false" class="h-100" />
          </b-col>

          <b-col lg="12" xl="6 dashboard__card">
            <TxsCard :show-per-page-filter="false" class="h-100" />
          </b-col>
        </b-row>
      </b-container>
    </section>

    <div class="promo-footer">
      <b-container fluid>
        <b-row class="justify-content-md-center align-items-center">
          <b-col lg="4">
            <img src="../assets/img/footer-img.svg" width="85%" alt />
          </b-col>
          <b-col lg="6">
            <b-row>
              <b-col lg="12">
                <h2>
                  {{ $t('index.moreAboutTezos') }}
                </h2>
              </b-col>
            </b-row>
            <b-row>
              <b-col lg="3">
                <ul>
                  <li>
                    <a href="https://tezos.com" target="_blank">
                      {{ $t('index.whatIsTezos') }}
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://tezos.com/static/white_paper-2dc8c02267a8fb86bd67a108199441bf.pdf"
                      target="”_blank”"
                    >
                      {{ $t('index.whitePaper') }}
                    </a>
                  </li>
                  <li>
                    <a href="https://faucet.tzalpha.net/" target="_blank">
                      {{ $t('index.testnetFaucet') }}
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/everstake/teztracker"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {{ $t('footer.backendRepo') }}
                    </a>
                  </li>
                </ul>
              </b-col>
              <b-col lg="3">
                <ul>
                  <li>
                    <a
                      href="https://tezos.gitlab.io/introduction/howtouse.html"
                      target="”_blank”"
                    >
                      {{ $t('index.howToRunTezos') }}
                    </a>
                  </li>
                  <li>
                    <a href="https://gitlab.com/tezos/tezos" target="_blank">
                      {{ $t('index.gitRepo') }}
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://hub.docker.com/r/tezos/tezos"
                      target="”_blank”"
                    >
                      {{ $t('index.dockerImages') }}
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/everstake/teztracker-front"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {{ $t('footer.frontendRepo') }}
                    </a>
                  </li>
                </ul>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import { GET_APP_INFO, GET_BLOCK_HEAD } from '@/store/actions.types';

  import BlocksCard from '../components/blocks/BlocksCard.vue';
  import TxsCard from '../components/transactions/TxsCard';
  import CycleCounter from '../components/partials/cycle/CycleCounter';
  import Search from '../components/partials/Search';
  import { setInterval, clearInterval } from 'timers';
  import moment from 'moment';

  export default {
    name: 'Index',
    components: {
      BlocksCard,
      TxsCard,
      Search,
      CycleCounter,
    },
    data() {
      return {
        interval: null,
      };
    },
    computed: {
      ...mapState('app', {
        info: (state) => state.priceInfo,
      }),
      ...mapState('blocks', {
        head: (state) => state.headBlock,
      }),
      priceChange() {
        if (!this.info || !this.info.price_24h_change) {
          return 0;
        }
        return Math.abs(this.info.price_24h_change.toFixed(2));
      },
      stakingRatio() {
        if (!this.info || !this.info.staking_ratio) {
          return 0;
        }
        return Math.abs(this.info.staking_ratio.toFixed(2));
      },
      votingProgressPercent() {
        return parseInt(
          (
            (this.head.metaVotingPeriodPosition /
              (this.info.blocks_in_cycle *
                this.$constants.CYCLES_IN_VOTING_PERIOD)) *
            100
          ).toFixed(),
        );
      },
      timeLeftTillVotingPeriodEnd() {
        return moment()
          .add(
            this.info.blocks_in_cycle *
              this.$constants.CYCLES_IN_VOTING_PERIOD -
              this.head.metaVotingPeriodPosition,
            'minutes',
          )
          .fromNow(true);
      },
    },
    methods: {
      ...mapActions('app', [GET_APP_INFO]),
      ...mapActions('blocks', [GET_BLOCK_HEAD]),
    },
    async created() {
      this.interval = setInterval(async () => {
        await this[GET_APP_INFO]();
      }, 10000);

      await Promise.all([
        await this[GET_APP_INFO](),
        await this[GET_BLOCK_HEAD](),
      ]);
    },
    beforeRouteUpdate(to, from, next) {
      clearInterval(this.interval);
      next();
    },
  };
</script>

<style lang="scss">
  .tile {
    padding: 0 15px;
  }

  .promo-tiles {
    &.row {
      @include for-smartphones-portrait {
        flex-direction: column;
      }
    }
    .col-sm-12 {
      padding-left: 0;
      padding-right: 0;
    }
  }
  .col-xs-12 {
    @include for-smartphones-portrait {
      padding: 0;
    }
  }

  .tz-row {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    @include for-smartphones-portrait-up {
      flex-direction: column;
    }
    @include for-phone-only {
      flex-direction: column;
    }
    @include for-tablet-portrait-up {
      flex-direction: row;
    }

    &__item {
      flex: 1 0 20%;
      padding: 0;
      margin: 0;
      width: 100%;
      padding-bottom: 1.6rem;
      padding-right: 0.8rem;
      padding-left: 0.8rem;

      &:first-child {
        padding-left: 0;
      }

      &:last-child {
        padding-right: 0;
      }

      @media (max-width: 1280px) {
        &:nth-child(odd) {
          padding-left: 0;
        }

        &:nth-child(even) {
          padding-right: 0;
        }
      }

      @media (max-width: 600px) {
        padding-left: 0;
        padding-right: 0;
      }

      @include for-smartphones-portrait-up {
        flex: 1 0 50%;
      }
      @include for-low-resolution-tablets-mobiles-landscape {
        flex: 1 0 50%;
      }
      @include for-tablet-ipad-landscape {
        flex: 1 0 50%;
      }
      @include for-tablet-ipad-portrait {
        flex: 1 0 50%;
      }

      @include for-regular-desktops-up {
        flex: 1 0 20%;
      }
    }
  }
  div.main-content .promo-section .promo-top .promo-search {
    .search {
      @include for-smartphones-portrait-up {
        width: 100%;
      }
      @include for-regular-desktops-up {
        width: 85%;
      }
    }
  }

  .dashboard {
    &__card {
      &:first-child {
        padding-right: 0.8rem;
      }

      &:last-child {
        padding-left: 0.8rem;
      }
    }
  }

  .main-content .dashboard__cards {
    margin-top: 0;
  }
</style>
