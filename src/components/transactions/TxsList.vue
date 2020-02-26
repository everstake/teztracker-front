<template>
  <div>
    <b-table
      show-empty
      stacked="md"
      :items="items"
      :fields="fields"
      :current-page="currentPage"
      :per-page="0"
      class="transactions-table table table-borderless table-responsive-md"
    >
      <template slot="txhash" slot-scope="row">
        <b-link
          :to="{ name: 'tx', params: { txhash: row.item.operationGroupHash } }"
        >
          <span>{{ row.item.operationGroupHash | longhash(35) }}</span>
        </b-link>
      </template>

      <template slot="level" slot-scope="row">
        <b-link :to="{ name: 'block', params: { level: row.item.blockLevel } }">
          <span>{{ row.item.blockLevel }}</span>
        </b-link>
      </template>

      <template slot="timestamp" slot-scope="row">
        <span>{{ row.item.timestamp | timeformat($constants.TIME_FORMAT) }}</span>
      </template>

      <template slot="from" slot-scope="row">
        <b-link :to="{ name: 'account', params: { account: row.item.source } }">
          <span>{{ row.item.source | longhash(20) }}</span>
        </b-link>
      </template>

      <template slot="to" slot-scope="row">
        <b-link
          :to="{ name: 'account', params: { account: row.item.destination } }"
        >
          <span>{{ row.item.destination | longhash(20) }}</span>
        </b-link>
      </template>
      <template slot="amount" slot-scope="row">
        <span>{{ row.item.amount | tezos }}</span>
      </template>
      <template slot="fee" slot-scope="row">
        <span>{{ row.item.fee | tezos }}</span>
      </template>
    </b-table>

    <TzPagination
      @change="_handleChange"
      :total-rows="rows"
      :per-page="perPage"
    />
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { SET_TX_COUNT } from "@/store/mutations.types";
import TzPagination from "../common/_tz_pagination";

export default {
  name: "TxsList",
  components: {
    TzPagination
  },
  props: ["block", "account"],
  data() {
    return {
      perPage: this.$constants.PER_PAGE,
      currentPage: this.$constants.INITIAL_CURRENT_PAGE,
      pageOptions: this.$constants.PAGE_OPTIONS,
      transactions: [],
      count: 0,
      fields: [
        { key: "txhash", label: "Transactions Hash" },
        { key: "level", label: "Block ID" },
        { key: "timestamp", label: "Timestamp" },
        { key: "from", label: "From" },
        { key: "to", label: "To" },
        { key: "amount", label: "Amount" },
        { key: "fee", label: "Fees" }
      ]
    };
  },
  computed: {
    ...mapState('operations', {
      counts: state => state.counts
    }),
    rows() {
      return this.count;
    },
    items() {
      return this.transactions;
    }
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
    }
  },
  async created() {
    await this.reload();
  },
  methods: {
    ...mapMutations('operations', [SET_TX_COUNT]),
    _handleChange(page) {
      this.currentPage = page;
    },
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
      if (data.status !== 200) {
        return this.$router.push({
          name: data.status
        });
      }
      this.transactions = data.data;
      this.count = data.count;
      this[SET_TX_COUNT](this.count);
    }
  }
};
</script>
