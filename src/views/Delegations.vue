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
                    {{ $t('listTypes.delegationsList') }}
                  </h4>
                </template>
                <template #right-content class="text">
                  <Counter show-line :count="count" />
                </template>
              </CardHeader>

              <b-card-body>
                <DelegationList
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
  import DelegationList from '../components/delegations/DelegationsList';
  import CardHeader from '../components/partials/CardHeader';
  import Counter from '../components/partials/Counter';
  import { SET_DELEGATIONS_COUNT } from '@/store/mutations.types';
  import reloadNavigationList from '@/mixins/reloadNavigationList';

  export default {
    name: 'Delegations',
    components: {
      Breadcrumbs,
      DelegationList,
      CardHeader,
      Counter,
    },
    mixins: [reloadNavigationList],
    computed: {
      crumbs() {
        return [
          { toRouteName: 'network', text: this.$t('common.home') },
          {
            toRouteName: 'delegations',
            text: this.$t('pageTypes.delegationsPage'),
          },
        ];
      },
    },
    methods: {
      ...mapMutations('operations', [SET_DELEGATIONS_COUNT]),
      async reload() {
        const { page, limit } = this;
        await this.$api
          .getDelegations({ page, limit })
          .then((data) => {
            this.items = data.data;
            this.count = data.count;
            this[SET_DELEGATIONS_COUNT](data.count);
          })
          .catch(() => {});
      },
    },
  };
</script>
