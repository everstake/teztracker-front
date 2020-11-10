import Vue from 'vue';
import numeral from 'numeral';
import { state } from '@/store/modules/app.module';

const helpers = {
  isLocalStorageAvailable() {
    try {
      localStorage;
      return true;
    } catch (e) {
      return false;
    }
  },
  formatXtz(value) {
    return value / Vue.prototype.$constants.XTZ;
  },
  formatUSD(amount) {
    return `$ ${numeral(amount).format('0,0[.][00]')}`;
  },
  capitalize(string) {
    if (typeof string !== 'string') return string;

    return `${string[0].toUpperCase()}${string.slice(1)}`;
  },
  truncateHash(hash, fromStart = 8, fromEnd = -5) {
    if (!hash || typeof hash !== 'string') return hash;

    return `${hash.slice(0, fromStart)}...${hash.slice(fromEnd)}`;
  },

  formatCurrency(amount, calcXTZ = true) {
    const currentCurrency = state.currentCurrency;
    const currentCurrencySign =
      Vue.prototype.$constants.CURRENCY_CODE_SIGN_MAP[currentCurrency] || '';
    const res = calcXTZ ? amount / Vue.prototype.$constants.XTZ : amount;

    return `${currentCurrencySign} ${numeral(res).format('0,0[.][000000]')}`;
  },
  tezos(amount, currency = 'ꜩ', calcXTZ = true) {
    if (amount > 0) {
      const formattedAmount = numeral(
        calcXTZ ? amount / Vue.prototype.$constants.XTZ : amount,
      ).format('0,0[.]000000');

      return `${formattedAmount} ${currency}`;
    }

    return `0 ${currency}`;
  },
  denominate(amount, calcXTZ = true) {
    const rate = state.priceInfo.price;
    const isTezos = state.currentCurrency === 'xtz';

    return isTezos
      ? this.tezos(amount, 'ꜩ', calcXTZ)
      : this.formatCurrency(amount * rate, calcXTZ);
  },
};

Vue.use({
  install() {
    Vue.prototype.$helpers = helpers;
  },
});
