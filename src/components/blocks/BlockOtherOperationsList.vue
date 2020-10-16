<template>
  <div>
    <b-table
      responsive
      show-empty
      :items="operations"
      :fields="fields"
      borderless
      class="transactions-table"
      :tbody-tr-class="$_defineRowClass"
      :empty-text="$t('common.noData')"
    >
      <template slot="source" slot-scope="row">
        <span class="d-flex align-items-center">
          <IdentIcon :seed="row.item.source" />

          <b-link
            :to="{
              name: 'account',
              params: { network: currentNetwork, account: row.item.source },
            }"
          >
            <template v-if="row.item.sourceName">
              {{ row.item.sourceName }}
            </template>
            <template v-else>
              {{ row.item.source | longhash }}
            </template>
          </b-link>

          <BtnCopy
            v-if="!row.item.sourceName"
            :text-to-copy="row.item.source"
          />
        </span>
      </template>
      <template slot="destination" slot-scope="row">
        <span class="d-flex align-items-center">
          <!--TODO: Can be empty. Refactor the condition-->
          <IdentIcon
            :seed="row.item.destination || row.item.delegate || row.item.pkh"
          />

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
            <template
              v-if="
                row.item.destinationName ||
                  row.item.delegateName ||
                  row.item.pkhName
              "
            >
              {{
                row.item.destinationName ||
                  row.item.delegateName ||
                  row.item.pkhName
              }}
            </template>
            <template v-else>
              {{
                row.item.destination | longhash() ||
                  row.item.delegate | longhash() ||
                  row.item.pkh | longhash()
              }}
            </template>
          </b-link>

          <!--TODO: Can be empty. Refactor the condition-->
          <BtnCopy
            v-if="
              (!row.item.destinationName &&
                !row.item.delegateName &&
                !row.item.pkhName &&
                row.item.destination) ||
                row.item.delegate ||
                row.item.pkh
            "
            :text-to-copy="
              row.item.destination || row.item.delegate || row.item.pkh
            "
          />
        </span>
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
        <span class="d-flex align-items-center">
          <b-link
            :to="{
              name: 'tx',
              params: {
                network: currentNetwork,
                txhash: row.item.operationGroupHash,
              },
            }"
          >
            {{ row.item.operationGroupHash | longhash }}
          </b-link>

          <BtnCopy :text-to-copy="row.item.operationGroupHash" />
        </span>
      </template>
      <template slot="kind" slot-scope="row">
        {{ operationTypesMap[row.item.kind] }}
      </template>
    </b-table>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import BtnCopy from '@/components/partials/BtnCopy';
  import IdentIcon from '@/components/accounts/IdentIcon';
  import defineRowClass from '@/mixins/defineRowClass';

  export default {
    name: 'BlockOtherOperationsList',
    components: {
      BtnCopy,
      IdentIcon,
    },
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
