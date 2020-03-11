<template>
  <div>
    <div class="d-flex justify-content-between mb-4">
      <PerPageSelect @per-page="$_setPerPage" />
    </div>

    <b-table
      show-empty
      :items="double_baking"
      :fields="fields"
      :current-page="currentPage"
      :per-page="0"
      borderless
      class="transactions-table table-responsive-md"
    >
      <template slot="txhash" slot-scope="row">
        <b-link
          :to="{ name: 'tx', params: { txhash: row.item.operationGroupHash } }"
        >
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
          :to="{
            name: 'baker',
            params: { baker: row.item.doubleBake.evidence_baker }
          }"
          >{{ row.item.doubleBake.evidence_baker | longhash(20) }}</router-link
        >
      </template>
      <template slot="baker_rewards" slot-scope="row">
        <span>{{ row.item.doubleBake.baker_reward | tezos }}</span>
      </template>
      <template slot="offender" slot-scope="row">
        <router-link
          class="baker"
          :to="{
            name: 'baker',
            params: { baker: row.item.doubleBake.offender }
          }"
          >{{ row.item.doubleBake.offender | longhash(20) }}</router-link
        >
      </template>
      <template slot="denounced_level" slot-scope="row">
        <b-link
          :to="{
            name: 'block',
            params: { level: row.item.doubleBake.denounced_level }
          }"
        >
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

    <Pagination
      @change="$_handleCurrentPageChange"
      :total-rows="count"
      :per-page="perPage"
    />
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { SET_DOUBLE_BAKING_COUNT } from "@/store/mutations.types";
import PerPageSelect from "@/components/partials/PerPageSelect";
import Pagination from "../partials/Pagination";
import handleCurrentPageChange from "@/mixins/handleCurrentPageChange";
import setPerPage from "@/mixins/setPerPage";

export default {
  name: "DoubleBakingList",
  components: {
    PerPageSelect,
    Pagination
  },
  mixins: [handleCurrentPageChange, setPerPage],
  props: ["account"],
  data() {
    return {
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
    ...mapMutations('operations', [SET_DOUBLE_BAKING_COUNT]),
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
      const data = await this.$api.getDoubleBaking(props);
      this.double_baking = data.data;
      this.count = data.count;
      this[SET_DOUBLE_BAKING_COUNT](this.count);
    }
  }
};
</script>
