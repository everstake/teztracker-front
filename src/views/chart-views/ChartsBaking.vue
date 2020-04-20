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
              <ChartRollsDistribution />
            </b-col>
            <b-col xl="6" class="mb-30">
              Chart
            </b-col>
          </b-row>

          <b-row>
            <b-col xl="6" class="mb-30">
              <ChartBakersPerDay />
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
import ChartBakersPerDay from "../../components/charts/baking/ChartBakersPerDay.vue";
import ChartRollsDistribution from "../../components/charts/baking/ChartRollsDistribution.vue";

export default {
  name: "ChartsBaking",
  components: {
    PageContentContainer,
    Breadcrumbs,
    ChartBakersPerDay,
    ChartRollsDistribution
  },
  data() {
    return {
      crumbs: [
        { toRouteName: "network", text: this.$t("common.home") },
        { toRouteName: "accounts", text: this.$t("pageTypes.bakingChartsPage") }
      ]
    };
  }
};
</script>

<style lang="scss" scoped></style>
