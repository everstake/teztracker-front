<template>
  <PageContentContainer page-name="Delegations page">
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
                    <h4 class="tz-title--bold">Delegations list</h4>
                  </template>
                  <template #right-content class="text">
                    <Counter show-line :count="count.delegations"/>
                  </template>
                </CardHeader>

                <b-card-body>
                  <DelegationList />
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
import DelegationList from "../components/delegations/DelegationsList";
import CardHeader from "../components/partials/CardHeader";
import Counter from "../components/partials/Counter";

export default {
  name: "Delegations",
  components: {
    PageContentContainer,
    Breadcrumbs,
    DelegationList,
    CardHeader,
    Counter
  },
  data() {
    return {
      crumbs: [
        { toRouteName: "network", text: "Home" },
        { toRouteName: "delegations", text: "Delegations page" }
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
