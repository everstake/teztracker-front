<template>
  <div>
    <div class="d-flex justify-content-between mb-4">
      <PerPageSelect @per-page="$_setPerPage" />
    </div>

    <b-table
      show-empty
      :items="contracts"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      borderless
      class="transactions-table table-responsive-md"
    >
      <template slot="accountId" slot-scope="row">
        <b-link
          :to="{ name: 'account', params: { account: row.item.accountId } }"
        >
          <span>{{ row.item.accountId | longhash(35) }}</span>
        </b-link>
      </template>
      <template slot="manager" slot-scope="row">
        <span>{{ row.item.manager | longhash(35) }}</span>
      </template>
      <template slot="delegateValue" slot-scope="row">
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
import PerPageSelect from "@/components/partials/PerPageSelect";
import Pagination from "../partials/Pagination";
import setPerPage from "@/mixins/setPerPage";

import withCustomAction from "../partials/withCustomAction";
const PaginationWithCustomAction = withCustomAction(
  Pagination,
  "accounts",
  "GET_CONTRACTS"
);

export default {
  name: "ContractsList",
  components: {
    PerPageSelect,
    PaginationWithCustomAction
  },
  mixins: [setPerPage],
  data() {
    return {
      currentPage: this.$constants.INITIAL_CURRENT_PAGE,
      fields: [
        { key: "accountId", label: "Contract" },
        { key: "manager", label: "Manager" },
        { key: "delegateValue", label: "Delegate" },
        {
          key: "balance",
          label: "Balance",
          sortable: true,
          sortDirection: "desc"
        }
      ]
    };
  },
  computed: {
    ...mapState("accounts", {
      contracts: state => state.contracts,
      count: state => state.counts
    })
  }
};
</script>
