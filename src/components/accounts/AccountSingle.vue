<template>
  <div class="row">
    <div class="col-lg-12">
      <div class="card ml-2 mr-2">
        <div class="card-header">
          <div class="title">
            <h3 id="card-title" class="card__title" @click="copyToClipboard()">
              <span ref="textToCopy" class="text">{{ hash }}</span>
              <span class="icon"><font-awesome-icon class="icon-primary" :icon="['fas', 'copy']"/></span>
            </h3>
            <b-tooltip ref="tooltip" triggers="hover" target="card-title">Copy to clipboard</b-tooltip>
            <div class="subtitle">Account Information</div>
          </div>
        </div>

        <div class="card-divider"></div>

        <div class="card-body">
          <div class="item-info row ml-1 mr-1">
            <div class="col-lg-2">
              <span class="label">Manager</span>
            </div>
            <div class="col-lg-10">
              <span class="value">{{ account.manager }}</span>
            </div>
          </div>
          <div class="item-info row ml-1 mr-1">
            <div class="col-lg-2">
              <span class="label">Delegate</span>
            </div>
            <div class="col-lg-10">
              <span class="value">{{ account.delegateValue }}</span>
            </div>
          </div>
          <div class="item-info row ml-1 mr-1">
            <div class="col-lg-2">
              <span class="label">Balance</span>
            </div>
            <div class="col-lg-10">
              <span class="value">
                {{ account.balance | tezos }}
                ({{ $_convert(account.balance) }})
              </span>
            </div>
          </div>
          <div class="item-info row ml-1 mr-1" v-if="baker">
            <div class="col-lg-4">
              <span class="value">Current Deposits</span>
            </div>
            <div class="col-lg-8">
              <span class="value">Pending Rewards</span>
            </div>
          </div>
          <div class="item-info row ml-1 mr-1" v-if="baker">
            <div class="col-lg-4">
              <div class="row">
                <div class="col-lg-6">
                  <span class="label">Baking</span>
                </div>
                <div class="col-lg-6">
                  <span class="value">{{
                    bakerInfo.bakingDeposits | tezos
                  }}</span>
                </div>
              </div>
            </div>
            <div class="col-lg-8">
              <div class="row">
                <div class="col-lg-3">
                  <span class="label">Baking</span>
                </div>
                <div class="col-lg-9">
                  <span class="value">{{
                    bakerInfo.bakingRewards | tezos
                  }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="item-info row ml-1 mr-1" v-if="baker">
            <div class="col-lg-4">
              <div class="row">
                <div class="col-lg-6">
                  <span class="label">Endorsement</span>
                </div>
                <div class="col-lg-6">
                  <span class="value">{{
                    bakerInfo.endorsementDeposits | tezos
                  }}</span>
                </div>
              </div>
            </div>
            <div class="col-lg-8">
              <div class="row">
                <div class="col-lg-3">
                  <span class="label">Endorsement</span>
                </div>
                <div class="col-lg-9">
                  <span class="value">{{
                    bakerInfo.endorsementRewards | tezos
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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
      account: {}
    };
  },
  computed: {
    ...mapState('app', {
      info: state => state.priceInfo
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
        return this.$router.push({
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
  .card__title {
    display: inline-flex;
    align-items: center;
    padding-right: 0 !important; /* outweigh selector cascade from public styles */
    cursor: pointer;
  }

  .icon-primary {
    color: #309282;
  }

  .tooltip .tooltip-inner {
    font-size: 13px;
  }

  .icon {
    display: inline-block;
    padding-left: .5rem;
    font-size: 16px;
  }
</style>
