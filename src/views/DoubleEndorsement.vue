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
                    {{ $t('listTypes.dblEndorsementsList') }}
                  </h4>
                </template>
                <template #right-content class="text">
                  <Counter show-line :count="count" />
                </template>
              </CardHeader>

              <b-card-body>
                <DoubleEndorsementList
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
  import DoubleEndorsementList from '../components/double_endorsement/DoubleEndorsementList';
  import CardHeader from '../components/partials/CardHeader';
  import Counter from '../components/partials/Counter';
  import { SET_DOUBLE_ENDORSEMENT_COUNT } from '@/store/mutations.types';
  import reloadNavigationList from '@/mixins/reloadNavigationList';

  export default {
    name: 'DoubleEndorsement',
    components: {
      Breadcrumbs,
      DoubleEndorsementList,
      CardHeader,
      Counter,
    },
    mixins: [reloadNavigationList],
    computed: {
      crumbs() {
        return [
          { toRouteName: 'network', text: this.$t('common.home') },
          {
            toRouteName: 'double_endorsement',
            text: this.$t('pageTypes.dblEndorsementsPage'),
          },
        ];
      },
    },
    methods: {
      ...mapMutations('operations', [SET_DOUBLE_ENDORSEMENT_COUNT]),
      async reload() {
        const { page, limit } = this;
        const data = await this.$api.getDoubleEndorsement({ page, limit });
        this.items = data.data;
        this.count = data.count;
        this[SET_DOUBLE_ENDORSEMENT_COUNT](data.count);
      },
    },
  };
</script>
