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
                <router-link :to="{ name: 'index' }">Home</router-link>
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
              <TzCardHeader>
                <template v-slot:left-content class="text">
                  <h4 class="tz-title--bold">Future Baking Rights</h4>
                </template>
                <template v-slot:right-content class="text">
                  <TzCounter :count="count.future_baking_rights" />
                </template>
              </TzCardHeader>

              <div class="card-body">
                <FutureBakingRightsList />
              </div>
            </div>
            <div class="card mb-3">
              <TzCardHeader>
                <template v-slot:left-content class="text">
                  <h4 class="tz-title--bold">Past Baking Rights</h4>
                </template>
                <template v-slot:right-content class="text">
                  <TzCounter :count="count.baking_rights" />
                </template>
              </TzCardHeader>

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
import BakingRightsList from "../baking_rights/baking_rights";

import TzCardHeader from "../common/tz_card_header";
import TzCounter from "../common/tz_counter";

import FutureBakingRightsList from "../baking_rights/future_baking_rights";
export default {
  name: "BakingRights",
  components: {
    BakingRightsList,
    FutureBakingRightsList,
    TzCardHeader,
    TzCounter
  },
  computed: {
    ...mapState({
      count: state => state.counts
    })
  }
};
</script>

<style />
