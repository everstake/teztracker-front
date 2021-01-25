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
                    {{ $t('listTypes.contractsList') }}
                  </h4>
                </template>
                <template #right-content class="text">
                  <Counter show-line :count="count" :loading="loading" />
                </template>
              </CardHeader>

              <b-card-body>
                <ContractsList
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
  import { mapMutations, mapState } from 'vuex';
  import Breadcrumbs from '../components/partials/Breadcrumbs';
  import ContractsList from '../components/contracts/ContractsList';
  import CardHeader from '../components/partials/CardHeader';
  import Counter from '../components/partials/Counter';
  import { SET_CONTRACTS } from '@/store/mutations.types';
  import reloadNavigationList from '@/mixins/reloadNavigationList';
  import wsListsHandler from '@/mixins/wsListsHandler';

  export default {
    name: 'Contracts',
    components: {
      Breadcrumbs,
      ContractsList,
      Counter,
      CardHeader,
    },
    mixins: [reloadNavigationList, wsListsHandler],
    data() {
      return {
        // Expected in wsListHandler.js mixin
        subscriptionChannel: 'contracts',
      };
    },
    computed: {
      ...mapState('user', ['favorites']),
      crumbs() {
        return [
          { toRouteName: 'network', text: this.$t('common.home') },
          {
            toRouteName: 'contracts',
            text: this.$t('pageTypes.contractsPage'),
          },
        ];
      },
    },
    methods: {
      ...mapMutations('accounts', [SET_CONTRACTS]),
      async reload() {
        const options = { page: this.page, limit: this.limit, favorites: this.favorites };
        await this.$api
          .getContracts(options)
          .then((data) => {
            this.items = data.data;
            this.count = data.count;
            this[SET_CONTRACTS](data);
          })
          .catch(() => {});
      },
    },
  };
</script>
