<template>
  <div>
    <Breadcrumbs :crumbs="crumbs" />

    <ICOCycleCounter :percent="getPercentage" />

    <section>
      <b-container fluid>
        <b-row>
          <b-col lg="12">
            <b-card no-body>
              <CardHeader>
                <template #left-content class="text">
                  <h4 class="tz-title--bold">
                    {{ $t('listTypes.activationsList') }}
                  </h4>
                </template>
                <template #right-content class="text">
                  <Counter show-line :count="count" :loading="loading" />
                </template>
              </CardHeader>

              <b-card-body>
                <ActivationsList
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
  import ActivationsList from '../components/activations/ActivationsList.vue';
  import ICOCycleCounter from '../components/partials/cycle/ICOCycleCounter.vue';
  import CardHeader from '../components/partials/CardHeader';
  import Counter from '../components/partials/Counter';
  import { SET_ACTIVATIONS_COUNT } from '@/store/mutations.types';
  import reloadNavigationList from '@/mixins/reloadNavigationList';

  export default {
    name: 'Activations',
    components: {
      Breadcrumbs,
      ActivationsList,
      ICOCycleCounter,
      CardHeader,
      Counter,
    },
    mixins: [reloadNavigationList],
    computed: {
      crumbs() {
        return [
          { toRouteName: 'network', text: this.$t('common.home') },
          {
            toRouteName: 'activations',
            text: this.$t('pageTypes.activationsPage'),
          },
        ];
      },
      getPercentage() {
        const num = this.count;
        return parseFloat(
          ((num * 100) / this.$constants.ALL_ICO_ACTIVE_ADDRESSES).toFixed(2),
        );
      },
    },
    methods: {
      ...mapMutations('operations', [SET_ACTIVATIONS_COUNT]),
      async reload() {
        const { page, limit } = this;
        await this.$api
          .getActivations({ page, limit })
          .then((data) => {
            this.items = data.data;
            this.count = data.count;
            this[SET_ACTIVATIONS_COUNT](data.count);
          })
          .catch(() => {});
      },
    },
  };
</script>
