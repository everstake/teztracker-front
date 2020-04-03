<template>
  <PageContentContainer page-name="Account page">
    <template #breadcrumbs>
      <Breadcrumbs :crumbs="crumbs" />
    </template>

    <template #content>
      <section>
        <b-container fluid>
          <AccountSingle :hash="hash">
            <template #chart="props">
              <h3 class="card__title account__title">
                <span class="card__title--strong">Balance in the last 30 days</span>
              </h3>
              <LineChart :chartData="chartData" :balance="props.balance" class="account-line-chart"></LineChart>
            </template>
          </AccountSingle>
        </b-container>
      </section>

      <section class="mt-0">
        <b-container fluid>
          <b-row>
            <b-col lg="12">
              <b-card no-body>
                <b-tabs>
                  <b-tab title="Transactions" active>
                    <b-card-header>
                      <div class="break-word">
                        <h3>
                          <span class="text">
                            {{ $t("listTypes.txsList") }}
                          </span>
                        </h3>
                      </div>
                    </b-card-header>

                    <b-card-body>
                      <TxsList @onTransactions="setChartData" :account="hash" />
                    </b-card-body>
                  </b-tab>
                  <b-tab title="Delegations">
                    <b-card-header>
                      <div class="break-word">
                        <h3>
                          <span class="text">
                            {{ $t("listTypes.delegationsList") }}
                          </span>
                        </h3>
                      </div>
                    </b-card-header>

                    <b-card-body>
                      <DelegationsList :account="hash" />
                    </b-card-body>
                  </b-tab>
                  <b-tab title="Originations">
                    <b-card-header>
                      <div class="break-word">
                        <h3>
                          <span class="text">
                            {{ $t("listTypes.originationsList") }}
                          </span>
                        </h3>
                      </div>
                    </b-card-header>

                    <b-card-body>
                      <OriginationsList :account="hash" />
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
                      <OperationsList :account="hash"/>
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
import LineChart from "@/components/partials/LineChart";
import OperationsList from "@/components/operations/OperationsList";

export default {
  name: "Account",
  components: {
    PageContentContainer,
    Breadcrumbs,
    AccountSingle,
    TxsList,
    DelegationsList,
    OriginationsList,
    LineChart,
    OperationsList
  },
  data() {
    return {
      chartData: null
    }
  },
  methods: {
    async setChartData(acc) {
      if (acc !== undefined) {
        const now = new Date();
        const oneMonthAgo = now.setMonth(now.getMonth() - 1);
        const balance = await this.$api.getAccountBalance({ account: acc, from: Math.round(oneMonthAgo / 1000), to: Math.round((new Date()).getTime() / 1000) });
        this.chartData = balance.data;
        return balance.data;
      }
    }
  },
  async mounted() {
    await this.setChartData();
  },
  computed: {
    hash() {
      return this.$route.params.account;
    },
    crumbs() {
      return [
        { toRouteName: "network", text: this.$t("common.home") },
        { toRouteName: "accounts", text: this.$t("pageTypes.accsPage") },
        { toRouteName: "account", text: this.hash }
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
.account {
  &__title {
    display: block;
  }

  &-line-chart {
    width: 100% !important;
    height: auto;
    max-height: 350px;
  }
}
</style>
