<template>
  <div class="main-content">
    <section class="breadcrumbs">
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="page-title ml-2">
              <h2>
                Tezos (XTZ) Blockchain Explorer -
                <span>Delegations page</span>
              </h2>
            </div>

            <ol class="breadcrumb ml-2">
              <li class="breadcrumb-item">
                <router-link :to="{ name: 'index' }">Home</router-link>
              </li>
              <li class="breadcrumb-item active">Delegations page</li>
            </ol>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="card ml-2 mr-2">
              <TzCardHeader>
                <template v-slot:left-content class="text">
                  <h4 class="tz-title--bold">Delegations list</h4>
                </template>
                <template v-slot:right-content class="text">
                  <TzCounter showLine :count="count.delegations" />
                </template>
              </TzCardHeader>

              <div class="card-body">
                <DelegationList />
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
import TzCardHeader from "../common/tz_card_header";
import TzCounter from "../common/tz_counter";
import DelegationList from "../delegations/list.vue";
export default {
  name: "Delegations",
  components: {
    DelegationList,
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
