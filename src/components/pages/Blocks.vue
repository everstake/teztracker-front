<template>
  <div class="main-content">
    <section class="breadcrumbs">
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="page-title ml-2">
              <h2>
                Tezos (XTZ) Blockchain Explorer -
                <span>Blocks page</span>
              </h2>
            </div>

            <ol class="breadcrumb ml-2">
              <li class="breadcrumb-item">
                <router-link :to="{ name: 'network' }">Home</router-link>
              </li>
              <li class="breadcrumb-item active">Blocks Page</li>
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
                  <h4 class="tz-title--bold">Blocks list</h4>
                </template>
                <template v-slot:right-content class="text">
                  <TzCounter showLine :count="count.blocks" />
                </template>
              </TzCardHeader>

              <div class="card-body">
                <BlocksList />
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
import BlocksList from "../blocks/BlocksList.vue";
import TzCardHeader from "../common/tz_card_header";
import TzCounter from "../common/tz_counter";

export default {
  name: "Blocks",
  components: {
    BlocksList,
    TzCardHeader,
    TzCounter
  },
  computed: {
    ...mapState('blocks', {
      count: state => state.counts
    })
  }
};
</script>

<style />
