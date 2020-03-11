<template>
  <PageContentContainer page-name="Snapshots page">
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
                    <h4 class="tz-title--bold">Snapshots list</h4>
                  </template>
                  <template #right-content class="text">
                    <Counter show-line :count="count.snapshots"/>
                  </template>
                </CardHeader>

                <b-card-body>
                  <SnapshotsList />
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
import SnapshotsList from "../components/snapshots/SnapshotsList";
import CardHeader from "../components/partials/CardHeader";
import Counter from "../components/partials/Counter";

export default {
  name: "Snapshots",
  components: {
    PageContentContainer,
    Breadcrumbs,
    SnapshotsList,
    CardHeader,
    Counter
  },
  data() {
    return {
      crumbs: [
        { toRouteName: "network", text: "Home" },
        { toRouteName: "snapshots", text: "Snapshots page" }
      ]
    };
  },
  computed: {
    ...mapState('blocks', {
      count: state => state.counts
    })
  }
};
</script>
