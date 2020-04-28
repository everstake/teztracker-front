<template>
  <div>
    <div class="d-flex justify-content-between mb-2">
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
        <router-link
          :to="{ name: 'account', params: { account: row.item.accountId } }"
        >
          <span>{{ row.item.accountId | longhash(35) }}</span>
        </router-link>
      </template>
      <template slot="manager" slot-scope="row">
        <b-link
          v-if="row.item.manager"
          :to="{ name: 'account', params: { account: row.item.accountId } }"
        >
          <span>{{ row.item.manager | longhash(35) }}</span>
        </b-link>
        <span v-else>----</span>
      </template>
      <template slot="delegateValue" slot-scope="row">
        <b-link
          v-if="row.item.delegateValue"
          :to="{ name: 'account', params: { account: row.item.delegateValue } }"
        >
          <span>{{ row.item.delegateName || row.item.delegateValue | longhash(35) }}</span>
        </b-link>
        <span v-else>----</span>
      </template>
      <template slot="balance" slot-scope="row">
        <span>{{ row.item.balance | tezos }}</span>
      </template>
      <template slot="createdAt" slot-scope="row">
        <span>{{ row.item.createdAt | timeformat(dateFormat) }}</span>
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
  "GET_CONTRACTS",
);

export default {
  name: "ContractsList",
  components: {
    PerPageSelect,
    PaginationWithCustomAction
  },
  mixins: [setPerPage],
  props: ['account'],
  data() {
    return {
      currentPage: this.$constants.INITIAL_CURRENT_PAGE,
      fields: [
        { key: "accountId", label: this.$tc("common.contract", 1) },
        { key: "manager", label: this.$t("common.manager") },
        { key: "delegateValue", label: this.$t("common.delegate") },
        {
          key: "balance",
          label: this.$t("common.balance"),
          sortable: true,
          sortDirection: "desc"
        },
        { key: "createdAt", label: this.$t("accSingle.created") }
      ]
    };
  },
  computed: {
    ...mapState("accounts", {
      contracts: state => state.contracts,
      count: state => state.counts
    }),
    ...mapState("app", {
      dateFormat: state => state.dateFormat
    })
  }
};
</script>
