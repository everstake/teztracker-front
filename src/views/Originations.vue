<template>
  <PageContentContainer page-name="Originations page">
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
                      {{ $t("listTypes.originationsList") }}
                    </h4>
                  </template>
                  <template #right-content class="text">
                    <Counter show-line :count="count.originations" />
                  </template>
                </CardHeader>

                <b-card-body>
                  <OriginationsList />
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
import OriginationsList from "../components/originations/OriginationsList";
import CardHeader from "../components/partials/CardHeader";
import Counter from "../components/partials/Counter";

export default {
  name: "Originations",
  components: {
    PageContentContainer,
    Breadcrumbs,
    OriginationsList,
    CardHeader,
    Counter
  },
  data() {
    return {
      crumbs: [
        { toRouteName: "network", text: this.$t("common.home") },
        { toRouteName: "originations", text: this.$t("pageTypes.originationsPage") }
      ]
    };
  },
  computed: {
    ...mapState('operations', {
      count: state => state.counts
    })
  }
};
</script>
