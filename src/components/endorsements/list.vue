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
        <span>{{ row.item.timestamp | timeformat("HH:mm:ss DD.MM.YY") }}</span>
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
import { mapState } from "vuex";
import { ACTIONS } from "../../store";
import _ from "lodash";
let i = 0;
export default {
  name: "Endorsements",
  props: ["block"],
  data() {
    return {
      perPage: 10,
      currentPage: 1,
      pageOptions: [10, 15, 20, 25, 30],
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
    async reload({ page = 1, block = 0 } = {}) {
      const props = {
        page,
        limit: this.perPage
      };
      let result;
      if (block > 0) {
        props.block_id = block;
        props.limit = 32;
        this.perPage = 32;
        result = await this.$store.getters.API.getBlockEndorsements(props);
      } else {
        result = await this.$store.getters.API.getEndorsements(props);
      }
      if (result.status !== 200) {
        return this.$router.push({
          name: result.status
        });
      }
      this.count = result.count;
      this.endorsements = result.data;
      this.$store.commit(ACTIONS.SET_ENDORSEMENTS_COUNT, this.count);
    }
  }
};
</script>
<style />
