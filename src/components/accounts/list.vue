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
        align="right"
        first-text
        prev-text="Prev"
        next-text="Next"
        last-text
      ></PaginationWithCustomAction>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import TzPagination from "../common/_tz_pagination";
import withCustomAction from "../common/withCustomAction";
const PaginationWithCustomAction = withCustomAction(
  TzPagination,
  "ACCOUNTS_GET"
);

export default {
  name: "Accounts",
  props: {},
  data() {
    return {
      perPage: 10,
      currentPage: 1,
      pageOptions: [10, 15, 20, 25, 30],
      fields: [
        { key: "account", label: "Account" },
        { key: "amount", label: "Amount" }
      ]
    };
  },
  computed: {
    ...mapState({
      accounts: state => state.accounts,
      count: state => state.counts
    }),
    rows() {
      return this.count.accounts;
    },
    items() {
      return this.accounts;
    }
  },
  components: {
    PaginationWithCustomAction
  }
};
</script>
