<template>
  <div>
    <Breadcrumbs :crumbs="crumbs" />

    <section>
      <b-container fluid>
        <AssetSingle :hash="hash" @onCurrencyChange="handleCurrencyChange" />
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
                    <AssetTabTxs
                      :currency="currency"
                      :precision="precision"
                      :account="hash"
                      @onReload="onReload"
                      @onPageChange="onPageChange"
                      @onLimitChange="onLimitChange"
                      :loading="loading.txs"
                      :loaded="loaded.txs"
                      :limit="limit.txs"
                      :page="page.txs"
                      :items="txs"
                      :count="count.txs"
                    />
                  </b-card-body>
                </b-tab>
                <b-tab :title="$t('opTypes.holders')">
                  <b-card-header>
                    <div class="break-word">
                      <h3>
                        <span class="text">
                          {{ $t('listTypes.holdersList') }}
                        </span>
                      </h3>
                    </div>
                  </b-card-header>

                  <b-card-body>
                    <AssetTabHolders
                      :currency="currency"
                      :precision="precision"
                      :account="hash"
                      @onReload="onReload"
                      @onPageChange="onPageChange"
                      @onLimitChange="onLimitChange"
                      :loading="loading.holders"
                      :loaded="loaded.holders"
                      :limit="limit.holders"
                      :page="page.holders"
                      :items="holders"
                      :count="count.holders"
                    />
                  </b-card-body>
                </b-tab>
                <b-tab :title="$tc('listTypes.otherOpsList', 2)">
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
                    <AssetTabOther
                      :currency="currency"
                      :precision="precision"
                      :account="hash"
                      @onReload="onReload"
                      @onPageChange="onPageChange"
                      @onLimitChange="onLimitChange"
                      :loading="loading.otherOperations"
                      :loaded="loaded.otherOperations"
                      :limit="limit.otherOperations"
                      :page="page.otherOperations"
                      :items="otherOperations"
                      :count="count.otherOperations"
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
  import AssetSingle from '../components/assets/AssetSingle';
  import AssetTabTxs from '../components/assets/AssetTabTxs';
  import AssetTabHolders from '../components/assets/AssetTabHolders';
  import AssetTabOther from '../components/assets/AssetTabOther';
  import AssetBalanceTabList from '@/components/partials/tabs/AssetBalanceTabList';

  export default {
    name: 'Asset',
    components: {
      Breadcrumbs,
      AssetSingle,
      AssetTabTxs,
      AssetTabHolders,
      AssetTabOther,
      AssetBalanceTabList,
    },
    data() {
      return {
        currency: 'XTZ',
        precision: null,
        txs: [],
        holders: [],
        otherOperations: [],
        loading: {
          txs: false,
          holders: false,
          otherOperations: false,
        },
        loaded: {
          txs: false,
          holders: false,
          otherOperations: false,
        },
        count: {
          txs: 0,
          holders: 0,
          otherOperations: 0,
        },
        limit: {
          txs: 10,
          holders: 10,
          otherOperations: 10,
        },
        page: {
          txs: 1,
          holders: 1,
          otherOperations: 1,
        },
      };
    },
    computed: {
      hash() {
        return this.$route.params.id;
      },
      crumbs() {
        return [
          { toRouteName: 'network', text: this.$t('common.home') },
          { toRouteName: 'assets', text: this.$t('pageTypes.assetsPage') },
          { toRouteName: 'asset', text: this.hash },
        ];
      },
    },
    methods: {
      handleCurrencyChange({ currency, precision }) {
        this.currency = currency;
        this.precision = precision;
      },
      async onReload({ name, limit, page }) {
        this.loading[name] = true;
        const { id: asset_id } = this.$route.params;
        const props = { page, limit, type: 'transfer', asset_id };

        if (name === 'txs') {
          await this.$api
            .getAssetsOperationsById(props)
            .then((data) => {
              this.txs = data.data;
              this.count.txs = data.count;
            })
            .catch(() => {});
          this.loaded.txs = true;
        }

        if (name === 'otherOperations') {
          await this.$api
            .getAssetsOperationsById({ ...props, type: ['other'] })
            .then((data) => {
              this.otherOperations = data.data;
              this.count.otherOperations = data.count;
            })
            .catch(() => {});
          this.loaded.otherOperations = true;
        }

        if (name === 'holders') {
          await this.$api
            .getAssetsHoldersById({ limit, page, asset_id })
            .then((data) => {
              this.holders = data.data;
              this.count.holders = data.count;
            })
            .catch(() => {});
          this.loaded.holders = true;
        }
        this.loading[name] = false;
      },
      async onPageChange({ name, page }) {
        const limit = this.limit[name];
        this.page[name] = page;
        await this.onReload({ name, limit, page });
      },
      async onLimitChange({ name, limit }) {
        this.page[name] = 1;
        const page = this.page[name];
        this.limit[name] = limit;
        await this.onReload({ name, limit, page });
      },
    },
  };
</script>
