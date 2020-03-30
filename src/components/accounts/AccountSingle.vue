<template>
  <b-row>
    <b-col lg="12">
      <b-card no-body>
        <b-card-header>
          <div class="break-word">
            <h3 id="card-title" class="card__title" @click="copyToClipboard()">
              <span ref="textToCopy" class="text">{{ hash }}</span>
              <span class="icon"
                ><font-awesome-icon class="icon-primary" :icon="['fas', 'copy']"
              /></span>
            </h3>
            <b-tooltip ref="tooltip" triggers="hover" target="card-title">
              {{ $t("common.copyToClipboard") }}
            </b-tooltip>
            <div class="subtitle">
              {{ $t("infoTypes.accInfo") }}
            </div>
          </div>
        </b-card-header>

        <div class="card-divider"></div>

        <b-card-body>
          <b-row class="item-info  mr-1">
            <b-col lg="2">
              <span class="label">
                {{ $t("common.manager") }}
              </span>
            </b-col>
            <b-col lg="10">
              <span class="value">{{ account.manager }}</span>
            </b-col>
          </b-row>

          <b-row class="item-info  mr-1">
            <b-col lg="2">
              <span class="label">
                {{ $t("common.delegate") }}
              </span>
            </b-col>
            <b-col lg="10">
              <span class="value">{{ account.delegateValue }}</span>
            </b-col>
          </b-row>

          <b-row class="item-info  mr-1">
            <b-col lg="2">
              <span class="label">
                {{ $t("common.balance") }}
              </span>
            </b-col>
            <b-col lg="10">
              <span class="value">
                {{ account.balance | tezos }}
                ({{ $_convert(account.balance) }})
              </span>
            </b-col>
          </b-row>
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
  name: "AccountSingle",
  props: ["hash"],
  mixins: [convert],
  data() {
    return {
      account: {}
    };
  },
  computed: {
    ...mapState("app", {
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
    ...mapActions("app", [GET_APP_INFO]),
    async reload(acc) {
      const result = await this.$api.getAccount({ account: acc });
      if (result.status !== this.$constants.STATUS_SUCCESS) {
        return this.$router.replace({
          name: result.status
        });
      }
      this.account = result.data;
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
  display: inline-block;
  padding-left: 0.5rem;
  font-size: 16px;
}
</style>
