<template>
  <div class="list txs-list">
    <div class="d-flex justify-content-between mb-2">
      <LimitSelect
        :limit="perPage"
        @onLimitChange="
          (limit) => $emit('onLimitChange', { type: 'assetBalance', limit })
        "
        :loading="loading"
      />
    </div>

    <div v-if="loading && assetBalance.length === 0" class="table-skeleton">
      <b-skeleton-table
        responsive
        :rows="2"
        :columns="6"
        :table-props="{ borderless: true, responsive: true }"
        animation="none"
        class="table-skeleton"
      />
    </div>
    <b-table
      v-else
      show-empty
      :items="assetBalance"
      :fields="fields"
      :current-page="currentPage"
      :per-page="0"
      borderless
      class="transactions-table"
      :empty-text="$t('common.noData')"
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
        {{ row.item.balance | denominate }}
      </template>
    </b-table>

    <PaginationSelect
      :total-rows="count"
      :per-page="perPage"
      :current-page="currentPage"
      :loading="loading"
      @onPageChange="(page) => $emit('onPageChange', { type: 'assetBalance', page })"
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
    name: 'AssetBalanceTabList',
    components: {
      LimitSelect,
      PaginationSelect,
      BtnCopy,
      IdentIcon,
    },
    mixins: [defineRowClass],
    props: {
      assetBalance: {
        type: Array,
        default() {
          return [];
        },
      },
      count: {
        type: Number,
        default: 0,
      },
      account: String,
      currentPage: Number,
      perPage: Number,
      loaded: Boolean,
      loading: Boolean,
      blockHash: String,
    },
    computed: {
      ...mapState('app', {
        dateFormat: (state) => state.dateFormat,
      }),
      fields() {
        if (!this.$i18n.locale) return [];
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
    watch: {
      blockHash: {
        immediate: true,
        handler(value) {
          const itemsNotFetched = !this.loaded;
          if (itemsNotFetched && value) {
            this.$emit('onReload', { type: 'assetBalance', limit: this.perPage });
          }
        },
      },
    },
    async created() {
      const { blockHash } = this;
      const itemsNotFetched = !this.loaded;
      if (itemsNotFetched && !blockHash) {
        this.$emit('onReload', { type: 'assetBalance', limit: this.perPage });
      }
    },
    methods: {
      getAccountName(row, rowHash) {
        return `${row.item[`${rowHash}Name`] ||
          row.item[rowHash].slice(0, 15)}...`;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .s {
    position: relative;
  }

  .source,
  .destination {
    position: relative;
  }

  .icon {
    &__arrow--red:before {
      position: absolute;
      content: '';
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      color: #309282;
      border-top: 0.3em solid transparent;
      border-bottom: 0.3em solid transparent;
      border-left: 0.3em solid;
    }

    &__arrow--green:before {
      position: absolute;
      content: '';
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      color: #e56968;
      border-top: 0.3em solid transparent;
      border-bottom: 0.3em solid transparent;
      border-left: 0.3em solid;
    }
  }
</style>
