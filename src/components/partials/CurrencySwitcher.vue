<template>
  <b-form-group label="Currency">
    <b-form-radio-group
      v-model="currentCurrencyLocal"
      :options="currencyOptions"
    />
  </b-form-group>
</template>

<script>
  import { mapState, mapMutations } from 'vuex';
  import { SET_CURRENT_CURRENCY } from '@/store/mutations.types';

  export default {
    name: 'CurrencySwitcher',
    data() {
      return {
        defaultCurrency: 'xtz',
      };
    },
    computed: {
      ...mapState('app', ['currentCurrency', 'priceInfo']),
      currencyOptions() {
        if (
          !this.priceInfo ||
          !Object.keys(this.priceInfo).length ||
          !this.priceInfo.price ||
          !Object.keys(this.priceInfo.price).length
        ) {
          return [];
        }

        const res = Object.keys(this.priceInfo.price)
          .map((currencyCode) => {
            return {
              text: currencyCode.toUpperCase(),
              value: currencyCode,
            };
          })
          .reverse();

        res.unshift({
          text: 'XTZ',
          value: 'xtz',
        });

        return res;
      },
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
      currentCurrency(val) {
        localStorage.setItem('currency', val);
      },
    },
    created() {
      this.getCurrentCurrency();
    },
    methods: {
      ...mapMutations('app', [SET_CURRENT_CURRENCY]),
      getCurrentCurrency() {
        if (this.$helpers.isLocalStorageAvailable() && localStorage.currency) {
          this[SET_CURRENT_CURRENCY](localStorage.currency);
        } else {
          this[SET_CURRENT_CURRENCY](this.defaultCurrency);
        }
      },
    },
  };
</script>

<style scoped></style>
