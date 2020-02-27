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
      <template slot="account" slot-scope="row">
        <b-link
          :to="{ name: 'account', params: { account: row.item.accountId } }"
        >
          <span>{{ row.item.accountId | longhash(35) }}</span>
        </b-link>
      </template>
      <template slot="amount" slot-scope="row">
        <span>{{ row.item.balance | tezos }}</span>
      </template>
    </b-table>

    <div class="pagination-block">
      <PaginationWithCustomAction
        :total-rows="rows"
        :per-page="perPage"
      />
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import TzPagination from "../common/_tz_pagination";

import withCustomAction from "../common/withCustomAction";
const PaginationWithCustomAction = withCustomAction(
  TzPagination,
  "accounts",
  "GET_ACCOUNTS"
);

export default {
  name: "AccountsList",
  components: {
    PaginationWithCustomAction
  },
  data() {
    return {
      perPage: this.$constants.PER_PAGE,
      currentPage: this.$constants.INITIAL_CURRENT_PAGE,
      pageOptions: this.$constants.PAGE_OPTIONS,
      fields: [
        { key: "account", label: "Account" },
        { key: "amount", label: "Amount" }
      ]
    };
  },
  computed: {
    ...mapState('accounts', {
      accounts: state => state.accounts,
      count: state => state.counts
    }),
    rows() {
      return this.count.accounts;
    },
    items() {
      return this.accounts;
    }
  }
};
</script>
