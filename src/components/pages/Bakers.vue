<template>
  <div class="main-content">
    <section class="breadcrumbs">
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="page-title ml-2">
              <h2>
                Tezos (XTZ) Blockchain Explorer -
                <span>Bakers page</span>
              </h2>
            </div>

            <ol class="breadcrumb ml-2">
              <li class="breadcrumb-item">
                <router-link :to="{ name: 'index' }">Home</router-link>
              </li>
              <li class="breadcrumb-item active">Bakers page</li>
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
              <TzCardHeader>
                <template v-slot:left-content class="text">
                  <h4 class="tz-title--bold">Bakers list</h4>
                </template>
                <template v-slot:right-content class="text">
                  <TzCounter showLine :count="count.bakers" />
                </template>
              </TzCardHeader>

              <div class="card-body">
                <BakersList />
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
import BakersList from "../bakers/BakersList";
import TzCardHeader from "../common/tz_card_header";
import TzCounter from "../common/tz_counter";

export default {
  name: "Bakers",
  components: {
    BakersList,
    TzCounter,
    TzCardHeader
  },
  computed: {
    ...mapState('accounts', {
      count: state => state.counts
    })
  }
};
</script>

<style />
