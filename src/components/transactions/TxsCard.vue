<template>
  <b-card no-body>
    <CardHeader>
      <template v-slot:left-content class="text">
        <h4 class="tz-title--bold">Transaction list</h4>
<!--        <Dropdown dropdownTitle="This year" />-->
      </template>
      <template v-slot:right-content class="text">
        <Counter :count="count" />
        <div class="counter">
          <div class="tz_link">
            <router-link class="tz-dropdown-item" :to="{ name: 'txs' }"
              >View all</router-link
            >
          </div>
        </div>
      </template>
    </CardHeader>

    <b-card-body>
      <b-table
        show-empty
        :items="transactions"
        :fields="fields"
        :per-page="0"
        borderless
        class="table-responsive-sm"
      >
        <template slot="timestamp" slot-scope="row">
          <span>{{ row.item.timestamp | timeformat($constants.TIME_FORMAT) }}</span>
        </template>

        <template slot="level" slot-scope="row">
          <b-link
            :to="{ name: 'block', params: { level: row.item.blockLevel } }"
          >
            <span>{{ row.item.blockLevel }}</span>
          </b-link>
        </template>

        <template slot="baker" slot-scope="row">
          <b-link
            :to="{
              name: 'tx',
              params: { txhash: row.item.operationGroupHash }
            }"
          >
            <span>{{ row.item.operationGroupHash | longhash(35) }}</span>
          </b-link>
        </template>
      </b-table>

      <PaginationWithCustomAction
        :total-rows="count"
        :per-page="perPage"
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
  "operations",
  "GET_TRANSACTIONS"
);

export default {
  name: "TxsCard",
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
        { key: "baker", label: "Transaction hash" }
      ]
    };
  },
  computed: {
    ...mapState('operations', {
      transactions: state => state.txs,
      count: state => state.counts.txs
    })
  }
};
</script>

<style lang="scss" scoped>

.line {
  display: block;
  float: left;
  width: 30px;
  height: 16px;
  margin-right: 0.5rem;
  border-bottom: 1px solid $color-grey;
  opacity: 0.5;
}
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  h3 {
    line-height: 1;
  }
}
</style>
