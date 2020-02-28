<template>
  <div>
    <b-table
      show-empty
      stacked="md"
      :items="originations"
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
        <span>{{
          row.item.timestamp | timeformat($constants.TIME_FORMAT)
        }}</span>
      </template>

      <template slot="from" slot-scope="row">
        <b-link :to="{ name: 'account', params: { account: row.item.source } }">
          <span>{{ row.item.source | longhash(20) }}</span>
        </b-link>
      </template>

      <template slot="to" slot-scope="row" v-if="row.item.delegate">
        <b-link
          :to="{ name: 'account', params: { account: row.item.delegate } }"
        >
          <span>{{ row.item.delegate | longhash(20) }}</span>
        </b-link>
      </template>
      <template slot="amount" slot-scope="row">
        <span>{{ row.item.balance | tezos }}</span>
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
import { mapMutations } from "vuex";
import { SET_ORIGINATIONS_COUNT } from "@/store/mutations.types";
import Pagination from "../partials/Pagination";
import handleCurrentPageChange from "@/mixins/handleCurrentPageChange";

export default {
  name: "OriginationsList",
  components: {
    Pagination
  },
  mixins: [handleCurrentPageChange],
  props: ["account"],
  data() {
    return {
      perPage: this.$constants.PER_PAGE,
      pageOptions: this.$constants.PAGE_OPTIONS,
      originations: [],
      count: 0,
      fields: [
        { key: "txhash", label: "Origination Hash" },
        { key: "level", label: "Block ID" },
        { key: "timestamp", label: "Timestamp" },
        { key: "to", label: "To" },
        { key: "from", label: "From" },
        { key: "amount", label: "Amount" }
      ]
    };
  },
  watch: {
    currentPage: {
      async handler(value) {
        await this.reload(value);
      }
    }
  },
  async created() {
    await this.reload();
  },
  methods: {
    ...mapMutations('operations', [SET_ORIGINATIONS_COUNT]),
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
      const data = await this.$api.getOriginations(props);
      this.originations = data.data;
      this.count = data.count;
      this[SET_ORIGINATIONS_COUNT](this.count);
    }
  }
};
</script>
