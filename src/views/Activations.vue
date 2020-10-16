<template>
  <PageContentContainer page-name="Activations page">
    <template #breadcrumbs>
      <Breadcrumbs :crumbs="crumbs" />
    </template>

    <template #content>
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
                    <Counter show-line :count="count.activations" />
                  </template>
                </CardHeader>

                <b-card-body>
                  <ActivationsList />
                </b-card-body>
              </b-card>
            </b-col>
          </b-row>
        </b-container>
      </section>
    </template>
  </PageContentContainer>
</template>

<script>
  import { mapState } from 'vuex';
  import PageContentContainer from '../layouts/PageContentContainer';
  import Breadcrumbs from '../components/partials/Breadcrumbs';
  import ActivationsList from '../components/activations/ActivationsList.vue';
  import ICOCycleCounter from '../components/partials/cycle/ICOCycleCounter.vue';
  import CardHeader from '../components/partials/CardHeader';
  import Counter from '../components/partials/Counter';

  export default {
    name: 'Activations',
    components: {
      PageContentContainer,
      Breadcrumbs,
      ActivationsList,
      ICOCycleCounter,
      CardHeader,
      Counter,
    },
    computed: {
      ...mapState('operations', {
        count: (state) => state.counts,
      }),
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
        const num = this.count.activations;
        return parseFloat(
          ((num * 100) / this.$constants.ALL_ICO_ACTIVE_ADDRESSES).toFixed(2),
        );
      },
    },
  };
</script>
