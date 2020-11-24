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
  import { SET_APP_INFO, SET_CURRENT_CURRENCY } from '@/store/mutations.types';
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
      };
    },
    computed: {
      ...mapState('app', [
        'currentCurrency',
        'priceInfo',
        'isWsConnectionOpen',
      ]),
      // for v-model
      currentCurrencyLocal: {
        get() {
          return this.currentCurrency;
        },
        set(val) {
          this[SET_CURRENT_CURRENCY](val);
        },
      },
      currencyAndConnection() {
        return {
          currency: this.currentCurrency,
          connection: this.isWsConnectionOpen,
        };
      },
    },
    watch: {
      currencyAndConnection: {
        immediate: true,
        async handler(val, oldVal) {
          const { currency, connection } = val;
          const { currency: oldCurrency } = oldVal || { currency: '' };

          const wsCurrency = currency === 'xtz' ? 'usd' : currency;

          if (currency) {
            localStorage.setItem('currency', currency);

            if (connection) {
              if (this.$ws.subscriptions.includes(`info_${oldCurrency}`)) {
                this.$ws.unsubscribeFromChannel(`info_${oldCurrency}`);
              }

              await this[GET_APP_INFO](currency);
              this.$ws.subscribeToChannel(`info_${wsCurrency}`);
              this.$ws.onmessage((res) => {
                if (res.event === `info_${wsCurrency}`) {
                  this[SET_APP_INFO](res.data);
                }
              });
            }
          }
        },
      },
    },
    created() {
      this.setInitialCurrentCurrency();
    },
    methods: {
      ...mapMutations('app', [SET_CURRENT_CURRENCY, SET_APP_INFO]),
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
