<template>
  <PageContentContainer>
    <template #breadcrumbs>
      <Breadcrumbs :crumbs="crumbs" />
    </template>

    <template #content>
      <section>
        <b-container fluid>
          <b-row>
            <b-col>
              <ChartNumOfBlocks />
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

export default {
  name: "ChartsGeneral",
  components: {
    PageContentContainer,
    Breadcrumbs,
    ChartNumOfBlocks
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

<style scoped></style>
