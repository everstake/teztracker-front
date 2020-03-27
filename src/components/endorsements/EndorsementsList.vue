<template>
  <div>
    <div
      class="d-flex justify-content-between mb-2"
      v-if="!isBlockEndorsements"
    >
      <PerPageSelect @per-page="$_setPerPage" />
    </div>

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
          {{ row.item.operationGroupHash | longhash(35) }}
        </b-link>
      </template>

      <template slot="block" slot-scope="row">
        <b-link :to="{ name: 'block', params: { level: row.item.level } }">
          {{ row.item.level | formatInteger }}
        </b-link>
      </template>

      <template slot="endorser" slot-scope="row">
        <b-link
          :to="{ name: 'account', params: { account: row.item.delegate } }"
        >
          {{ row.item.delegateName || row.item.delegate | longhash(42) }}
        </b-link>
      </template>

      <template slot="timestamp" slot-scope="row">
        {{ row.item.timestamp | timeformat(dateFormat) }}
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
import { mapState, mapMutations } from "vuex";
import { SET_ENDORSEMENTS_COUNT } from "@/store/mutations.types";
import PerPageSelect from "@/components/partials/PerPageSelect";
import Pagination from "../partials/Pagination";
import handleCurrentPageChange from "@/mixins/handleCurrentPageChange";
import setPerPage from "@/mixins/setPerPage";

export default {
  name: "EndorsementsList",
  props: {
    blockHash: {
      type: String,
      default: ""
    }
  },
  components: {
    PerPageSelect,
    Pagination
  },
  mixins: [handleCurrentPageChange, setPerPage],
  data() {
    return {
      endorsements: [],
      count: 0,
      fields: [
        { key: "endorser", label: "Endorser" },
        { key: "block", label: "Endorsed Block" },
        { key: "timestamp", label: "Timestamp" },
        { key: "txhash", label: "Endorsement hash" }
      ]
    };
  },
  computed: {
    ...mapState("app", {
      dateFormat: state => state.dateFormat
    }),
    level() {
      return this.$route.params.level;
    },
    isBlockEndorsements() {
      return this.level > 0;
    }
  },
  watch: {
    currentPage: {
      async handler(value) {
        await this.reload({ page: value, block: this.blockHash });
      }
    },
    blockHash: {
      async handler(value) {
        if (this.isBlockEndorsements) {
          await this.reload({ block: value });
        }
      }
    },
    perPage: {
      async handler() {
        if (!this.isBlockEndorsements) {
          await this.reload({ block: this.blockHash });
        }
      }
    }
  },
  async created() {
    if (this.isBlockEndorsements) {
      this.perPage = this.$constants.ENDORSEMENTS_LIMIT;
    } else {
      this.perPage = this.$constants.PER_PAGE;
      await this.reload({ block: this.blockHash });
    }
  },
  methods: {
    ...mapMutations("blocks", [SET_ENDORSEMENTS_COUNT]),
    async reload({ page = 1, block = 0 } = {}) {
      const props = {
        page,
        limit: this.perPage
      };
      let result;
      if (this.isBlockEndorsements) {
        props.block_id = block;
        // TODO: Refactor API service
        delete props.page;
        result = await this.$api.getEndorsements(props);
      } else {
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
