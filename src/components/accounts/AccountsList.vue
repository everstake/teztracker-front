<template>
  <div>
    <b-table
      show-empty
      :items="accounts"
      :fields="fields"
      :current-page="currentPage"
      :per-page="0"
      borderless
      class="transactions-table table-responsive-md"
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
        :total-rows="count.accounts"
        :per-page="perPage"
      />
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import Pagination from "../partials/Pagination";

import withCustomAction from "../partials/withCustomAction";
const PaginationWithCustomAction = withCustomAction(
  Pagination,
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
    })
  }
};
</script>
