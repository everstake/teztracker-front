<template>
  <div class="card">
    <TzCardHeader>
      <template v-slot:left-content class="text">
        <h4 class="tz-title--bold">Blocks list</h4>
        <TzDropdown dropdownTitle="this year" />
      </template>
      <template v-slot:right-content class="text">
        <TzCounter :count="count" />
        <div class="counter">
          <div class="tz_link">
            <router-link class="tz-dropdown-item" :to="{ name: 'blocks' }"
              >View all</router-link
            >
          </div>
        </div>
      </template>
    </TzCardHeader>

    <div class="card-body">
      <b-table
        show-empty
        stacked="md"
        :items="items"
        :fields="fields"
        :current-page="currentPage"
        :per-page="0"
        class="table table-borderless table-responsive-sm"
      >
        <template slot="timestamp" slot-scope="row">
          <span>{{
            row.item.timestamp | timeformat("HH:mm:ss DD.MM.YY")
          }}</span>
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
        :total-rows="rows"
        :per-page="perPage"
        align="right"
        first-text
        prev-text="Prev"
        next-text="Next"
        last-text
        action="BLOCKS_GET"
      ></PaginationWithCustomAction>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import TzPagination from "../common/_tz_pagination";
import TzCardHeader from "../common/tz_card_header";
import TzDropdown from "../common/tz_dropdown";
import TzCounter from "../common/tz_counter";

import withCustomAction from "../common/withCustomAction";
const PaginationWithCustomAction = withCustomAction(TzPagination, "BLOCKS_GET");

export default {
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
        { key: "baker", label: "Baker" }
      ]
    };
  },
  name: "Blocks_short",
  props: {},
  computed: {
    ...mapState({
      blocks: state => state.blocks,
      count: state => state.counts.blocks
    }),
    rows() {
      return Number(this.count);
    },
    items() {
      return this.blocks;
    }
  },
  components: {
    TzCardHeader,
    TzDropdown,
    TzCounter,
    PaginationWithCustomAction
  }
};
</script>
<style />
