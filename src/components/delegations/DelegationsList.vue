<template>
  <div>
    <div class="d-flex justify-content-between mb-2">
      <PerPageSelect @per-page="$_setPerPage" />
    </div>

    <b-table
      show-empty
      :items="delegations"
      :fields="fields"
      :current-page="currentPage"
      :per-page="0"
      borderless
      class="transactions-table table-responsive-md"
      :tbody-tr-class="$_defineRowClass"
    >
      <template slot="txhash" slot-scope="row">
        <b-link
          :to="{ name: 'tx', params: { txhash: row.item.operationGroupHash } }"
        >
          {{ row.item.operationGroupHash | longhash(35) }}
        </b-link>
      </template>

      <template slot="from" slot-scope="row">
        <b-link :to="{ name: 'account', params: { account: row.item.source } }">
          {{ row.item.sourceName || row.item.source | longhash(20) }}
        </b-link>
      </template>

      <template slot="to" slot-scope="row">
        <b-link
          :to="{ name: 'account', params: { account: row.item.delegate } }"
          v-if="row.item.delegateName || row.item.delegate"
        >
          {{ row.item.delegateName || row.item.delegate | longhash(20) }}
        </b-link>
        <span v-else>unset</span>
      </template>

      <template slot="level" slot-scope="row">
        <b-link :to="{ name: 'block', params: { level: row.item.blockLevel } }">
          {{ row.item.blockLevel | formatInteger }}
        </b-link>
      </template>

      <template slot="timestamp" slot-scope="row">
        {{ row.item.timestamp | timeformat(dateFormat) }}
      </template>

      <template slot="fee" slot-scope="row">
        {{ row.item.fee | tezos }}
      </template>
    </b-table>

    <Pagination
      @change="$_handleCurrentPageChange"
      v-model="currentPage"
      :total-rows="count"
      :per-page="perPage"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { SET_DELEGATIONS_COUNT } from "@/store/mutations.types";
import PerPageSelect from "@/components/partials/PerPageSelect";
import Pagination from "../partials/Pagination";
import handleCurrentPageChange from "@/mixins/handleCurrentPageChange";
import setPerPage from "@/mixins/setPerPage";
import defineRowClass from "@/mixins/defineRowClass";

export default {
  name: "DelegationsList",
  components: {
    PerPageSelect,
    Pagination
  },
  props: ["account"],
  mixins: [handleCurrentPageChange, setPerPage, defineRowClass],
  data() {
    return {
      delegations: [],
      count: 0,
      fields: [
        { key: "level", label: "Block ID" },
        { key: "txhash", label: "Delegations Hash" },
        { key: "from", label: "From" },
        { key: "to", label: "To" },
        { key: "fee", label: "Fees" },
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
    ...mapMutations('operations', [SET_DELEGATIONS_COUNT]),
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
      const data = await this.$api.getDelegations(props);
      if (data.status !== this.$constants.STATUS_SUCCESS) {
        return this.$router.replace({
          name: data.status
        });
      }
      this.delegations = data.data;
      this.count = data.count;
      this[SET_DELEGATIONS_COUNT](this.count);
    }
  }
};
</script>
