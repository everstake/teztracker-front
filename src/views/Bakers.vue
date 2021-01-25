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
                    {{ $t('listTypes.bakersList') }}
                  </h4>
                </template>
                <template #right-content class="text">
                  <Counter show-line :count="count" :loading="loading" />
                </template>
              </CardHeader>

              <b-card-body>
                <BakersList
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
  import BakersList from '../components/bakers/BakersList';
  import CardHeader from '../components/partials/CardHeader';
  import Counter from '../components/partials/Counter';
  import { SET_BAKERS } from '@/store/mutations.types';
  import reloadNavigationList from '@/mixins/reloadNavigationList';

  export default {
    name: 'Bakers',
    components: {
      Breadcrumbs,
      BakersList,
      Counter,
      CardHeader,
    },
    mixins: [reloadNavigationList],
    computed: {
      ...mapState('user', ['favorites']),
      crumbs() {
        return [
          { toRouteName: 'network', text: this.$t('common.home') },
          { toRouteName: 'bakers', text: this.$t('pageTypes.allBakersPage') },
        ];
      },
    },
    methods: {
      ...mapMutations('accounts', [SET_BAKERS]),
      async reload() {
        const options = { page: this.page, limit: this.limit, favorites: this.favorites };
        await this.$api
          .getBakers(options)
          .then((data) => {
            this.items = data.data;
            this.count = data.count;
            this[SET_BAKERS](data);
          })
          .catch(() => {});
      },
    },
  };
</script>
