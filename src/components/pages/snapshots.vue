<template>
  <div class="main-content">
    <section class="breadcrumbs">
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="page-title ml-2">
              <h2>
                Tezos (XTZ) Blockchain Explorer -
                <span>Snapshots page</span>
              </h2>
            </div>

            <ol class="breadcrumb ml-2">
              <li class="breadcrumb-item">
                <router-link :to="{ name: 'index' }">Home</router-link>
              </li>
              <li class="breadcrumb-item active">Snapshots page</li>
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
                  <h4 class="tz-title--bold">Snapshots list</h4>
                </template>
                <template v-slot:right-content class="text">
                  <TzCounter showLine :count="count.snapshots" />
                </template>
              </TzCardHeader>

              <div class="card-body">
                <SnapshotsList />
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
import SnapshotsList from "../snapshots/list";
import TzCardHeader from "../common/tz_card_header";
import TzCounter from "../common/tz_counter";

export default {
  name: "Snapshots",
  components: {
    SnapshotsList,
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
