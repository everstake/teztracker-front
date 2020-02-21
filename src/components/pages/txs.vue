<template>
  <div class="main-content">
    <section class="breadcrumbs">
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="page-title ml-2">
              <h2>
                Tezos (XTZ) Blockchain Explorer -
                <span>Transactions page</span>
              </h2>
            </div>

            <ol class="breadcrumb ml-2">
              <li class="breadcrumb-item">
                <router-link :to="{ name: 'index' }">Home</router-link>
              </li>
              <li class="breadcrumb-item active">Transactions page</li>
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
                    <span class="text">Transactions list</span>
                    <div class="counter">
                      <span class="line"></span>
                      <span class="counter-text">{{ count.txs | bignum }}</span>
                    </div>
                  </h3>
                </div>
              </div>

              <div class="card-body">
                <TxsList />
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
import TxsList from "../transactions/transactions.vue";
export default {
  name: "Txs",
  components: {
    TxsList
  },
  computed: {
    ...mapState('operations', {
      count: state => state.counts
    })
  }
};
</script>

<style />
