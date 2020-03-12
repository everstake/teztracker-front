<template>
  <div>
    <div class="d-flex justify-content-between mb-4">
      <PerPageSelect @per-page="$_setPerPage" />
    </div>

    <b-table
      show-empty
      :items="protocols"
      :fields="fields"
      :current-page="currentPage"
      :per-page="0"
      borderless
      class="transactions-table table-responsive-md"
    >

      <template slot="startBlock" slot-scope="row">
        <b-link
          :to="{ name: 'block', params: { level: row.item.startBlock } }"
        >
          <span>{{ row.item.startBlock }}</span>
        </b-link>
      </template>

      <template slot="endBlock" slot-scope="row">
        <b-link
          :to="{ name: 'block', params: { level: row.item.endBlock } }"
        >
          <span>{{ row.item.endBlock }}</span>
        </b-link>
      </template>
    </b-table>

    <Pagination
      @change="$_handleCurrentPageChange"
      :total-rows="protocolsCount"
      :per-page="perPage"
    />
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import { SET_PROTOCOLS_COUNT } from "@/store/mutations.types";
import PerPageSelect from "@/components/partials/PerPageSelect";
import Pagination from "../partials/Pagination";
import handleCurrentPageChange from "@/mixins/handleCurrentPageChange";
import setPerPage from "@/mixins/setPerPage";

export default {
  name: "ProtocolsList",
  components: {
    PerPageSelect,
    Pagination
  },
  mixins: [handleCurrentPageChange, setPerPage],
  props: ["account"],
  data() {
    return {
      protocols: [],
      fields: [
        { key: "id", label: "Protocol" },
        { key: "hash", label: "Hash" },
        { key: "startBlock", label: "Starting Block" },
        { key: "endBlock", label: "Ending Block" }
      ]
    };
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
    ...mapMutations('period', [SET_PROTOCOLS_COUNT]),
    async reload(page = 1) {
      const props = {
        page,
        limit: this.perPage
      };

      const data = await this.$api.getProtocols(props);
      const result = data.data.map((protocol, index) => ({ ...protocol, id: index }));
      this[SET_PROTOCOLS_COUNT](data.data.length);
      this.protocols = result;
    }
  },
  computed: {
    ...mapState('period', {
      protocolsCount: state => state.counts.protocols
    })
  }
};
</script>
