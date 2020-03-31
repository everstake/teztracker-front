<template>
  <div>
    <div class="d-flex justify-content-between mb-2">
      <PerPageSelect @per-page="$_setPerPage" />
    </div>

    <b-table
      show-empty
      :items="double_endorsement"
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

      <template slot="level" slot-scope="row">
        <b-link :to="{ name: 'block', params: { level: row.item.blockLevel } }">
          {{ row.item.blockLevel | formatInteger }}
        </b-link>
      </template>

      <template slot="timestamp" slot-scope="row">
        {{ row.item.timestamp | timeformat(dateFormat) }}
      </template>
      <template slot="denounced_level" slot-scope="row">
        <b-link :to="{ name: 'block', params: { level: row.item.level } }">
          {{ row.item.level | formatInteger }}
        </b-link>
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
import { SET_DOUBLE_ENDORSEMENT_COUNT } from "@/store/mutations.types";
import PerPageSelect from "@/components/partials/PerPageSelect";
import Pagination from "../partials/Pagination";
import handleCurrentPageChange from "@/mixins/handleCurrentPageChange";
import setPerPage from "@/mixins/setPerPage";

export default {
  name: "DoubleEndorsementList",
  components: {
    PerPageSelect,
    Pagination
  },
  mixins: [handleCurrentPageChange, setPerPage],
  props: ["account"],
  data() {
    return {
      double_endorsement: [],
      count: 0,
      fields: [
        { key: "level", label: "Block ID" },
        { key: "txhash", label: "Origination Hash" },
        { key: "denounced_level", label: "Denounced Level" },
        { key: "timestamp", label: "Timestamp" }
      ]
    };
  },
  computed: {
    ...mapState("app", {
      dateFormat: state => state.dateFormat
    })
  },
  watch: {
    currentPage: {
      async handler(value) {
        await this.reload(value);
      }
    },
    async perPage() {
      await this.reload();
    }
  },
  async created() {
    await this.reload();
  },
  methods: {
    ...mapMutations('operations', [SET_DOUBLE_ENDORSEMENT_COUNT]),
    async reload(page = 1) {
      const props = {
        page,
        limit: this.perPage
      };
      if (this.block) {
        props.block_id = this.block.hash;
      }
      if (this.account) {
        props.account_id = this.account;
      }
      const data = await this.$api.getDoubleEndorsement(props);
      this.double_endorsement = data.data;
      this.count = data.count;
      this[SET_DOUBLE_ENDORSEMENT_COUNT](this.count);
    }
  }
};
</script>
