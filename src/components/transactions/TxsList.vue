<template>
  <div>
    <div class="d-flex justify-content-between mb-2">
      <PerPageSelect @per-page="$_setPerPage" :hide="!showPerPageFilter" />
    </div>

    <b-table
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
        <b-link :to="{ name: 'account', params: { account: row.item.source } }">
          {{ row.item.source | longhash(20) }}
        </b-link>
      </template>

      <template slot="to" slot-scope="row">
        <b-link
          :to="{ name: 'account', params: { account: row.item.destination } }"
        >
          {{ row.item.destination | longhash(20) }}
        </b-link>
      </template>
      <template slot="amount" slot-scope="row">
        {{ row.item.amount | tezos }}
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
import { mapState, mapMutations } from "vuex";
import { SET_TX_COUNT } from "@/store/mutations.types";
import PerPageSelect from "@/components/partials/PerPageSelect";
import Pagination from "../partials/Pagination";
import handleCurrentPageChange from "@/mixins/handleCurrentPageChange";
import setPerPage from "@/mixins/setPerPage";
import defineRowClass from "@/mixins/defineRowClass";

export default {
  name: "TxsList",
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
    }
  },
  data() {
    return {
      transactions: [],
      count: 0,
      fields: [
        { key: "level", label: "Block ID" },
        { key: "txhash", label: "Transactions Hash" },
        {
          key: "from",
          label: "From",
          class: !this.isTableComplete ? "d-none" : ""
        },
        {
          key: "to",
          label: "To",
          class: !this.isTableComplete ? "d-none" : ""
        },
        {
          key: "amount",
          label: "Amount",
          class: !this.isTableComplete ? "d-none" : ""
        },
        {
          key: "fee",
          label: "Fees",
          class: !this.isTableComplete ? "d-none" : ""
        },
        { key: "timestamp", label: "Timestamp" }
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
    ...mapMutations("operations", [SET_TX_COUNT]),
    async reload(page = 1) {
      const props = {
        page,
        limit: this.perPage
      };
      if (this.block) {
        props.block_id = this.block.hash;
      }
      if (this.account) {
        props.account_id = this.account;
      }
      const data = await this.$api.getTransactions(props);
      if (data.status !== this.$constants.STATUS_SUCCESS) {
        return this.$router.replace({
          name: data.status
        });
      }
      this.transactions = data.data;

      const transactionsChartData = this.transactions.map(tx => ({amount: tx.amount, timestamp: tx.timestamp}));
      this.$emit('onTransactions', this.account)
      this.count = data.count;
      this[SET_TX_COUNT](this.count);
    }
  }
};
</script>
