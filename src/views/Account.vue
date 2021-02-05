<template>
  <div>
    <Breadcrumbs :crumbs="crumbs" />

    <section>
      <b-container fluid>
        <AccountSingle :hash="hash">
          <template #chart="props">
            <ChartBalanceLast30Days :acc="hash" />
          </template>
        </AccountSingle>
      </b-container>
    </section>

    <section class="mt-0">
      <b-container fluid>
        <b-row>
          <b-col lg="12">
            <b-card no-body>
              <b-tabs lazy>
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
                    <TxsTabList :hash="hash" hash-type="account" />
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
                    <DelegationsTabList :hash="hash" />
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
                    <OriginationsTabList :hash="hash" />
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
                    <OperationsTabList :hash="hash" />
                  </b-card-body>
                </b-tab>
                <template #tabs-end>
                  <ExportAccountReport />
                </template>
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
  import TxsTabList from '@/components/partials/tabs/TxsTabList';
  import DelegationsTabList from '@/components/partials/tabs/DelegationsTabList';
  import OriginationsTabList from '@/components/partials/tabs/OriginationsTabList';
  import OperationsTabList from '@/components/partials/tabs/OperationsTabList';
  import ExportAccountReport from '@/components/partials/ExportAccountReport';

  export default {
    name: 'Account',
    components: {
      OperationsTabList,
      OriginationsTabList,
      DelegationsTabList,
      TxsTabList,
      Breadcrumbs,
      AccountSingle,
      ChartBalanceLast30Days,
      ExportAccountReport,
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
