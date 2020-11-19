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
                    {{ $t('listTypes.dblBakingList') }}
                  </h4>
                </template>
                <template #right-content class="text">
                  <Counter show-line :count="count" :loading="loading" />
                </template>
              </CardHeader>

              <b-card-body>
                <DoubleBakingList
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
  import DoubleBakingList from '../components/double_baking/DoubleBakingList.vue';
  import CardHeader from '../components/partials/CardHeader';
  import Counter from '../components/partials/Counter';
  import { SET_DOUBLE_BAKING_COUNT } from '@/store/mutations.types';
  import reloadNavigationList from '@/mixins/reloadNavigationList';

  export default {
    name: 'DoubleBaking',
    components: {
      Breadcrumbs,
      DoubleBakingList,
      CardHeader,
      Counter,
    },
    mixins: [reloadNavigationList],
    computed: {
      crumbs() {
        return [
          { toRouteName: 'network', text: this.$t('common.home') },
          {
            toRouteName: 'double_baking',
            text: this.$t('pageTypes.dblBakingPage'),
          },
        ];
      },
    },
    methods: {
      ...mapMutations('operations', [SET_DOUBLE_BAKING_COUNT]),
      async reload() {
        const { page, limit } = this;
        await this.$api
          .getDoubleBaking({ page, limit })
          .then((data) => {
            this.items = data.data;
            this.count = data.count;
            this[SET_DOUBLE_BAKING_COUNT](data.count);
          })
          .catch(() => {});
      },
    },
  };
</script>
