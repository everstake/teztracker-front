<template>
  <div>
    <b-table
      show-empty
      :items="endorsements"
      :fields="fields"
      :current-page="currentPage"
      :per-page="0"
      borderless
      class="transactions-table table-responsive-md"
    >
      <template slot="txhash" slot-scope="row">
        <b-link
          :to="{ name: 'tx', params: { txhash: row.item.operationGroupHash } }"
        >
          <span>{{ row.item.operationGroupHash | longhash(35) }}</span>
        </b-link>
      </template>

      <template slot="block" slot-scope="row">
        <b-link :to="{ name: 'block', params: { level: row.item.level } }">
          <span>{{ row.item.level }}</span>
        </b-link>
      </template>

      <template slot="endorser" slot-scope="row">
        <b-link
          :to="{ name: 'account', params: { account: row.item.delegate } }"
        >
          <span>{{ row.item.delegate | longhash(42) }}</span>
        </b-link>
      </template>

      <template slot="timestamp" slot-scope="row">
        <span>{{ row.item.timestamp | timeformat($constants.TIME_FORMAT) }}</span>
      </template>
    </b-table>

    <Pagination
      @change="$_handleCurrentPageChange"
      :total-rows="count"
      :per-page="perPage"
    />
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { SET_ENDORSEMENTS_COUNT } from "@/store/mutations.types";
import Pagination from "../partials/Pagination";
import handleCurrentPageChange from "@/mixins/handleCurrentPageChange";

export default {
  name: "EndorsementsList",
  components: {
    Pagination
  },
  mixins: [handleCurrentPageChange],
  props: ["block"],
  data() {
    return {
      perPage: this.$constants.PER_PAGE,
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
        // TODO: Refactor API service
        delete props.limit;
        delete props.page;
        this.perPage = this.$constants.ENDORSEMENTS_LIMIT;
        result = await this.$api.getBlockEndorsements(props);
      } else {
        this.perPage = this.$constants.PER_PAGE;
        result = await this.$api.getEndorsements(props);
      }
      if (result.status !== this.$constants.STATUS_SUCCESS) {
        return this.$router.replace({
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
