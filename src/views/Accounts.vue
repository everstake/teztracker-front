<template>
  <div class="main-content">
    <section class="breadcrumbs">
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="page-title ml-2">
              <h2>
                Tezos (XTZ) Blockchain Explorer -
                <span>Accounts page</span>
              </h2>
            </div>

            <ol class="breadcrumb ml-2">
              <li class="breadcrumb-item">
                <router-link :to="{ name: 'network' }">Home</router-link>
              </li>
              <li class="breadcrumb-item active">Accounts page</li>
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
              <CardHeader>
                <template v-slot:left-content class="text">
                  <h4 class="tz-title--bold">Accounts list</h4>
                </template>
                <template v-slot:right-content class="text">
                  <Counter show-line :count="count.accounts" />
                </template>
              </CardHeader>

              <div class="card-body">
                <AccountsList />
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
import AccountsList from "../components/accounts/AccountsList";
import CardHeader from "../components/partials/CardHeader";
import Counter from "../components/partials/Counter";

export default {
  name: "Accounts",
  components: {
    AccountsList,
    Counter,
    CardHeader
  },
  computed: {
    ...mapState('accounts', {
      count: state => state.counts
    })
  }
};
</script>
