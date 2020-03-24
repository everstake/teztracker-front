<template>
  <div>
    <b-table
      show-empty
      :items="operations"
      :fields="fields"
      borderless
      class="transactions-table table-responsive-md"
      :tbody-tr-class="$_defineRowClass"
    >
      <template slot="source" slot-scope="row">
        <b-link
          :to="{
            name: 'account',
            params: { network: currentNetwork, account: row.item.source }
          }"
        >
          {{ row.item.source | longhash(20) }}
        </b-link>
      </template>
      <template slot="destination" slot-scope="row">
        <b-link
          :to="{
            name: 'account',
            params: { network: currentNetwork, account: row.item.destination }
          }"
        >
          {{
             row.item.destination | longhash(20)
             || row.item.delegate | longhash(20)
             || row.item.pkh | longhash(20)
          }}
        </b-link>
      </template>
      <template slot="amount" slot-scope="row">
        {{ row.item.amount | tezos }}
      </template>
      <template slot="fee" slot-scope="row">
        {{ row.item.fee | tezos }}
      </template>
      <template slot="operationGroupHash" slot-scope="row">
        <b-link
          :to="{
            name: 'tx',
            params: {
              network: currentNetwork,
              txhash: row.item.operationGroupHash
            }
          }"
        >
          {{ row.item.operationGroupHash | longhash(35) }}
        </b-link>
      </template>
      <template slot="kind" slot-scope="row">
        {{ operationTypesMap[row.item.kind] }}
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import defineRowClass from "@/mixins/defineRowClass";

export default {
  name: "BlockOtherOperationsList",
  mixins: [defineRowClass],
  props: {
    blockHash: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      fields: [
        { key: "source", label: "From" },
        { key: "destination", label: "To" },
        { key: "amount", label: "Amount" },
        { key: "fee", label: "Fee" },
        { key: "operationGroupHash", label: "Opearation hash" },
        { key: "kind", label: "Operation type" }
      ],
      operations: [],
      count: 0,
      operationTypes: [
        "delegation",
        "origination",
        "activate_account",
        "double_baking_evidence",
        "double_endorsement_evidence"
      ],
      operationTypesMap: {
        delegation: "Delegation",
        origination: "Origination",
        activate_account: "Activation",
        double_baking_evidence: "Double baking",
        double_endorsement_evidence: "Double endorsement"
      }
    };
  },
  computed: {
    ...mapGetters("app", {
      currentNetwork: "getAppNetwork"
    })
  },
  watch: {
    blockHash(value) {
      this.load(value, this.operationTypes);
    }
  },
  methods: {
    async load(blockHash, operationTypes) {
      const res = await this.$api.getOperations({
        block_id: blockHash,
        operation_kind: operationTypes,
        limit: 100
      });

      if (res.status !== this.$constants.STATUS_SUCCESS) {
        return this.$router.replace({
          name: res.status
        });
      }

      this.operations = res.data;
      this.count = res.count;
    }
  }
};
</script>

<style scoped></style>
