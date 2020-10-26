<template>
  <div>
    <div class="d-flex justify-content-between mb-2">
      <PerPageSelect :hide="!showPerPageFilter" @per-page="$_setPerPage" />
    </div>

    <b-table
      responsive
      show-empty
      :items="transactions"
      :fields="fields"
      :current-page="currentPage"
      :per-page="0"
      borderless
      class="transactions-table"
      :tbody-tr-class="$_defineRowClass"
    >
      <template slot="from" slot-scope="row">
        <span class="d-flex align-items-center">
          <IdentIcon :seed="row.item.from" />

          <b-link :to="{ name: 'account', params: { account: row.item.from } }">
            {{ row.item.from | longhash }}
          </b-link>

          <BtnCopy :text-to-copy="row.item.from" />
        </span>
      </template>

      <template slot="to" slot-scope="row">
        <span class="d-flex align-items-center">
          <IdentIcon :seed="row.item.to" />

          <b-link :to="{ name: 'account', params: { account: row.item.to } }">
            {{ row.item.to | longhash }}
          </b-link>

          <BtnCopy :text-to-copy="row.item.to" />
        </span>
      </template>

      <template slot="amount" slot-scope="row">
        {{ row.item.amount | currencyPrecision(currency, precision) }}
      </template>

      <template slot="fee" slot-scope="row">
        {{ row.item.fee | tezos }}
      </template>

      <template slot="timestamp" slot-scope="row">
        {{ row.item.timestamp | timeformat(dateFormat) }}
      </template>
    </b-table>

    <Pagination
      :total-rows="count"
      :per-page="perPage"
      @change="$_handleCurrentPageChange"
    />
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import PerPageSelect from '@/components/partials/PerPageSelect';
  import Pagination from '../partials/Pagination';
  import BtnCopy from '@/components/partials/BtnCopy';
  import IdentIcon from '@/components/accounts/IdentIcon';
  import handleCurrentPageChange from '@/mixins/handleCurrentPageChange';
  import setPerPage from '@/mixins/setPerPage';
  import defineRowClass from '@/mixins/defineRowClass';

  export default {
    name: 'AssetTabTxs',
    components: {
      PerPageSelect,
      Pagination,
      BtnCopy,
      IdentIcon,
    },
    mixins: [handleCurrentPageChange, setPerPage, defineRowClass],
    props: {
      block: {
        type: Object,
      },
      account: {
        type: String,
      },
      showPerPageFilter: {
        type: Boolean,
        default: true,
      },
      currency: String,
      precision: [String, Number],
    },
    data() {
      return {
        transactions: [],
        count: 0,
      };
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
    watch: {
      currentPage: {
        async handler(value) {
          await this.reload(value);
        },
      },
      block: {
        async handler() {
          await this.reload();
        },
      },
      account: {
        async handler() {
          await this.reload();
        },
      },
      async perPage() {
        await this.reload();
      },
    },
    async created() {
      // TODO: refactor API
      if (!this.block) {
        await this.reload();
      }
    },
    methods: {
      async reload(page = 1) {
        const props = {
          page,
          limit: this.perPage,
          type: 'transfer',
          assets_id: this.$route.params.id,
        };
        const data = await this.$api.getAssetsOperationsById(props);
        this.transactions = data.data;
        this.count = data.count;
      },
      getAccountName(row, rowHash) {
        return `${row.item[`${rowHash}Name`] ||
          row.item[rowHash].slice(0, 15)}...`;
      },
    },
  };
</script>
