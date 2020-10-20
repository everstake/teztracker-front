<template>
  <div>
    <Breadcrumbs :crumbs="crumbs" />

    <section>
      <b-container fluid>
        <b-row>
          <b-col xl="6" class="mb-30">
            <ChartRollsDistribution />
          </b-col>
          <b-col xl="6" class="mb-30">
            <ChartPrioritiesPerCycle />
          </b-col>
        </b-row>

        <b-row>
          <b-col xl="6" class="mb-30">
            <ChartBakersPerDay />
          </b-col>
        </b-row>
      </b-container>
    </section>
  </div>
</template>

<script>
  import Breadcrumbs from '../../components/partials/Breadcrumbs.vue';
  // Charts
  import ChartRollsDistribution from '../../components/charts/baking/ChartRollsDistribution.vue';
  import ChartPrioritiesPerCycle from '../../components/charts/baking/ChartPrioritiesPerCycle.vue';
  import ChartBakersPerDay from '../../components/charts/baking/ChartBakersPerDay.vue';

  export default {
    name: 'ChartsBaking',
    components: {
      Breadcrumbs,
      ChartRollsDistribution,
      ChartPrioritiesPerCycle,
      ChartBakersPerDay,
    },
    computed: {
      crumbs() {
        return [
          { toRouteName: 'network', text: this.$t('common.home') },
          {
            toRouteName: 'accounts',
            text: this.$t('pageTypes.bakingChartsPage'),
          },
        ];
      },
    },
  };
</script>

<style lang="scss" scoped></style>
