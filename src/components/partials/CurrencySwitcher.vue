<template>
  <b-form-group :label="$t('currencySwitcher.title')">
    <b-form-radio-group
      v-model="currentCurrencyLocal"
      :options="currencyOptions"
    />
  </b-form-group>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex';
  import { SET_CURRENT_CURRENCY } from '@/store/mutations.types';
  import { GET_APP_INFO } from '@/store/actions.types';

  export default {
    name: 'CurrencySwitcher',
    data() {
      return {
        currencyOptions: [
          { text: 'XTZ', value: 'xtz' },
          { text: 'USD', value: 'usd' },
          { text: 'EUR', value: 'eur' },
          { text: 'GBP', value: 'gbp' },
          { text: 'CNY', value: 'cny' },
        ],
        getInfoRouteNames: [
          'network',
          'blocks',
          'block',
          'tx',
          'txs',
          'delegations',
          'originations',
          'bakers',
          'baker',
          'public_bakers',
          'double_endorsement',
          'double_baking',
          'accounts',
          'top_accounts',
          'account',
          'contracts',
          'asset',
        ],
      };
    },
    computed: {
      ...mapState('app', ['currentCurrency', 'priceInfo']),
      // for v-model
      currentCurrencyLocal: {
        get() {
          return this.currentCurrency;
        },
        set(val) {
          this[SET_CURRENT_CURRENCY](val);
        },
      },
    },
    watch: {
      currentCurrency: {
        immediate: true,
        handler(val) {
          if (val) {
            localStorage.setItem('currency', val);
            this[GET_APP_INFO](val);
          }
        },
      },
      '$route.name'(val) {
        if (this.getInfoRouteNames.includes(val)) {
          this[GET_APP_INFO](this.currentCurrency);
        }
      },
    },
    created() {
      this.setInitialCurrentCurrency();
    },
    methods: {
      ...mapMutations('app', [SET_CURRENT_CURRENCY]),
      ...mapActions('app', [GET_APP_INFO]),
      setInitialCurrentCurrency() {
        if (
          this.$helpers.isLocalStorageAvailable() &&
          localStorage.getItem('currency')
        ) {
          this[SET_CURRENT_CURRENCY](localStorage.getItem('currency'));
        } else {
          this[SET_CURRENT_CURRENCY](this.currencyOptions[0].value);
        }
      },
    },
  };
</script>
