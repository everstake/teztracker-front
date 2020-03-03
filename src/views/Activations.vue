<template>
  <div class="main-content">
    <section class="breadcrumbs">
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="page-title ml-2">
              <h2>
                Tezos (XTZ) Blockchain Explorer -
                <span>Activations page</span>
              </h2>
            </div>

            <ol class="breadcrumb ml-2">
              <li class="breadcrumb-item">
                <router-link :to="{ name: 'network' }">Home</router-link>
              </li>
              <li class="breadcrumb-item active">Activations page</li>
            </ol>
          </div>
        </div>
      </div>
    </section>
    <ICOCycleCounter v-bind:percent="getPercentage" />

    <section>
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="card">
              <CardHeader>
                <template v-slot:left-content class="text">
                  <h4 class="tz-title--bold">Activations list</h4>
                </template>
                <template v-slot:right-content class="text">
                  <Counter show-line :count="count.activations" />
                </template>
              </CardHeader>

              <div class="card-body">
                <ActivationsList />
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
import ActivationsList from "../components/activations/ActivationsList.vue";
import ICOCycleCounter from "../components/partials/cycle/ICOCycleCounter.vue";
import CardHeader from "../components/partials/CardHeader";
import Counter from "../components/partials/Counter";

export default {
  name: "Activations",
  components: {
    ActivationsList,
    ICOCycleCounter,
    CardHeader,
    Counter
  },
  computed: {
    ...mapState('operations', {
      count: state => state.counts
    }),
    getPercentage() {
      const num = this.count.activations;
      return parseFloat(
        ((num * 100) / this.$constants.ALL_ICO_ACTIVE_ADDRESSES).toFixed(2)
      );
    }
  }
};
</script>