<template>
  <PageContentContainer page-name="Public bakers page">
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
                      {{ $t("listTypes.publicBakersList") }}
                    </h4>
                  </template>
                  <template #right-content class="text">
                    <Counter show-line :count="count.publicBakers" />
                  </template>
                </CardHeader>

                <b-card-body>
                  <BakersListPublic />
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
import BakersListPublic from "../components/bakers/BakersListPublic";
import CardHeader from "../components/partials/CardHeader";
import Counter from "../components/partials/Counter";

export default {
  name: "BakersPublic",
  components: {
    PageContentContainer,
    Breadcrumbs,
    BakersListPublic,
    Counter,
    CardHeader
  },
  data() {
    return {
      crumbs: [
        { toRouteName: "network", text: this.$t("common.home") },
        {
          toRouteName: "public_bakers",
          text: this.$t("pageTypes.publicBakersPage")
        }
      ]
    };
  },
  computed: {
    ...mapState("accounts", {
      count: state => state.counts
    })
  }
};
</script>
