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
};

Vue.use({
  install() {
    Vue.prototype.$helpers = helpers;
  },
});
