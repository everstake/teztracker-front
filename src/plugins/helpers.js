import Vue from 'vue';
import numeral from 'numeral';

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
    return `$${numeral(amount).format('0,0[.][00]')}`;
  },
  capitalize(string) {
    if (typeof string !== 'string') return string;

    return `${string[0].toUpperCase()}${string.slice(1)}`;
  },
  truncateHash(hash, fromStart = 8, fromEnd = -5) {
    if (!hash || typeof hash !== 'string') return hash;

    return `${hash.slice(0, fromStart)}...${hash.slice(fromEnd)}`;
  },
};

Vue.use({
  install() {
    Vue.prototype.$helpers = helpers;
  },
});
