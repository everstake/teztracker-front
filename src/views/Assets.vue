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
                    {{ $t('listTypes.assetsList') }}
                  </h4>
                </template>
                <template #right-content class="text">
                  <Counter show-line :count="count" :loading="loading" />
                </template>
              </CardHeader>

              <b-card-body>
                <AssetsList
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
  import AssetsList from '../components/assets/AssetsList';
  import CardHeader from '../components/partials/CardHeader';
  import Counter from '../components/partials/Counter';
  import { SET_ASSETS } from '@/store/mutations.types';
  import reloadNavigationList from '@/mixins/reloadNavigationList';

  export default {
    name: 'Assets',
    components: {
      Breadcrumbs,
      AssetsList,
      Counter,
      CardHeader,
    },
    mixins: [reloadNavigationList],
    data() {
      return {
        crumbs: [
          { toRouteName: 'network', text: this.$t('common.home') },
          { toRouteName: 'assets', text: this.$t('pageTypes.assetsPage') },
        ],
      };
    },
    methods: {
      ...mapMutations('accounts', [SET_ASSETS]),
      async reload() {
        const { page, limit } = this;
        await this.$api
          .getAssets({ page, limit })
          .then((data) => {
            this.items = data.data.map((assets, index) => ({
              ...assets,
              id: index + 1,
            }));
            this.count = data.count;
            this[SET_ASSETS](data);
          })
          .catch(() => {});
      },
    },
  };
</script>
