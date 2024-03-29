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
                    {{ $t('listTypes.endorsementsList') }}
                  </h4>
                </template>
                <template #right-content class="text">
                  <Counter show-line :count="count" :loading="loading" />
                </template>
              </CardHeader>

              <b-card-body>
                <EndorsementsList
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
  import EndorsementsList from '../components/endorsements/EndorsementsList';
  import CardHeader from '../components/partials/CardHeader';
  import Counter from '../components/partials/Counter';
  import { SET_ENDORSEMENTS_COUNT } from '@/store/mutations.types';
  import reloadNavigationList from '@/mixins/reloadNavigationList';
  import wsListHandler from '@/mixins/wsListsHandler';

  export default {
    name: 'Endorsements',
    components: {
      Breadcrumbs,
      EndorsementsList,
      CardHeader,
      Counter,
    },
    mixins: [reloadNavigationList, wsListHandler],
    data() {
      return {
        // Expected in wsListHandler.js mixin
        subscriptionChannel: 'endorsements',
      };
    },
    computed: {
      crumbs() {
        return [
          { toRouteName: 'network', text: this.$t('common.home') },
          {
            toRouteName: 'endorsements',
            text: this.$t('pageTypes.endorsementsPage'),
          },
        ];
      },
    },
    methods: {
      ...mapMutations('blocks', [SET_ENDORSEMENTS_COUNT]),
      async reload() {
        const { page, limit } = this;
        await this.$api
          .getEndorsements({ page, limit }, true)
          .then((data) => {
            this.items = data.data;
            this.count = data.count;
            this[SET_ENDORSEMENTS_COUNT](data.count);
          })
          .catch(() => {});
      },
    },
  };
</script>
