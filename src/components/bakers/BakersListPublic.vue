<template>
  <div>
    <div class="d-flex justify-content-between mb-4">
      <PerPageSelect @per-page="$_setPerPage" />
    </div>

    <b-table
      show-empty
      :items="bakersFormatted"
      :fields="fields"
      :current-page="currentPage"
      :per-page="0"
      borderless
      class="transactions-table table-responsive-md"
    >
      <template slot="accountId" slot-scope="row">
        <b-link :to="{ name: 'baker', params: { baker: row.item.accountId } }">
          {{ row.item.name || row.item.accountId | longhash(35) }}
        </b-link>
      </template>
      <template slot="stakingCapacity" slot-scope="row">
        {{ row.item.stakingCapacity | tezosCapacity }}
      </template>
      <template slot="fee" slot-scope="row"> {{ row.item.fee }} % </template>
      <template slot="stakingBalance" slot-scope="row">
        {{ row.item.stakingBalance | tezos }}
      </template>
      <template slot="bakingSince" slot-scope="row">
        {{ row.item.bakingSince | timeformat(dateFormat) }}
      </template>
    </b-table>

    <Pagination
      :total-rows="count.publicBakers"
      :per-page="perPage"
      @change="$_handleCurrentPageChange"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { GET_PUBLIC_BAKERS } from "@/store/actions.types";
import PerPageSelect from "@/components/partials/PerPageSelect";
import Pagination from "../partials/Pagination";
import handleCurrentPageChange from "@/mixins/handleCurrentPageChange";
import setPerPage from "@/mixins/setPerPage";

export default {
  name: "BakersListPublic",
  components: {
    PerPageSelect,
    Pagination
  },
  mixins: [handleCurrentPageChange, setPerPage],
  data() {
    return {
      currentPage: this.$constants.INITIAL_CURRENT_PAGE,
      fields: [
        { key: "position", label: "#" },
        { key: "accountId", label: "Baker" },
        { key: "stakingCapacity", label: "Capacity" },
        { key: "fee", label: "Fee" },
        { key: "stakingBalance", label: "Total balance" },
        { key: "rolls", label: "Rolls" },
        {
          key: "blocks",
          label: "Blocks",
          sortable: true,
          sortDirection: "desc"
        },
        {
          key: "endorsements",
          label: "Endorsements",
          sortable: true,
          sortDirection: "desc"
        },
        { key: "activeDelegators", label: "# of delegators" },
        { key: "bakingSince", label: "Baking since" }
      ]
    };
  },
  computed: {
    ...mapState({
      publicBakers: state => state.accounts.publicBakers,
      count: state => state.accounts.counts,
      dateFormat: state => state.app.dateFormat
    }),
    offset() {
      if (!this.perPage) return 0;

      return this.currentPage * this.perPage - this.perPage;
    },
    bakersFormatted() {
      if (!this.publicBakers || this.publicBakers.length === 0) return [];

      return this.publicBakers.map((bakerObj, index) => {
        return {
          position: index + 1 + this.offset,
          accountId: bakerObj.accountId,
          ...bakerObj.bakerInfo
        };
      });
    }
  },
  watch: {
    currentPage: {
      immediate: true,
      handler(value) {
        this.load(value, this.perPage);
      }
    },
    perPage: {
      handler(value) {
        this.currentPage = 1;
        this.load(1, value);
      }
    }
  },
  methods: {
    ...mapActions("accounts", [GET_PUBLIC_BAKERS]),
    async load(page = 1, limit = 10) {
      await this[GET_PUBLIC_BAKERS]({ page, limit });
    }
  }
};
</script>
