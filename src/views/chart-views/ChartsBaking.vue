<template>
  <PageContentContainer>
    <template #breadcrumbs>
      <Breadcrumbs :crumbs="crumbs" />
    </template>

    <template #content>
      <section>
        <b-container fluid>
          Baking charts
        </b-container>
      </section>
    </template>
  </PageContentContainer>
</template>

<script>
import PageContentContainer from "../../layouts/PageContentContainer.vue";
import Breadcrumbs from "../../components/partials/Breadcrumbs.vue";

export default {
  name: "ChartsBaking",
  components: {
    PageContentContainer,
    Breadcrumbs
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

<style scoped></style>
