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
import { mapState } from "vuex";
import { ACTIONS } from "../../store";

export default {
  name: "Contracts",
  props: {},
  data() {
    return {
      perPage: 10,
      currentPage: 1,
      pageOptions: [10, 15, 20, 25, 30],
      fields: [
        { key: "contract", label: "Contract" },
        { key: "manager", label: "Manager" },
        { key: "delegate", label: "Delegate" },
        { key: "balance", label: "Balance" },
      ]
    };
  },
  computed: {
    ...mapState({
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
        await this.$store.dispatch(ACTIONS.CONTRACTS_GET, {
          page: value,
          limit: this.perPage
        });
      }
    }
  },
  async mounted() {
    await this.$store.dispatch(ACTIONS.CONTRACTS_GET);
  }
};
</script>

<style scoped></style>
