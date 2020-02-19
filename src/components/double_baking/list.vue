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
          <span>{{ row.item.operationGroupHash | longhash(25) }}</span>
        </b-link>
      </template>

      <template slot="level" slot-scope="row">
        <b-link :to="{ name: 'block', params: { level: row.item.blockLevel } }">
          <span>{{ row.item.blockLevel }}</span>
        </b-link>
      </template>

      <template slot="age" slot-scope="row">
        <span>{{ row.item.timestamp | getAge }}</span>
      </template>
      <template slot="baker" slot-scope="row">
        <router-link
          class="baker"
          :to="{ name: 'baker', params: {baker: row.item.doubleBake.evidence_baker}}"
        >{{row.item.doubleBake.evidence_baker | longhash(20)}}</router-link>
      </template>
      <template slot="baker_rewards" slot-scope="row">
        <span>{{ row.item.doubleBake.baker_reward | tezos }}</span>
      </template>
      <template slot="offender" slot-scope="row">
        <router-link
          class="baker"
          :to="{ name: 'baker', params: {baker: row.item.doubleBake.offender}}"
        >{{row.item.doubleBake.offender | longhash(20)}}</router-link>
      </template>
      <template slot="denounced_level" slot-scope="row">
        <b-link :to="{ name: 'block', params: { level: row.item.doubleBake.denounced_level } }">
          <span>{{ row.item.doubleBake.denounced_level }}</span>
        </b-link>
      </template>
      <template slot="lost_deposits" slot-scope="row">
        <span>{{ row.item.doubleBake.lost_deposits | tezos }}</span>
      </template>
      <template slot="lost_rewards" slot-scope="row">
        <span>{{ row.item.doubleBake.lost_rewards | tezos }}</span>
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
import { mapMutations } from "vuex";
import { SET_DOUBLE_BAKING_COUNT } from "@/store/mutations.types";

export default {
  name: "DoubleBaking",
  props: ["account"],
  data() {
    return {
      perPage: this.$constants.PER_PAGE,
      currentPage: this.$constants.INITIAL_CURRENT_PAGE,
      pageOptions: this.$constants.PAGE_OPTIONS,
      double_baking: [],
      count: 0,
      fields: [
        { key: "txhash", label: "Origination Hash" },
        { key: "level", label: "Block ID" },
        { key: "age", label: "Age" },
        { key: "baker", label: "Baker" },
        { key: "baker_rewards", label: "Baker Rewards" },
        { key: "offender", label: "Offender" },
        { key: "denounced_level", label: "Denounced Level" },
        { key: "lost_deposits", label: "Lost Deposits" },
        { key: "lost_rewards", label: "Lost Rewards" }
      ]
    };
  },
  computed: {
    rows() {
      return this.count;
    },
    items() {
      return this.double_baking;
    }
  },
  watch: {
    currentPage: {
      async handler(value) {
        await this.reload(value);
      }
    }
  },
  async created() {
    await this.reload();
  },
  methods: {
    ...mapMutations('operations', [SET_DOUBLE_BAKING_COUNT]),
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
      const data = await this.$api.getDoubleBaking(props);
      this.double_baking = data.data;
      this.count = data.count;
      this[SET_DOUBLE_BAKING_COUNT](this.count);
    }
  }
};
</script>
