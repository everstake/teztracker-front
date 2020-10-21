<template>
  <div>
    <Breadcrumbs :crumbs="crumbs" />

    <section>
      <b-container fluid>
        <AccountSingle :hash="hash">
          <template #chart="props">
            <ChartBalanceLast30Days :acc="acc" />
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
                <b-tab :title="$tc('opTypes.tx', 2)" active>
                  <b-card-header>
                    <div class="break-word">
                      <h3>
                        <span class="text">
                          {{ $t('listTypes.txsList') }}
                        </span>
                      </h3>
                    </div>
                  </b-card-header>

                  <b-card-body>
                    <TxsList :account="hash" @onTransactions="setChartData" />
                  </b-card-body>
                </b-tab>
                <b-tab :title="$tc('opTypes.delegation', 2)">
                  <b-card-header>
                    <div class="break-word">
                      <h3>
                        <span class="text">
                          {{ $t('listTypes.delegationsList') }}
                        </span>
                      </h3>
                    </div>
                  </b-card-header>

                  <b-card-body>
                    <DelegationsList :account="hash" />
                  </b-card-body>
                </b-tab>
                <b-tab :title="$tc('opTypes.origination', 2)">
                  <b-card-header>
                    <div class="break-word">
                      <h3>
                        <span class="text">
                          {{ $t('listTypes.originationsList') }}
                        </span>
                      </h3>
                    </div>
                  </b-card-header>

                  <b-card-body>
                    <OriginationsList :account="hash" />
                  </b-card-body>
                </b-tab>
                <b-tab :title="$t('common.other')">
                  <b-card-header>
                    <div class="break-word">
                      <h3>
                        <span class="text">
                          {{ $t('listTypes.otherOpsList') }}
                        </span>
                      </h3>
                    </div>
                  </b-card-header>

                  <b-card-body>
                    <OperationsList :account="hash" />
                  </b-card-body>
                </b-tab>
              </b-tabs>
            </b-card>
          </b-col>
        </b-row>
      </b-container>
    </section>
  </div>
</template>

<script>
  import Breadcrumbs from '../components/partials/Breadcrumbs';
  import AccountSingle from '../components/accounts/AccountSingle';
  import ChartBalanceLast30Days from '@/components/charts/account/ChartBalanceLast30Days';
  import TxsList from '../components/transactions/TxsList';
  import DelegationsList from '../components/delegations/DelegationsList';
  import OriginationsList from '../components/originations/OriginationsList';
  import OperationsList from '@/components/operations/OperationsList';

  export default {
    name: 'Account',
    components: {
      Breadcrumbs,
      AccountSingle,
      TxsList,
      DelegationsList,
      OriginationsList,
      OperationsList,
      ChartBalanceLast30Days,
    },
    props: {
      accountType: {
        type: String,
        default: 'account',
      },
    },
    data() {
      return {
        chartData: null,
        acc: '',
      };
    },
    computed: {
      hash() {
        return this.$route.params.account;
      },
      crumbs() {
        return [
          { toRouteName: 'network', text: this.$t('common.home') },
          { toRouteName: 'accounts', text: this.$t('pageTypes.accsPage') },
          { toRouteName: 'account', text: this.hash },
        ];
      },
    },
    methods: {
      setChartData(acc) {
        this.acc = acc;
      },
    },
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
