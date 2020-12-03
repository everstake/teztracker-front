<template>
  <div class="asset-single">
    <b-row>
      <b-col lg="12">
        <b-card no-body>
          <b-card-header>
            <div class="card__heading">
              <h3>
                <span class="text">
                  <IdentIcon :seed="hash" />

                  <template v-if="account.name">
                    {{ account.name }}
                  </template>
                  <template v-else>
                    <span class="text-break">
                      {{ hash }}
                      <BtnCopy :text-to-copy="hash" />
                    </span>
                  </template>
                </span>
              </h3>

<!--              <ExportAccountReport />-->
            </div>
            <div class="subtitle">
              {{ $t('infoTypes.assetInfo') }}
            </div>
          </b-card-header>

          <div class="card-divider"></div>

          <b-card-body>
            <b-container fluid>
              <b-row>
                <b-col class="card__no-padding" lg="6">
                  <span class="text-accent">
                    {{ $t('infoTypes.generalInfo') }}
                  </span>

                  <b-row class="item-info">
                    <b-col lg="4" class="label">
                      {{ $t('bakerSingle.address') }}
                    </b-col>
                    <b-col lg="8" class="text-accent">
                      <b-skeleton v-if="loading"></b-skeleton>
                      <span v-else class="d-flex align-items-center text-break">
                        {{ hash }}
                        <BtnCopy :text-to-copy="hash" />
                      </span>
                    </b-col>
                  </b-row>

                  <b-row class="item-info">
                    <b-col lg="4" class="label">
                      {{ $t('accSingle.created') }}
                    </b-col>
                    <b-col lg="8" class="text-accent">
                      <b-skeleton v-if="loading"></b-skeleton>
                      <span v-else>{{
                        account.created_at | timeformat(dateFormat)
                      }}</span>
                    </b-col>
                  </b-row>
                </b-col>

                <b-col class="p-0 px-lg-3" lg="6">
                  <span class="text-accent">
                    {{ $t('bakerSingle.balances') }}
                  </span>

                  <b-row class="item-info">
                    <b-col lg="4" class="label">
                      {{ $t('common.balance') }}
                    </b-col>

                    <b-col lg="6" class="text-accent">
                      <b-skeleton v-if="loading"></b-skeleton>
                      <span v-else>
                        {{
                          account.balance
                            | currencyPrecision(
                              getAssetCurrency(account.name),
                              account.precision,
                            )
                        }}
                      </span>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
            </b-container>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import IdentIcon from '@/components/accounts/IdentIcon';
  import BtnCopy from '@/components/partials/BtnCopy';
  import convert from '../../mixins/convert';
  // import ExportAccountReport from '@/components/partials/ExportAccountReport';

  export default {
    name: 'AssetSingle',
    components: {
      IdentIcon,
      BtnCopy,
      // ExportAccountReport,
    },
    mixins: [convert],
    props: {
      hash: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        bakerInfo: {},
        account: {},
        loading: true,
      };
    },
    computed: {
      ...mapState('app', {
        info: (state) => state.priceInfo,
        dateFormat: (state) => state.dateFormat,
      }),
    },
    watch: {
      hash: {
        async handler(value) {
          await this.reload(value);
        },
      },
    },
    async created() {
      await this.reload(this.hash);
    },
    methods: {
      async reload(acc) {
        this.loading = true;
        await this.$api
          .getAssetsById({ asset_id: acc })
          .then((data) => {
            this.account = data.data;
            if (data.data.bakerInfo) {
              this.bakerInfo = data.data.bakerInfo;
              this.baker = true;
            } else {
              this.baker = false;
            }
          })
          .catch(() => {});
        this.loading = false;
      },
      getAssetCurrency(asset) {
        if (!asset) return 'ꜩ';

        const assets = [
          { name: 'tzBTC', currency: 'tzBTC' },
          { name: 'Staker DAO', currency: 'STKR' },
          { name: 'USDtz', currency: 'USDtz' },
        ];

        const findedAsset = assets.find(({ name, currency }) => {
          if (asset === name) return currency;
        });

        findedAsset.precision = this.account.precision;

        this.$emit('onCurrencyChange', {
          currency: findedAsset.currency,
          precision: findedAsset.precision,
        });

        return findedAsset.currency;
      },
    },
  };
</script>

<style scoped lang="scss">
  .asset-single__skeleton {
    width: 200px;
  }

  .card__heading {
    display: flex;
    justify-content: space-between;
  }
</style>
