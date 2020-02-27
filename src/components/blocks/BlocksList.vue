<template>
  <div>
    <b-table
      show-empty
      stacked="md"
      :items="items"
      :fields="fields"
      :current-page="currentPage"
      :per-page="0"
      class="table table-borderless table-responsive-sm"
    >
      <template slot="level" slot-scope="row">
        <b-link :to="{ name: 'block', params: { level: row.item.level } }">
          <span>{{ row.item.level }}</span>
        </b-link>
      </template>

      <template slot="timestamp" slot-scope="row">
        <span>{{
          row.item.timestamp | timeformat($constants.TIME_FORMAT)
        }}</span>
      </template>

      <template slot="baker" slot-scope="row">
        <b-link :to="{ name: 'baker', params: { baker: row.item.baker } }">
          <span>{{ row.item.baker | longhash(42) }}</span>
        </b-link>
      </template>

      <template slot="volume" slot-scope="row">
        <span>{{ row.item.volume | tezos }}</span>
      </template>

      <template slot="fees" slot-scope="row">
        <span>{{ row.item.fees | tezos }}</span>
      </template>
    </b-table>

    <PaginationWithCustomAction
      :total-rows="rows"
      :per-page="perPage"
    />
  </div>
</template>
<script>
import { mapState } from "vuex";
import TzPagination from "../common/_tz_pagination";

import withCustomAction from "../common/withCustomAction";
const PaginationWithCustomAction = withCustomAction(
  TzPagination,
  "blocks",
  "GET_BLOCKS"
);

export default {
  name: "BlocksList",
  components: {
    PaginationWithCustomAction
  },
  data() {
    return {
      perPage: this.$constants.PER_PAGE,
      currentPage: this.$constants.INITIAL_CURRENT_PAGE,
      pageOptions: this.$constants.PAGE_OPTIONS,
      fields: [
        {
          key: "level",
          label: "Block ID",
          sortable: true,
          sortDirection: "desc"
        },
        { key: "timestamp", label: "Timestamp" },
        { key: "baker", label: "Baker" },
        { key: "volume", label: "Volume" },
        { key: "fees", label: "Fees" }
      ]
    };
  },
  computed: {
    ...mapState("blocks", {
      blocks: state => state.blocks,
      count: state => state.counts
    }),
    rows() {
      return Number(this.count.blocks);
    },
    items() {
      return this.blocks;
    }
  }
};
</script>
