<template>
  <div>
    <div class="d-flex justify-content-between mb-2">
      <PerPageSelect @per-page="$_setPerPage" :hide="true" />
    </div>

    <b-table
      show-empty
      :items="blocks"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      borderless
      class="transactions-table table-responsive-md"
    >
      <template slot="level" slot-scope="row">
        <b-link :to="{ name: 'block', params: { level: row.item.level } }">
          {{ row.item.level | formatInteger }}
        </b-link>
      </template>

      <template slot="timestamp" slot-scope="row">
        {{ row.item.timestamp | timeformat(dateFormat) }}
      </template>

      <template slot="baker" slot-scope="row">
        <b-link :to="{ name: 'baker', params: { baker: row.item.baker } }">
          {{ row.item.bakerName || row.item.baker | longhash(42) }}
        </b-link>
      </template>
  
      <template slot="number_of_operations" slot-scope="row">
        {{ row.item.number_of_operations | formatInteger }}
      </template>

      <template slot="volume" slot-scope="row">
        {{ row.item.volume | tezos }}
      </template>

      <template slot="fees" slot-scope="row">
        {{ row.item.fees | tezos }}
      </template>
      <template slot="endorsements" slot-scope="row">
        {{ row.item.endorsements | formatInteger }}
      </template>
    </b-table>

    <PaginationWithCustomAction
      :total-rows="Number(this.count.blocks)"
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
  "blocks",
  "GET_BLOCKS"
);

export default {
  name: "BlocksList",
  components: {
    PerPageSelect,
    PaginationWithCustomAction
  },
  mixins: [setPerPage],
  props: {
    isTableComplete: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      currentPage: this.$constants.INITIAL_CURRENT_PAGE,
      fields: [
        { key: "level", label: "Block ID" },
        { key: "timestamp", label: "Timestamp" },
        { key: "baker", label: "Baker" },
        {
          key: "priority",
          label: "Priority",
          class: !this.isTableComplete ? "d-none" : ""
        },
        {
          key: "number_of_operations",
          label: "# of operations",
          class: !this.isTableComplete ? "d-none" : ""
        },
        {
          key: "volume",
          label: "Volume",
          class: !this.isTableComplete ? "d-none" : ""
        },
        {
          key: "fees",
          label: "Fees",
          class: !this.isTableComplete ? "d-none" : ""
        },
        {
          key: "endorsements",
          label: "# of endorsements",
          class: !this.isTableComplete ? "d-none" : ""
        }
      ]
    };
  },
  computed: {
    ...mapState({
      blocks: state => state.blocks.blocks,
      count: state => state.blocks.counts,
      dateFormat: state => state.app.dateFormat
    })
  }
};
</script>
