<template>
  <PageContentContainer>
    <template #breadcrumbs>
      <Breadcrumbs :crumbs="crumbs" />
    </template>

    <template #content>
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
              <ChartDelegationVolume />
            </b-col>
            <b-col xl="6">
              <ChartNumOfWhaleAccs />
            </b-col>
          </b-row>
        </b-container>
      </section>
    </template>
  </PageContentContainer>
</template>

<script>
import PageContentContainer from "../../layouts/PageContentContainer.vue";
import Breadcrumbs from "../../components/partials/Breadcrumbs.vue";
// Charts
import ChartNumOfBlocks from "../../components/charts/general/ChartNumOfBlocks.vue";
import ChartTxVolume from "../../components/charts/general/ChartTxVolume.vue";
import ChartNumOfOps from "../../components/charts/general/ChartNumOfOps.vue";
import ChartAvgBlockDelay from "../../components/charts/general/ChartAvgBlockDelay.vue";
import ChartFeesPerDay from "../../components/charts/general/ChartFeesPerDay.vue";
import ChartActivations from "../../components/charts/general/ChartActivations.vue";
import ChartDelegationVolume from "../../components/charts/general/ChartDelegationVolume.vue";
import ChartNumOfWhaleAccs from "../../components/charts/general/ChartNumOfWhaleAccs.vue";

export default {
  name: "ChartsGeneral",
  components: {
    PageContentContainer,
    Breadcrumbs,
    ChartNumOfBlocks,
    ChartTxVolume,
    ChartNumOfOps,
    ChartAvgBlockDelay,
    ChartFeesPerDay,
    ChartActivations,
    ChartDelegationVolume,
    ChartNumOfWhaleAccs
  },
  data() {
    return {
      crumbs: [
        { toRouteName: "network", text: this.$t("common.home") },
        {
          toRouteName: "accounts",
          text: this.$t("pageTypes.generalChartsPage")
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped></style>
