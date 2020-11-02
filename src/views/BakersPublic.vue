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
                    {{ $t('listTypes.publicBakersList') }}
                  </h4>
                </template>
                <template #right-content class="text">
                  <Counter show-line :count="count" />
                </template>
              </CardHeader>

              <b-card-body>
                <BakersListPublic
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
  import BakersListPublic from '../components/bakers/BakersListPublic';
  import CardHeader from '../components/partials/CardHeader';
  import Counter from '../components/partials/Counter';
  import { SET_PUBLIC_BAKERS } from '@/store/mutations.types';
  import reloadNavigationList from '@/mixins/reloadNavigationList';

  export default {
    name: 'BakersPublic',
    components: {
      Breadcrumbs,
      BakersListPublic,
      Counter,
      CardHeader,
    },
    mixins: [reloadNavigationList],
    computed: {
      crumbs() {
        return [
          { toRouteName: 'network', text: this.$t('common.home') },
          {
            toRouteName: 'public_bakers',
            text: this.$t('pageTypes.publicBakersPage'),
          },
        ];
      },
    },
    methods: {
      ...mapMutations('accounts', [SET_PUBLIC_BAKERS]),
      async reload() {
        const { page, limit } = this;
        const data = await this.$api.getPublicBakers({ page, limit });
        this.items = data.data;
        this.count = data.count;
        this[SET_PUBLIC_BAKERS](data);
      },
    },
  };
</script>
