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

        <div class="promo-tiles row justify-content-md-center">
          <div class="tile col text-center ml-4 mr-4">
            <div class="tile-icon text-center">
              <font-awesome-icon icon="chart-bar" />
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
              <font-awesome-icon icon="folder" />
            </div>
            <span class="counter">{{ head.level | bignum }}</span>
            <span class="percentage"></span>
            <span class="tile-name">Height</span>
          </div>

          <div class="tile col text-center mr-4">
            <div class="tile-icon text-center">
              <font-awesome-icon icon="hourglass" />
            </div>
            <span class="counter">{{ head.metaCycle }}</span>
            <span class="percentage"></span>
            <span class="tile-name">Cycle counter</span>
          </div>

          <div class="tile col text-center mr-4">
            <div class="tile-icon text-center">
              <font-awesome-icon icon="lightbulb" />
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
              <font-awesome-icon icon="bell" />
            </div>
            <span class="counter">{{ info.annual_yield }}%</span>
            <span class="percentage red"></span>
            <span class="tile-name">Annual yield</span>
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
import Search from "../search/search";
import { ACTIONS } from "../../store";
import { setInterval, clearInterval } from "timers";

export default {
  name: "index",
  components: {
    BlocksCard,
    TxCard,
    Search
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

<style />
