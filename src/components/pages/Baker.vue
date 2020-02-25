<template>
  <div class="main-content">
    <section class="breadcrumbs">
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="page-title ml-2">
              <h2>
                Tezos (XTZ) Blockchain Explorer -
                <span>Baker page</span>
              </h2>
            </div>

            <ol class="breadcrumb ml-2">
              <li class="breadcrumb-item">
                <router-link :to="{ name: 'index' }">Home</router-link>
              </li>
              <li class="breadcrumb-item">
                <router-link :to="{ name: 'bakers' }">Bakers</router-link>
              </li>
              <li class="breadcrumb-item active">{{ hash }}</li>
            </ol>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="container-fluid">
        <AccountSingle :hash="hash" />
      </div>
    </section>

    <section>
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="card ml-2 mr-2">
              <!-- Nav tabs -->
              <ul class="nav nav-tabs">
                <li class="nav-item">
                  <a
                    class="nav-link active"
                    data-toggle="tab"
                    href="#transactions"
                    >Transactions</a
                  >
                </li>
                <li class="nav-item">
                  <a class="nav-link" data-toggle="tab" href="#delegations"
                    >Delegations</a
                  >
                </li>
                <li class="nav-item">
                  <a class="nav-link" data-toggle="tab" href="#originations"
                    >Originations</a
                  >
                </li>
              </ul>

              <!-- Tab panes -->
              <div class="tab-content">
                <div class="tab-pane active" id="transactions">
                  <div class="card-header">
                    <div class="title">
                      <h3>
                        <span class="text">Transactions list</span>
                      </h3>
                    </div>
                  </div>

                  <div class="card-body">
                    <TxsList :account="hash" />
                  </div>
                </div>

                <div class="tab-pane" id="delegations">
                  <div class="card-header">
                    <div class="title">
                      <h3>
                        <span class="text">Delegations</span>
                      </h3>
                    </div>
                  </div>

                  <div class="card-body">
                    <DelegationsList :account="hash" />
                  </div>
                </div>
                <div class="tab-pane" id="originations">
                  <div class="card-header">
                    <div class="title">
                      <h3>
                        <span class="text">Originations</span>
                      </h3>
                    </div>
                  </div>

                  <div class="card-body">
                    <OriginationsList :account="hash" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import AccountSingle from "../accounts/AccountSingle";
import TxsList from "../transactions/TxsList";
import DelegationsList from "../delegations/DelegationsList";
import OriginationsList from "../originations/OriginationsList";

export default {
  name: "Baker",
  components: {
    AccountSingle,
    TxsList,
    DelegationsList,
    OriginationsList
  },
  computed: {
    hash() {
      return this.$route.params.baker;
    }
  }
};
</script>

<style />
