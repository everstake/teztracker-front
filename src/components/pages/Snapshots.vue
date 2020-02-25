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
                <router-link :to="{ name: 'network' }">Home</router-link>
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
            <div class="card ml-2 mr-2">
              <div class="card-header">
                <div class="title">
                  <h3>
                    <span class="text">Snapshots list</span>
                    <div class="counter">
                      <span class="line"></span>
                      <span class="counter-text">
                        {{
                        count.snapshots | bignum
                        }}
                      </span>
                    </div>
                  </h3>
                </div>
              </div>

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
import SnapshotsList from "../snapshots/SnapshotsList";

export default {
  name: "Snapshots",
  components: {
    SnapshotsList
  },
  computed: {
    ...mapState('blocks', {
      count: state => state.counts
    })
  }
};
</script>

<style />
