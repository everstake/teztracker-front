<template>
  <div class="main-content">
    <section class="promo-section">
      <div class="container-fluid">
        <div class="promo-top row justify-content-md-center align-items-center">
          <div class="promo-search col-lg-6">
            <h1>Tezos (XTZ) Blockchain Explorer</h1>
            <div class="search">
              <Search />
            </div>
            <p>
              Tezos blockchain - Version
              <span>1.01.00</span>
            </p>
          </div>
          <div class="promo-image col-lg-4">
            <img src="img/promo-img.svg" height="270px" alt />
          </div>
        </div>
        <!-- cycle-->
        <CycleCount />

        <div class="promo-tiles row">
          <div class="col col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-3 text-center">
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
              <span class="tile-name">Staking ratio</span>
            </div>
          </div>

          <div class="col col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-3 text-center">
            <div class="tile">
              <div class="tile-icon text-center">
                <font-awesome-icon :icon="['far', 'star']" />
              </div>
              <div class="voting-progress">
                <b-progress :value="cyclePercent" :max="100" class="mb-2"></b-progress>
                <div class="progress-labels">
                  <div class="voting-percentage float-left">
                    <span>{{ cyclePercent }}%</span>
                  </div>
                  <div class="timer float-right">
                    <span>{{ timeLeft }}</span> - Until cycle end
                  </div>
                </div>
              </div>
              <span class="tile-name">Voting progress</span>
            </div>
          </div>

          <div class="col col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-3 text-center">
            <div class="tile">
              <div class="tile-icon text-center">
                <font-awesome-icon :icon="['far', 'folder']" />
              </div>
              <span class="counter">{{ head.level | bignum }}</span>
              <span class="percentage"></span>
              <span class="tile-name">Block Height</span>
            </div>
          </div>

          <div class="col col-lg-3 col-md-6 col-sm-6 col-xs-12 text-center">
            <div class="tile">
              <div class="tile-icon text-center">
                <font-awesome-icon :icon="['far', 'user']" />
              </div>

              <span class="counter">
                <router-link
                  class="baker"
                  :to="{ name: 'account', params: { account: head.baker } }"
                >{{ head.baker | longhash(13) }}</router-link>
              </span>
              <span class="percentage"></span>
              <span class="tile-name">Latest baker</span>
            </div>
          </div>
        </div>

        <div class="promo-tiles row">
          <div class="col col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-3 text-center">
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

              <span class="tile-name">Price</span>
            </div>
          </div>

          <div class="col col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-3 text-center">
            <div class="tile">
              <div class="tile-icon text-center">
                <font-awesome-icon :icon="['far', 'bookmark']" />
              </div>
              <span class="counter">{{ info.volume_24h | bignum(",") }} XTZ</span>
              <span class="percentage"></span>
              <span class="tile-name">Trading Volume</span>
            </div>
          </div>

          <div class="col col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-3 text-center">
            <div class="tile">
              <div class="tile-icon text-center">
                <font-awesome-icon :icon="['far', 'gem']" />
              </div>
              <span class="counter">${{ info.market_cap | bignum(",") }}</span>
              <span class="percentage"></span>
              <span class="tile-name">Market cap</span>
            </div>
          </div>

          <div class="col col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-3 text-center">
            <div class="tile">
              <div class="tile-icon text-center">
                <font-awesome-icon :icon="['far', 'hourglass']" />
              </div>
              <span class="counter">
                {{
                (info.circulating_supply > 0
                ? info.circulating_supply.toFixed()
                : 0) | bignum(",")
                }}
              </span>
              <span class="percentage"></span>
              <span class="tile-name">Circulating Supply</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12 col-xl-6 mb-3">
            <BlocksCard />
          </div>

          <div class="col-lg-12 col-xl-6">
            <TxCard />
          </div>
        </div>
      </div>
    </section>
    <div class="promo-footer">
      <div class="container-fluid">
        <div class="row justify-content-md-center align-items-center">
          <div class="col-lg-4">
            <img src="img/footer-img.svg" width="85%" alt />
          </div>
          <div class="col-lg-6">
            <div class="row">
              <div class="col-lg-12">
                <h2>More about Tezos</h2>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-3">
                <ul>
                  <li>
                    <a href="#">What is Tezos?</a>
                  </li>
                  <li>
                    <a href="#">White Paper</a>
                  </li>
                  <li>
                    <a href="#">Testnet Faucet</a>
                  </li>
                </ul>
              </div>
              <div class="col-lg-3">
                <ul>
                  <li>
                    <a href="#">How to Run Tezos?</a>
                  </li>
                  <li>
                    <a href="#">Git repository</a>
                  </li>
                  <li>
                    <a href="#">Docker images</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

import BlocksCard from "../blocks/blocks_card.vue";
import TxCard from "../transactions/transactions_card.vue";
import CycleCount from "../cycle/count.vue";
import Search from "../search/search";
import { ACTIONS } from "../../store";
import { setInterval, clearInterval } from "timers";
import moment from "moment";
export default {
  name: "index",
  components: {
    BlocksCard,
    TxCard,
    Search,
    CycleCount
  },
  data() {
    return {
      interval: {}
    };
  },
  computed: {
    ...mapState({
      info: state => state.priceInfo,
      head: state => state.headBlock
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
    cyclePercent() {
      return parseInt(((this.head.metaCyclePosition / 4096) * 100).toFixed());
    },
    timeLeft() {
      return moment()
        .add(4096 - this.head.metaCyclePosition, "minutes")
        .fromNow(true);
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  async created() {
    await Promise.all([
      await this.$store.dispatch(ACTIONS.INFO_GET),
      await this.$store.dispatch(ACTIONS.BLOCK_GET_HEAD)
    ]);
    this.interval = setInterval(
      () => this.$store.dispatch(ACTIONS.INFO_GET),
      10000
    );
  }
};
</script>

<style lang="scss">
@import "../../styles/scss/common";

.tile {
  padding: 0 15px;
}
.counter {
  // overflow: hidden;
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
</style>
