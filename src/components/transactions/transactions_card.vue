<template>
  <div class="card">
    <div class="card-header">
      <div class="title">
        <h3>
          <span class="text">Transaction list</span>
        </h3>
        <div class="counter">
          <!--            <span class="line"></span>-->
          <h3 class="counter-text">{{ count | bignum }}</h3>
        </div>
      </div>
    </div>

    <div class="card-body">
      <b-table
        show-empty
        stacked="md"
        :items="items"
        :fields="fields"
        :per-page="0"
        class="table table-borderless table-responsive-sm"
      >
        <template slot="timestamp" slot-scope="row">
          <span>
            {{
            row.item.timestamp | timeformat("HH:mm:ss DD.MM.YY")
            }}
          </span>
        </template>

        <template slot="level" slot-scope="row">
          <b-link :to="{ name: 'block', params: { level: row.item.blockLevel } }">
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
      <TzPagination
        :totalRows="rows"
        :perPage="perPage"
        align="right"
        :prevText="'Prev'"
        :nextText="'Next'"
        lastText
        firstText
        action="TRANSACTIONS_GET"
      ></TzPagination>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import TzPagination from "../common/_tz_pagination";

export default {
  name: "Transactions",
  props: {},
  mounted() {},
  data() {
    return {
      perPage: 10,
      currentPage: 1,
      fields: [
        { key: "timestamp", label: "Time", sortable: true },
        {
          key: "level",
          label: "Block ID",
          sortable: true,
          sortDirection: "desc"
        },
        { key: "baker", label: "Transaction hash" }
      ]
    };
  },
  computed: {
    ...mapState({
      transactions: state => state.txs,
      count: state => state.counts.txs
    }),
    rows() {
      return this.count;
    },
    items() {
      return this.transactions;
    }
  },
  components: {
    TzPagination
  }
};
</script>

<style lang="scss" scoped>
// TODO: aliases
@import "../../styles/scss/common";

.line {
  display: block;
  float: left;
  width: 30px;
  height: 16px;
  margin-right: 0.5rem;
  border-bottom: 1px solid #9ea0a5;
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
.pagination-block {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  width: 100%;
  @include for-tablet-portrait-up {
    justify-content: flex-end;
    align-items: center;
    position: relative;
    overflow: hidden;
    width: 100%;
  }
}
</style>
