<template>
  <div class="list assets-holders">
    <div class="d-flex justify-content-between mb-2">
      <LimitSelect
        :limit="limit"
        @onLimitChange="
          (limit) => $emit('onLimitChange', { name: 'holders', limit })
        "
        :loading="loading"
      />
    </div>

    <div v-if="loading && !loaded" class="table-skeleton">
      <b-skeleton-table
        responsive
        :rows="5"
        :columns="2"
        :table-props="{ borderless: true, responsive: true }"
        animation="none"
        class="table-skeleton"
      />
    </div>
    <b-table
      v-else
      show-empty
      :items="items"
      :fields="fields"
      :current-page="page"
      :per-page="0"
      borderless
      class="transactions-table"
      :tbody-tr-class="$_defineRowClass"
    >
      <template #cell(account_id)="row">
        <span class="d-flex align-items-center">
          <IdentIcon :seed="row.item.account_id" />

          <b-link
            :to="{ name: 'account', params: { account: row.item.account_id } }"
          >
            {{ row.item.account_id }}
          </b-link>

          <BtnCopy :text-to-copy="row.item.account_id" />
        </span>
      </template>

      <template #cell(balance)="row">
        {{ row.item.balance | currencyPrecision(currency, precision) }}
      </template>
    </b-table>

    <PaginationSelect
      :total-rows="count"
      :per-page="limit"
      :current-page="page"
      :loading="loading"
      @onPageChange="(page) => $emit('onPageChange', { name: 'holders', page })"
    />
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import LimitSelect from '@/components/partials/LimitSelect';
  import PaginationSelect from '@/components/partials/PaginationSelect';
  import defineRowClass from '@/mixins/defineRowClass';
  import IdentIcon from '@/components/accounts/IdentIcon';
  import BtnCopy from '@/components/partials/BtnCopy';

  export default {
    name: 'AssetTabHolders',
    components: {
      LimitSelect,
      PaginationSelect,
      IdentIcon,
      BtnCopy,
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
            key: 'account_id',
            label: this.$t('bakerSingle.address'),
          },
          {
            key: 'balance',
            label: this.$t('common.balance'),
          },
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
        this.$emit('onReload', { name: 'holders', page, limit });
      }
    },
  };
</script>
