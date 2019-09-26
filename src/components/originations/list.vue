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
      <template slot="txhash" slot-scope="row">
        <b-link :to="{ name: 'tx', params: { txhash: row.item.operationGroupHash } }">
          <span>{{ row.item.operationGroupHash | longhash(35) }}</span>
        </b-link>
      </template>

      <template slot="from" slot-scope="row">
        <b-link :to="{ name: 'account', params: { account: row.item.source } }">
          <span>{{ row.item.source | longhash(20) }}</span>
        </b-link>
      </template>

      <template slot="level" slot-scope="row">
        <b-link :to="{ name: 'block', params: { level: row.item.blockLevel } }">
          <span>{{ row.item.blockLevel }}</span>
        </b-link>
      </template>

      <template slot="timestamp" slot-scope="row">
        <span>{{ row.item.timestamp | timeformat("hh:mm:ss DD.MM.YY") }}</span>
      </template>

      <template slot="fee" slot-scope="row">
        <span>{{ row.item.fee | tezos }}</span>
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
import { mapState } from "vuex";
import { ACTIONS, api } from "../../store";
export default {
  name: "Originations",
  props: ["account"],
  data() {
    return {
      perPage: 10,
      currentPage: 1,
      pageOptions: [10, 15, 20, 25, 30],
      originations: [],
      count: 0,
      fields: [
        { key: "txhash", label: "Origination Hash" },
        { key: "from", label: "From" },
        { key: "level", label: "Block ID" },
        { key: "timestamp", label: "Timestamp" },
        { key: "fee", label: "Fees" }
      ]
    };
  },
  computed: {
    rows() {
      return this.count;
    },
    items() {
      return this.originations;
    }
  },
  watch: {
    currentPage: {
      async handler(value) {
        await this.reload(value);
      }
    }
  },
  async mounted() {
    await this.reload();
  },
  methods: {
    async reload(page = 1) {
      const props = {
        page,
        limit: this.perPage
      };
      if (this.$props.block) {
        props.block_id = this.$props.block.hash;
      }
      if (this.$props.account) {
        props.account_id = this.$props.account;
      }
      const data = await api.getOriginations(props);
      this.originations = data.data;
      this.count = data.count;
    }
  }
};
</script>

<style scoped></style>
