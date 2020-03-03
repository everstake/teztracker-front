<template>
  <div>
    <b-table
      show-empty
      :items="contracts"
      :fields="fields"
      :current-page="currentPage"
      :per-page="0"
      borderless
      class="transactions-table table-responsive-md"
    >
      <template slot="contract" slot-scope="row">
        <b-link
          :to="{ name: 'account', params: { account: row.item.accountId } }"
        >
          <span>{{ row.item.accountId | longhash(35) }}</span>
        </b-link>
      </template>
      <template slot="manager" slot-scope="row">
        <span>{{ row.item.manager | longhash(35) }}</span>
      </template>
      <template slot="delegate" slot-scope="row">
        <span>{{ row.item.delegateValue | longhash(20) }}</span>
      </template>
      <template slot="balance" slot-scope="row">
        <span>{{ row.item.balance | tezos }}</span>
      </template>
    </b-table>

    <PaginationWithCustomAction
      v-model="currentPage"
      :total-rows="count.contracts"
      :per-page="perPage"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import Pagination from "../partials/Pagination";

import withCustomAction from "../partials/withCustomAction";
const PaginationWithCustomAction = withCustomAction(
  Pagination,
  "accounts",
  "GET_CONTRACTS"
);

export default {
  name: "ContractsList",
  components: {
    PaginationWithCustomAction
  },
  data() {
    return {
      perPage: this.$constants.PER_PAGE,
      currentPage: this.$constants.INITIAL_CURRENT_PAGE,
      fields: [
        { key: "contract", label: "Contract" },
        { key: "manager", label: "Manager" },
        { key: "delegate", label: "Delegate" },
        { key: "balance", label: "Balance" }
      ]
    };
  },
  computed: {
    ...mapState('accounts', {
      contracts: state => state.contracts,
      count: state => state.counts
    })
  }
};
</script>
