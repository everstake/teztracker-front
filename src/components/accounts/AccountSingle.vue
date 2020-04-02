<template>
  <b-row>
    <b-col lg="12">
      <b-card no-body>
        <b-card-header>
          <div class="break-word">
            <h3 id="card-title" class="card__title" @click="copyToClipboard()">
              <span ref="textToCopy" class="text">{{ hash }}</span>
              <span class="icon"><font-awesome-icon class="icon-primary" :icon="['fas', 'copy']"/></span>
            </h3>
            <b-tooltip ref="tooltip" triggers="hover" target="card-title">Copy to clipboard</b-tooltip>
            <div class="subtitle">Account Information</div>
          </div>
        </b-card-header>

        <div class="card-divider"></div>

        <b-card-body>
          <b-row class="item-info mr-1">
            <b-col lg="2">
              <span class="label">Manager</span>
            </b-col>
            <b-col lg="10">
              <span class="value">{{ account.manager }}</span>
            </b-col>
          </b-row>
          
          <b-row class="item-info  mr-1">
            <b-col lg="2">
              <span class="label">Created on</span>
            </b-col>
            <b-col lg="10">
              <span class="value">
                {{ account.createdAt | timeformat(dateFormat) }}
              </span>
            </b-col>
          </b-row>

          <b-row class="item-info  mr-1">
            <b-col lg="2">
              <span class="label">Delegate</span>
            </b-col>
            <b-col lg="10">
              <span class="value">{{ account.delegateValue || false }}</span>
            </b-col>
          </b-row>

          <b-row class="item-info  mr-1">
            <b-col lg="2">
              <span class="label">Balance</span>
            </b-col>
            <b-col lg="10">
              <span class="value">
                {{ account.balance | tezos }}
                ({{ $_convert(account.balance) }})
              </span>
            </b-col>
          </b-row>

          <b-row class="item-info mr-1">
            <b-col lg="2">
              <span class="label"># of operations</span>
            </b-col>
            <b-col lg="10">
              <span class="value">
                {{ account.operations }}
              </span>
            </b-col>
          </b-row>

          <b-row class="item-info mr-1">
            <b-col lg="2">
              <span class="label">Last active</span>
            </b-col>
            <b-col lg="10">
              <span class="value">
                {{ account.lastActive | timeformat(dateFormat) }}
              </span>
            </b-col>
          </b-row>
  
  
          <b-row class="item-info  mr-1">
            <b-col lg="2">
              <span class="label">Status</span>
            </b-col>
            <b-col lg="10">
              <span
                class="value value--capitalize"
                :class="{
                  'text-success': account.revealed,
                  'text-danger': !account.revealed
                }"
              >
                {{ account.revealed ? 'revealed' : 'unrevealed' }}
              </span>
            </b-col>
          </b-row>

          <b-row class="item-info mr-1" v-if="baker">
            <b-col lg="4">
              <span class="value">Current Deposits</span>

              <b-row class="item-info">
                <b-col lg="6">
                  <span class="label">Baking</span>
                </b-col>
                <b-col lg="6">
                  <span class="value">{{
                    bakerInfo.bakingDeposits | tezos
                  }}</span>
                </b-col>
              </b-row>

              <b-row class="item-info">
                <b-col lg="6">
                  <span class="label">Endorsement</span>
                </b-col>
                <b-col lg="6">
                  <span class="value">{{
                    bakerInfo.endorsementDeposits | tezos
                  }}</span>
                </b-col>
              </b-row>
            </b-col>
            <b-col lg="8">
              <span class="value">Pending Rewards</span>

              <b-row class="item-info">
                <b-col lg="3">
                  <span class="label">Baking</span>
                </b-col>
                <b-col lg="9">
                  <span class="value">{{
                    bakerInfo.bakingRewards | tezos
                  }}</span>
                </b-col>
              </b-row>

              <b-row class="item-info">
                <b-col lg="3">
                  <span class="label">Endorsement</span>
                </b-col>
                <b-col lg="9">
                  <span class="value">{{
                    bakerInfo.endorsementRewards | tezos
                  }}</span>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>

      <b-card class="card-offset">
        <b-row class="item-info">
          <b-col lg="12">
            <slot v-bind:balance="account.balance" class="chart" name="chart"></slot>
          </b-col>
        </b-row>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import convert from "../../mixins/convert";
import { GET_APP_INFO } from "@/store/actions.types";
import { mapState, mapActions } from "vuex";

export default {
  name: "AccountSingle",
  props: ["hash"],
  mixins: [convert],
  data() {
    return {
      baker: false,
      bakerInfo: {},
      account: {},
      balance: []
    };
  },
  computed: {
    ...mapState('app', {
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
    ...mapActions('app', [GET_APP_INFO]),
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
        document.execCommand('copy');
      } catch (err) {
        selection.removeAllRanges();
      }
    }
  }
};
</script>

<style>
  .tooltip .tooltip-inner {
    font-size: 13px;
  }
</style>

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
    position: absolute;
    top: 0;
    right: -15px;
    margin-left: 10px;
    font-size: 12px;
    color: #309282;
  }
  
  .card-offset {
    margin-top: 51px;
  }
  
  .value--capitalize {
    text-transform: capitalize;
  }
</style>
