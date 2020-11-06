<template>
  <b-card no-body class="txs-card">
    <CardHeader>
      <template v-slot:left-content class="text">
        <h4 class="tz-title--bold">
          {{ $t('listTypes.txsList') }}
        </h4>
      </template>
      <template v-slot:right-content class="text">
        <Counter show-line :count="count" />
      </template>
    </CardHeader>

    <b-card-body>
      <TxsTable
        :loading="loading"
        :limit="limit"
        :items="items"
        :count="count"
        :page="page"
        :props-fields="fields"
        @onPageChange="handlePageChange"
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
  import reloadNavigationTable from '@/mixins/reloadNavigationList';
  import TxsTable from '@/components/partials/tables/TxsTable';

  export default {
    name: 'TxsCard',
    components: {
      TxsTable,
      CardHeader,
      Counter,
    },
    mixins: [reloadNavigationTable],
    computed: {
      fields() {
        if (!this.$i18n.locale) return [];
        return [
          { key: 'level', label: this.$t('common.blockId') },
          { key: 'txhash', label: this.$t('hashTypes.txHash'), tdClass: 'txs-card--hash-height' },
          { key: 'timestamp', label: this.$t('common.timestamp') },
        ];
      },
    },
    methods: {
      async reload() {
        const { page, limit } = this;
        const data = await this.$api.getTransactions({ page, limit });
        this.items = data.data;
        this.count = data.count;
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
</style>

<style>
  .txs-card--hash-height span {
    height: 28px;
  }
</style>
