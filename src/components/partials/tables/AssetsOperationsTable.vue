<template>
  <b-table
    responsive
    show-empty
    :items="items"
    :fields="fields"
    :current-page="page"
    :per-page="0"
    borderless
    class="transactions-table"
    :tbody-tr-class="$_defineRowClass"
    :empty-text="$t('common.noData')"
  >
    <template #cell(operation_group_hash)="row">
      {{ row.item.operation_group_hash | longhash }}
    </template>
    <template #cell(from)="row">
      <span class="d-flex align-items-center">
        <IdentIcon :seed="row.item.from" />

        <b-link :to="{ name: 'account', params: { account: row.item.from } }">
          {{ row.item.from | longhash }}
        </b-link>

        <BtnCopy :text-to-copy="row.item.from" />
      </span>
    </template>
    <template #cell(to)="row">
      <span class="d-flex align-items-center">
        <IdentIcon :seed="row.item.to" />

        <b-link :to="{ name: 'account', params: { account: row.item.to } }">
          {{ row.item.to | longhash }}
        </b-link>

        <BtnCopy :text-to-copy="row.item.to" />
      </span>
    </template>
    <template #cell(amount)="row">
      {{ row.item.amount | currencyPrecision(currency, precision) }}
    </template>
    <template #cell(fee)="row">
      {{ row.item.fee | denominate }}
    </template>
    <template #cell(timestamp)="row">
      {{ row.item.timestamp | timeformat(dateFormat) }}
    </template>
    <template #cell(amount)="row">
      {{ row.item.balance | denominate }}
    </template>
  </b-table>
</template>

<script>
  import { mapState } from 'vuex';
  import BtnCopy from '@/components/partials/BtnCopy';
  import IdentIcon from '@/components/accounts/IdentIcon';
  import defineRowClass from '@/mixins/defineRowClass';
  // import NoDataTableCell from '@/components/partials/NoDataTableCell';

  export default {
    name: 'AssetsOperationsTable',
    props: {
      items: Array,
      page: Number,
      limit: Number,
      propsFields: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    mixins: [defineRowClass],
    components: {
      BtnCopy,
      IdentIcon,
      // NoDataTableCell,
    },
    computed: {
      ...mapState({
        dateFormat: (state) => state.app.dateFormat,
      }),
      fields() {
        const propsFields = this.propsFields.length > 0;
        if (!this.$i18n.locale) return [];
        if (propsFields) {
          return this.propsFields;
        } else {
          return [
            { key: 'operation_group_hash', label: this.$t('hashTypes.hash') },
            { key: 'type', label: this.$t('common.type') },
            {
              key: 'to',
              label: this.$t('common.to'),
            },
            {
              key: 'from',
              label: this.$t('common.from'),
            },

            {
              key: 'amount',
              label: this.$t('common.amount'),
            },
            {
              key: 'gas_limit',
              label: this.$t('txPage.gasLimit'),
            },
            {
              key: 'fee',
              label: this.$t('common.fee'),
            },
            {
              key: 'storage_limit',
              label: this.$t('txPage.storageLimit'),
            },
            { key: 'timestamp', label: this.$t('common.timestamp') },
          ];
        }
      },
    },
  };
</script>
