<template>
  <b-card no-body class="txs-card">
    <CardHeader>
      <template v-slot:left-content class="text">
        <h4 class="tz-title--bold">
          {{ $t('listTypes.txsList') }}
        </h4>
      </template>
      <template v-slot:right-content class="text">
        <Counter show-line :count="count" :loading="loading" />
      </template>
    </CardHeader>

    <b-card-body>
      <div v-if="loading" class="table-skeleton">
        <b-skeleton-table
          responsive
          :rows="10"
          :columns="3"
          :table-props="{ borderless: true, responsive: true }"
          animation="none"
        />
      </div>
      <TxsTable
        v-else
        :loading="loading"
        :limit="limit"
        :items="items"
        :count="count"
        :page="page"
        :props-fields="fields"
      />

      <div class="txs-card__actions">
        <router-link class="txs-card__link link fs-14" :to="{ name: 'txs' }">
          {{ $t('common.viewAll') }}
        </router-link>
      </div>
    </b-card-body>
  </b-card>
</template>

<script>
  import CardHeader from '../partials/CardHeader';
  import Counter from '../partials/Counter';
  import TxsTable from '@/components/partials/tables/TxsTable';

  export default {
    name: 'TxsCard',
    components: {
      TxsTable,
      CardHeader,
      Counter,
    },
    data() {
      return {
        limit: 10,
        items: [],
        count: 0,
        page: 1,
        loading: true,
      };
    },
    computed: {
      fields() {
        if (!this.$i18n.locale) return [];
        return [
          { key: 'level', label: this.$t('common.blockId') },
          {
            key: 'txhash',
            label: this.$t('hashTypes.txHash'),
            tdClass: 'txs-card--hash-height',
          },
          { key: 'timestamp', label: this.$t('common.timestamp') },
        ];
      },
    },
    async created() {
      await this.reload();
    },
    methods: {
      async reload() {
        const { page, limit } = this;
        this.loading = true;
        await this.$api
          .getTransactions({ page, limit })
          .then((data) => {
            this.items = data.data;
            this.count = data.count;
          })
          .catch(() => {});
        this.loading = false;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .line {
    display: block;
    float: left;
    width: 30px;
    height: 16px;
    margin-right: 0.5rem;
    border-bottom: 1px solid $color-grey;
    opacity: 0.5;
  }
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    h3 {
      line-height: 1;
    }
  }

  .txs-card__actions {
    text-align: center;
    margin-bottom: 10px;
  }

  .txs-card__link {
    font-weight: bold;
  }

  ::v-deep .txs-hash {
    height: 28px;
  }

  ::v-deep .table-skeleton tr {
    height: 52px;
  }
</style>
