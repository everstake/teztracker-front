<template>
  <div class="list asset-txs">
    <div class="d-flex justify-content-between mb-2">
      <LimitSelect
        :limit="limit"
        @onLimitChange="
          (limit) => $emit('onLimitChange', { name: 'txs', limit })
        "
        :loading="loading"
      />
    </div>

    <div v-if="loading && !loaded" class="table-skeleton">
      <b-skeleton-table
        responsive
        :rows="5"
        :columns="5"
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
      :current-page="page"
      :per-page="0"
      borderless
      class="transactions-table"
      :tbody-tr-class="$_defineRowClass"
    >
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
    </b-table>

    <PaginationSelect
      :total-rows="count"
      :per-page="limit"
      :current-page="page"
      :loading="loading"
      @onPageChange="(page) => $emit('onPageChange', { name: 'txs', page })"
    />
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import LimitSelect from '@/components/partials/LimitSelect';
  import PaginationSelect from '@/components/partials/PaginationSelect';
  import BtnCopy from '@/components/partials/BtnCopy';
  import IdentIcon from '@/components/accounts/IdentIcon';
  import defineRowClass from '@/mixins/defineRowClass';

  export default {
    name: 'AssetTabTxs',
    components: {
      LimitSelect,
      PaginationSelect,
      BtnCopy,
      IdentIcon,
    },
    mixins: [defineRowClass],
    props: {
      block: {
        type: Object,
      },
      account: {
        type: String,
      },
      currency: String,
      precision: [String, Number],
      count: Number,
      items: Array,
      loading: Boolean,
      loaded: Boolean,
      limit: Number,
      page: Number,
    },
    computed: {
      ...mapState('app', {
        dateFormat: (state) => state.dateFormat,
      }),
      fields() {
        return [
          {
            key: 'from',
            label: this.$t('common.from'),
          },
          {
            key: 'to',
            label: this.$t('common.to'),
          },
          {
            key: 'amount',
            label: this.$t('common.amount'),
          },
          {
            key: 'fee',
            label: this.$t('common.fee'),
          },
          {
            key: 'gas_limit',
            label: this.$t('txPage.gasLimit'),
          },
          {
            key: 'storage_limit',
            label: this.$t('txPage.storageLimit'),
          },
          { key: 'timestamp', label: this.$t('common.timestamp') },
        ];
      },
    },
    methods: {
      getAccountName(row, rowHash) {
        return `${row.item[`${rowHash}Name`] ||
          row.item[rowHash].slice(0, 15)}...`;
      },
    },
    created() {
      const itemsNotFetched = !this.loaded;
      const { page, limit } = this;
      if (itemsNotFetched) {
        this.$emit('onReload', { name: 'txs', page, limit });
      }
    },
  };
</script>
