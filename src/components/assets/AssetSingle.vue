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

              <b-btn
                class="card__button"
                variant="success"
                type="submit"
                @click="handleExportClick"
              >
                {{ $t('common.export') }}
              </b-btn>

              <b-modal
                id="export-data"
                size="md"
                class="modal"
                centered
                hide-header
                hide-footer
              >
                <div class="export">
                  <div class="modal__section calendar">
                    <p class="modal__subtitle">Select period</p>
                    <date-picker
                      inline
                      v-model="calendar.selected"
                      range-separator=" - "
                      prefix-class="teztracker"
                      :range="true"
                      :lang="calendarLanguage"
                    />
                  </div>
                  <div class="modal__section">
                    <p class="modal__subtitle">Select operations</p>
                    <div class="export-operations">
                      <b-row>
                        <b-col>
                          <b-form-checkbox-group
                            v-model="checkboxes.selected"
                            :options="checkboxes.operations"
                            switches
                            size="md"
                          />
                        </b-col>
                      </b-row>
                    </div>
                  </div>
                  <div class="modal__section text-center">
                    <b-button size="md" variant="success" @click="exportReport"
                      >Export</b-button
                    >
                  </div>
                </div>
              </b-modal>
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
  import DatePicker from 'vue2-datepicker';
  import 'vue2-datepicker/locale/zh-cn';
  import 'vue2-datepicker/locale/ru';
  import moment from 'moment';
  import i18n from '@/plugins/i18n';

  export default {
    name: 'AssetSingle',
    components: {
      IdentIcon,
      BtnCopy,
      DatePicker,
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
        calendar: {
          selected: [new Date(), new Date()],
        },
        checkboxes: {
          selected: [
            'transaction',
            'endorsement',
            'delegation',
            'origination',
            'activate_account',
            'double_baking_evidence',
            'double_endorsement_evidence',
            'baking',
          ],
          operations: [
            { text: 'Transaction', value: 'transaction' },
            { text: 'Baking', value: 'baking' },
            { text: 'Endorsement', value: 'endorsement' },
            { text: 'Delegation', value: 'delegation' },
            { text: 'Origination', value: 'origination' },
            { text: 'Activation', value: 'activate_account' },
            // { text: 'Reveal', value: 'reveal' },
            { text: 'Double-baking', value: 'double_baking_evidence' },
            {
              text: 'Double-endorsement',
              value: 'double_endorsement_evidence',
            },
          ],
        },
      };
    },
    computed: {
      ...mapState('app', {
        info: (state) => state.priceInfo,
        dateFormat: (state) => state.dateFormat,
      }),
      calendarLanguage() {
        if (i18n.locale === 'zh') {
          return 'zh-cn';
        } else {
          return i18n.locale;
        }
      },
      calendarDateFormat() {
        return this.dateFormat.slice(0, 10);
      },
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
      handleExportClick() {
        this.$bvModal.show('export-data');
      },
      async exportReport() {
        /* eslint-disable */
        const account = this.$route.params.baker;
        const from = moment(this.calendar.selected[0])
          .startOf('day')
          .utc()
          .unix();
        const to = moment(this.calendar.selected[1])
          .endOf('day')
          .utc()
          .unix();
        // console.log(from, to);
        const selectedOperations = this.checkboxes.selected;
        const props = {
          account,
          operation_type: selectedOperations,
          from,
          to,
        };
        await this.$api
          .getAccountReport(props)
          .then(() => {})
          .catch((error) => {
            console.log(error);
          });
        // $bvToast.toast(errorText, {
        //   title: i18n.t('errorsNotifications.error'),
        //   autoHideDelay: 4000,
        //   variant: 'danger',
        //   appendToast: false,
        // });
        // });
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
