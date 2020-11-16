<template>
  <div class="list assets-holders">
    <div class="d-flex justify-content-between mb-2">
      <PerPageSelect :hide="!showLimitFilter" @onLimitChange="$_setPerPage" :loading="loading" />
    </div>

    <div v-if="loading && transactions.length === 0" class="table-skeleton">
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
      :items="transactions"
      :fields="fields"
      :current-page="currentPage"
      :per-page="0"
      borderless
      class="transactions-table"
      :tbody-tr-class="$_defineRowClass"
    />

    <Pagination
      :total-rows="count"
      :per-page="perPage"
      @change="$_handleCurrentPageChange"
      :loading="loading"
    />
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import PerPageSelect from '@/components/partials/PerPageSelect';
  import Pagination from '../partials/Pagination';
  import handleCurrentPageChange from '@/mixins/handleCurrentPageChange';
  import setPerPage from '@/mixins/setPerPage';
  import defineRowClass from '@/mixins/defineRowClass';

  export default {
    name: 'AssetTabHolders',
    components: {
      PerPageSelect,
      Pagination,
    },
    mixins: [handleCurrentPageChange, setPerPage, defineRowClass],
    props: {
      block: {
        type: Object,
      },
      account: {
        type: String,
      },
      showLimitFilter: {
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
        loading: false,
      };
    },
    computed: {
      ...mapState('app', {
        dateFormat: (state) => state.dateFormat,
      }),
      fields() {
        return [
          {
            key: 'balance',
            label: this.$t('common.balance'),
          },
          {
            key: 'address',
            label: this.$t('bakerSingle.address'),
          },
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
        this.loading = true;
        const props = {
          page,
          limit: this.perPage,
          type: 'transfer',
          assets_id: this.$route.params.id,
        };
        const data = await this.$api.getAssetsHoldersById(props);
        this.transactions = data.data;
        this.count = data.count;
        this.loading = false;
      },
      getAccountName(row, rowHash) {
        return `${row.item[`${rowHash}Name`] ||
          row.item[rowHash].slice(0, 15)}...`;
      },
    },
  };
</script>
