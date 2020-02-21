<template>
  <div class="card ml-2">
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
            row.item.timestamp | timeformat($constants.TIME_FORMAT)
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
      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        align="right"
        prev-text="Prev"
        next-text="Next"
        first-number
        last-number
      ></b-pagination>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { GET_BLOCKS } from "@/store/actions.types";
export default {
  name: "BlocksCard",
  data() {
    return {
      perPage: this.$constants.PER_PAGE,
      currentPage: this.$constants.INITIAL_CURRENT_PAGE,
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
  computed: {
    ...mapState('blocks', {
      count: state => state.counts.blocks,
      blocks: state => state.blocks
    }),
    rows() {
      return Number(this.count);
    },
    items() {
      return this.blocks;
    }
  },
  watch: {
    currentPage: {
      async handler(value) {
        await this[GET_BLOCKS]({
          page: value,
          perPage: this.perPage
        });
      }
    }
  },
  methods: {
    ...mapActions('blocks', [GET_BLOCKS])
  },
  async created() {
    await this[GET_BLOCKS]({
      page: this.currentPage,
      perPage: this.perPage
    });
  }
};
</script>
<style />
