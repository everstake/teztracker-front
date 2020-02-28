<template>
  <PageContentContainer page-name="Transactions page">
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
                    <h4 class="tz-title--bold">Transactions list</h4>
                  </template>
                  <template #right-content class="text">
                    <Counter show-line :count="count.txs"/>
                  </template>
                </CardHeader>

                <b-card-body>
                  <TxsList />
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
import TxsList from "../components/transactions/TxsList";
import CardHeader from "../components/partials/CardHeader";
import Counter from "../components/partials/Counter";

export default {
  name: "Txs",
  components: {
    PageContentContainer,
    Breadcrumbs,
    TxsList,
    CardHeader,
    Counter
  },
  data() {
    return {
      crumbs: [
        { toRouteName: "network", text: "Home" },
        { toRouteName: "txs", text: "Transactions page" }
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
