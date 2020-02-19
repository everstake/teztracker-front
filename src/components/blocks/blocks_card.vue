<template>
  <div class="card">
    <div class="card-header">
      <div class="title">
        <h3>
          <span class="text">Blocks list</span>
          <div class="counter">
            <span class="line"></span>
            <span class="counter-text">{{ count | bignum }}</span>
          </div>
        </h3>
      </div>
    </div>

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
          <span>
            {{
            row.item.timestamp | timeformat("HH:mm:ss DD.MM.YY")
            }}
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
      <TzPagination
        :total-rows="rows"
        :per-page="perPage"
        align="right"
        first-text
        prev-text="Prev"
        next-text="Next"
        last-text
        action="BLOCKS_GET"
      ></TzPagination>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import TzPagination from "../common/_tz_pagination";

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
    TzPagination
  }
};
</script>
<style />
