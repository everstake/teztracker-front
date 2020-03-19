<template>
  <div>
    <div class="d-flex justify-content-between mb-4">
      <PerPageSelect @per-page="$_setPerPage" :hide="true" />
    </div>

    <b-table
      show-empty
      :items="transactions"
      :fields="fields"
      :current-page="currentPage"
      :per-page="0"
      borderless
      class="transactions-table table-responsive-md"
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
        <span>{{ row.item.timestamp | timeformat(dateFormat) }}</span>
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

export default {
  name: "TxsList",
  components: {
    PerPageSelect,
    Pagination
  },
  mixins: [handleCurrentPageChange, setPerPage],
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
    }
  },
  data() {
    return {
      transactions: [],
      count: 0,
      fields: [
        { key: "level", label: "Block ID" },
        { key: "timestamp", label: "Timestamp" },
        { key: "txhash", label: "Transactions Hash" },
        { key: "from", label: "From", class: !this.isTableComplete ? 'd-none' : '' },
        { key: "to", label: "To", class: !this.isTableComplete ? 'd-none' : '' },
        { key: "amount", label: "Amount", class: !this.isTableComplete ? 'd-none' : '' },
        { key: "fee", label: "Fees", class: !this.isTableComplete ? 'd-none' : '' }
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
    ...mapMutations('operations', [SET_TX_COUNT]),
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
      this.count = data.count;
      this[SET_TX_COUNT](this.count);
    }
  }
};
</script>
