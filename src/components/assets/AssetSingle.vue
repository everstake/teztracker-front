<template>
  <b-row>
    <b-col lg="12">
      <b-card no-body>
        <b-card-header>
          <h3 id="card-title" class="card__title">
            <span class="text card-title__text">
              <template v-if="account.name">
                {{ account.name }}
              </template>
              <template v-else>
                {{ hash }}
              </template>
            </span>
          </h3>
          <div class="subtitle">
            {{ $t("infoTypes.assetInfo") }}
          </div>
        </b-card-header>

        <div class="card-divider"></div>

        <b-card-body>
          <b-container fluid>
            <b-row>
              <b-col class="card__no-padding" lg="6">
                <span class="text-accent">
                  {{ $t("infoTypes.generalInfo") }}
                </span>

                <b-row class="item-info">
                  <b-col lg="4" class="label">
                    {{ $t("bakerSingle.address") }}
                  </b-col>
                  <b-col lg="8" class="text-accent card__pointer">
                    <span class="hash" id="hash" @click="copyToClipboard()">
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
                      {{ $t("common.copyToClipboard") }}
                    </b-tooltip>
                  </b-col>
                </b-row>
                <b-row class="item-info">
                  <b-col lg="4" class="label">
                    {{ $t("accSingle.created") }}
                  </b-col>
                  <b-col lg="8" class="text-accent">
                    {{ account.created_at | timeformat(dateFormat) }}
                  </b-col>
                </b-row>
              </b-col>

              <b-col class="p-0 px-lg-3" lg="6">
                <span class="text-accent">
                  {{ $t("bakerSingle.balances") }}
                </span>

                <b-row class="item-info">
                  <b-col lg="4" class="label">
                    {{ $t("common.balance") }}
                  </b-col>
                  <b-col lg="6" class="text-accent">
                    {{ account.balance | tezos(getAssetCurrency(account.name)) }}
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
import convert from "../../mixins/convert";
import { GET_APP_INFO } from "@/store/actions.types";
import { mapState, mapActions } from "vuex";

export default {
  name: "AssetSingle",
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
      const result = await this.$api.getAssetsById({ asset_id: acc });
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
    },
    getAssetCurrency(asset) {
      if (!asset) return 'XTZ';

      const assets = [
        { name: 'tzBTC', currency: 'tzBTC' },
        { name: 'Staker DAO', currency: 'STKR' },
        { name: 'USDtz', currency: 'USDtz' },
      ];

      const findedAsset = assets.find(({ name, currency }) => {
        if (asset === name) return currency;
      });

      this.$emit('onCurrencyChange', findedAsset.currency);

      return findedAsset.currency;
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
