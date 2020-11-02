<template>
  <b-card no-body>
    <CardHeader>
      <template v-slot:left-content class="text">
        <h4 class="tz-title--bold">
          {{ $t('listTypes.txsList') }}
        </h4>
      </template>
      <template v-slot:right-content class="text">
        <Counter show-line :count="count" />
        <router-link class="link fs-14" :to="{ name: 'txs' }">
          {{ $t('common.viewAll') }}
        </router-link>
      </template>
    </CardHeader>

    <b-card-body>
      <TxsList
        :show-limit-filter="showLimitFilter"
        :loading="loading"
        :limit="limit"
        :items="items"
        :count="count"
        :page="page"
        :props-fields="fields"
        @onPageChange="handlePageChange"
      />
    </b-card-body>
  </b-card>
</template>

<script>
  import CardHeader from '../partials/CardHeader';
  import Counter from '../partials/Counter';
  import TxsList from '@/components/transactions/TxsList';
  import reloadNavigationTable from '@/mixins/reloadNavigationList';

  export default {
    name: 'TxsCard',
    components: {
      CardHeader,
      Counter,
      TxsList,
    },
    mixins: [reloadNavigationTable],
    props: {
      showLimitFilter: {
        type: Boolean,
        default: true,
      },
    },
    computed: {
      fields() {
        if (!this.$i18n.locale) return [];
        return [
          { key: 'level', label: this.$t('common.blockId') },
          { key: 'txhash', label: this.$t('hashTypes.txHash') },
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
</style>
