<template>
  <div>
    <b-table
      show-empty
      stacked="md"
      :items="items"
      :fields="fields"
      :current-page="currentPage"
      :per-page="0"
      class="table table-borderless table-responsive-md"
    >
      <template slot="txhash" slot-scope="row">
        <b-link :to="{ name: 'tx', params: { txhash: row.item.operationGroupHash } }">
          <span>{{ row.item.operationGroupHash | longhash(35) }}</span>
        </b-link>
      </template>

      <template slot="block" slot-scope="row">
        <b-link :to="{ name: 'block', params: { level: row.item.level } }">
          <span>{{ row.item.blockHash | longhash(25) }}</span>
        </b-link>
      </template>

      <template slot="endorser" slot-scope="row">
        <b-link :to="{ name: 'account', params: { account: row.item.delegate } }">
          <span>{{ row.item.delegate | longhash(42) }}</span>
        </b-link>
      </template>

      <template slot="timestamp" slot-scope="row">
        <span>{{ row.item.timestamp | timeformat($constants.TIME_FORMAT) }}</span>
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
</template>

<script>
import { mapMutations } from "vuex";
import { SET_ENDORSEMENTS_COUNT } from "@/store/mutations.types";

export default {
  name: "EndorsementsList",
  props: ["block"],
  data() {
    return {
      perPage: this.$constants.PER_PAGE,
      currentPage: this.$constants.INITIAL_CURRENT_PAGE,
      pageOptions: this.$constants.PAGE_OPTIONS,
      endorsements: [],
      count: 0,
      fields: [
        { key: "txhash", label: "Endorsements Hash" },
        { key: "block", label: "Endorsed Block" },
        { key: "endorser", label: "Endorser" },
        { key: "timestamp", label: "Timestamp" }
      ]
    };
  },
  computed: {
    rows() {
      return this.count;
    },
    items() {
      return this.endorsements;
    },
    level() {
      return this.$route.params.level;
    }
  },
  watch: {
    currentPage: {
      async handler(value) {
        await this.reload({ page: value, block: this.level });
      }
    },
    level: {
      async handler(value) {
        await this.reload({ block: value });
      }
    }
  },
  async created() {
    this.reload({ block: this.level });
  },
  methods: {
    ...mapMutations('blocks', [SET_ENDORSEMENTS_COUNT]),
    async reload({ page = 1, block = 0 } = {}) {
      const props = {
        page,
        limit: this.perPage
      };
      let result;
      if (block > 0) {
        props.block_id = block;
        props.limit = this.$constants.ENDORSEMENTS_LIMIT;
        this.perPage = this.$constants.ENDORSEMENTS_LIMIT;
        result = await this.$api.getBlockEndorsements(props);
      } else {
        result = await this.$api.getEndorsements(props);
      }
      if (result.status !== this.$constants.STATUS_SUCCESS) {
        return this.$router.push({
          name: result.status
        });
      }
      this.count = result.count;
      this.endorsements = result.data;
      this[SET_ENDORSEMENTS_COUNT](this.count);
    }
  }
};
</script>

<style />
