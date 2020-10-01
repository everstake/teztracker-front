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
            params: { network: currentNetwork, account: row.item.source },
          }"
        >
          {{ row.item.sourceName || row.item.source | longhash(20) }}
        </b-link>
      </template>
      <template slot="destination" slot-scope="row">
        <b-link
          :to="{
            name: 'account',
            params: {
              network: currentNetwork,
              account:
                row.item.destination || row.item.delegate || row.item.pkh,
            },
          }"
        >
          {{
            row.item.destinationName | longhash(20) ||
              row.item.delegateName | longhash(20) ||
              row.item.pkhName | longhash(20) ||
              row.item.destination | longhash(20) ||
              row.item.delegate | longhash(20) ||
              row.item.pkh | longhash(20)
          }}
        </b-link>
      </template>
      <template slot="amount" slot-scope="row">
        <template v-if="row.item.amount">
          {{ row.item.amount | tezos }}
        </template>
        <template v-else>
          {{ row.item.balance | tezos }}
        </template>
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
              txhash: row.item.operationGroupHash,
            },
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
  import { mapGetters } from 'vuex';
  import defineRowClass from '@/mixins/defineRowClass';

  export default {
    name: 'BlockOtherOperationsList',
    mixins: [defineRowClass],
    props: {
      blockHash: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        fields: [
          { key: 'source', label: this.$t('common.from') },
          { key: 'destination', label: this.$t('common.to') },
          { key: 'amount', label: this.$t('common.amount') },
          { key: 'fee', label: this.$t('common.fee') },
          { key: 'operationGroupHash', label: this.$t('hashTypes.opHash') },
          { key: 'kind', label: this.$t('common.opType') },
        ],
        operations: [],
        count: 0,
        operationTypes: [
          'delegation',
          'origination',
          'activate_account',
          'double_baking_evidence',
          'double_endorsement_evidence',
        ],
        operationTypesMap: {
          delegation: this.$tc('opTypes.delegation', 1),
          origination: this.$tc('opTypes.origination', 1),
          activate_account: this.$tc('opTypes.activation', 1),
          double_baking_evidence: this.$t('opTypes.doubleBaking'),
          double_endorsement_evidence: this.$tc('opTypes.doubleEndorsement', 1),
        },
      };
    },
    computed: {
      ...mapGetters('app', {
        currentNetwork: 'getAppNetwork',
      }),
    },
    watch: {
      blockHash(value) {
        this.load(value, this.operationTypes);
      },
    },
    methods: {
      async load(blockHash, operationTypes) {
        const res = await this.$api.getOperations({
          block_id: blockHash,
          operation_kind: operationTypes,
          limit: 100,
        });

        if (res.status !== this.$constants.STATUS_SUCCESS) {
          return this.$router.replace({
            name: res.status,
          });
        }

        this.operations = res.data;
        this.count = res.count;
      },
    },
  };
</script>

<style scoped></style>
