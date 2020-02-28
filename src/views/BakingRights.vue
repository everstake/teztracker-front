<template>
  <div class="main-content">
    <section class="breadcrumbs">
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="page-title ml-2">
              <h2>
                Tezos (XTZ) Blockchain Explorer -
                <span>Baking Rights</span>
              </h2>
            </div>

            <ol class="breadcrumb ml-2">
              <li class="breadcrumb-item">
                <router-link :to="{ name: 'network' }">Home</router-link>
              </li>
              <li class="breadcrumb-item active">Baking Rights</li>
            </ol>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="card mb-3">
              <CardHeader>
                <template v-slot:left-content class="text">
                  <h4 class="tz-title--bold">Future Baking Rights</h4>
                </template>
                <template v-slot:right-content class="text">
                  <Counter :count="count.future_baking_rights" />
                </template>
              </CardHeader>

              <div class="card-body">
                <FutureBakingRightsList />
              </div>
            </div>
            <div class="card mb-3">
              <CardHeader>
                <template v-slot:left-content class="text">
                  <h4 class="tz-title--bold">Past Baking Rights</h4>
                </template>
                <template v-slot:right-content class="text">
                  <Counter :count="count.baking_rights" />
                </template>
              </CardHeader>

              <div class="card-body">
                <BakingRightsList />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from "vuex";
import BakingRightsList from "../components/baking_rights/BakingRightsList";
import FutureBakingRightsList from "../components/baking_rights/FutureBakingRightsList";
import CardHeader from "../components/partials/CardHeader";
import Counter from "../components/partials/Counter";

export default {
  name: "BakingRights",
  components: {
    BakingRightsList,
    FutureBakingRightsList,
    CardHeader,
    Counter
  },
  computed: {
    ...mapState('blocks', {
      count: state => state.counts
    })
  }
};
</script>
