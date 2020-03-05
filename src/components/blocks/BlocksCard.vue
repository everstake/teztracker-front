<template>
  <b-card no-body>
    <CardHeader>
      <template v-slot:left-content class="text">
        <h4 class="tz-title--bold">Blocks list</h4>
<!--        <Dropdown dropdownTitle="This year" />-->
      </template>
      <template v-slot:right-content class="text">
        <Counter show-line :count="count" />
        <div class="counter">
          <div class="tz_link">
            <router-link class="tz-dropdown-item" :to="{ name: 'blocks' }"
              >View all</router-link
            >
          </div>
        </div>
      </template>
    </CardHeader>

    <b-card-body>
      <b-table
        show-empty
        :items="blocks"
        :fields="fields"
        :current-page="currentPage"
        :per-page="0"
        borderless
        class="table-responsive-sm"
      >
        <template slot="timestamp" slot-scope="row">
          <span>
            {{ row.item.timestamp | timeformat($constants.TIME_FORMAT) }}
          </span>
        </template>

        <template slot="level" slot-scope="row">
          <b-link :to="{ name: 'block', params: { level: row.item.level } }">
            <span>{{ row.item.level }}</span>
          </b-link>
        </template>

        <template slot="baker" slot-scope="row">
          <b-link :to="{ name: 'baker', params: { baker: row.item.baker } }">
            <span>{{ row.item.baker | longhash(42) }}</span>
          </b-link>
        </template>
      </b-table>

      <PaginationWithCustomAction
        :total-rows="Number(this.count)"
        :per-page="perPage"
        action="BLOCKS_GET"
      />
    </b-card-body>
  </b-card>
</template>

<script>
import { mapState } from "vuex";
import Pagination from "../partials/Pagination";
import CardHeader from "../partials/CardHeader";
// import Dropdown from "../partials/Dropdown";
import Counter from "../partials/Counter";

import withCustomAction from "../partials/withCustomAction";
const PaginationWithCustomAction = withCustomAction(
  Pagination,
  "blocks",
  "GET_BLOCKS"
);

export default {
  name: "BlocksCard",
  components: {
    CardHeader,
    // Dropdown,
    Counter,
    PaginationWithCustomAction
  },
  data() {
    return {
      perPage: this.$constants.PER_PAGE,
      currentPage: this.$constants.INITIAL_CURRENT_PAGE,
      fields: [
        { key: "timestamp", label: "Time" },
        { key: "level", label: "Block ID" },
        { key: "baker", label: "Baker" }
      ]
    };
  },
  computed: {
    ...mapState("blocks", {
      count: state => state.counts.blocks,
      blocks: state => state.blocks
    })
  }
};
</script>
