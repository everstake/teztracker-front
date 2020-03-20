<template>
  <PageContentContainer page-name="Account page">
    <template #breadcrumbs>
      <Breadcrumbs :crumbs="crumbs"/>
    </template>

    <template #content>
      <section>
        <b-container fluid>
          <AccountSingle :hash="hash"/>
        </b-container>
      </section>

      <section>
        <b-container fluid>
          <b-row>
            <b-col lg="12">
              <b-card no-body>
                <b-tabs>
                  <b-tab title="Transactions" active>
                    <b-card-header>
                      <div class="break-word">
                        <h3>
                          <span class="text">Transactions list</span>
                        </h3>
                      </div>
                    </b-card-header>

                    <b-card-body>
                      <TxsList :account="hash"/>
                    </b-card-body>
                  </b-tab>
                  <b-tab title="Delegations">
                    <b-card-header>
                      <div class="break-word">
                        <h3>
                          <span class="text">Delegations</span>
                        </h3>
                      </div>
                    </b-card-header>

                    <b-card-body>
                      <DelegationsList :account="hash"/>
                    </b-card-body>
                  </b-tab>
                  <b-tab title="Originations">
                    <b-card-header>
                      <div class="break-word">
                        <h3>
                          <span class="text">Originations</span>
                        </h3>
                      </div>
                    </b-card-header>

                    <b-card-body>
                      <OriginationsList :account="hash"/>
                    </b-card-body>
                  </b-tab>
                  <b-tab title="Other">
                    <b-card-header>
                      <div class="break-word">
                        <h3>
                          <span class="text">Other operations</span>
                        </h3>
                      </div>
                    </b-card-header>

                    <b-card-body>
<!--                      <OperationsList :account="hash"/>-->
                    </b-card-body>
                  </b-tab>
                </b-tabs>
              </b-card>
            </b-col>
          </b-row>
        </b-container>
      </section>
    </template>
  </PageContentContainer>
</template>

<script>
  import PageContentContainer from "../layouts/PageContentContainer";
  import Breadcrumbs from "../components/partials/Breadcrumbs";
  import AccountSingle from "../components/accounts/AccountSingle";
  import TxsList from "../components/transactions/TxsList";
  import DelegationsList from "../components/delegations/DelegationsList";
  import OriginationsList from "../components/originations/OriginationsList";

  export default {
    name: "Account",
    components: {
      PageContentContainer,
      Breadcrumbs,
      AccountSingle,
      TxsList,
      DelegationsList,
      OriginationsList
    },
    computed: {
      hash() {
        return this.$route.params.account;
      },
      crumbs() {
        return [
          {toRouteName: "network", text: "Home"},
          {toRouteName: "accounts", text: "Accounts page"},
          {toRouteName: "account", text: this.hash}
        ];
      }
    }
  };
</script>
