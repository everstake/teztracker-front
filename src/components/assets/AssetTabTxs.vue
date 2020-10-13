<template>
  <div>
    <div class="d-flex justify-content-between mb-2">
      <PerPageSelect @per-page="$_setPerPage" :hide="!showPerPageFilter" />
    </div>

    <b-table
      responsive
      show-empty
      :items="transactions"
      :fields="fields"
      :current-page="currentPage"
      :per-page="0"
      borderless
      class="transactions-table table-responsive-md"
      :tbody-tr-class="$_defineRowClass"
    >
      <template slot="txhash" slot-scope="row">
        <b-link
          :to="{ name: 'tx', params: { txhash: row.item.operationGroupHash } }"
        >
          {{ row.item.operationGroupHash | longhash(35) }}
        </b-link>
      </template>
      
      <template slot="level" slot-scope="row">
        <b-link :to="{ name: 'block', params: { level: row.item.blockLevel } }">
          {{ row.item.blockLevel | formatInteger }}
        </b-link>
      </template>
      
      <template slot="timestamp" slot-scope="row">
        {{ row.item.timestamp | timeformat(dateFormat) }}
      </template>
      
      <template slot="from" slot-scope="row">
        <b-link
          :to="{ name: 'account', params: { account: row.item.from } }"
        >
          <div>
            {{ row.item.from | longhash(15) }}
          </div>
        </b-link>
      </template>
      
      <template slot="to" slot-scope="row">
        <b-link
          :to="{ name: 'account', params: { account: row.item.to } }"
        >
          {{ row.item.to | longhash(15) }}
        </b-link>
      </template>
      <template slot="amount" slot-scope="row">
        {{ row.item.amount | currencyPrecision(currency, precision) }}
      </template>
      <template slot="fee" slot-scope="row">
        {{ row.item.fee | tezos }}
      </template>
    </b-table>
    
    <Pagination
      @change="$_handleCurrentPageChange"
      :total-rows="count"
      :per-page="perPage"
    />
  </div>
</template>

<script>
  import { mapState } from "vuex";
  import PerPageSelect from "@/components/partials/PerPageSelect";
  import Pagination from "../partials/Pagination";
  import handleCurrentPageChange from "@/mixins/handleCurrentPageChange";
  import setPerPage from "@/mixins/setPerPage";
  import defineRowClass from "@/mixins/defineRowClass";

  export default {
    name: "AssetTabTxs",
    components: {
      PerPageSelect,
      Pagination
    },
    mixins: [handleCurrentPageChange, setPerPage, defineRowClass],
    props: {
      block: {
        type: Object
      },
      account: {
        type: String
      },
      isTableComplete: {
        type: Boolean,
        default: true
      },
      showPerPageFilter: {
        type: Boolean,
        default: true
      },
      currency: String,
      precision: [String, Number],
    },
    data() {
      return {
        transactions: [],
        count: 0,
        fields: [
          {
            key: "from",
            label: this.$t("common.from"),
            class: !this.isTableComplete ? "d-none" : ""
          },
          {
            key: "to",
            label: this.$t("common.to"),
            class: !this.isTableComplete ? "d-none" : ""
          },
          {
            key: "amount",
            label: this.$t("common.amount"),
            class: !this.isTableComplete ? "d-none" : ""
          },
          {
            key: "fee",
            label: this.$t("common.fee"),
            class: !this.isTableComplete ? "d-none" : ""
          },
          {
            key: "gas_limit",
            label: this.$t("txPage.gasLimit"),
            class: !this.isTableComplete ? "d-none" : ""
          },
          {
            key: "storage_limit",
            label: this.$t("txPage.storageLimit"),
            class: !this.isTableComplete ? "d-none" : ""
          },
          { key: "timestamp", label: this.$t("common.timestamp") },
        ]
      };
    },
    computed: {
      ...mapState("app", {
        dateFormat: state => state.dateFormat
      })
    },
    watch: {
      currentPage: {
        async handler(value) {
          await this.reload(value);
        }
      },
      block: {
        async handler() {
          await this.reload();
        }
      },
      account: {
        async handler() {
          await this.reload();
        }
      },
      async perPage() {
        await this.reload();
      }
    },
    async created() {
      // TODO: refactor API
      if (!this.block) {
        await this.reload();
      }
    },
    methods: {
      // ...mapMutations("operations", [SET_TX_COUNT]),
      async reload(page = 1) {
        const props = {
          page,
          limit: this.perPage,
          type: 'transfer',
          assets_id: this.$route.params.id
        };
        const data = await this.$api.getAssetsOperationsById(props);
        // if (data.status !== this.$constants.STATUS_SUCCESS) {
        //   return this.$router.replace({
        //     name: data.status
        //   });
        // }
        this.transactions = data.data;
        // this.$emit('onTransactions', this.account);
        this.count = data.count;
        // this[SET_TX_COUNT](this.count);
      },
      getAccountName(row, rowHash) {
        return `${row.item[`${rowHash}Name`] || row.item[rowHash].slice(0, 15)}...`;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .source,
  .destination {
    position: relative;
    padding-left: 12px;
  }
  
  .icon {
    &__arrow--red:before {
      position: absolute;
      content: '';
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      color: #309282;
      border-top: .3em solid transparent;
      border-bottom: .3em solid transparent;
      border-left: .3em solid;
    }
    
    &__arrow--green:before {
      position: absolute;
      content: '';
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      color: #e56968;
      border-top: .3em solid transparent;
      border-bottom: .3em solid transparent;
      border-left: .3em solid;
    }
  }
</style>
