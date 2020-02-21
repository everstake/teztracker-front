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
        <CycleCounter />

        <div class="promo-tiles row justify-content-md-center">
          <div class="tile col text-center ml-2 mr-4">
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

          <div class="tile col text-center mr-4">
            <div class="tile-icon text-center">
              <font-awesome-icon :icon="['far', 'star']" />
            </div>
            <div class="voting-progress">
              <b-progress
                :value="votingProgressPercent"
                :max="100"
                class="mb-2"
              ></b-progress>
              <div class="progress-labels">
                <div class="voting-percentage float-left">
                  <span>{{ votingProgressPercent }}%</span>
                </div>
                <div class="timer float-right">
                  <span>{{ timeLeftTillVotingPeriodEnd }}</span> - Until voting
                  period end
                </div>
              </div>
            </div>
            <span class="tile-name">Voting progress</span>
          </div>

          <div class="tile col text-center mr-4">
            <div class="tile-icon text-center">
              <font-awesome-icon :icon="['far', 'folder']" />
            </div>
            <span class="counter">{{ head.level | bignum }}</span>
            <span class="percentage"></span>
            <span class="tile-name">Block Height</span>
          </div>

          <div class="tile col text-center mr-2">
            <div class="tile-icon text-center">
              <font-awesome-icon :icon="['far', 'user']" />
            </div>

            <span class="counter">
              <router-link
                class="baker"
                :to="{ name: 'account', params: { account: head.baker } }"
                >{{ head.baker | longhash(13) }}</router-link
              >
            </span>
            <span class="percentage"></span>
            <span class="tile-name">Latest baker</span>
          </div>
        </div>

        <div class="promo-tiles row justify-content-md-center">
          <div class="tile col text-center ml-2 mr-4">
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

          <div class="tile col text-center mr-4">
            <div class="tile-icon text-center">
              <font-awesome-icon :icon="['far', 'bookmark']" />
            </div>
            <span class="counter">{{ info.volume_24h | bignum(",") }} XTZ</span>
            <span class="percentage"></span>
            <span class="tile-name">Trading Volume</span>
          </div>

          <div class="tile col text-center mr-4">
            <div class="tile-icon text-center">
              <font-awesome-icon :icon="['far', 'gem']" />
            </div>
            <span class="counter">${{ info.market_cap | bignum(",") }}</span>
            <span class="percentage"></span>
            <span class="tile-name">Market cap</span>
          </div>

          <div class="tile col text-center mr-2">
            <div class="tile-icon text-center">
              <font-awesome-icon :icon="['far', 'hourglass']" />
            </div>
            <span class="counter">{{
              (info.circulating_supply > 0
                ? info.circulating_supply.toFixed()
                : 0) | bignum(",")
            }}</span>
            <span class="percentage"></span>
            <span class="tile-name">Circulating Supply</span>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-6">
            <BlocksCard />
          </div>

          <div class="col-lg-6">
            <TxsCard />
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
                    <a href="https://tezos.com">What is Tezos?</a>
                  </li>
                  <li>
                    <a href="https://tezos.com/static/white_paper-2dc8c02267a8fb86bd67a108199441bf.pdf">White Paper</a>
                  </li>
                  <li>
                    <a href="https://faucet.tzalpha.net/">Testnet Faucet</a>
                  </li>
                </ul>
              </div>
              <div class="col-lg-3">
                <ul>
                  <li>
                    <a href="https://tezos.gitlab.io/introduction/howtouse.html">How to Run Tezos?</a>
                  </li>
                  <li>
                    <a href="https://gitlab.com/tezos/tezos">Git repository</a>
                  </li>
                  <li>
                    <a href="https://hub.docker.com/r/tezos/tezos">Docker images</a>
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
import { mapState, mapActions } from "vuex";
import { GET_APP_INFO, GET_BLOCK_HEAD } from "@/store/actions.types";

import BlocksCard from "../blocks/blocks_card.vue";
import TxCard from "../transactions/transactions_card.vue";
import Search from "../search/search";
import CycleCounter from "../cycle/CycleCounter";
import Search from "../search/Search";
import { setInterval, clearInterval } from "timers";
import moment from "moment";

export default {
  name: "Index",
  components: {
    BlocksCard,
    TxsCard,
    Search,
    CycleCounter
  },
  data() {
    return {
      interval: {}
    };
  },
  computed: {
    ...mapState('app', {
      info: state => state.priceInfo,
    }),
    ...mapState('blocks', {
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
    votingProgressPercent() {
      return parseInt(
        (
          (this.head.metaVotingPeriodPosition /
            (this.info.blocks_in_cycle *
              this.$constants.CYCLES_IN_VOTING_PERIOD)) *
          100
        ).toFixed()
      );
    },
    timeLeftTillVotingPeriodEnd() {
      return moment()
        .add(
          this.info.blocks_in_cycle * this.$constants.CYCLES_IN_VOTING_PERIOD -
            this.head.metaVotingPeriodPosition,
          "minutes"
        )
        .fromNow(true);
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    ...mapActions('app', [GET_APP_INFO]),
    ...mapActions('blocks', [GET_BLOCK_HEAD])
  },
  async created() {
    await Promise.all([
      await this[GET_APP_INFO](),
      await this[GET_BLOCK_HEAD]()
    ]);
    this.interval = setInterval(
      () => this[GET_APP_INFO](),
      10000
    );
  }
};
</script>

<style />
