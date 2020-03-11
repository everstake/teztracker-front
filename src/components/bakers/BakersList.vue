<template>
  <div>
    <div class="d-flex justify-content-between mb-4">
      <PerPageSelect @per-page="$_setPerPage" />
    </div>

    <b-table
      show-empty
      :items="bakers"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      borderless
      class="transactions-table table-responsive-md"
    >
      <template slot="accountId" slot-scope="row">
        <b-link :to="{ name: 'baker', params: { baker: row.item.accountId } }">
          <span>{{ row.item.name || row.item.accountId | longhash(35) }}</span>
        </b-link>
      </template>
      <template slot="blocks" slot-scope="row">
        <span>{{ row.item.blocks }}</span>
      </template>
      <template slot="stakingBalance" slot-scope="row">
        <span>{{ row.item.stakingBalance | tezos }}</span>
      </template>
      <template slot="endorsements" slot-scope="row">
        <span>{{ row.item.endorsements }}</span>
      </template>
    </b-table>

    <PaginationWithCustomAction
      v-model="currentPage"
      :total-rows="count.bakers"
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
  "GET_BAKERS"
);

export default {
  name: "BakersList",
  components: {
    PerPageSelect,
    PaginationWithCustomAction
  },
  mixins: [setPerPage],
  data() {
    return {
      currentPage: this.$constants.INITIAL_CURRENT_PAGE,
      // The key property must coincide with the corresponding keys in the data items
      fields: [
        { key: "accountId", label: "Baker" },
        {
          key: "blocks",
          label: "Blocks",
          sortable: true,
          sortDirection: "desc"
        },
        { key: "stakingBalance", label: "Staked assets" },
        {
          key: "endorsements",
          label: "Endorsement",
          sortable: true,
          sortDirection: "desc"
        }
      ]
    };
  },
  computed: {
    ...mapState("accounts", {
      bakers: state => state.bakers,
      count: state => state.counts
    })
  }
};
</script>
