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
        <b-link
          :to="{ name: 'tx', params: { txhash: row.item.operationGroupHash } }"
        >
          <span>{{ row.item.operationGroupHash | longhash(35) }}</span>
        </b-link>
      </template>

      <template slot="level" slot-scope="row">
        <b-link :to="{ name: 'block', params: { level: row.item.blockLevel } }">
          <span>{{ row.item.blockLevel }}</span>
        </b-link>
      </template>

      <template slot="timestamp" slot-scope="row">
        <span>{{ row.item.timestamp | timeformat("HH:mm:ss DD.MM.YY") }}</span>
      </template>

      <template slot="to" slot-scope="row">
        <b-link :to="{ name: 'account', params: { account: row.item.pkh } }">
          <span>{{ row.item.pkh | longhash(20) }}</span>
        </b-link>
      </template>
    </b-table>

    <TzPagination
      @change="_handleChange"
      :totalRows="rows"
      :perPage="perPage"
      align="right"
      firstText
      prevText="Prev"
      nextText="Next"
      lastText
    ></TzPagination>
  </div>
</template>
<script>
import { ACTIONS } from "../../store";
import TzPagination from "../common/_tz_pagination";

export default {
  name: "Activations",
  props: ["account"],
  data() {
    return {
      perPage: 10,
      currentPage: 1,
      pageOptions: [10, 15, 20, 25, 30],
      activations: [],
      count: 0,
      fields: [
        { key: "txhash", label: "Origination Hash" },
        { key: "level", label: "Block ID" },
        { key: "timestamp", label: "Timestamp" },
        { key: "to", label: "To" }
      ]
    };
  },
  computed: {
    rows() {
      return this.count;
    },
    items() {
      return this.activations;
    }
  },
  components: {
    TzPagination
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
    _handleChange(page) {
      this.currentPage = page;
    },
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
      // :C Move to actions, make HOC for pagination item. withAction(b-pagination);
      const data = await this.$store.getters.API.getActivations(props);
      this.activations = data.data;
      this.count = data.count;
      this.$store.commit(ACTIONS.SET_ACTIVATIONS_COUNT, this.count);
    }
  }
};
</script>
