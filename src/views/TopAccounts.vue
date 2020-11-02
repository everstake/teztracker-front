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
                    {{ $t('listTypes.topAccountsList') }}
                  </h4>
                </template>
                <template #right-content class="text">
                  <Counter show-line :count="count" />
                </template>
              </CardHeader>

              <b-card-body>
                <TopAccountsList
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
  import TopAccountsList from '../components/accounts/TopAccountsList';
  import CardHeader from '../components/partials/CardHeader';
  import Counter from '../components/partials/Counter';
  import reloadNavigationList from '@/mixins/reloadNavigationList';

  export default {
    name: 'TopAccounts',
    components: {
      Breadcrumbs,
      TopAccountsList,
      Counter,
      CardHeader,
    },
    mixins: [reloadNavigationList],
    computed: {
      crumbs() {
        return [
          { toRouteName: 'network', text: this.$t('common.home') },
          {
            toRouteName: 'top_accounts',
            text: this.$t('pageTypes.topAccountsPage'),
          },
        ];
      },
    },
    methods: {
      async reload() {
        const { page, limit } = this;
        const data = await this.$api.getTopAccounts({ page, limit });
        this.items = data.data;
        this.count = data.count;
      },
    },
  };
</script>
