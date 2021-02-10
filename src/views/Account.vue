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
                    <TxsTabList
                      :txs="txs"
                      :count="counts.txs"
                      :account="hash"
                      :current-page="page.txs"
                      :per-page="limit.txs"
                      :loading="loading.txs"
                      :loaded="loaded.txs"
                      @onReload="reload"
                      @onLimitChange="handleLimitChange"
                      @onPageChange="handlePageChange"
                    />
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
                    <DelegationsTabList
                      :delegations="delegations"
                      :count="counts.delegations"
                      :account="hash"
                      :current-page="page.delegations"
                      :per-page="limit.delegations"
                      :loading="loading.delegations"
                      :loaded="loaded.delegations"
                      @onReload="reload"
                      @onLimitChange="handleLimitChange"
                      @onPageChange="handlePageChange"
                    />
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
                    <OriginationsTabList
                      :originations="originations"
                      :count="counts.originations"
                      :account="hash"
                      :current-page="page.originations"
                      :per-page="limit.originations"
                      :loading="loading.originations"
                      :loaded="loaded.originations"
                      @onReload="reload"
                      @onLimitChange="handleLimitChange"
                      @onPageChange="handlePageChange"
                    />
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
                    <OperationsTabList
                      :operations="operations"
                      :count="counts.operations"
                      :account="hash"
                      :current-page="page.operations"
                      :per-page="limit.operations"
                      :loading="loading.operations"
                      :loaded="loaded.operations"
                      @onReload="reload"
                      @onLimitChange="handleLimitChange"
                      @onPageChange="handlePageChange"
                    />
                  </b-card-body>
                </b-tab>
                <b-tab title="Assets balances">
                  <b-card-header>
                    <div class="break-word">
                      <h3>
                        <span class="text">
                          Asset balances list
                        </span>
                      </h3>
                    </div>
                  </b-card-header>

                  <b-card-body>
                    <AssetBalanceTabList
                      @onReload="reload"
                      :operations="assetBalance"
                      :count="counts.assetBalance"
                      :currentPage="page.assetBalance"
                      :perPage="limit.assetBalance"
                      :loaded="loaded.assetBalance"
                      :loading="loading.assetBalance"
                      @onLimitChange="handleLimitChange"
                      @onPageChange="handlePageChange"
                    />
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
  import reloadTabTables from '@/mixins/reloadTabulationList';
  import DelegationsTabList from '@/components/partials/tabs/DelegationsTabList';
  import OriginationsTabList from '@/components/partials/tabs/OriginationsTabList';
  import OperationsTabList from '@/components/partials/tabs/OperationsTabList';
  import ExportAccountReport from '@/components/partials/ExportAccountReport';
  import AssetBalanceTabList from '@/components/partials/tabs/AssetBalanceTabList';

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
      AssetBalanceTabList,
    },
    mixins: [reloadTabTables],
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
