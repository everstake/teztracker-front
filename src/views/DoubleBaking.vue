<template>
  <PageContentContainer page-name="Double-baking page">
    <template #breadcrumbs>
      <Breadcrumbs :crumbs="crumbs" />
    </template>

    <template #content>
      <section>
        <b-container fluid>
          <b-row>
            <b-col lg="12">
              <b-card no-body>
                <CardHeader>
                  <template #left-content class="text">
                    <h4 class="tz-title--bold">
                      {{ $t("listTypes.dblBakingList") }}
                    </h4>
                  </template>
                  <template #right-content class="text">
                    <Counter show-line :count="count.double_baking" />
                  </template>
                </CardHeader>

                <b-card-body>
                  <DoubleBakingList />
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
import { mapState } from "vuex";
import PageContentContainer from "../layouts/PageContentContainer";
import Breadcrumbs from "../components/partials/Breadcrumbs";
import DoubleBakingList from "../components/double_baking/DoubleBakingList.vue";
import CardHeader from "../components/partials/CardHeader";
import Counter from "../components/partials/Counter";

export default {
  name: "DoubleBaking",
  components: {
    PageContentContainer,
    Breadcrumbs,
    DoubleBakingList,
    CardHeader,
    Counter
  },
  data() {
    return {
      crumbs: [
        { toRouteName: "network", text: this.$t("common.home") },
        {
          toRouteName: "double_baking",
          text: this.$t("pageTypes.dblBakingPage")
        }
      ]
    };
  },
  computed: {
    ...mapState("operations", {
      count: state => state.counts
    })
  }
};
</script>
