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
      <template slot="account" slot-scope="row">
        <b-link
          :to="{ name: 'account', params: { account: row.item.accountId } }"
        >
          <span>{{ row.item.accountId | longhash(35) }}</span>
        </b-link>
      </template>
      <template slot="amount" slot-scope="row">
        <span>{{ row.item.balance | tezos }}</span>
      </template>
    </b-table>
    <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      align="right"
      first-text
      prev-text="Prev"
      next-text="Next"
      last-text
    ></b-pagination>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { GET_ACCOUNTS } from "@/store/actions.types";

export default {
  name: "Accounts",
  props: {},
  data() {
    return {
      perPage: this.$constants.PER_PAGE,
      currentPage: this.$constants.INITIAL_CURRENT_PAGE,
      pageOptions: this.$constants.PAGE_OPTIONS,
      fields: [
        { key: "account", label: "Account" },
        { key: "amount", label: "Amount" }
      ]
    };
  },
  computed: {
    ...mapState('accounts', {
      accounts: state => state.accounts,
      count: state => state.counts
    }),
    rows() {
      return this.count.accounts;
    },
    items() {
      return this.accounts;
    }
  },
  watch: {
    currentPage: {
      async handler(value) {
        await this[GET_ACCOUNTS]({
          page: value,
          limit: this.perPage
        });
      }
    }
  },
  methods: {
    ...mapActions('accounts', [GET_ACCOUNTS])
  },
  async created() {
    await this[GET_ACCOUNTS]();
  }
};
</script>

<style scoped></style>
