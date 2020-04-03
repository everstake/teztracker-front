<template>
  <div>
    <div class="d-flex justify-content-between mb-2">
      <PerPageSelect @per-page="$_setPerPage" />
    </div>

    <b-table
      show-empty
      :items="accounts"
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
      <template slot="balance" slot-scope="row">
        <span>{{ row.item.balance | tezos }}</span>
      </template>
      <template slot="createdAt" slot-scope="row">
        <span>{{ row.item.createdAt | timeformat(dateFormat) }}</span>
      </template>
      <template v-if="row.item.delegateValue" slot="delegateValue" slot-scope="row">
        <b-link
          :to="{ name: 'account', params: { account: row.item.accountId } }"
        >
          <span>{{ row.item.delegateValue | longhash(35) }}</span>
        </b-link>
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
import PerPageSelect from "@/components/partials/PerPageSelect";
import Pagination from "../partials/Pagination";
import setPerPage from "@/mixins/setPerPage";

import withCustomAction from "../partials/withCustomAction";
const PaginationWithCustomAction = withCustomAction(
  Pagination,
  "accounts",
  "GET_ACCOUNTS"
);

export default {
  name: "AccountsList",
  components: {
    PerPageSelect,
    PaginationWithCustomAction
  },
  mixins: [setPerPage],
  data() {
    return {
      currentPage: this.$constants.INITIAL_CURRENT_PAGE,
      fields: [
        { key: "accountId", label: this.$tc("common.acc", 1) },
        {
          key: "balance",
          label: this.$t("common.amount"),
          sortable: true,
          sortDirection: "desc"
        },
        { key: "delegateValue", label: "Delegate" },
        { key: "createdAt", label: "Created" }
      ]
    };
  },
  computed: {
    ...mapState("accounts", {
      accounts: state => state.accounts,
      count: state => state.counts
    }),
    ...mapState("app", {
      dateFormat: state => state.dateFormat
    })
  }
};
</script>
