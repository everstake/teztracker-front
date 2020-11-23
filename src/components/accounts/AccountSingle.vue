<template>
  <div class="account-single">
    <b-row>
      <b-col lg="12">
        <b-card no-body>
          <b-card-header>
            <div class="break-word">
              <div class="card__heading">
                <h3 class="card__title text-accent">
                  <IdentIcon :seed="hash" />

                  <template v-if="account.accountName">
                    {{ account.accountName }}
                  </template>
                  <template v-else>
                    <span class="text-break">
                      <span>{{ hash }}</span>
                      <BtnCopy :text-to-copy="hash" />
                    </span>
                  </template>
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
                      <b-button
                        :disabled="calendar.loading"
                        size="md"
                        variant="success"
                        @click="exportReport"
                        >
                        Export
                      </b-button>
                    </div>
                  </div>
                </b-modal>
              </div>
              <div class="subtitle">
                <span v-if="hash.slice(0, 2) === 'KT'">{{
                  $t('infoTypes.contractInfo')
                }}</span>
                <span v-else>{{ $t('infoTypes.accInfo') }}</span>
              </div>
            </div>
          </b-card-header>

          <div class="card-divider"></div>

          <b-card-body>
            <b-row class="item-info mr-1">
              <b-col lg="2">
                <span class="label">
                  {{ $t('common.manager') }}
                </span>
              </b-col>
              <b-col lg="10">
                <b-skeleton
                  v-if="loading"
                  class="account-single__skeleton"
                ></b-skeleton>
                <span class="value">{{ account.manager }}</span>
              </b-col>
            </b-row>

            <b-row class="item-info  mr-1">
              <b-col lg="2">
                <span class="label">
                  {{ $t('accSingle.created') }}
                </span>
              </b-col>
              <b-col lg="10">
                <b-skeleton
                  v-if="loading"
                  class="account-single__skeleton"
                ></b-skeleton>
                <span v-else class="value">
                  {{ account.createdAt | timeformat(dateFormat) }}
                </span>
              </b-col>
            </b-row>

            <b-row class="item-info  mr-1">
              <b-col lg="2">
                <span class="label">
                  {{ $t('common.delegate') }}
                </span>
              </b-col>
              <b-col lg="10">
                <b-skeleton
                  v-if="loading"
                  class="account-single__skeleton"
                ></b-skeleton>
                <span
                  v-else-if="account.delegateValue"
                  class="d-flex align-items-center"
                >
                  <IdentIcon :seed="account.delegateValue" />

                  <span class="value">
                    {{ account.delegateName || account.delegateValue }}
                  </span>

                  <BtnCopy
                    v-if="!account.delegateName"
                    :text-to-copy="account.delegateValue"
                  />
                </span>
                <span v-else>
                  <span class="value">~~~~~</span>
                </span>
              </b-col>
            </b-row>

            <b-row class="item-info  mr-1">
              <b-col lg="2">
                <span class="label">
                  {{ $t('common.balance') }}
                </span>
              </b-col>
              <b-col lg="10">
                <b-skeleton
                  v-if="loading"
                  class="account-single__skeleton"
                ></b-skeleton>
                <span v-else class="value">
                  {{ account.balance | denominate }}
                </span>
              </b-col>
            </b-row>

            <b-row class="item-info mr-1">
              <b-col lg="2">
                <span class="label">
                  {{ $t('numberOf.#OfOperations') }}
                </span>
              </b-col>
              <b-col lg="10">
                <b-skeleton
                  v-if="loading"
                  class="account-single__skeleton"
                ></b-skeleton>
                <span v-else class="value">
                  {{ account.operations }}
                </span>
              </b-col>
            </b-row>

            <b-row class="item-info mr-1">
              <b-col lg="2">
                <span class="label">
                  {{ $t('accSingle.lastActive') }}
                </span>
              </b-col>
              <b-col lg="10">
                <b-skeleton
                  v-if="loading"
                  class="account-single__skeleton"
                ></b-skeleton>
                <span v-else class="value">
                  {{ account.lastActive | timeformat(dateFormat) }}
                </span>
              </b-col>
            </b-row>

            <b-row class="item-info  mr-1">
              <b-col lg="2">
                <span class="label">
                  {{ $t('statusTypes.status') }}
                </span>
              </b-col>
              <b-col lg="10">
                <b-skeleton
                  v-if="loading"
                  class="account-single__skeleton"
                ></b-skeleton>
                <span
                  v-else
                  class="value value--capitalize"
                  :class="{
                    'text-success': account.revealed,
                    'text-danger': !account.revealed,
                  }"
                >
                  {{
                    account.revealed
                      ? $t('statusTypes.revealed')
                      : $t('statusTypes.unrevealed')
                  }}
                </span>
              </b-col>
            </b-row>
          </b-card-body>
        </b-card>

        <b-row class="item-info card-offset">
          <b-col lg="12">
            <slot :balance="account.balance" class="chart" name="chart"></slot>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import convert from '../../mixins/convert';
  import BtnCopy from '@/components/partials/BtnCopy';
  import IdentIcon from '@/components/accounts/IdentIcon';
  import DatePicker from 'vue2-datepicker';
  import 'vue2-datepicker/locale/zh-cn';
  import 'vue2-datepicker/locale/ru';
  import moment from 'moment';
  import i18n from '@/plugins/i18n';

  export default {
    name: 'AccountSingle',
    components: {
      BtnCopy,
      IdentIcon,
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
        account: {},
        balance: [],
        loading: false,
        calendar: {
          selected: [new Date(), new Date()],
          loading: false,
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
          .getAccount({ account: acc })
          .then((data) => {
            this.account = data.data;
          })
          .catch(() => {});
        this.loading = false;
      },
      handleExportClick() {
        this.$bvModal.show('export-data');
      },
      async exportReport() {
        /* eslint-disable */
        const account = this.$route.params.account;
        const from = moment(this.calendar.selected[0])
          .startOf('day')
          .utc()
          .unix();
        const to = moment(this.calendar.selected[1])
          .endOf('day')
          .utc()
          .unix();
        const selectedOperations = this.checkboxes.selected;
        const props = {
          account,
          operation_type: selectedOperations,
          from,
          to,
        };
        this.calendar.loading = true;
        await this.$api
          .getAccountReport(props)
          .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');

            link.href = url;
            link.setAttribute('download', 'report.csv');
            document.body.appendChild(link);

            link.click();
            this.$bvModal.hide('export-data');
          })
          .catch((error) => {
            console.log(error);
          });
        this.calendar.loading = false;
      },
    },
  };
</script>

<style>
  .tooltip .tooltip-inner {
    font-size: 13px;
  }
</style>

<style lang="scss" scoped>
  .card-header .title {
    word-break: break-word;
  }

  .card__title {
    display: inline-flex;
    align-items: center;
    padding-right: 0 !important; /* outweigh selector cascade from public styles */
  }

  .icon-primary {
    color: $color-brand;
  }

  .icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: -15px;
    margin-left: 10px;
    font-size: 12px;
    color: #309282;
  }

  .card-offset {
    margin-top: 1.6rem;
  }

  .value--capitalize {
    text-transform: capitalize;
  }

  .account-single__skeleton {
    width: 150px;
  }

  .card__heading {
    display: flex;
    justify-content: space-between;
  }
</style>
