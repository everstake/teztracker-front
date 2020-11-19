<template>
  <div class="account-single">
    <b-row>
      <b-col lg="12">
        <b-card no-body>
          <b-card-header>
            <div class="break-word">
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
                <b-skeleton v-if="loading" class="account-single__skeleton"></b-skeleton>
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
                <b-skeleton v-if="loading" class="account-single__skeleton"></b-skeleton>
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
                <b-skeleton v-if="loading" class="account-single__skeleton"></b-skeleton>
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
                <b-skeleton v-if="loading" class="account-single__skeleton"></b-skeleton>
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
                <b-skeleton v-if="loading" class="account-single__skeleton"></b-skeleton>
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
                <b-skeleton v-if="loading" class="account-single__skeleton"></b-skeleton>
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
                <b-skeleton v-if="loading" class="account-single__skeleton"></b-skeleton>
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

  export default {
    name: 'AccountSingle',
    components: {
      BtnCopy,
      IdentIcon,
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
          .getAccount({ account: acc })
          .then((data) => {
            this.account = data.data;
          })
          .catch(() => {});
        this.loading = false;
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
</style>
