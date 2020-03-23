<template>
  <b-row>
    <b-col lg="12">
      <b-card no-body>
        <b-card-header>
          <h3
            v-if="Object.keys(bakerInfo).length !== 0"
            id="card-title"
            class="card__title"
          >
            <span class="text">
              <template v-if="bakerInfo.name">
                {{ bakerInfo.name }}
              </template>
              <template v-else>
                {{ hash }}
              </template>
            </span>
          </h3>
          <div class="subtitle">Baker information</div>
        </b-card-header>

        <div class="card-divider"></div>

        <b-card-body>
          <b-container fluid>
            <b-row>
              <b-col class="card__no-padding" lg="6">
                <span class="text-accent">General info</span>

                <b-row class="item-info">
                  <b-col lg="4" class="label">Address</b-col>
                  <b-col lg="8" class="text-accent card__pointer">
                    <span id="hash" @click="copyToClipboard()">
                      <span ref="textToCopy">
                        {{ hash }}
                      </span>
                      <span class="icon">
                        <font-awesome-icon
                          class="icon-primary"
                          :icon="['fas', 'copy']"
                        />
                      </span>
                    </span>
                    <b-tooltip ref="tooltip" triggers="hover" target="hash">
                      Copy to clipboard
                    </b-tooltip>
                  </b-col>
                </b-row>
                <b-row class="item-info">
                  <b-col lg="4" class="label">Fee</b-col>
                  <b-col lg="8" class="text-accent">
                    {{ bakerInfo.fee | addPercent }}
                  </b-col>
                </b-row>
                <b-row class="item-info">
                  <b-col lg="4" class="label">Baking since</b-col>
                  <b-col lg="8" class="text-accent">
                    {{ bakerInfo.bakingSince | timeformat(dateFormat) }}
                  </b-col>
                </b-row>
                <b-row class="item-info">
                  <b-col lg="4" class="label">Rolls</b-col>
                  <b-col lg="8" class="text-accent">
                    {{ bakerInfo.rolls }}
                  </b-col>
                </b-row>
                <b-row class="item-info">
                  <b-col lg="4" class="label">Blocks baked</b-col>
                  <b-col lg="8" class="text-accent">
                    {{ bakerInfo.blocks }}
                  </b-col>
                </b-row>
                <b-row class="item-info">
                  <b-col lg="4" class="label"># of delegators</b-col>
                  <b-col lg="8" class="text-accent">
                    {{ bakerInfo.activeDelegators }}
                  </b-col>
                </b-row>
                <b-row class="item-info">
                  <b-col lg="4" class="label"># of endorsements</b-col>
                  <b-col lg="8" class="text-accent">
                    {{ bakerInfo.endorsements }}
                  </b-col>
                </b-row>
              </b-col>
              
              <b-col class="p-0 px-lg-3" lg="6">
                <span class="text-accent">Balances</span>

                <b-row class="item-info">
                  <b-col lg="4" class="label">Total balance</b-col>
                  <b-col lg="6" class="text-accent">
                    {{ bakerInfo.evaluatedBalance | tezos }}
                  </b-col>
                </b-row>
                <b-row class="item-info">
                  <b-col lg="4" class="label">Liquid balance</b-col>
                  <b-col lg="8" class="text-accent">{{
                    account.balance | tezos
                  }}</b-col>
                </b-row>
                <b-row class="item-info">
                  <b-col lg="4" class="label">Staking balance</b-col>
                  <b-col lg="8" class="text-accent">{{
                    bakerInfo.stakingBalance | tezos
                  }}</b-col>
                </b-row>

                <span class="text-accent">Current Deposits</span>

                <b-row class="item-info">
                  <b-col lg="4" class="label">Baking</b-col>
                  <b-col lg="8" class="text-accent">{{
                    bakerInfo.bakingDeposits | tezos
                  }}</b-col>
                </b-row>
                <b-row class="item-info">
                  <b-col lg="4" class="label">Endorsement</b-col>
                  <b-col lg="8" class="text-accent">{{
                    bakerInfo.endorsementDeposits | tezos
                  }}</b-col>
                </b-row>

                <span class="text-accent">Pending Rewards</span>

                <b-row class="item-info">
                  <b-col lg="4" class="label">Baking</b-col>
                  <b-col lg="8" class="text-accent">{{
                    bakerInfo.bakingRewards | tezos
                  }}</b-col>
                </b-row>
                <b-row class="item-info">
                  <b-col lg="4" class="label">Endorsement</b-col>
                  <b-col lg="8" class="text-accent">{{
                    bakerInfo.endorsementRewards | tezos
                  }}</b-col>
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
import convert from "../../mixins/convert";
import { GET_APP_INFO } from "@/store/actions.types";
import { mapState, mapActions } from "vuex";

export default {
  name: "BakerSingle",
  props: {
    hash: {
      type: String,
      required: true
    }
  },
  mixins: [convert],
  data() {
    return {
      bakerInfo: {},
      account: {}
    };
  },
  computed: {
    ...mapState("app", {
      info: state => state.priceInfo,
      dateFormat: state => state.dateFormat
    })
  },
  watch: {
    hash: {
      async handler(value) {
        await this.reload(value);
      }
    }
  },
  async created() {
    await this[GET_APP_INFO]();
    await this.reload(this.hash);
  },
  methods: {
    ...mapActions("app", [GET_APP_INFO]),
    async reload(acc) {
      const result = await this.$api.getAccount({ account: acc });
      if (result.status !== this.$constants.STATUS_SUCCESS) {
        return this.$router.replace({
          name: result.status
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
    copyToClipboard() {
      const selection = window.getSelection();
      const range = window.document.createRange();
      selection.removeAllRanges();
      range.selectNode(this.$refs.textToCopy);
      selection.addRange(range);

      try {
        document.execCommand("copy");
      } catch (err) {
        selection.removeAllRanges();
      }
    }
  }
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
  cursor: pointer;
}

.icon-primary {
  color: $color-brand;
}

.icon {
  display: inline-block;
  padding-left: 0.5rem;
  font-size: 16px;
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
