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
                    {{ $t('listTypes.assetsOperationsList') }}
                  </h4>
                </template>
                <template #right-content class="text">
                  <Counter show-line :count="count" :loading="loading" />
                </template>
              </CardHeader>

              <b-card-body>
                <AssetsOperationsList
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
  import Breadcrumbs from '../components/partials/Breadcrumbs';
  import AssetsOperationsList from '../components/operations/AssetsOperationsList';
  import CardHeader from '../components/partials/CardHeader';
  import Counter from '../components/partials/Counter';
  import reloadNavigationList from '@/mixins/reloadNavigationList';
  import wsListHandler from '@/mixins/wsListsHandler';

  export default {
    name: 'AssetsOperations',
    components: {
      Breadcrumbs,
      AssetsOperationsList,
      CardHeader,
      Counter,
    },
    mixins: [reloadNavigationList, wsListHandler],
    data() {
      return {
        // Expected in wsListHandler.js mixin
        subscriptionChannel: 'originations',
      };
    },
    computed: {
      crumbs() {
        return [
          { toRouteName: 'network', text: this.$t('common.home') },
          {
            toRouteName: 'originations',
            text: this.$t('pageTypes.assetsOperationsPage'),
          },
        ];
      },
    },
    methods: {
      async reload() {
        const { page, limit } = this;
        await this.$api
          .getAssetsOperationsById({ page, limit })
          .then((data) => {
            this.items = data.data;
            this.count = data.count;
          })
          .catch(() => {});
      },
    },
  };
</script>
