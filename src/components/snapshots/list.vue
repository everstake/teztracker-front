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
        <b-link :to="{ name: 'block', params: { level: row.item.snapshot_block } }">
          <span>{{ row.item.snapshot_block }}</span>
        </b-link>
      </template>

      <template slot="rolls" slot-scope="row">
        <span>{{ row.item.rolls }}</span>
      </template>
    </b-table>

    <div class="pagination-block">
      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        align="right"
        first-text
        prev-text="Prev"
        next-text="Next"
        last-text
      ></b-pagination>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { ACTIONS } from "../../store";

export default {
  name: "Snapshots",
  data() {
    return {
      perPage: 6,
      currentPage: 1,
      pageOptions: [10, 15, 20, 25, 30],
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
  async mounted() {
    await this.reload();
  },
  methods: {
    async reload(page = 1) {
      const props = {
        page,
        limit: this.perPage
      };
      const data = await this.$store.getters.API.getSnapshots(props);
      console.log(data);
      this.snapshots = data.data;
      this.count = data.count;
      this.$store.commit(ACTIONS.SET_SNAPSHOTS_COUNT, this.count);
    }
  }
};
</script>

<style lang='scss' scoped>
@import "../../styles/scss/common";

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
