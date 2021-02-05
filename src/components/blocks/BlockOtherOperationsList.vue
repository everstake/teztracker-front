<template>
  <div class="list block-other-operations-list">
    <div v-if="loading && items.length === 0" class="table-skeleton">
      <b-skeleton-table
        responsive
        :rows="5"
        :columns="6"
        :table-props="{ borderless: true, responsive: true }"
        animation="none"
        class="table-skeleton"
      />
    </div>
    <b-table
      v-else
      responsive
      show-empty
      :items="items"
      :fields="fields"
      borderless
      class="transactions-table"
      :tbody-tr-class="$_defineRowClass"
      :empty-text="$t('common.noData')"
    >
      <template #cell(source)="row">
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
      <template #cell(destination)="row">
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
                row.item.destination ||
                  row.item.delegate ||
                  row.item.pkh | longhash
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
      <template #cell(amount)="row">
        <template v-if="row.item.amount">
          {{ row.item.amount | denominate }}
        </template>
        <template v-else>
          {{ row.item.balance | denominate }}
        </template>
      </template>
      <template #cell(fee)="row">
        {{ row.item.fee | denominate }}
      </template>
      <template #cell(operationGroupHash)="row">
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
      <template #cell(kind)="row">
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
  import tabulationList from '@/mixins/tabulationList';

  export default {
    name: 'BlockOtherOperationsList',
    components: {
      BtnCopy,
      IdentIcon,
    },
    mixins: [defineRowClass, tabulationList],
    props: {
      hash: String,
    },
    data() {
      return {
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
      fields() {
        return [
          { key: 'source', label: this.$t('common.from') },
          { key: 'destination', label: this.$t('common.to') },
          { key: 'amount', label: this.$t('common.amount') },
          { key: 'fee', label: this.$t('common.fee') },
          { key: 'operationGroupHash', label: this.$t('hashTypes.opHash') },
          { key: 'kind', label: this.$t('common.opType') },
        ];
      },
    },
    watch: {
      hash: {
        immediate: true,
        async handler(hash) {
          if (!this.loaded && hash) {
            await this.reload();
          }
        },
      },
    },
    methods: {
      async reload() {
        this.loading = true;
        const operationTypes = [
          'delegation',
          'origination',
          'activate_account',
          'double_baking_evidence',
          'double_endorsement_evidence',
        ];

        const data = await this.$api.getOperations({
          block_id: this.hash,
          operation_kind: operationTypes,
          limit: 100,
        });

        if (data.status !== this.$constants.STATUS_SUCCESS) {
          return this.$router.replace({
            name: data.status,
          });
        }

        this.items = data.data;
        this.count = data.count;
        this.loading = false;
        this.loaded = true;
      },
    },
  };
</script>

<style scoped></style>
