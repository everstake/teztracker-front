<template>
  <div>
    <b-table
      show-empty
      stacked="md"
      :items="items"
      :fields="fields"
      :current-page="currentPage"
      :per-page="0"
      class="transactions-table table table-borderless table-responsive-md"
    >
      <template slot="contract" slot-scope="row">
        <b-link :to="{ name: 'account', params: { account: row.item.accountId } }">
          <span>{{ row.item.accountId | longhash(35) }}</span>
        </b-link>
      </template>
      <template slot="manager" slot-scope="row">
          <span>{{ row.item.manager | longhash(35) }}</span>
      </template>
      <template slot="delegate" slot-scope="row">
        <span>{{ row.item.delegateValue | longhash(20) }}</span>
      </template>
      <template slot="balance" slot-scope="row">
        <span>{{ row.item.balance | tezos }}</span>
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
import { mapState, mapActions } from "vuex";
import { GET_CONTRACTS } from "@/store/actions.types";

export default {
  name: "Contracts",
  props: {},
  data() {
    return {
      perPage: this.$constants.PER_PAGE,
      currentPage: this.$constants.INITIAL_CURRENT_PAGE,
      pageOptions: this.$constants.PAGE_OPTIONS,
      fields: [
        { key: "contract", label: "Contract" },
        { key: "manager", label: "Manager" },
        { key: "delegate", label: "Delegate" },
        { key: "balance", label: "Balance" },
      ]
    };
  },
  computed: {
    ...mapState('accounts', {
      contracts: state => state.contracts,
      count: state => state.counts
    }),
    rows() {
      return this.count.contracts;
    },
    items() {
      return this.contracts;
    }
  },
  watch: {
    currentPage: {
      async handler(value) {
        await this[GET_CONTRACTS]({
          page: value,
          limit: this.perPage
        });
      }
    }
  },
  methods: {
    ...mapActions('accounts', [GET_CONTRACTS])
  },
  async created() {
    await this[GET_CONTRACTS]();
  }
};
</script>

<style scoped></style>
