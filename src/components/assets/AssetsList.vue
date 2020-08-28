<template>
  <div>
    <div class="d-flex justify-content-between mb-2">
      <PerPageSelect @per-page="$_setPerPage" />
    </div>

    <b-table
      show-empty
      :items="assets"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      borderless
      class="transactions-table table-responsive-md"
    >
      <template slot="account_id" slot-scope="row">
        <router-link
          :to="{ name: 'asset', params: { id: row.item.account_id } }"
        >
          <span v-if="row.item.name">
            {{ row.item.name }}
          </span>
          <span v-else>{{row.item.account_id | longhash(15) }}</span>
        </router-link>
      </template>
      <template slot="manager" slot-scope="row">
        <b-link
          v-if="row.item.manager"
          :to="{ name: 'account', params: { account: row.item.manager } }"
        >
          <span>{{ row.item.manager | longhash(15) }}</span>
        </b-link>
        <span v-else>----</span>
      </template>
      <template slot="name" slot-scope="row">
        <span v-if="row.item.name">{{ row.item.name }}</span>
        <span v-else>----</span>
      </template>
      <template slot="balance" slot-scope="row">
        <span>{{ row.item.balance | tezos(getAssetCurrency(row.item.name)) }}</span>
      </template>
      <template slot="created_at" slot-scope="row">
        <span>{{ row.item.created_at | timeformat(dateFormat) }}</span>
      </template>
    </b-table>

    <PaginationWithCustomAction
      v-model="currentPage"
      :total-rows="count.assets"
      :per-page="perPage"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import PerPageSelect from "@/components/partials/PerPageSelect";
import Pagination from "../partials/Pagination";
import setPerPage from "@/mixins/setPerPage";

import withCustomAction from "../partials/withCustomAction";
const PaginationWithCustomAction = withCustomAction(
  Pagination,
  "accounts",
  "GET_ASSETS"
);

export default {
  name: "AssetsList",
  components: {
    PerPageSelect,
    PaginationWithCustomAction
  },
  mixins: [setPerPage],
  props: ['account'],
  data() {
    return {
      currentPage: this.$constants.INITIAL_CURRENT_PAGE,
      fields: [
        { key: "id", label: this.$t("common.ordinalNumber") },
        { key: "account_id", label: this.$t("common.contractName") },
        { key: "manager", label: this.$t("common.manager") },
        {
          key: "balance",
          label: this.$t("common.balance"),
          sortable: true,
          sortDirection: "desc"
        },
        { key: "created_at", label: this.$t("accSingle.created") }
      ]
    };
  },
  computed: {
    ...mapState("accounts", {
      assets: state => state.assets,
      count: state => state.counts
    }),
    ...mapState("app", {
      dateFormat: state => state.dateFormat
    })
  },
  methods: {
    getAssetCurrency(asset) {
      if (!asset) return 'XTZ';

      const assets = [
        { name: 'tzBTC', currency: 'tzBTC' },
        { name: 'Staker DAO', currency: 'STKR' },
        { name: 'USDtz', currency: 'USDtz' },
      ];

      const findedAsset = assets.find(({ name, currency }) => {
        if (asset === name) return currency;
      });

      return findedAsset.currency;
    }
  }
};
</script>
