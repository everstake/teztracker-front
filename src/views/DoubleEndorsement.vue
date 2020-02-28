<template>
  <div class="main-content">
    <section class="breadcrumbs">
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="page-title ml-2">
              <h2>
                Tezos (XTZ) Blockchain Explorer -
                <span>Double Endorsement page</span>
              </h2>
            </div>

            <ol class="breadcrumb ml-2">
              <li class="breadcrumb-item">
                <router-link :to="{ name: 'network' }">Home</router-link>
              </li>
              <li class="breadcrumb-item active">Double Endorsement page</li>
            </ol>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="card">
              <CardHeader>
                <template v-slot:left-content class="text">
                  <h4 class="tz-title--bold">Double Endorsement list</h4>
                </template>
                <template v-slot:right-content class="text">
                  <Counter :count="count.double_endorsement" />
                </template>
              </CardHeader>

              <div class="card-body">
                <DoubleEndorsementList />
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
import DoubleEndorsementList from "../components/double_endorsement/DoubleEndorsementList";
import CardHeader from "../components/partials/CardHeader";
import Counter from "../components/partials/Counter";

export default {
  name: "DoubleEndorsement",
  components: {
    DoubleEndorsementList,
    CardHeader,
    Counter
  },
  computed: {
    ...mapState('operations', {
      count: state => state.counts
    })
  }
};
</script>
