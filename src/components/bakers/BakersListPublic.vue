<template>
  <div>
    <div class="d-flex justify-content-between mb-4">
      <PerPageSelect @per-page="$_setPerPage" />
    </div>

    <b-table
      show-empty
      :items="bakersFormatted"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      borderless
      class="transactions-table table-responsive-md"
    >
      <template slot="accountId" slot-scope="row">
        <b-link :to="{ name: 'baker', params: { baker: row.item.accountId } }">
          {{ row.item.name || row.item.accountId | longhash(35) }}
        </b-link>
      </template>
      <template slot="stakingCapacity" slot-scope="row">
        {{ row.item.stakingCapacity | tezosCapacity }}
      </template>
      <template slot="fee" slot-scope="row">
        {{ row.item.fee }} %
      </template>
      <template slot="stakingBalance" slot-scope="row">
        {{ row.item.stakingBalance | tezos }}
      </template>
      <template slot="bakingSince" slot-scope="row">
        {{ row.item.bakingSince | timeformat(dateFormat) }}
      </template>
    </b-table>

    <PaginationWithCustomAction
      v-model="currentPage"
      :total-rows="count.publicBakers"
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
  "GET_PUBLIC_BAKERS"
);

export default {
  name: "BakersListPublic",
  components: {
    PerPageSelect,
    PaginationWithCustomAction
  },
  mixins: [setPerPage],
  data() {
    return {
      currentPage: this.$constants.INITIAL_CURRENT_PAGE,
      fields: [
        { key: "accountId", label: "Baker" },
        { key: "stakingCapacity", label: "Capacity" },
        { key: "fee", label: "Fee" },
        { key: "stakingBalance", label: "Total balance" },
        { key: "rolls", label: "Rolls" },
        {
          key: "blocks",
          label: "Blocks",
          sortable: true,
          sortDirection: "desc"
        },
        {
          key: "endorsements",
          label: "Endorsements",
          sortable: true,
          sortDirection: "desc"
        },
        { key: "activeDelegators", label: "# of delegators" },
        { key: "bakingSince", label: "Baking since" }
      ]
    };
  },
  computed: {
    ...mapState({
      publicBakers: state => state.accounts.publicBakers,
      count: state => state.accounts.counts,
      dateFormat: state => state.dateFormat
    }),
    bakersFormatted() {
      if (!this.publicBakers || this.publicBakers.length === 0) return [];

      return this.publicBakers.map(bakerObj => {
        return { accountId: bakerObj.accountId, ...bakerObj.bakerInfo };
      });
    }
  }
};
</script>
