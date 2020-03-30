<template>
  <PageContentContainer page-name="Contracts page">
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
                      {{ $t("listTypes.contractsList") }}
                    </h4>
                  </template>
                  <template #right-content class="text">
                    <Counter show-line :count="count.contracts" />
                  </template>
                </CardHeader>

                <b-card-body>
                  <ContractsList />
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
import ContractsList from "../components/contracts/ContractsList";
import CardHeader from "../components/partials/CardHeader";
import Counter from "../components/partials/Counter";

export default {
  name: "Contracts",
  components: {
    PageContentContainer,
    Breadcrumbs,
    ContractsList,
    Counter,
    CardHeader
  },
  data() {
    return {
      crumbs: [
        { toRouteName: "network", text: this.$t("common.home") },
        { toRouteName: "contracts", text: this.$t("pageTypes.contractsPage") }
      ]
    };
  },
  computed: {
    ...mapState('accounts', {
      count: state => state.counts
    })
  }
};
</script>
