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
      <template slot="baker" slot-scope="row">
        <b-link :to="{ name: 'baker', params: { baker: row.item.accountId } }">
          <span>{{ row.item.accountId | longhash(35) }}</span>
        </b-link>
      </template>
      <template slot="blocks" slot-scope="row">
        <span>{{ row.item.blocks }}</span>
      </template>
      <template slot="assets" slot-scope="row">
        <span>{{ row.item.stakingBalance | tezos }}</span>
      </template>
      <template slot="endorsement" slot-scope="row">
        <span>{{ row.item.endorsements }}</span>
      </template>
    </b-table>
    <PaginationWithCustomAction
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      align="right"
      first-text
      prev-text="Prev"
      next-text="Next"
      last-text
    ></PaginationWithCustomAction>
  </div>
</template>
<script>
import { mapState } from "vuex";
import TzPagination from "../common/_tz_pagination";
import withCustomAction from "../common/withCustomAction";
const PaginationWithCustomAction = withCustomAction(TzPagination, "BAKERS_GET");
export default {
  name: "Bakers",
  props: {},
  data() {
    return {
      perPage: 10,
      currentPage: 1,
      pageOptions: [10, 15, 20, 25, 30],
      fields: [
        { key: "baker", label: "Baker" },
        { key: "blocks", label: "Blocks" },
        { key: "assets", label: "Staked assets" },
        { key: "endorsement", label: "Endorsement" }
      ]
    };
  },
  computed: {
    ...mapState({
      bakers: state => state.bakers,
      count: state => state.counts
    }),
    rows() {
      return this.count.bakers;
    },
    items() {
      return this.bakers;
    }
  },
  components: {
    PaginationWithCustomAction
  }
};
</script>
