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
      <template slot="cycle" slot-scope="row">
        <span>{{ row.item.cycle }}</span>
      </template>

      <template slot="level" slot-scope="row">
        <b-link
          :to="{ name: 'block', params: { level: row.item.snapshot_block } }"
        >
          <span>{{ row.item.snapshot_block }}</span>
        </b-link>
      </template>

      <template slot="rolls" slot-scope="row">
        <span>{{ row.item.rolls }}</span>
      </template>
    </b-table>

    <TzPagination
      @change="_handleChange"
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      align="right"
      first-text
      prev-text="Prev"
      next-text="Next"
      last-text
    />
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import { SET_SNAPSHOTS_COUNT } from "@/store/mutations.types";
import TzPagination from "../common/_tz_pagination";

export default {
  name: "SnapshotsList",
  components: {
    TzPagination
  },
  data() {
    return {
      perPage: this.$constants.PER_PAGE_SNAPSHOTS,
      currentPage: this.$constants.INITIAL_CURRENT_PAGE,
      pageOptions: this.$constants.PAGE_OPTIONS,
      snapshots: [],
      count: 0,
      fields: [
        { key: "cycle", label: "Cycles" },
        { key: "level", label: "Block ID" },
        { key: "rolls", label: "Amount of rolls" }
      ]
    };
  },
  computed: {
    rows() {
      return this.count;
    },
    items() {
      return this.snapshots;
    }
  },
  watch: {
    currentPage: {
      async handler(value) {
        await this.reload(value);
      }
    }
  },
  async created() {
    await this.reload();
  },
  methods: {
    ...mapMutations('blocks', [SET_SNAPSHOTS_COUNT]),
    _handleChange(page) {
      this.currentPage = page;
    },
    async reload(page = 1) {
      const props = {
        page,
        limit: this.perPage
      };
      const data = await this.$api.getSnapshots(props);

      this.snapshots = data.data;
      this.count = data.count;
      this[SET_SNAPSHOTS_COUNT](this.count);
    }
  }
};
</script>
