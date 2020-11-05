<template>
  <div>
    <Breadcrumbs :crumbs="crumbs" />

    <section>
      <b-container fluid>
        <b-row>
          <b-col lg="12">
            <b-card no-body>
              <CardHeader>
                <template #left-content class="text">
                  <h4 class="tz-title--bold">
                    {{ $t('listTypes.txsList') }}
                  </h4>
                </template>
                <template #right-content class="text">
                  <Counter show-line :count="count" />
                </template>
              </CardHeader>

              <b-card-body>
                <TxsList
                  :loading="loading"
                  :limit="limit"
                  :items="items"
                  :count="count"
                  :page="page"
                  @onLimitChange="handleLimitChange"
                  @onPageChange="handlePageChange"
                />
              </b-card-body>
            </b-card>
          </b-col>
        </b-row>
      </b-container>
    </section>
  </div>
</template>

<script>
  import { mapMutations } from 'vuex';
  import Breadcrumbs from '../components/partials/Breadcrumbs';
  import TxsList from '../components/transactions/TxsList';
  import CardHeader from '../components/partials/CardHeader';
  import Counter from '../components/partials/Counter';
  import { SET_TX_COUNT } from '@/store/mutations.types';
  import reloadNavigationList from '@/mixins/reloadNavigationList';

  export default {
    name: 'Txs',
    components: {
      Breadcrumbs,
      TxsList,
      CardHeader,
      Counter,
    },
    mixins: [reloadNavigationList],
    computed: {
      crumbs() {
        return [
          { toRouteName: 'network', text: this.$t('common.home') },
          { toRouteName: 'txs', text: this.$t('pageTypes.txsPage') },
        ];
      },
    },
    methods: {
      ...mapMutations('operations', [SET_TX_COUNT]),
      async reload() {
        const { page, limit } = this;
        const data = await this.$api.getTransactions({ page, limit });
        this.items = data.data;
        this.count = data.count;
        this[SET_TX_COUNT](data.count);
      },
    },
  };
</script>
