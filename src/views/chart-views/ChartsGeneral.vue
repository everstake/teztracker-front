<template>
  <div>
    <Breadcrumbs :crumbs="crumbs" />

    <section>
      <b-container fluid>
        <b-row>
          <b-col xl="6" class="mb-30">
            <ChartNumOfBlocks />
          </b-col>
          <b-col xl="6" class="mb-30">
            <ChartTxVolume />
          </b-col>
        </b-row>

        <b-row>
          <b-col xl="6" class="mb-30">
            <ChartNumOfOps />
          </b-col>
          <b-col xl="6" class="mb-30">
            <ChartAvgBlockDelay />
          </b-col>
        </b-row>

        <b-row>
          <b-col xl="6" class="mb-30">
            <ChartFeesPerDay />
          </b-col>
          <b-col xl="6" class="mb-30">
            <ChartActivations />
          </b-col>
        </b-row>

        <b-row>
          <b-col xl="6" class="mb-30">
            <ChartDelegationVolume class="chart-min-height" />
          </b-col>
          <b-col xl="6">
            <ChartNumOfWhaleAccs />
          </b-col>
        </b-row>
      </b-container>
    </section>
  </div>
</template>

<script>
  import Breadcrumbs from '../../components/partials/Breadcrumbs.vue';
  // Charts
  import ChartNumOfBlocks from '../../components/charts/general/ChartNumOfBlocks.vue';
  import ChartTxVolume from '../../components/charts/general/ChartTxVolume.vue';
  import ChartNumOfOps from '../../components/charts/general/ChartNumOfOps.vue';
  import ChartAvgBlockDelay from '../../components/charts/general/ChartAvgBlockDelay.vue';
  import ChartFeesPerDay from '../../components/charts/general/ChartFeesPerDay.vue';
  import ChartActivations from '../../components/charts/general/ChartActivations.vue';
  import ChartDelegationVolume from '../../components/charts/general/ChartDelegationVolume.vue';
  import ChartNumOfWhaleAccs from '../../components/charts/general/ChartNumOfWhaleAccs.vue';

  export default {
    name: 'ChartsGeneral',
    components: {
      Breadcrumbs,
      ChartNumOfBlocks,
      ChartTxVolume,
      ChartNumOfOps,
      ChartAvgBlockDelay,
      ChartFeesPerDay,
      ChartActivations,
      ChartDelegationVolume,
      ChartNumOfWhaleAccs,
    },
    computed: {
      crumbs() {
        return [
          { toRouteName: 'network', text: this.$t('common.home') },
          {
            toRouteName: 'accounts',
            text: this.$t('pageTypes.generalChartsPage'),
          },
        ];
      },
    },
  };
</script>

<style lang="scss" scoped>
  @media (min-width: 1200px) {
    .chart-min-height {
      min-height: 499px;
    }
  }
</style>
